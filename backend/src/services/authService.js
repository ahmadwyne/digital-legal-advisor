const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const config = require('../config/config');
const emailService = require('./emailService');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpire
    });
  }

  // Generate refresh token
  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpire
    });
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config. jwtRefreshSecret);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Register new user (local)
  async register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData. email } });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password
    if (!userData.password || userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create user
    const user = await User.create({
      ... userData,
      authProvider: 'local'
    });

    // Generate email verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // 🔥 LOG TOKEN FOR DEVELOPMENT
    console.log('═══════════════════════════════════════════');
    console.log('📧 EMAIL VERIFICATION TOKEN GENERATED');
    console.log('═══════════════════════════════════════════');
    console.log('User:', user.email);
    console.log('Token:', verificationToken);
    console.log('Link:', `${process.env. FRONTEND_URL}/verify-email?token=${verificationToken}`);
    console.log('═══════════════════════════════════════════\n');

    // Send verification email (optional)
    try {
      await emailService.sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    // Generate tokens
    const token = this.generateToken(user. id);
    const refreshToken = this. generateRefreshToken(user.id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user,
      token,
      refreshToken
    };
  }

  // Login user (local)
  async login(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // Check if user is OAuth user
    if (user.authProvider !== 'local') {
      throw new Error(`Please sign in with ${user.authProvider}`);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    
    // Generate tokens
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user. save();

    return {
      user,
      token,
      refreshToken
    };
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken);

    // Find user and verify refresh token matches
    const user = await User. findByPk(decoded.id);

    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = this.generateToken(user.id);

    return {
      token: newAccessToken,
      user
    };
  }

  // Logout user
  async logout(userId) {
    const user = await User.findByPk(userId);
    
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return { message: 'Logged out successfully' };
  }

  // Verify email
  async verifyEmail(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { [require('sequelize').Op.gt]: Date.now() }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return { message: 'Email verified successfully', user };
  }

  // Request password reset
  async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    if (user.authProvider !== 'local') {
      throw new Error(`This account uses ${user.authProvider} authentication`);
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return { message: 'Password reset link sent to email' };
  }

  // Request password reset
  async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    if (user.authProvider !== 'local') {
      throw new Error(`This account uses ${user.authProvider} authentication`);
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // 🔥 LOG TOKEN FOR DEVELOPMENT
    console.log('═══════════════════════════════════════════');
    console.log('🔑 PASSWORD RESET TOKEN GENERATED');
    console.log('═══════════════════════════════════════════');
    console.log('User:', user.email);
    console.log('Token:', resetToken);
    console.log('Link:', `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
    console.log('═══════════════════════════════════════════\n');

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return { message: 'Password reset link sent to email' };
  }

  // Change password (authenticated user)
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.authProvider !== 'local') {
      throw new Error(`Cannot change password for ${user.authProvider} accounts`);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user. password = newPassword;
    user.refreshToken = null; // Invalidate all sessions
    await user.save();

    // Generate new tokens
    const token = this.generateToken(user.id);
    const refreshToken = this. generateRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      message: 'Password changed successfully',
      token,
      refreshToken
    };
  }
}

module.exports = new AuthService();
