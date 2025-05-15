import * as statusActivityService from '../services/status-activity.service.js';

export const getAllStatusActivities = async (req, res) => {
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
        const statusActivitiesData = await statusActivityService.getAllStatusActivities({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            typeId,
        });

        // Trả về kết quả
        return res.status(200).json(statusActivitiesData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getStatusActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const statusActivity = await statusActivityService.getStatusActivityById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin status-activity thành công',
            data: statusActivity
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createStatusActivity = async (req, res) => {
    try {
        const statusActivityData = req.body;
        const newStatusActivity = await statusActivityService.createStatusActivity(statusActivityData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo status-activity mới thành công',
            data: newStatusActivity
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateStatusActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const statusActivityData = req.body;
        const updatedStatusActivity = await statusActivityService.updateStatusActivity(id, statusActivityData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật status-activity thành công',
            data: updatedStatusActivity
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteStatusActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await statusActivityService.deleteStatusActivity(id);
        
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