import * as postTagService from '../../services/post/post-tag.service.js';

export const getAllPostTags = async (req, res) => {
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
        const tagId = req.query.tagId || null;
        const pageId = req.query.pageId || null;
        const postId = req.query.postId || null;
        const document_share_id = req.query.document_share_id || null;
        

        // Gọi service để lấy danh sách post-tags
        const postTagsData = await postTagService.getAllPostTags({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            tagId,
            pageId,
            postId,
            document_share_id
        });

        // Trả về kết quả
        return res.status(200).json(postTagsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

// Controller để lấy post-tags với các trường tùy chỉnh theo tagId
export const getCustomPostTagsByTagId = async (req, res) => {
    try {
        const { tagId } = req.params;
        
        // Lấy danh sách các trường tùy chỉnh từ query
        let customAttributes = ['page_id']; // Mặc định lấy pageId
        if (req.query.fields) {
            customAttributes = req.query.fields.split(',');
        }
        
        // Kiểm tra xem có cần lọc page_id not null hay không
        const pageIdNotNull = req.query.pageIdNotNull === 'true';
        
        // Kiểm tra xem có cần include thông tin page hay không
        const includePage = req.query.includePage === 'true';

        const includePagemember = req.query.includePagemem === 'true'
        
        // Gọi service với tham số customAttributes
        const postTagsData = await postTagService.getAllPostTags({
            tagId,
            customAttributes,
            pageIdNotNull,
            includePage
        });
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách post-tags thành công',
            data: postTagsData.data
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPostTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const postTag = await postTagService.getPostTagById(id);
        
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

export const createPostTag = async (req, res) => {
    try {
        const postTagData = req.body;
        
        const newPostTag = await postTagService.createPostTag(postTagData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo post-tag mới thành công',
            data: newPostTag
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updatePostTag = async (req, res) => {
    try {
        const { id } = req.params;
        const postTagData = req.body;
        const updatedPostTag = await postTagService.updatePostTag(id, postTagData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật post-tag thành công',
            data: updatedPostTag
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deletePostTag = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await postTagService.deletePostTag(id);
        
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