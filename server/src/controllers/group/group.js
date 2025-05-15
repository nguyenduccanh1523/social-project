import * as groupService from '../../services/group/group.service.js';

export const getAllGroups = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        // Xử lý tham số sort
        const sort = req.query.sort;
        let sortField = 'createdAt';
        let sortOrder = 'DESC';

        if (sort) {
            const sortParts = sort.split(':');
            if (sortParts.length === 2) {
                sortField = sortParts[0];
                sortOrder = sortParts[1].toUpperCase();
            }
        }

        // Xử lý populate
        const populate = req.query.populate === '*' ? true : false;

        // Xây dựng bộ lọc từ query params
        const filters = {};
        if (req.query.group_name) filters.group_name = req.query.group_name;
        if (req.query.keyword) filters.keyword = req.query.keyword;
        if (req.query.type_id) filters.type_id = req.query.type_id;
        
        // Lấy userId từ query
        const userId = req.query.userId || null;
        const adminId = req.query.adminId || null;

        // Gọi service để lấy danh sách groups
        const groupsData = await groupService.getAllGroups({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId,
            adminId
        });

        // Trả về kết quả
        return res.status(200).json(groupsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await groupService.getGroupById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin nhóm thành công',
            data: group
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createGroup = async (req, res) => {
    try {
        const groupData = req.body;
        
        // Lấy ID của người tạo nhóm từ token (người đăng nhập)
        if (!groupData.admin_id) {
            groupData.admin_id = req.user.documentId;
        }
        
        const newGroup = await groupService.createGroup(groupData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo nhóm mới thành công',
            data: newGroup
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const groupData = req.body;
        
        // Kiểm tra quyền cập nhật (chỉ admin của nhóm mới có quyền cập nhật)
        const group = await groupService.getGroupById(id);
        
        if (group.admin_id !== req.user.documentId) {
            return res.status(403).json({
                err: -1,
                message: 'Bạn không có quyền cập nhật nhóm này'
            });
        }
        
        const updatedGroup = await groupService.updateGroup(id, groupData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật nhóm thành công',
            data: updatedGroup
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra quyền xóa (chỉ admin của nhóm mới có quyền xóa)
        const group = await groupService.getGroupById(id);
        
        if (group.admin_id !== req.user.documentId) {
            return res.status(403).json({
                err: -1,
                message: 'Bạn không có quyền xóa nhóm này'
            });
        }
        
        const result = await groupService.deleteGroup(id);
        
        return res.status(200).json({
            err: 0,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const getGroupsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const groups = await groupService.getGroupsByUserId(userId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách nhóm của người dùng thành công',
            data: groups
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const getGroupsAdminByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const groups = await groupService.getGroupsAdminByUserId(userId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách nhóm do người dùng làm admin thành công',
            data: groups
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 