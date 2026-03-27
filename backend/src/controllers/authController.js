const authService = require('../services/authService');
const emailService = require('../services/emailService');

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    const result = await authService.register({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role:  role || 'user' // Default to 'user' if not specified
    });

    // Send welcome email (don't wait for it)
    emailService.sendWelcomeEmail(result.user.email, result.user.firstName)
      .catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully.  Please check your email to verify your account.',
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req. body;

    const result = await authService.login(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports. googleAuth = async (req, res, next) => {
  // This is handled by Passport middleware
  // We just need to define the success callback
};

exports.googleAuthCallback = async (req, res, next) => {
  try {
    // User is attached to req by passport
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }

    // Generate tokens
    const token = authService.generateToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user. save();

    // Redirect to frontend with tokens
    // You can pass tokens via URL params or set them as cookies
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    next(error);
  }
};

exports. logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user:  req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const result = await authService.verifyEmail(token);

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: {
        user: result.user
      }
    });
  } catch (error) {
    next(error);
  }
};

exports. requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.requestPasswordReset(email);

    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

exports. resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService. resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: {
        token: result.token,
        refreshToken: result.refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};