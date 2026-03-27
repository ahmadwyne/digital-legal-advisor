/**
 * precedentSearchService.js
 *
 * Implements a lightweight keyword/TF-IDF relevance search over the
 * Precedents table. When you integrate a vector embedding store
 * (e.g. pgvector, Pinecone, or the HuggingFace dataset embeddings),
 * replace `_keywordSearch` with your semantic search call.
 *
 * HuggingFace dataset reference:
 *   https://huggingface.co/datasets/Ibtehaj10/supreme-court-of-pak-judgments
 */

const { Op } = require('sequelize');
const { Precedent, PrecedentSearch, QueryPrecedent, PrecedentFeedback } = require('../models');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Tokenise a string into lower-case terms, removing stopwords.
 */
const STOPWORDS = new Set([
  'the','a','an','and','or','of','in','on','at','to','for','with','by',
  'is','are','was','were','be','been','being','have','has','had','do',
  'does','did','will','would','could','should','may','might','shall',
  'that','this','these','those','its','it','he','she','they','we',
  'vs','etc','no','not','as','from','into','than','then','when','where',
]);

function tokenise(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Calculate a naive TF-IDF-style relevance score between a query
 * and a precedent document.  Returns a float [0, 1].
 */
function scoreRelevance(queryTokens, precedent) {
  const fields = [
    precedent.title   || '',
    precedent.citation || '',
    precedent.summary  || '',
    precedent.content  || '',
    (precedent.keywords || []).join(' '),
    precedent.judge    || '',
    precedent.court    || '',
  ];

  // Weight: title/citation hits count more than body hits
  const weights = [4, 3, 2, 1, 2, 1, 1];

  let score = 0;
  let total = 0;

  fields.forEach((field, i) => {
    const fieldTokens = tokenise(field);
    const fieldSet    = new Set(fieldTokens);
    const w           = weights[i];

    queryTokens.forEach(qt => {
      total += w;
      // Exact match
      if (fieldSet.has(qt)) {
        score += w;
        return;
      }
      // Partial match (substring)
      if (fieldTokens.some(ft => ft.includes(qt) || qt.includes(ft))) {
        score += w * 0.5;
      }
    });
  });

  if (total === 0) return 0;
  const raw = score / total;
  // Boost: if the query appears verbatim in the title
  const titleLower = (precedent.title || '').toLowerCase();
  const queryLower = queryTokens.join(' ');
  if (titleLower.includes(queryLower)) return Math.min(raw + 0.3, 1.0);
  return Math.min(raw, 1.0);
}

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Search precedents using keyword relevance.
 * Returns ranked array of { precedent, relevanceScore }.
 *
 * @param {string} query
 * @param {number} topK
 */
async function _keywordSearch(query, topK = 10) {
  const queryTokens = tokenise(query);
  if (queryTokens.length === 0) return [];

  // Build a broad SQL LIKE filter to avoid loading the entire table
  const conditions = queryTokens.map(t => ({
    [Op.or]: [
      { title:   { [Op.like]: `%${t}%` } },
      { summary: { [Op.like]: `%${t}%` } },
      { content: { [Op.like]: `%${t}%` } },
      { judge:   { [Op.like]: `%${t}%` } },
      { citation:{ [Op.like]: `%${t}%` } },
    ],
  }));

  const candidates = await Precedent.findAll({
    where: { [Op.or]: conditions },
    limit: 50, // candidate set before ranking
  });

  // Score and rank
  const scored = candidates
    .map(p => ({ precedent: p, relevanceScore: scoreRelevance(queryTokens, p) }))
    .filter(r => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);

  // If nothing matched via LIKE, fall back to returning all
  if (scored.length === 0) {
    const all = await Precedent.findAll({ limit: topK });
    return all.map(p => ({ precedent: p, relevanceScore: 0.1 }));
  }

  return scored;
}

/**
 * Main search entry point. Persists the search + results.
 */
exports.searchPrecedents = async ({ userId, query, topK = 10 }) => {
  const results = await _keywordSearch(query, topK);

  // Persist search record
  const search = await PrecedentSearch.create({
    userId,
    query,
    resultCount: results.length,
  });

  // Persist result links
  if (results.length > 0) {
    await QueryPrecedent.bulkCreate(
      results.map(r => ({
        searchId:      search.id,
        precedentId:   r.precedent.id,
        relevanceScore: r.relevanceScore,
        retrievedAt:   new Date(),
      }))
    );
  }

  return {
    searchId: search.id,
    query,
    results: results.map((r, i) => ({
      srNo:          i + 1,
      id:            r.precedent.id,
      caseNo:        r.precedent.caseNo || r.precedent.citation,
      title:         r.precedent.title,
      judge:         r.precedent.judge,
      court:         r.precedent.court,
      year:          r.precedent.year,
      citation:      r.precedent.citation,
      summary:       r.precedent.summary,
      relevanceScore: r.relevanceScore,
      matchPercent:  `${Math.round(r.relevanceScore * 100)}%`,
      hasFile:       !!r.precedent.fileUrl,
    })),
  };
};

/**
 * Return full content of a single precedent for the view modal.
 */
exports.getPrecedentById = async (id) => {
  const p = await Precedent.findByPk(id);
  if (!p) throw Object.assign(new Error('Precedent not found'), { statusCode: 404 });
  return p;
};

/**
 * Fetch search history for a user, with nested results.
 */
exports.getSearchHistory = async ({ userId, limit = 20, offset = 0 }) => {
  const { count, rows } = await PrecedentSearch.findAndCountAll({
    where: { userId },
    include: [
      {
        association: 'queryPrecedents',
        include: [{ association: 'precedent', attributes: ['id','title','citation','caseNo','judge'] }],
        order: [['relevanceScore', 'DESC']],
      },
      { association: 'feedback' },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    total: count,
    items: rows.map(s => ({
      id:          s.id,
      query:       s.query,
      resultCount: s.resultCount,
      createdAt:   s.createdAt,
      feedback:    s.feedback,
      results:     (s.queryPrecedents || [])
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .map((qp, i) => ({
          srNo:          i + 1,
          id:            qp.precedent?.id,
          caseNo:        qp.precedent?.caseNo || qp.precedent?.citation,
          title:         qp.precedent?.title,
          judge:         qp.precedent?.judge,
          citation:      qp.precedent?.citation,
          relevanceScore: qp.relevanceScore,
          matchPercent:  `${Math.round((qp.relevanceScore || 0) * 100)}%`,
        })),
    })),
  };
};

exports.getHistoryById = async ({ userId, searchId }) => {
  const search = await PrecedentSearch.findOne({
    where: { id: searchId, userId },
    include: [
      {
        model: QueryPrecedent,
        as: 'queryPrecedents',
        include: [
          {
            model: Precedent,
            as: 'precedent'
          }
        ]
      }
    ],
    order: [[{ model: QueryPrecedent, as: 'queryPrecedents' }, 'relevanceScore', 'DESC']]
  });

  if (!search) {
    const e = new Error('Search history not found');
    e.statusCode = 404;
    throw e;
  }

  const results = (search.queryPrecedents || []).map((qp, idx) => ({
    id: qp.precedent.id,
    srNo: idx + 1,
    caseNo: qp.precedent.caseNo,
    title: qp.precedent.title,
    judge: qp.precedent.judge,
    year: qp.precedent.year,
    court: qp.precedent.court,
    citation: qp.precedent.citation,
    matchPercent: qp.relevanceScore
      ? `${Math.round(Number(qp.relevanceScore) * 100)}%`
      : '0%'
  }));

  return {
    id: search.id,
    query: search.query,
    results
  };
};

/**
 * Delete a search from history.
 */
exports.deleteSearch = async ({ userId, searchId }) => {
  const search = await PrecedentSearch.findOne({ where: { id: searchId, userId } });
  if (!search) throw Object.assign(new Error('Search not found'), { statusCode: 404 });
  await search.destroy();
};

/**
 * Submit feedback for a search.
 */
exports.submitFeedback = async ({ userId, searchId, rating, comment }) => {
  const search = await PrecedentSearch.findOne({ where: { id: searchId, userId } });
  if (!search) throw Object.assign(new Error('Search not found'), { statusCode: 404 });

  const [fb, created] = await PrecedentFeedback.findOrCreate({
    where: { userId, searchId },
    defaults: { rating, comment: comment || null },
  });

  if (!created) {
    await fb.update({ rating, comment: comment || null });
  }

  return fb;
};

/**
 * Generate a simple text-based PDF representation of a precedent.
 * In production, swap this out for a proper PDF generator (e.g. pdfkit).
 */
exports.generateDownloadContent = async (precedentId) => {
  const p = await Precedent.findByPk(precedentId);
  if (!p) throw Object.assign(new Error('Precedent not found'), { statusCode: 404 });

  const text = [
    '═'.repeat(60),
    `CASE: ${p.title}`,
    `CITATION: ${p.citation}`,
    `CASE NO: ${p.caseNo || p.citation}`,
    `COURT: ${p.court}`,
    `JUDGE: ${p.judge}`,
    `YEAR: ${p.year}`,
    '═'.repeat(60),
    '',
    'SUMMARY',
    '─'.repeat(40),
    p.summary || '(No summary available)',
    '',
    'FULL JUDGMENT',
    '─'.repeat(40),
    p.content,
    '',
    '─'.repeat(60),
    'Generated by Digital Legal Advisor',
  ].join('\n');

  return { text, filename: `${p.citation.replace(/[/\\:*?"<>|]/g, '_')}.txt` };
};