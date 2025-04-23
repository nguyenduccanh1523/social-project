import * as pageMemberService from '../../services/page/page-member.service';
import * as pageService from '../../services/page/page.service';
import { StatusCodes } from 'http-status-codes';

// Lấy danh sách thành viên của trang
export const getPageMembers = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { 
            page = 1, 
            pageSize = 10, 
            sortField = 'joined_at', 
            sortOrder = 'DESC',
            ...filters 
        } = req.query;

        const result = await pageMemberService.getPageMembers(pageId, {
            page,
            pageSize,
            filters,
            sortField,
            sortOrder
        });

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Lấy chi tiết thành viên
export const getPageMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await pageMemberService.getPageMemberById(id);
        return res.status(StatusCodes.OK).json(member);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Thêm thành viên mới vào trang
export const addPageMember = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { userId, role = 'member' } = req.body;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ admin mới được thêm thành viên)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        
        if (!isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Bạn không có quyền thêm thành viên vào trang này'
            });
        }
        
        const memberData = {
            page_id: pageId,
            user_id: userId,
            role
        };
        
        const newMember = await pageMemberService.addPageMember(memberData);
        return res.status(StatusCodes.CREATED).json(newMember);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Cập nhật vai trò của thành viên
export const updatePageMemberRole = async (req, res) => {
    try {
        const { pageId, userId } = req.params;
        const { role } = req.body;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ admin mới được cập nhật vai trò thành viên)
        const page = await pageService.getPageById(pageId);
        
        if (page.author !== user.documentId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Chỉ người tạo trang mới được phép cập nhật vai trò thành viên'
            });
        }
        
        // Không cho phép thay đổi vai trò của người tạo trang
        if (userId === page.author) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Không thể thay đổi vai trò của người tạo trang'
            });
        }
        
        const updatedMember = await pageMemberService.updatePageMemberRole(userId, pageId, role);
        return res.status(StatusCodes.OK).json(updatedMember);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Xóa thành viên khỏi trang
export const removePageMember = async (req, res) => {
    try {
        const { pageId, userId } = req.params;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ admin mới được xóa thành viên hoặc tự xóa mình)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        const page = await pageService.getPageById(pageId);
        
        // Không cho phép xóa người tạo trang
        if (userId === page.author) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Không thể xóa người tạo trang'
            });
        }
        
        // Cho phép người dùng tự xóa mình khỏi trang hoặc admin xóa thành viên khác
        if (userId !== user.documentId && !isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Bạn không có quyền xóa thành viên khỏi trang này'
            });
        }
        
        const result = await pageMemberService.removePageMember(userId, pageId);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Kiểm tra người dùng có phải là thành viên của trang
export const checkPageMember = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { user } = req;
        
        const isMember = await pageMemberService.isPageMember(user.documentId, pageId);
        
        return res.status(StatusCodes.OK).json({
            isMember
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Kiểm tra người dùng có phải là admin của trang
export const checkPageAdmin = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { user } = req;
        
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        
        return res.status(StatusCodes.OK).json({
            isAdmin
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Người dùng tự tham gia vào trang
export const joinPage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { user } = req;
        
        // Kiểm tra xem người dùng đã là thành viên của trang chưa
        const isMember = await pageMemberService.isPageMember(user.documentId, pageId);
        
        if (isMember) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Bạn đã là thành viên của trang này'
            });
        }
        
        const memberData = {
            page_id: pageId,
            user_id: user.documentId,
            role: 'member'
        };
        
        const newMember = await pageMemberService.addPageMember(memberData);
        return res.status(StatusCodes.CREATED).json(newMember);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Người dùng tự rời khỏi trang
export const leavePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { user } = req;
        
        // Kiểm tra xem người dùng có phải là người tạo trang không
        const page = await pageService.getPageById(pageId);
        
        if (page.author === user.documentId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Người tạo trang không thể rời khỏi trang'
            });
        }
        
        const result = await pageMemberService.removePageMember(user.documentId, pageId);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}; 