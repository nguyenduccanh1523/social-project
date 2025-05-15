import * as tagService from '../services/tag.service.js';

export const getAllTags = async (req, res) => {
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
        const pageId = req.query.pageId || null;
        const postId = req.query.postId || null;
        const document_share_id = req.query.document_share_id || null;

        // Gọi service để lấy danh sách tags
        const tagsData = await tagService.getAllTags({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            pageId,
            postId,
            document_share_id
        });

        // Trả về kết quả
        return res.status(200).json(tagsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await tagService.getTagById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin tag thành công',
            data: tag
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createTag = async (req, res) => {
    try {
        const tagData = req.body;
        const newTag = await tagService.createTag(tagData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo tag mới thành công',
            data: newTag
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tagData = req.body;
        const updatedTag = await tagService.updateTag(id, tagData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật tag thành công',
            data: updatedTag
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await tagService.deleteTag(id);
        
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