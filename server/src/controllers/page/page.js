import * as pageService from '../../services/page/page.service';
import * as pageMemberService from '../../services/page/page-member.service';
import { StatusCodes } from 'http-status-codes';

// Lấy danh sách trang
export const getPages = async (req, res) => {
    try {
        const { 
            page = 1, 
            pageSize = 10, 
            sortField = 'createdAt', 
            sortOrder = 'DESC',
            populate = false,
            userId,
            authorId,
            ...filters 
        } = req.query;

        const result = await pageService.getAllPages({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate: populate === 'true',
            userId,
            authorId
        });

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Lấy chi tiết trang
export const getPage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await pageService.getPageById(id);
        return res.status(StatusCodes.OK).json(page);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Tạo trang mới
export const createPage = async (req, res) => {
    try {
        const { user } = req;
        
        // Đảm bảo người tạo trang là người dùng hiện tại
        const pageData = {
            ...req.body,
            author: user.documentId
        };
        
        const newPage = await pageService.createPage(pageData);
        return res.status(StatusCodes.CREATED).json(newPage);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Cập nhật trang
export const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ author hoặc admin mới được cập nhật)
        const page = await pageService.getPageById(id);
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, id);
        
        if (page.author !== user.documentId && !isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Bạn không có quyền cập nhật trang này'
            });
        }
        
        const updatedPage = await pageService.updatePage(id, req.body);
        return res.status(StatusCodes.OK).json(updatedPage);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Xóa trang
export const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ author mới được xóa)
        const page = await pageService.getPageById(id);
        
        if (page.author !== user.documentId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Chỉ người tạo mới được phép xóa trang'
            });
        }
        
        const result = await pageService.deletePage(id);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Lấy danh sách trang mà user hiện tại là thành viên
export const getMyPages = async (req, res) => {
    try {
        const { user } = req;
        const pages = await pageService.getPagesByUserId(user.documentId);
        return res.status(StatusCodes.OK).json(pages);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Lấy danh sách trang mà user hiện tại là author
export const getPagesIOwn = async (req, res) => {
    try {
        const { user } = req;
        const pages = await pageService.getPagesAuthorByUserId(user.documentId);
        return res.status(StatusCodes.OK).json(pages);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Lấy danh sách trang mà một user là thành viên
export const getUserPages = async (req, res) => {
    try {
        const { userId } = req.params;
        const pages = await pageService.getPagesByUserId(userId);
        return res.status(StatusCodes.OK).json(pages);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}; 