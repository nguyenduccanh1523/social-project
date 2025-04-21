import * as groupMemberService from '../../services/group/group-member.service';

export const getAllGroupMembers = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        // Xử lý tham số sort
        const sort = req.query.sort;
        let sortField = 'joined_at';
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
        const userId = req.query.userId || null;
        const groupId = req.query.groupId || null;

        // Gọi service để lấy danh sách thành viên nhóm
        const groupMembersData = await groupMemberService.getAllGroupMembers({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            userId,
            groupId
        });

        // Trả về kết quả
        return res.status(200).json(groupMembersData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getGroupMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const groupMember = await groupMemberService.getGroupMemberById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin thành viên nhóm thành công',
            data: groupMember
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const addGroupMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        
        // Kiểm tra xem groupId và userId có được cung cấp không
        if (!groupId || !userId) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin cần thiết (groupId hoặc userId)'
            });
        }
        
        const newGroupMember = await groupMemberService.addGroupMember({
            group_id: groupId,
            user_id: userId,
            joined_at: new Date()
        });
        
        return res.status(201).json({
            err: 0,
            message: 'Thêm thành viên vào nhóm thành công',
            data: newGroupMember
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const removeGroupMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Lấy thông tin thành viên nhóm
        // const groupMember = await groupMemberService.getGroupMemberById(id);
        
        const result = await groupMemberService.removeGroupMember(id);
        
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

export const getGroupMembersByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const members = await groupMemberService.getGroupMembersByGroupId(groupId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách thành viên nhóm thành công',
            data: members
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const getGroupMembersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const memberships = await groupMemberService.getGroupMembersByUserId(userId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách nhóm của người dùng thành công',
            data: memberships
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const checkGroupMembership = async (req, res) => {
    try {
        const { userId, groupId } = req.params;
        
        const isMember = await groupMemberService.checkGroupMembership(userId, groupId);
        
        return res.status(200).json({
            err: 0,
            message: 'Kiểm tra thành viên nhóm thành công',
            data: { isMember }
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 