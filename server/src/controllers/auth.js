import { registerUser, loginUser, refreshUserToken, logoutUser } from '../services/auth.service.js';

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
    console.error('Lỗi controller đăng ký:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
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
    console.error('Lỗi controller đăng nhập:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
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
    console.error('Lỗi controller refresh token:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
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
    console.error('Lỗi controller đăng xuất:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: {
        message: error.message
      }
    });
  }
}; 