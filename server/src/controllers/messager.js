import * as messageService from '../services/message.service';

export const getAllMessages = async (req, res) => {
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
        const conversationId = req.query.conversationId || null;

        // Gọi service để lấy danh sách tin nhắn
        const messagesData = await messageService.getAllMessages({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            conversationId
        });

        // Trả về kết quả
        return res.status(200).json(messagesData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageService.getMessageById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin tin nhắn thành công',
            data: message
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createMessage = async (req, res) => {
    try {
        const messageData = {
            ...req.body,
            sender_id: req.user.id // Người gửi là người đăng nhập
        };
        
        // Kiểm tra dữ liệu đầu vào
        if (!messageData.conversation_id) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin cuộc trò chuyện'
            });
        }
        
        if (!messageData.content && !messageData.media_id) {
            return res.status(400).json({
                err: -1,
                message: 'Tin nhắn phải có nội dung hoặc đính kèm media'
            });
        }
        
        const newMessage = await messageService.createMessage(messageData);
        
        return res.status(201).json({
            err: 0,
            message: 'Gửi tin nhắn thành công',
            data: newMessage
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const messageData = req.body;
        
        // Kiểm tra quyền (chỉ người gửi mới được sửa tin nhắn)
        const message = await messageService.getMessageById(id);
        if (message.sender_id !== req.user.id) {
            return res.status(403).json({
                err: -1,
                message: 'Bạn không có quyền sửa tin nhắn này'
            });
        }
        
        const updatedMessage = await messageService.updateMessage(id, messageData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật tin nhắn thành công',
            data: updatedMessage
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra quyền (chỉ người gửi mới được xóa tin nhắn)
        const message = await messageService.getMessageById(id);
        if (message.sender_id !== req.user.id) {
            return res.status(403).json({
                err: -1,
                message: 'Bạn không có quyền xóa tin nhắn này'
            });
        }
        
        const result = await messageService.deleteMessage(id);
        
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

export const markMessagesAsRead = async (req, res) => {
    try {
        const { conversationId } = req.body;
        
        if (!conversationId) {
            return res.status(400).json({
                err: -1,
                message: 'Thiếu thông tin conversationId'
            });
        }
        
        const result = await messageService.markMessagesAsRead(conversationId, req.user.id);
        
        return res.status(200).json({
            err: 0,
            message: result.message,
            count: result.count
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const countUnreadMessages = async (req, res) => {
    try {
        const result = await messageService.countUnreadMessages(req.user.id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy số tin nhắn chưa đọc thành công',
            unreadCount: result.unreadCount
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 