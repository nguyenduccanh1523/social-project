import * as groupRequestService from '../../services/group/group-request.service.js';

export const getAllGroupRequests = async (req, res) => {
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
        const userId = req.query.userId || null;
        const groupId = req.query.groupId || null;
        const statusId = req.query.statusId || null;

        // Gọi service để lấy danh sách yêu cầu tham gia nhóm
        const requestsData = await groupRequestService.getAllGroupRequests({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            userId,
            groupId,
            statusId
        });

        // Trả về kết quả
        return res.status(200).json(requestsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getGroupRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await groupRequestService.getGroupRequestById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin yêu cầu tham gia nhóm thành công',
            data: request
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createGroupRequest = async (req, res) => {
    try {
        const { groupId, requestBy, statusActionId } = req.body;
        
        // Kiểm tra xem groupId có được cung cấp không
        if (!groupId) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin cần thiết (groupId)'
            });
        }
        
        const newRequest = await groupRequestService.createGroupRequest({
            group_id: groupId,
            user_request: requestBy,
            status_action_id: statusActionId,
            created_at: new Date()
        });
        
        return res.status(201).json({
            err: 0,
            message: 'Gửi yêu cầu tham gia nhóm thành công',
            data: newRequest
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const respondToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusActionId } = req.body;
        
        // Lấy thông tin yêu cầu
        const request = await groupRequestService.getGroupRequestById(id);
        
        const result = await groupRequestService.respondToRequest(id, statusActionId);
        
        return res.status(200).json({
            err: 0,
            message: 'Phản hồi yêu cầu tham gia nhóm thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Lấy thông tin yêu cầu
        const request = await groupRequestService.getGroupRequestById(id);
        
        const result = await groupRequestService.cancelRequest(id);
        
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

export const getRequestsByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const requests = await groupRequestService.getRequestsByGroupId(groupId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách yêu cầu tham gia nhóm thành công',
            data: requests
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const getRequestsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const requests = await groupRequestService.getRequestsByUserId(userId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy danh sách yêu cầu tham gia nhóm của người dùng thành công',
            data: requests
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const getPendingRequestCount = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const count = await groupRequestService.getPendingRequestCount(groupId);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy số lượng yêu cầu đang chờ xử lý thành công',
            data: { count }
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 