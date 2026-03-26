const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const pdfParse = require('pdf-parse-debugging-disabled');
const mammoth = require('mammoth');

/**
 * MODEL CHOICE: facebook/bart-large-cnn (via Hugging Face Inference API - free tier)
 * OR local: "sshleifer/distilbart-cnn-12-6" (CPU-friendly, ~900MB)
 *
 * Strategy: Use HuggingFace Inference API (free) as primary.
 * Fallback: extractive summarization (sumy-style) purely in Node.js — zero RAM overhead.
 * 
 * This keeps your backend CPU/RAM friendly with no local model required.
 */

const HUGGINGFACE_API_URL = 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn';
const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN; // Free token from huggingface.co

// ─── Text Extraction ───────────────────────────────────────────────────────────

/**
 * Extract text from uploaded file buffer
 */
const extractText = async (fileBuffer, mimeType, originalName) => {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    const data = await pdfParse(fileBuffer);
    return data.text;
  }

  if (ext === '.docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  if (ext === '.txt' || mimeType === 'text/plain') {
    return fileBuffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: ${ext}`);
};

// ─── Legal Document Type Detection ────────────────────────────────────────────

const detectDocumentType = (text) => {
  const lower = text.toLowerCase();

  const patterns = [
    { type: 'Contract', keywords: ['agreement', 'contract', 'party', 'parties', 'hereinafter', 'whereas', 'consideration'] },
    { type: 'Court Judgment', keywords: ['judgment', 'plaintiff', 'defendant', 'court', 'appeal', 'verdict', 'ruling', 'bench'] },
    { type: 'Legal Notice', keywords: ['legal notice', 'notice is hereby', 'take notice', 'demand notice'] },
    { type: 'Legislation / Act', keywords: ['act of', 'section', 'subsection', 'statute', 'regulation', 'ordinance', 'amendment'] },
    { type: 'Affidavit', keywords: ['affidavit', 'sworn', 'deponent', 'solemnly affirm'] },
    { type: 'Power of Attorney', keywords: ['power of attorney', 'attorney-in-fact', 'authorize', 'principal'] },
    { type: 'Property Deed', keywords: ['deed', 'property', 'transferor', 'transferee', 'conveyance', 'sale deed'] },
    { type: 'Employment Agreement', keywords: ['employment', 'employee', 'employer', 'salary', 'termination', 'probation'] },
  ];

  for (const { type, keywords } of patterns) {
    const matches = keywords.filter(k => lower.includes(k)).length;
    if (matches >= 2) return type;
  }

  return 'Legal Document';
};

const extractYear = (text) => {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};

// ─── Text Chunking ─────────────────────────────────────────────────────────────

/**
 * Split text into chunks safe for BART (max ~1024 tokens ≈ 3500 chars)
 */
const chunkText = (text, maxChars = 3000) => {
  const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > maxChars) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += ' ' + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.slice(0, 4); // Limit to 4 chunks for speed
};

// ─── Fallback: Extractive Summarizer (no model needed) ────────────────────────

/**
 * Simple TF-IDF style extractive summarization — pure JS, zero dependencies
 */
const extractiveSummarize = (text, numSentences = 8) => {
  const sentences = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.length > 40);

  if (sentences.length <= numSentences) return sentences.join(' ');

  // Score by word frequency
  const wordFreq = {};
  sentences.forEach(s => {
    s.toLowerCase().split(/\W+/).forEach(w => {
      if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
  });

  const scores = sentences.map((s, i) => {
    const words = s.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const score = words.reduce((acc, w) => acc + (wordFreq[w] || 0), 0) / (words.length || 1);
    // Boost sentences near the beginning (legal docs front-load key info)
    const positionBoost = i < 5 ? 1.4 : i < 15 ? 1.1 : 1.0;
    return { sentence: s, score: score * positionBoost, index: i };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index)
    .map(s => s.sentence)
    .join(' ');
};

// ─── HuggingFace API Summarizer ────────────────────────────────────────────────

const summarizeWithHuggingFace = async (text) => {
  if (!HF_TOKEN) throw new Error('No HuggingFace token configured');

  const response = await fetch(HUGGINGFACE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length: 200,
        min_length: 60,
        do_sample: false,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace API error: ${err}`);
  }

  const result = await response.json();

  // Handle model loading (HF sometimes returns 503 with loading message)
  if (result.error && result.error.includes('loading')) {
    throw new Error('MODEL_LOADING');
  }

  if (Array.isArray(result) && result[0]?.summary_text) {
    return result[0].summary_text;
  }

  throw new Error('Unexpected HuggingFace response format');
};

// ─── Main Summarizer ──────────────────────────────────────────────────────────

/**
 * Main entry point — called by controller
 */
const summarizeDocument = async (fileBuffer, mimeType, originalName) => {
  // 1. Extract text
  const rawText = await extractText(fileBuffer, mimeType, originalName);

  if (!rawText || rawText.trim().length < 100) {
    throw new Error('Document appears to be empty or has too little text to summarize.');
  }

  // 2. Clean text
  const cleanText = rawText
    .replace(/\f/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{3,}/g, '  ')
    .replace(/\n{4,}/g, '\n\n')
    .trim();

  // 3. Detect document info
  const docType = detectDocumentType(cleanText);
  const docYear = extractYear(cleanText);

  // 4. Try AI summarization, fall back to extractive
  let summaryText = '';
  let usedAI = false;

  try {
    const chunks = chunkText(cleanText);
    const chunkSummaries = [];

    for (const chunk of chunks) {
      const chunkSummary = await summarizeWithHuggingFace(chunk);
      chunkSummaries.push(chunkSummary);
    }

    summaryText = chunkSummaries.join('\n\n');
    usedAI = true;
  } catch (err) {
    console.warn('[Summarizer] AI fallback triggered:', err.message);
    // Graceful fallback to extractive
    summaryText = extractiveSummarize(cleanText, 8);
    usedAI = false;
  }

  return {
    type: docType,
    year: docYear,
    source: originalName,
    content: `AI-Generated Summary:\n\n${summaryText}`,
    wordCount: rawText.split(/\s+/).length,
    usedAI,
    method: usedAI ? 'facebook/bart-large-cnn (HuggingFace)' : 'Extractive (Offline Fallback)',
  };
};

module.exports = { summarizeDocument, extractText };