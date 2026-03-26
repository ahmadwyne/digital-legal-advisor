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

const { sequelize, Query, Response, History } = require('../models');
const { askLLM } = require('e:/Digital Legal Advisor/DLA_Frontend/backend/src/services/llmservice');

const createChatResponse = async ({
  message,
  userId,
  queryType = 'general',
  topK = 5,
  sessionId = null
}) => {
  return sequelize.transaction(async (t) => {
    // 1) Save query as pending
    const queryRow = await Query.create(
      {
        userId,
        queryText: message,
        queryType,
        status: 'pending'
      },
      { transaction: t }
    );

    let llmResult;
    try {
      // 2) Call Python LLM service
      llmResult = await askLLM({
        query: message,
        topK,
        userId,
        sessionId
      });
    } catch (err) {
      // Mark query closed if LLM call fails
      await queryRow.update({ status: 'closed' }, { transaction: t });
      throw err;
    }

    // 3) Save response
    const responseRow = await Response.create(
      {
        queryId: queryRow.id,
        responseText: llmResult.answer || '',
        citations: llmResult.citations || [],
        confidence: llmResult.confidence ?? 0,
        numSources: llmResult.num_sources ?? 0
      },
      { transaction: t }
    );

    // 4) Save history entry
    await History.create(
      {
        userId,
        queryId: queryRow.id,
        entryTime: new Date()
      },
      { transaction: t }
    );

    // 5) Mark query answered
    await queryRow.update({ status: 'answered' }, { transaction: t });

    return {
      query: {
        id: queryRow.id,
        queryText: queryRow.queryText,
        queryType: queryRow.queryType,
        status: 'answered',
        createdAt: queryRow.createdAt
      },
      response: {
        id: responseRow.id,
        responseText: responseRow.responseText,
        citations: responseRow.citations || [],
        confidence: responseRow.confidence ?? 0,
        numSources: responseRow.numSources ?? 0,
        createdAt: responseRow.createdAt
      }
    };
  });
};

const getUserChatHistory = async ({ userId, limit = 50, offset = 0 }) => {
  const rows = await Query.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Response,
        as: 'response',
        required: false
      }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset
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
            responseCreatedAt: q.response.createdAt
          }
        : null
    }))
  };
};

module.exports = {
  createChatResponse,
  getUserChatHistory
};