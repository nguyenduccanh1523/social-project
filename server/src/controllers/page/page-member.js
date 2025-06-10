import * as pageMemberService from '../../services/page/page-member.service.js';
import * as pageService from '../../services/page/page.service.js';

// Lấy danh sách thành viên của trang
export const getPageMembers = async (req, res) => {
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
        const pageMembersData = await pageMemberService.getPageMembers({
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

// Lấy chi tiết thành viên
export const getPageMember = async (req, res) => {
    try {
        const { pageId, id } = req.params;
        const member = await pageMemberService.getPageMemberById(id);
        
        // Kiểm tra xem thành viên có thuộc về trang này không
        if (member.page_id !== pageId) {
            return res.status(404).json({
                message: 'Không tìm thấy thành viên trong trang này'
            });
        }
        
        return res.status(200).json(member);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Thêm thành viên mới vào trang
export const addPageMember = async (req, res) => {
    try {
        const { userId, role, pageId } = req.body;
        
        // // Kiểm tra quyền (chỉ admin mới được thêm thành viên)
        // const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        
        // if (!isAdmin) {
        //     return res.status(403).json({
        //         message: 'Bạn không có quyền thêm thành viên vào trang này'
        //     });
        // }
        
        const memberData = {
            page_id: pageId,
            user_id: userId,
            role: role
        };
        
        const newMember = await pageMemberService.addPageMember(memberData);
        return res.status(200).json(newMember);
    } catch (error) {
        return res.status(500).json({
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
            return res.status(403).json({
                message: 'Chỉ người tạo trang mới được phép cập nhật vai trò thành viên'
            });
        }
        
        // Không cho phép thay đổi vai trò của người tạo trang
        if (userId === page.author) {
            return res.status(403).json({
                message: 'Không thể thay đổi vai trò của người tạo trang'
            });
        }
        
        const updatedMember = await pageMemberService.updatePageMemberRole(userId, pageId, role);
        return res.status(200).json(updatedMember);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Xóa thành viên khỏi trang
export const removePageMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        // // Kiểm tra quyền (chỉ admin mới được xóa thành viên hoặc tự xóa mình)
        // const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        // const page = await pageService.getPageById(pageId);
        
        // // Không cho phép xóa người tạo trang
        // if (userId === page.author) {
        //     return res.status(StatusCodes.FORBIDDEN).json({
        //         message: 'Không thể xóa người tạo trang'
        //     });
        // }
        
        // // Cho phép người dùng tự xóa mình khỏi trang hoặc admin xóa thành viên khác
        // if (userId !== user.documentId && !isAdmin) {
        //     return res.status(StatusCodes.FORBIDDEN).json({
        //         message: 'Bạn không có quyền xóa thành viên khỏi trang này'
        //     });
        // }
        
        const result = await pageMemberService.removePageMember(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
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
        
        return res.status(200).json({
            isMember
        });
    } catch (error) {
        return res.status(500).json({
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
        
        return res.status(200).json({
            isAdmin
        });
    } catch (error) {
        return res.status(500).json({
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
            return res.status(400).json({
                message: 'Bạn đã là thành viên của trang này'
            });
        }
        
        const memberData = {
            page_id: pageId,
            user_id: user.documentId,
            role: 'member'
        };
        
        const newMember = await pageMemberService.addPageMember(memberData);
        return res.status(200).json(newMember);
    } catch (error) {
        return res.status(500).json({
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
            return res.status(403).json({
                message: 'Người tạo trang không thể rời khỏi trang'
            });
        }
        
        const result = await pageMemberService.removePageMember(user.documentId, pageId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}; 