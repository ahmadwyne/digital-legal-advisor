const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const { validate } = require('../middlewares/validationMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// Local authentication
router.post(
  '/register',
  authValidator.registerValidator,
  validate,
  authController.register
);

router.post(
  '/login',
  authValidator. loginValidator,
  validate,
  authController.login
);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  authController.googleAuthCallback
);

// Token management
router.post(
  '/refresh-token',
  authValidator.refreshTokenValidator,
  validate,
  authController.refreshToken
);

router.post(
  '/logout',
  protect,
  authController.logout
);

// User info
router.get(
  '/me',
  protect,
  authController.getMe
);

// Email verification
router.get(
  '/verify-email/:token',
  authValidator.verifyEmailValidator,
  validate,
  authController.verifyEmail
);

// Password management
router.post(
  '/forgot-password',
  authValidator.requestPasswordResetValidator,
  validate,
  authController.requestPasswordReset
);

router.post(
  '/reset-password/:token',
  authValidator.resetPasswordValidator,
  validate,
  authController.resetPassword
);

router.post(
  '/change-password',
  protect,
  authValidator. changePasswordValidator,
  validate,
  authController.changePassword
);

module.exports = router;