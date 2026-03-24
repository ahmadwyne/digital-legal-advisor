const chatService = require('../services/chatService');

exports.processMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Message is required' 
      });
    }

    // Call the service to get the LLM response
    const response = await chatService.generateResponse(message, history, req.user.id);

    res.status(200).json({
      status: 'success',
      data: { reply: response }
    });
  } catch (error) {
    next(error);
  }
};