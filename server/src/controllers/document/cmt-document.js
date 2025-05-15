import * as cmtDocumentService from '../../services/document/cmt-document.service.js';

export const getAllCmtDocument = async (req, res) => {
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
        const parentId = req.query.parentId || null;
        const document_share_id = req.query.document_share_id || null;
        

        // Gọi service để lấy danh sách comment document
        const cmtDocumentData = await cmtDocumentService.getAllCmtDocument({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            parentId,
            document_share_id
        });

        // Trả về kết quả
        return res.status(200).json(cmtDocumentData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getCmtDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const cmtDocument = await cmtDocumentService.getCmtDocumentById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin comment document thành công',
            data: cmtDocument
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createCmtDocument = async (req, res) => {
    try {
        const cmtDocumentData = req.body;
        const newCmtDocument = await cmtDocumentService.createCmtDocument(cmtDocumentData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo comment document mới thành công',
            data: newCmtDocument
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateCmtDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const cmtDocumentData = req.body;
        const updatedCmtDocument = await cmtDocumentService.updateCmtDocument(id, cmtDocumentData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật comment document thành công',
            data: updatedCmtDocument
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteCmtDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await cmtDocumentService.deleteCmtDocument(id);
        
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