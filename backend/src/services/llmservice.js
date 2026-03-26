const axios = require('axios');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 180000);
const LLM_API_KEY = process.env.LLM_API_KEY;

const askLLM = async ({ query, topK = 5, userId = null, sessionId = null }) => {
  if (!PYTHON_SERVICE_URL) {
    throw new Error('PYTHON_SERVICE_URL is not configured');
  }

  const { data } = await axios.post(
    `${PYTHON_SERVICE_URL}/answer`,
    {
      query,
      top_k: topK,
      user_id: userId,
      session_id: sessionId
    },
    {
      timeout: LLM_TIMEOUT_MS,
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`
      }
    }
  );

  return data;
};

module.exports = { askLLM };