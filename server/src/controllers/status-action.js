import * as statusActionService from '../services/status-action.service.js';

export const getAllStatusActions = async (req, res) => {
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
        const typeId = req.query.typeId || null;

        // Gọi service để lấy danh sách post-tags
        const statusActionsData = await statusActionService.getAllStatusActions({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            typeId,
        });

        // Trả về kết quả
        return res.status(200).json(statusActionsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getStatusActionById = async (req, res) => {
    try {
        const { id } = req.params;
        const statusAction = await statusActionService.getStatusActionById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin status-action thành công',
            data: statusAction
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createStatusAction = async (req, res) => {
    try {
        const statusActionData = req.body;
        const newStatusAction = await statusActionService.createStatusAction(statusActionData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo status-action mới thành công',
            data: newStatusAction
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateStatusAction = async (req, res) => {
    try {
        const { id } = req.params;
        const statusActionData = req.body;
        const updatedStatusAction = await statusActionService.updateStatusAction(id, statusActionData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật status-action thành công',
            data: updatedStatusAction
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteStatusAction = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await statusActionService.deleteStatusAction(id);
        
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