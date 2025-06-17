import { registerUser, loginUser, refreshUserToken, logoutUser } from '../services/auth.service.js';
import bcrypt from 'bcrypt';
import db from '../models/index.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

// Configure transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use App Password instead of regular password
  },
});

// Check email connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email connection error:', error);
  } else {
    console.log('Email connection successful!');
  }
});

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    return res.status(result.statusCode).json(result.success ? {
      success: result.success,
      message: result.message,
      ...result.data
    } : {
      success: result.success,
      message: result.message,
      error: {
        message: result.error
      }
    });
  } catch (error) {
    console.error('Register controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: {
        message: error.message
      }
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    return res.status(result.statusCode).json(result.success ? {
      success: result.success,
      message: result.message,
      ...result.data
    } : {
      success: result.success,
      message: result.message,
      error: {
        message: result.error
      }
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: {
        message: error.message
      }
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const result = await refreshUserToken(req.body);
    return res.status(result.statusCode).json(result.success ? {
      success: result.success,
      message: result.message,
      ...result.data
    } : {
      success: result.success,
      message: result.message,
      error: {
        message: result.error
      }
    });
  } catch (error) {
    console.error('Refresh token controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: {
        message: error.message
      }
    });
  }
};

export const logout = async (req, res) => {
  try {
    const result = await logoutUser(req.userId);
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      ...(result.error ? { error: { message: result.error } } : {})
    });
  } catch (error) {
    console.error('Logout controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: {
        message: error.message
      }
    });
  }
}; 

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Email does not exist in the system' 
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({
      reset_password_token: token,
      reset_password_expires: expires,
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: {
        name: process.env.APP_NAME || 'Social App',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Sincerely,<br>${process.env.APP_NAME || 'Social App'}</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ 
        success: true,
        message: 'Password reset email sent successfully' 
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // If sending email fails, delete the token so the user can try again
      await user.update({
        reset_password_token: null,
        reset_password_expires: null,
      });
      throw new Error('Could not send password reset email');
    }
  } catch (err) {
    console.error('Error processing forgot password request:', err);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while processing the forgot password request',
      error: err.message 
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await db.User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }

    // Check password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashed,
      reset_password_token: null,
      reset_password_expires: null,
    });

    return res.status(200).json({ 
      success: true,
      message: 'Password reset successfully' 
    });
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while resetting the password',
      error: err.message 
    });
  }
};