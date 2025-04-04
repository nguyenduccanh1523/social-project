import db from '../models';
import { Op } from 'sequelize';

// Lấy tất cả vai trò có phân trang
export const getAllRoles = async ({ page = 1, pageSize = 25 }) => {
  try {
    const offset = (page - 1) * pageSize;
    
    // Thực hiện truy vấn đếm tổng số bản ghi
    const { count, rows } = await db.Role.findAndCountAll({
      attributes: ['documentId', 'roleName', 'description', 'createdAt', 'updatedAt'],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
    });

    // Tạo thông tin phân trang
    const pagination = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      pageCount: Math.ceil(count / pageSize),
      total: count
    };

    // Trả về kết quả định dạng theo yêu cầu
    return {
      data: rows,
      meta: {
        pagination
      }
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách vai trò: ${error.message}`);
  }
};

// Lấy vai trò theo ID
export const getRoleById = async (documentId) => {
  try {
    const role = await db.Role.findByPk(documentId);
    
    if (!role) {
      throw new Error('Không tìm thấy vai trò');
    }
    
    return role;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin vai trò: ${error.message}`);
  }
};

// Tạo vai trò mới
export const createRole = async (roleData) => {
  try {
    const newRole = await db.Role.create(roleData);
    return newRole;
  } catch (error) {
    throw new Error(`Lỗi khi tạo vai trò mới: ${error.message}`);
  }
};

// Cập nhật vai trò
export const updateRole = async (documentId, roleData) => {
  try {
    const role = await db.Role.findByPk(documentId);
    
    if (!role) {
      throw new Error('Không tìm thấy vai trò');
    }
    
    await role.update(roleData);
    return role;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật vai trò: ${error.message}`);
  }
};

// Xóa vai trò
export const deleteRole = async (documentId) => {
  try {
    const role = await db.Role.findByPk(documentId);
    
    if (!role) {
      throw new Error('Không tìm thấy vai trò');
    }
    
    await role.destroy();
    return { message: 'Xóa vai trò thành công' };
  } catch (error) {
    throw new Error(`Lỗi khi xóa vai trò: ${error.message}`);
  }
}; 