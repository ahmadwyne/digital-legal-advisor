// const { OpenAI } = require('openai');

// // Initialize OpenAI (it automatically picks up OPENAI_API_KEY from your .env file)
// const openai = new OpenAI();

// class ChatService {
//   async generateResponse(message, history, userId) {
//     try {
//       // 1. Format the history for the API
//       // Your frontend sends: { type: 'user'/'bot', content: '...' }
//       // The API expects: { role: 'user'/'assistant', content: '...' }
//       const formattedHistory = history.map(msg => ({
//         role: msg.type === 'user' ? 'user' : 'assistant',
//         content: msg.content
//       }));

//       // 2. Add a System Prompt to set the AI's behavior
//       const systemPrompt = {
//         role: 'system',
//         content: `You are the Digital Legal Advisor, a professional, highly accurate, and helpful legal AI assistant specializing in Pakistani Law. 
        
//         Guidelines:
//         1. Provide clear, structured, and informative answers using markdown formatting (bullet points, bold text).
//         2. Maintain a formal, objective, and professional legal tone.
//         3. If you do not know the answer, politely state that the query requires specific legal consultation.
//         4. Always include a brief disclaimer at the end stating that you are an AI and this is not formal legal counsel.`
//       };

//       // 3. Combine the system prompt with the chat history
//       const messages = [systemPrompt, ...formattedHistory];

//       // Note: Because your frontend Platform.jsx adds the user's message to the 
//       // 'history' array BEFORE calling the API, the current 'message' is already 
//       // the last item in the formattedHistory. We don't need to append it again!

//       // 4. Call the OpenAI API
//       const completion = await openai.chat.completions.create({
//         model: 'gpt-4o-mini', // Fast, cheap, and very smart. You can also use 'gpt-3.5-turbo'
//         messages: messages,
//         temperature: 0.2, // Low temperature keeps the AI factual and less "creative" (important for law)
//         max_tokens: 1000,
//       });

//       // 5. Return the text response to your controller
//       return completion.choices[0].message.content;

//     } catch (error) {
//       console.error('LLM API Error:', error);
      
//       // Provide a clean error message to the frontend if the API key is missing or quota is exceeded
//       if (error.status === 401) {
//         throw new Error('API Key is invalid or missing.');
//       }
      
//       throw new Error('The Legal Advisor is currently unavailable. Please try again later.');
//     }
//   }
// }

// module.exports = new ChatService();

// const { OpenAI } = require('openai');

// class ChatService {
//   async generateResponse(message, history, userId) {
//     try {
//       if (!process.env.GEMINI_API_KEY) {
//         throw new Error('GEMINI_API_KEY is missing from the .env file.');
//       }

//       // 1. Initialize inside the function to ensure .env is fully loaded first!
//       // We are using the OpenAI SDK, but routing it to Google Gemini's free API
//       const openai = new OpenAI({
//         apiKey: process.env.GEMINI_API_KEY, // Make sure this is in your .env file
//         baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
//       });

//       // 2. Format the history for the API
//       const formattedHistory = history.map(msg => ({
//         role: msg.type === 'user' ? 'user' : 'assistant',
//         content: msg.content
//       }));

//       // 3. Add a System Prompt to set the AI's behavior
//       const systemPrompt = {
//         role: 'system',
//         content: `You are the Digital Legal Advisor, a professional, highly accurate, and helpful legal AI assistant specializing in Pakistani Law. 
        
//         Guidelines:
//         1. Provide clear, structured, and informative answers using markdown formatting (bullet points, bold text).
//         2. Maintain a formal, objective, and professional legal tone.
//         3. If you do not know the answer, politely state that the query requires specific legal consultation.
//         4. Always include a brief disclaimer at the end stating that you are an AI and this is not formal legal counsel.`
//       };

//       const messages = [systemPrompt, ...formattedHistory];

//       // 4. Call the free Gemini API using the OpenAI SDK format
//       const completion = await openai.chat.completions.create({
//         model: 'gemini-1.5-flash', // Google's fast model (OpenAI-compat)
//         messages: messages,
//         temperature: 0.2, 
//         max_tokens: 1000,
//       });

//       // 5. Return the text response to your controller
//       return completion.choices[0].message.content;

//     } catch (error) {
//       console.error('LLM API Error:', error);
      
//       if (error.status === 401 || error.message.includes('Missing credentials')) {
//         throw new Error('API Key is invalid or missing from the .env file.');
//       }
      
//       throw new Error('The Legal Advisor is currently unavailable. Please try again later.');
//     }
//   }
// }

// module.exports = new ChatService();

// LLM ChatService.js:

// const { sequelize, Query, Response, History } = require('../models');
// const { askLLM } = require('e:/Digital Legal Advisor/DLA_Frontend/backend/src/services/llmservice');

// const createChatResponse = async ({
//   message,
//   userId,
//   queryType = 'general',
//   topK = 5,
//   sessionId = null
// }) => {
//   return sequelize.transaction(async (t) => {
//     // 1) Save query as pending
//     const queryRow = await Query.create(
//       {
//         userId,
//         queryText: message,
//         queryType,
//         status: 'pending'
//       },
//       { transaction: t }
//     );

//     let llmResult;
//     try {
//       // 2) Call Python LLM service
//       llmResult = await askLLM({
//         query: message,
//         topK,
//         userId,
//         sessionId
//       });
//     } catch (err) {
//       // Mark query closed if LLM call fails
//       await queryRow.update({ status: 'closed' }, { transaction: t });
//       throw err;
//     }

//     // 3) Save response
//     const responseRow = await Response.create(
//       {
//         queryId: queryRow.id,
//         responseText: llmResult.answer || '',
//         citations: llmResult.citations || [],
//         confidence: llmResult.confidence ?? 0,
//         numSources: llmResult.num_sources ?? 0
//       },
//       { transaction: t }
//     );

//     // 4) Save history entry
//     await History.create(
//       {
//         userId,
//         queryId: queryRow.id,
//         entryTime: new Date()
//       },
//       { transaction: t }
//     );

//     // 5) Mark query answered
//     await queryRow.update({ status: 'answered' }, { transaction: t });

//     return {
//       query: {
//         id: queryRow.id,
//         queryText: queryRow.queryText,
//         queryType: queryRow.queryType,
//         status: 'answered',
//         createdAt: queryRow.createdAt
//       },
//       response: {
//         id: responseRow.id,
//         responseText: responseRow.responseText,
//         citations: responseRow.citations || [],
//         confidence: responseRow.confidence ?? 0,
//         numSources: responseRow.numSources ?? 0,
//         createdAt: responseRow.createdAt
//       }
//     };
//   });
// };

// const getUserChatHistory = async ({ userId, limit = 50, offset = 0 }) => {
//   const rows = await Query.findAndCountAll({
//     where: { userId },
//     include: [
//       {
//         model: Response,
//         as: 'response',
//         required: false
//       }
//     ],
//     order: [['createdAt', 'DESC']],
//     limit,
//     offset
//   });

//   return {
//     total: rows.count,
//     items: rows.rows.map((q) => ({
//       queryId: q.id,
//       queryText: q.queryText,
//       queryType: q.queryType,
//       status: q.status,
//       queryCreatedAt: q.createdAt,
//       response: q.response
//         ? {
//             responseId: q.response.id,
//             responseText: q.response.responseText,
//             citations: q.response.citations || [],
//             confidence: q.response.confidence ?? 0,
//             numSources: q.response.numSources ?? 0,
//             responseCreatedAt: q.response.createdAt
//           }
//         : null
//     }))
//   };
// };

// module.exports = {
//   createChatResponse,
//   getUserChatHistory
// };

// New ChatService.js:
const { sequelize, Query, Response, History } = require('../models');
const { askLLM } = require('./llmservice');

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA – used when DEMO_MODE=true in .env (or when LLM is unavailable)
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_QA = [
  {
    keywords: ['employment contract', 'employment', 'contract', 'job'],
    answer: `Employment contracts in Pakistan are governed under the Industrial and Commercial Employment (Standing Orders) Ordinance 1968 and the West Pakistan Shops and Establishments Ordinance 1969. These contracts generally include designation and job description, remuneration details such as salary and benefits, working hours which are typically 8 hours per day and 48 hours per week, a probation period usually ranging from 3 to 6 months, termination clauses with notice periods often around 30 days, and confidentiality or non-disclosure obligations. Employees cannot waive rights granted by law, contracts must comply with minimum wage requirements such as PKR 32,000 per month as notified in 2024, and disputes may be referred to Labour Court under the Industrial Relations Act 2012. ⚠ Disclaimer: This is general legal information generated by an AI system and does not constitute formal legal advice.

*⚠ Disclaimer: This is general legal information generated by an AI system and does not constitute formal legal advice.*`,
    citations: ['Industrial & Commercial Employment Ordinance 1968, S.4', 'Industrial Relations Act 2012, S.33'],
    confidence: 0.91,
    num_sources: 2,
  },
  {
    keywords: ['corporate tax', 'tax', 'income tax', 'corporate'],
    answer: `Corporate tax liability in Pakistan is governed under the Income Tax Ordinance 2001. For FY 2023-24, the tax rate is 29% for public and private companies, 39% for banking companies, and 20% for small companies. Key provisions include super tax on income exceeding PKR 300 million, minimum tax at 1.25% of turnover where regular tax is lower, advance tax collection at source which is adjustable against final liability, and return filing requirements such as filing by December 31 for companies with June 30 year-end. Tax credits may be available for balancing, modernization and replacement investments, employment generation, and stock exchange enlistment. ⚠ Disclaimer: Tax laws change frequently. Consult a qualified tax professional for current rates and compliance requirements.

*⚠ Disclaimer: Tax laws change frequently. Consult a qualified tax professional for current rates and compliance requirements.*`,
    citations: ['Income Tax Ordinance 2001, S.113', 'Finance Act 2023, Schedule I'],
    confidence: 0.94,
    num_sources: 2,
  },
  {
    keywords: ['property', 'property dispute', 'land', 'ownership', 'title'],
    answer: `Property disputes in Pakistan are mainly governed by the Transfer of Property Act 1882, Registration Act 1908, and Land Revenue Act 1967. Common disputes include title disputes involving conflicting ownership claims, boundary disputes due to encroachment, inheritance-related distribution conflicts, and tenancy disputes between landlords and tenants. Resolution forums include Revenue Courts for agricultural land matters, Civil Courts for urban property matters, and appellate forums including High Courts and the Supreme Court. Important documents commonly required include Fard Malkiat, registered sale or gift deeds, and mutation or intiqal entries. Limitation periods generally include 12 years for possession suits and 6 years for money suits related to property. ⚠ Disclaimer: This is AI-generated legal information and should not substitute professional legal counsel.

*⚠ Disclaimer: This is AI-generated legal information and should not substitute professional legal counsel.*`,
    citations: ['Transfer of Property Act 1882, S.54', 'Land Revenue Act 1967, S.42', 'Limitation Act 1908'],
    confidence: 0.89,
    num_sources: 3,
  },
  {
    keywords: ['tenant', 'tenant rights', 'rent', 'landlord', 'rental'],
    answer: `Tenant and landlord relations in Pakistan are governed by provincial Rent Restriction laws and the Transfer of Property Act 1882. Tenants have the right to peaceful possession and cannot be forcibly evicted without court process, may seek fair rent determination through Rent Controller, are entitled to notice before eviction, can demand rent receipts, and cannot be pressured through unlawful utility disconnection. Lawful eviction grounds include prolonged non-payment of rent, unauthorized subletting, genuine personal need of landlord, and structural damage caused by tenant. Complaints may be filed before the Rent Controller in the local district, and in Punjab the Punjab Rented Premises Act 2009 applies. ⚠ Disclaimer: Provincial laws vary. Consult a local lawyer for jurisdiction-specific advice.

*⚠ Disclaimer: Provincial laws vary. Consult a local lawyer for jurisdiction-specific advice.*`,
    citations: ['Punjab Rented Premises Act 2009, S.7', 'Transfer of Property Act 1882, S.108'],
    confidence: 0.88,
    num_sources: 2,
  },
  {
    keywords: ['state bank', 'sbp', 'central bank', 'banking regulation'],
    answer: `Banking regulation in Pakistan is primarily governed by the State Bank of Pakistan Act 1956 and the Banking Companies Ordinance 1962. The State Bank of Pakistan handles monetary policy, bank supervision, foreign exchange reserve management, and acts as lender of last resort. Core regulatory requirements include capital adequacy, statutory liquidity reserves, cash reserve ratios, and prudential controls for lending and risk management. Consumer protection is supported through Banking Mohtasib complaint mechanisms and timelines for resolution. Recent developments in 2024 included policy rate adjustments and digital banking regulation updates. ⚠ Disclaimer: Regulations are subject to frequent revision. Verify current requirements with official SBP circulars.

*⚠ Disclaimer: Regulations are subject to frequent revision. Verify current requirements with official SBP circulars.*`,
    citations: ['State Bank of Pakistan Act 1956', 'Banking Companies Ordinance 1962, S.25', 'SBP Prudential Regulations 2023'],
    confidence: 0.92,
    num_sources: 3,
  },
  {
    keywords: ['divorce', 'talaq', 'khula', 'marriage', 'family law'],
    answer: `Divorce and family law matters in Pakistan are governed under the Muslim Family Laws Ordinance 1961 and the Dissolution of Muslim Marriages Act 1939. Divorce may occur through talaq initiated by husband with required notice and reconciliation process, khula initiated by wife through court, mubarat by mutual consent, or judicial divorce by court decree. Under MFLO, talaq procedure includes written notice to Union Council, service to wife, and a 90-day reconciliation period before effectiveness if no reconciliation occurs. Post-divorce issues include iddat maintenance, mehr entitlement, and child custody principles under family law. Family courts have exclusive jurisdiction, typically based on locality of the wife’s residence. ⚠ Disclaimer: This is general information. Family law matters are sensitive and require qualified legal representation.

*⚠ Disclaimer: This is general information. Family law matters are sensitive and require qualified legal representation.*`,
    citations: ['Muslim Family Laws Ordinance 1961, S.7', 'Family Courts Act 1964', 'Dissolution of Muslim Marriages Act 1939'],
    confidence: 0.90,
    num_sources: 3,
  },
];

const DEFAULT_ANSWER = `Thank you for your question. As a Digital Legal Advisor specializing in Pakistani law, I can provide guidance on topics including corporate and commercial law, family law, property law, labor law, constitutional and administrative law, and banking and financial regulations. For a more specific answer, please rephrase your question with relevant keywords, for example: "What are tenant rights in Pakistan?", "How does corporate tax work?", or "Explain divorce procedure under MFLO". ⚠ Disclaimer: This AI system provides general legal information only. For formal legal advice, please consult a qualified advocate registered with the Pakistan Bar Council.

*⚠ Disclaimer: This AI system provides general legal information only. For formal legal advice, please consult a qualified advocate registered with the Pakistan Bar Council.*`;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: find best demo answer
// ─────────────────────────────────────────────────────────────────────────────
const findDemoAnswer = (query) => {
  const q = query.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const item of DEMO_QA) {
    const score = item.keywords.filter((kw) => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore > 0) return best;

  return {
    answer: DEFAULT_ANSWER,
    citations: [],
    confidence: 0.5,
    num_sources: 0,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Main service functions
// ─────────────────────────────────────────────────────────────────────────────
const createChatResponse = async ({
  message,
  userId,
  queryType = 'general',
  topK = 5,
  sessionId = null,
}) => {
  return sequelize.transaction(async (t) => {
    // 1) Save query as pending
    const queryRow = await Query.create(
      { userId, queryText: message, queryType, status: 'pending' },
      { transaction: t }
    );

    let llmResult;
    const isDemoMode = process.env.DEMO_MODE === 'true';

    try {
      if (isDemoMode) {
        // Simulate network delay for realism
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
        llmResult = findDemoAnswer(message);
      } else {
        llmResult = await askLLM({ query: message, topK, userId, sessionId });
      }
    } catch (err) {
      // Graceful fallback to demo answers if LLM is down
      console.warn('[ChatService] LLM unavailable, falling back to demo mode:', err.message);
      await new Promise((r) => setTimeout(r, 600));
      llmResult = findDemoAnswer(message);
    }

    // 2) Save response
    const responseRow = await Response.create(
      {
        queryId: queryRow.id,
        responseText: llmResult.answer || llmResult.responseText || '',
        citations: llmResult.citations || [],
        confidence: llmResult.confidence ?? 0,
        numSources: llmResult.num_sources ?? 0,
      },
      { transaction: t }
    );

    // 3) Save history entry
    await History.create(
      { userId, queryId: queryRow.id, entryTime: new Date() },
      { transaction: t }
    );

    // 4) Mark query answered
    await queryRow.update({ status: 'answered' }, { transaction: t });

    return {
      query: {
        id: queryRow.id,
        queryText: queryRow.queryText,
        queryType: queryRow.queryType,
        status: 'answered',
        createdAt: queryRow.createdAt,
      },
      response: {
        id: responseRow.id,
        responseText: responseRow.responseText,
        citations: responseRow.citations || [],
        confidence: responseRow.confidence ?? 0,
        numSources: responseRow.numSources ?? 0,
        createdAt: responseRow.createdAt,
      },
    };
  });
};

const getUserChatHistory = async ({ userId, limit = 50, offset = 0 }) => {
  const rows = await Query.findAndCountAll({
    where: { userId },
    include: [{ model: Response, as: 'response', required: false }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    total: rows.count,
    items: rows.rows.map((q) => ({
      queryId: q.id,
      queryText: q.queryText,
      queryType: q.queryType,
      status: q.status,
      queryCreatedAt: q.createdAt,
      response: q.response
        ? {
            responseId: q.response.id,
            responseText: q.response.responseText,
            citations: q.response.citations || [],
            confidence: q.response.confidence ?? 0,
            numSources: q.response.numSources ?? 0,
            responseCreatedAt: q.response.createdAt,
          }
        : null,
    })),
  };
};

const deleteChat = async ({ queryId, userId }) => {
  const query = await Query.findOne({ where: { id: queryId, userId } });
  if (!query) throw Object.assign(new Error('Chat not found'), { statusCode: 404 });

  // Cascade deletes response + history via DB constraints
  await query.destroy();
  return { deleted: true };
};

const submitFeedback = async ({ userId, responseId, rating, comment }) => {
  const { Feedback } = require('../models');

  // Upsert so user can change their rating
  const [feedback, created] = await Feedback.upsert(
    { userId, responseId, rating, comment },
    { conflictFields: ['userId', 'responseId'] }
  );

  return { feedback, created };
};

module.exports = {
  createChatResponse,
  getUserChatHistory,
  deleteChat,
  submitFeedback,
};