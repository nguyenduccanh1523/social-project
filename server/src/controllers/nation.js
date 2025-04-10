import * as nationService from '../services/nation.service';

export const getAllNations = async (req, res) => {
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

        // Gọi service để lấy danh sách quốc gia
        const nationsData = await nationService.getAllNations({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate
        });

        // Trả về kết quả
        return res.status(200).json(nationsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getNationById = async (req, res) => {
    try {
        const { id } = req.params;
        const nation = await nationService.getNationById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin quốc gia thành công',
            data: nation
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createNation = async (req, res) => {
    try {
        const nationData = req.body;
        const newNation = await nationService.createNation(nationData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo quốc gia mới thành công',
            data: newNation
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateNation = async (req, res) => {
    try {
        const { id } = req.params;
        const nationData = req.body;
        const updatedNation = await nationService.updateNation(id, nationData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật quốc gia thành công',
            data: updatedNation
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteNation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await nationService.deleteNation(id);
        
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