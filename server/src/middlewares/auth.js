import jwt from 'jsonwebtoken';
import db from '../models';

const User = db.User;

export const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực',
        error: {
          message: 'Không có token xác thực'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Xác thực token
    jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret', async (err, decoded) => {
      if (err) {
        // Token không hợp lệ hoặc đã hết hạn
        return res.status(401).json({
          success: false,
          message: 'Token không hợp lệ hoặc đã hết hạn',
          error: {
            message: err.message
          }
        });
      }
      
      // Kiểm tra xem user có tồn tại không
      const user = await User.findOne({ where: { documentId: decoded.id } });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
          error: {
            message: 'Không tìm thấy người dùng'
          }
        });
      }
      
      // Lưu thông tin user vào request để sử dụng ở các middleware và controller tiếp theo
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      req.userRole = decoded.role_id;
      
      next();
    });
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: {
        message: error.message
      }
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const { userRole } = req;
    
    // Kiểm tra role ID của admin
    const adminRoleId = process.env.ROLE_ADMIN_ID || '2';
    
    if (userRole !== adminRoleId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
        error: {
          message: 'Không có quyền truy cập'
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: {
        message: error.message
      }
    });
  }
}; 