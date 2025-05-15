import * as roleService from '../services/role.service.js';

export const getAllRoles = async (req, res) => {
  try {
    // Lấy tham số phân trang từ query
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;
    
    // Gọi service để lấy danh sách vai trò
    const rolesData = await roleService.getAllRoles({ page, pageSize });
    
    // Trả về kết quả
    return res.status(200).json(rolesData);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: 'Lỗi từ server: ' + error.message
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    
    return res.status(200).json({
      err: 0,
      message: 'Lấy thông tin vai trò thành công',
      data: role
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const roleData = req.body;
    const newRole = await roleService.createRole(roleData);
    
    return res.status(201).json({
      err: 0,
      message: 'Tạo vai trò mới thành công',
      data: newRole
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      message: error.message
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const roleData = req.body;
    
    const updatedRole = await roleService.updateRole(id, roleData);
    
    return res.status(200).json({
      err: 0,
      message: 'Cập nhật vai trò thành công',
      data: updatedRole
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await roleService.deleteRole(id);
    
    return res.status(200).json({
      err: 0,
      message: result.message
    });
  } catch (error) {
    return res.status(404).json({
      err: -1,
      message: error.message
    });
  }
}; 