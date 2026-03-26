// const chatService = require('../services/chatService');

// exports.processMessage = async (req, res, next) => {
//   try {
//     const { message, history } = req.body;
    
//     if (!message) {
//       return res.status(400).json({ 
//         status: 'error', 
//         message: 'Message is required' 
//       });
//     }

//     // Call the service to get the LLM response
//     const response = await chatService.generateResponse(message, history, req.user.id);

//     res.status(200).json({
//       status: 'success',
//       data: { reply: response }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const { createChatResponse, getUserChatHistory } = require('../services/chatService');

// POST /api/v1/chat
const sendMessage = async (req, res, next) => {
  try {
    const { message, queryType = 'general', top_k = 5, sessionId = null } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'message is required'
      });
    }

    // Prefer authenticated user from passport
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: userId not found'
      });
    }

    const result = await createChatResponse({
      message: String(message).trim(),
      userId,
      queryType,
      topK: Number(top_k) || 5,
      sessionId
    });

    return res.status(200).json({
      status: 'success',
      message: 'Response generated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/chat/history?limit=50&offset=0
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: userId not found'
      });
    }

    const limit = Number(req.query.limit || 50);
    const offset = Number(req.query.offset || 0);

    const data = await getUserChatHistory({ userId, limit, offset });

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getHistory
};