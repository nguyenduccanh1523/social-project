import * as conversationParticipantService from '../services/conversation-participant.service.js';

export const getAllParticipants = async (req, res) => {
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

        const userId = req.query.userId || null;
        const conversationId = req.query.conversationId || null

        // Gọi service để lấy danh sách thành viên
        const participantsData = await conversationParticipantService.getAllParticipants({
            userId,
            conversationId,
            page,
            pageSize,
            sortField,
            sortOrder,
            populate
        });

        return res.status(200).json(participantsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getParticipantById = async (req, res) => {
    try {
        const { id } = req.params;
        const participant = await conversationParticipantService.getParticipantById(id);
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin thành viên thành công',
            data: participant
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const addParticipant = async (req, res) => {
    try {
        const participantData = {
            ...req.body,
            conversation_id: req.params.conversationId
        };
        
        const newParticipant = await conversationParticipantService.addParticipant(participantData);
        
        return res.status(201).json({
            err: 0,
            message: 'Thêm thành viên thành công',
            data: newParticipant
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updateParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const participantData = req.body;
        const updatedParticipant = await conversationParticipantService.updateParticipant(id, participantData);
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật thông tin thành viên thành công',
            data: updatedParticipant
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const removeParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await conversationParticipantService.removeParticipant(id);
        
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