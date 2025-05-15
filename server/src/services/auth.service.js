import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const User = db.User;

// Hằng số thời gian token
const ACCESS_TOKEN_EXPIRATION = '1h';        // Access token hết hạn sau 1 giờ
const REFRESH_TOKEN_EXPIRATION = '5d';       // Refresh token hết hạn sau 5 ngày
const REFRESH_TOKEN_EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 ngày tính bằng ms

// Tạo access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.documentId, email: user.email, role_id: user.role_id },
    process.env.JWT_SECRET || 'your-default-secret',
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
};

// Tạo refresh token
const generateRefreshToken = () => {
  return jwt.sign(
    { data: uuidv4() },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );
};

// Kiểm tra độ mạnh của mật khẩu
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  const { email, password, confirmPassword, username } = userData;
  
  // Kiểm tra các trường bắt buộc
  if (!email || !password || !confirmPassword || !username) {
    return {
      success: false,
      statusCode: 400,
      message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      error: 'Email, username, password và confirmPassword là bắt buộc'
    };
  }
  
  // Kiểm tra xác nhận mật khẩu
  if (password !== confirmPassword) {
    return {
      success: false,
      statusCode: 400,
      message: 'Mật khẩu xác nhận không khớp',
      error: 'Mật khẩu xác nhận không khớp với mật khẩu'
    };
  }
  
  // Kiểm tra độ mạnh của mật khẩu
  if (!validatePassword(password)) {
    return {
      success: false,
      statusCode: 400,
      message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
      error: 'Mật khẩu không đủ mạnh'
    };
  }
  
  try {
    // Kiểm tra email đã tồn tại hay chưa
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return {
        success: false,
        statusCode: 400,
        message: 'Email đã được sử dụng',
        error: 'Email đã tồn tại'
      };
    }
    
    // Kiểm tra username đã tồn tại hay chưa
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return {
        success: false,
        statusCode: 400,
        message: 'Username đã được sử dụng',
        error: 'Username đã tồn tại'
      };
    }
    
    // Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // Tạo user mới
    const user = await User.create({
      documentId: uuidv4(),
      fullname: username, // Sử dụng username làm fullname nếu không có
      username,
      email,
      password: hashedPassword,
      date_of_birth: new Date(), // Giá trị mặc định
      gender: 'not_specified', // Giá trị mặc định
      role_id: process.env.ROLE_USER_ID || 'xha2u4697gkn1p9k97ycif3b', // ID của role user thường - đảm bảo ID tồn tại
      is_online: true,
      email_verified: false
    });
    
    // Tạo token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshExpires = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
    
    // Lưu refresh token vào database
    await user.update({
      refresh_token: refreshToken,
      refresh_token_expires: refreshExpires
    });
    
    // Lấy thêm thông tin avatar nếu có
    const userWithAvatar = await User.findOne({
      where: { documentId: user.documentId },
      include: [{
        model: db.Media,
        as: 'avatarMedia',
        attributes: ['documentId', 'file_path', 'file_type']
      }]
    });
    
    return {
      success: true,
      statusCode: 201,
      message: 'Đăng ký thành công',
      data: {
        jwt: accessToken,
        user: {
          id: user.documentId,
          documentId: user.documentId,
          username: user.username,
          email: user.email,
          provider: 'local',
          confirmed: user.email_verified,
          blocked: user.is_blocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          publishedAt: user.createdAt,
          avatar_id: userWithAvatar.avatar_id,
          avatarMedia: userWithAvatar.avatarMedia
        },
        refresh_token: refreshToken
      }
    };
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Lỗi server',
      error: error.message
    };
  }
};

// Đăng nhập
export const loginUser = async (credentials) => {
  const { identifier, password } = credentials;
  
  // Kiểm tra các trường bắt buộc
  if (!identifier || !password) {
    return {
      success: false,
      statusCode: 400,
      message: 'Vui lòng điền đầy đủ thông tin đăng nhập',
      error: 'Email/username và password là bắt buộc'
    };
  }
  
  try {
    // Kiểm tra định dạng email
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    
    // Tìm user theo email hoặc username và include avatarMedia
    const user = await User.findOne({ 
      where: isEmail ? { email: identifier } : { username: identifier },
      include: [{
        model: db.Media,
        as: 'avatarMedia',
        attributes: ['documentId', 'file_path', 'file_type']
      }]
    });
    
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: 'Email/username hoặc mật khẩu không đúng',
        error: 'Thông tin đăng nhập không hợp lệ'
      };
    }
    
    // Kiểm tra mật khẩu
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: 401,
        message: 'Email/username hoặc mật khẩu không đúng',
        error: 'Thông tin đăng nhập không hợp lệ'
      };
    }
    
    // Cập nhật trạng thái online
    await user.update({ is_online: true, last_active: new Date() });
    
    // Tạo access token và refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshExpires = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
    
    // Lưu refresh token vào database
    await user.update({
      refresh_token: refreshToken,
      refresh_token_expires: refreshExpires
    });
    
    return {
      success: true,
      statusCode: 200,
      message: 'Đăng nhập thành công',
      data: {
        jwt: accessToken,
        user: {
          id: user.documentId,
          documentId: user.documentId,
          username: user.username,
          email: user.email,
          provider: 'local',
          confirmed: user.email_verified,
          blocked: user.is_blocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          publishedAt: user.createdAt,
          avatarMedia: user.avatarMedia
        },
        refresh_token: refreshToken
      }
    };
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Lỗi server',
      error: error.message
    };
  }
};

// Làm mới token
export const refreshUserToken = async (refreshTokenData) => {
  const { refreshToken } = refreshTokenData;
  
  if (!refreshToken) {
    return {
      success: false,
      statusCode: 400,
      message: 'Refresh token không được cung cấp',
      error: 'Missing refresh token'
    };
  }
  
  try {
    // Tìm user với refresh token này
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    
    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Refresh token không hợp lệ',
        error: 'Invalid refresh token'
      };
    }
    
    // Kiểm tra xem refresh token đã hết hạn chưa
    if (new Date() > new Date(user.refresh_token_expires)) {
      // Xóa refresh token từ database
      await user.update({ refresh_token: null, refresh_token_expires: null });
      
      return {
        success: false,
        statusCode: 401,
        message: 'Refresh token đã hết hạn',
        error: 'Expired refresh token'
      };
    }
    
    // Tạo access token mới
    const newAccessToken = generateAccessToken(user);
    
    // Tạo refresh token mới (luân chuyển)
    const newRefreshToken = generateRefreshToken();
    const refreshExpires = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
    
    // Cập nhật refresh token mới vào database
    await user.update({
      refresh_token: newRefreshToken,
      refresh_token_expires: refreshExpires
    });
    
    return {
      success: true,
      statusCode: 200,
      message: 'Làm mới token thành công',
      data: {
        jwt: newAccessToken,
        refresh_token: newRefreshToken
      }
    };
  } catch (error) {
    console.error('Lỗi refresh token:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Lỗi server',
      error: error.message
    };
  }
};

// Đăng xuất
export const logoutUser = async (userId) => {
  if (!userId) {
    return {
      success: false,
      statusCode: 401,
      message: 'Không xác thực được người dùng',
      error: 'Unauthorized'
    };
  }
  
  try {
    // Tìm user
    const user = await User.findOne({ where: { documentId: userId } });
    
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: 'Không tìm thấy người dùng',
        error: 'User not found'
      };
    }
    
    // Xóa refresh token và cập nhật trạng thái
    await user.update({
      refresh_token: null,
      refresh_token_expires: null,
      is_online: false,
      last_active: new Date()
    });
    
    return {
      success: true,
      statusCode: 200,
      message: 'Đăng xuất thành công'
    };
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Lỗi server',
      error: error.message
    };
  }
}; 