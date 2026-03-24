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
const { OpenAI } = require('openai');

class ChatService {
  async generateResponse(message, history, userId) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is missing from the .env file.');
      }

      // 1. Initialize inside the function to ensure .env is fully loaded first!
      // We are using the OpenAI SDK, but routing it to Google Gemini's free API
      const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY, // Make sure this is in your .env file
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      // 2. Format the history for the API
      const formattedHistory = history.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // 3. Add a System Prompt to set the AI's behavior
      const systemPrompt = {
        role: 'system',
        content: `You are the Digital Legal Advisor, a professional, highly accurate, and helpful legal AI assistant specializing in Pakistani Law. 
        
        Guidelines:
        1. Provide clear, structured, and informative answers using markdown formatting (bullet points, bold text).
        2. Maintain a formal, objective, and professional legal tone.
        3. If you do not know the answer, politely state that the query requires specific legal consultation.
        4. Always include a brief disclaimer at the end stating that you are an AI and this is not formal legal counsel.`
      };

      const messages = [systemPrompt, ...formattedHistory];

      // 4. Call the free Gemini API using the OpenAI SDK format
      const completion = await openai.chat.completions.create({
        model: 'gemini-1.5-flash', // Google's fast model (OpenAI-compat)
        messages: messages,
        temperature: 0.2, 
        max_tokens: 1000,
      });

      // 5. Return the text response to your controller
      return completion.choices[0].message.content;

    } catch (error) {
      console.error('LLM API Error:', error);
      
      if (error.status === 401 || error.message.includes('Missing credentials')) {
        throw new Error('API Key is invalid or missing from the .env file.');
      }
      
      throw new Error('The Legal Advisor is currently unavailable. Please try again later.');
    }
  }
}

module.exports = new ChatService();