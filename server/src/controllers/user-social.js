import * as userSocialService from '../services/user-social.service.js';

export const getAllUserSocials = async (req, res) => {
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
        if (req.query.status) filters.status = req.query.status;
        if (req.query.keyword) filters.keyword = req.query.keyword;

        // Lấy các tham số lọc
        const userId = req.query.userId || null;
        
        // Gọi service để lấy danh sách user-socials
        const userSocialsData = await userSocialService.getAllUserSocials({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            userId
        });

        // Trả về kết quả
        return res.status(200).json(userSocialsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getUserSocialById = async (req, res) => {
    try {
        const { id } = req.params;
        const userSocial = await userSocialService.getUserSocialById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin user-social thành công',
            data: userSocial
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createUserSocial = async (req, res) => {
    try {
        const userSocialData = req.body;
        const newUserSocial = await userSocialService.createUserSocial(userSocialData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo user-social mới thành công',
            data: newUserSocial
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateUserSocial = async (req, res) => {
    try {
        const { id } = req.params;
        const userSocialData = req.body;
        const updatedUserSocial = await userSocialService.updateUserSocial(id, userSocialData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật user-social thành công',
            data: updatedUserSocial
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteUserSocial = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userSocialService.deleteUserSocial(id);
        
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