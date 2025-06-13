import * as conversationService from '../services/conversation.service.js'

export const getAllConversations = async (req, res) => {
    try {
        // Lấy tham số phân trang từ query
        const pagination = req.query.pagination || {}
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10

        // Xử lý tham số sort
        const sort = req.query.sort
        let sortField = 'createdAt'
        let sortOrder = 'DESC'

        if (sort) {
            const sortParts = sort.split(':')
            if (sortParts.length === 2) {
                sortField = sortParts[0]
                sortOrder = sortParts[1].toUpperCase()
            }
        }

        // Xử lý populate
        const populate = req.query.populate === '*' ? true : false

        // Lấy các tham số lọc
        const userId = req.query.userId || null
        const isGroupChat = req.query.groupId === 'true' ? true : (req.query.groupId === 'false' ? false : null)

        // Gọi service để lấy danh sách cuộc trò chuyện
        const conversationsData = await conversationService.getAllConversations({
            page,
            pageSize,
            sortField,
            sortOrder,
            populate,
            userId,
            isGroupChat
        })

        // Trả về kết quả
        return res.status(200).json(conversationsData)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        })
    }
}

export const getConversationById = async (req, res) => {
    try {
        const { id } = req.params
        const conversation = await conversationService.getConversationById(id)
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin cuộc trò chuyện thành công',
            data: conversation
        })
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        })
    }
}

export const createConversation = async (req, res) => {
    try {
        const conversationData = {
            ...req.body,
            // conversation_created_by: req.user.id // Người tạo cuộc trò chuyện là người đăng nhập
        }
        
        // // Kiểm tra dữ liệu đầu vào
        // if (!conversationData.user_chated_with) {
        //     return res.status(400).json({
        //         err: -1,
        //         message: 'Thiếu thông tin người nhận tin nhắn'
        //     })
        // }
        
        const newConversation = await conversationService.createConversation(conversationData)
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo cuộc trò chuyện mới thành công',
            data: newConversation
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        })
    }
}

export const updateConversation = async (req, res) => {
    try {
        const { id } = req.params
        const conversationData = req.body
        const updatedConversation = await conversationService.updateConversation(id, conversationData)
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật cuộc trò chuyện thành công',
            data: updatedConversation
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        })
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const { id } = req.params
        const result = await conversationService.deleteConversation(id)
        
        return res.status(200).json({
            err: 0,
            message: result.message
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        })
    }
} 