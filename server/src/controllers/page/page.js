import * as pageService from '../../services/page/page.service.js';

export const getAllPages = async (req, res) => {
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
        if (req.query.author) filters.author = req.query.author;
        if (req.query.lives_in) filters.lives_in = req.query.lives_in;

        // Gọi service để lấy danh sách pages
        const pagesData = await pageService.getAllPages({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate
        });

        // Trả về kết quả
        return res.status(200).json(pagesData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPageById = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await pageService.getPageById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin trang thành công',
            data: page
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createPage = async (req, res) => {
    try {
        const pageData = req.body;
        
        // Thêm author từ người dùng đã xác thực
        // pageData.author = req.user.documentId;
        
        const newPage = await pageService.createPage(pageData);
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo trang mới thành công',
            data: newPage
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const pageData = req.body;
        
        // Kiểm tra quyền cập nhật trang (có thể thêm logic kiểm tra ở đây)
        
        const updatedPage = await pageService.updatePage(id, pageData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật trang thành công',
            data: updatedPage
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra quyền xóa trang (có thể thêm logic kiểm tra ở đây)
        
        const result = await pageService.deletePage(id);
        
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

// Controllers cho PageMember
export const getAllPageMembers = async (req, res) => {
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

        // Lấy các tham số lọc
        const pageId = req.query.pageId || null;
        const userId = req.query.userId || null;

        // Gọi service để lấy danh sách thành viên trang
        const pageMembersData = await pageService.getAllPageMembers({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            pageId,
            userId
        });

        // Trả về kết quả
        return res.status(200).json(pageMembersData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPageMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const pageMember = await pageService.getPageMemberById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin thành viên trang thành công',
            data: pageMember
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createPageMember = async (req, res) => {
    try {
        const pageMemberData = req.body;
        
        // Đảm bảo có pageId và userId
        if (!pageMemberData.page_id || !pageMemberData.user_id) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin page_id hoặc user_id'
            });
        }
        
        const newPageMember = await pageService.createPageMember(pageMemberData);
        
        return res.status(201).json({
            err: 0,
            message: 'Thêm thành viên trang thành công',
            data: newPageMember
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deletePageMember = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pageService.deletePageMember(id);
        
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

// Controllers cho PageOpenHour
export const getAllPageOpenHours = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        // Xử lý tham số sort
        const sort = req.query.sort;
        let sortField = 'day_of_week';
        let sortOrder = 'ASC';

        if (sort) {
            const sortParts = sort.split(':');
            if (sortParts.length === 2) {
                sortField = sortParts[0];
                sortOrder = sortParts[1].toUpperCase();
            }
        }

        // Xử lý populate
        const populate = req.query.populate === '*' ? true : false;

        // Lấy các tham số lọc
        const pageId = req.query.pageId || null;

        // Gọi service để lấy danh sách giờ mở cửa trang
        const pageOpenHoursData = await pageService.getAllPageOpenHours({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            pageId
        });

        // Trả về kết quả
        return res.status(200).json(pageOpenHoursData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPageOpenHourById = async (req, res) => {
    try {
        const { id } = req.params;
        const pageOpenHour = await pageService.getPageOpenHourById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin giờ mở cửa trang thành công',
            data: pageOpenHour
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createPageOpenHour = async (req, res) => {
    try {
        const pageOpenHourData = req.body;
        
        // Đảm bảo có pageId
        if (!pageOpenHourData.page_id) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin page_id'
            });
        }
        
        const newPageOpenHour = await pageService.createPageOpenHour(pageOpenHourData);
        
        return res.status(201).json({
            err: 0,
            message: 'Thêm giờ mở cửa trang thành công',
            data: newPageOpenHour
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updatePageOpenHour = async (req, res) => {
    try {
        const { id } = req.params;
        const pageOpenHourData = req.body;
        
        const updatedPageOpenHour = await pageService.updatePageOpenHour(id, pageOpenHourData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật giờ mở cửa trang thành công',
            data: updatedPageOpenHour
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 