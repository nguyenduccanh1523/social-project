import * as supportService from '../services/support.service.js';

export const getAllSupport = async (req, res) => {
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
        

        // Gọi service để lấy danh sách post-tags
        const supportData = await supportService.getAllSupport({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
        });

        // Trả về kết quả
        return res.status(200).json(supportData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getSupportById = async (req, res) => {
    try {
        const { id } = req.params;
        const support = await supportService.getSupportById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin post-tag thành công',
            data: postTag
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createSupport = async (req, res) => {
    try {
        const supportData = req.body;
        const newSupport = await supportService.createSupport(supportData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo support mới thành công',
            data: newSupport
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateSupport = async (req, res) => {
    try {
        const { id } = req.params;
        const supportData = req.body;
        const updatedSupport = await supportService.updateSupport(id, supportData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật support thành công',
            data: updatedSupport
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteSupport = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supportService.deleteSupport(id);
        
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