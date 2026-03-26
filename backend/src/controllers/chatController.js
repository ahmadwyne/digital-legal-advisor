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

const {
  createChatResponse,
  getUserChatHistory,
  deleteChat,
  submitFeedback,
} = require('../services/chatService');

// ─── POST /api/v1/chat ────────────────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { message, queryType = 'general', top_k = 5, sessionId = null, userId: bodyUserId } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ status: 'error', message: 'message is required' });
    }

    // Accept userId from JWT (req.user), or from request body (demo / dev mode)
    const userId = req.user?.id || bodyUserId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized: userId not found' });
    }

    const result = await createChatResponse({
      message: String(message).trim(),
      userId,
      queryType,
      topK: Number(top_k) || 5,
      sessionId,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Response generated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/chat/history?limit=50&offset=0 ───────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    // Accept userId from JWT or query param (demo / dev mode)
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const limit  = Math.min(Number(req.query.limit  || 50), 100);
    const offset = Number(req.query.offset || 0);

    const data = await getUserChatHistory({ userId, limit, offset });

    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/v1/chat/:queryId ─────────────────────────────────────────────
const deleteMessage = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId || req.query.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const { queryId } = req.params;
    const result = await deleteChat({ queryId, userId });

    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// ─── POST /api/v1/chat/feedback ───────────────────────────────────────────────
const postFeedback = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const { responseId, rating, comment } = req.body;
    if (!responseId || !['like', 'dislike'].includes(rating)) {
      return res.status(400).json({
        status: 'error',
        message: 'responseId and rating ("like"|"dislike") are required',
      });
    }

    const result = await submitFeedback({ userId, responseId, rating, comment });

    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getHistory, deleteMessage, postFeedback };