import * as noticeTypeService from '../services/notice-type.service';

export const getAllNoticeTypes = async (req, res) => {
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
        if (req.query.name) filters.name = req.query.name;
        if (req.query.keyword) filters.keyword = req.query.keyword;

        // Gọi service để lấy danh sách notice-types
        const noticeTypesData = await noticeTypeService.getAllNoticeTypes({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate
        });

        // Trả về kết quả
        return res.status(200).json(noticeTypesData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getNoticeTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const noticeType = await noticeTypeService.getNoticeTypeById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin notice-type thành công',
            data: noticeType
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createNoticeType = async (req, res) => {
    try {
        const noticeTypeData = req.body;
        const newNoticeType = await noticeTypeService.createNoticeType(noticeTypeData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo notice-type mới thành công',
            data: newNoticeType
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateNoticeType = async (req, res) => {
    try {
        const { id } = req.params;
        const noticeTypeData = req.body;
        const updatedNoticeType = await noticeTypeService.updateNoticeType(id, noticeTypeData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật notice-type thành công',
            data: updatedNoticeType
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteNoticeType = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await noticeTypeService.deleteNoticeType(id);
        
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