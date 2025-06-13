import db from '../models/index.js';
import { Op } from 'sequelize';

// Lấy tất cả thành viên của một cuộc trò chuyện
export const getAllParticipants = async ({
    userId = null,
    conversationId = null,
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};
        // Lọc theo groupId nếu được cung cấp
        if (conversationId) {
            
            whereConditions.conversation_id = conversationId;
        }

        // Lọc theo pageId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'fullname', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Conversation,
                    as: 'conversation',
                    attributes: ['documentId', 'name', 'is_group_chat'],
                    include: [
                        {
                            model: db.Media,
                            as: 'groupImage',
                            attributes: ['documentId', 'file_path']
                        },
                        {
                            model: db.ConversationParticipant,
                            as: 'participants',
                            attributes: ['user_id', 'isAdmin'],
                            include: [
                                {
                                    model: db.User,
                                    as: 'user',
                                    attributes: ['fullname'],
                                    include: [
                                        {
                                            model: db.Media,
                                            as: 'avatarMedia',
                                            attributes: ['file_path']
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.ConversationParticipant.findAndCountAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize,
            distinct: true
        });

        return {
            data: rows,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    pageCount: Math.ceil(count / pageSize),
                    total: count
                }
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách thành viên: ${error.message}`);
    }
};

// Lấy thông tin một thành viên
export const getParticipantById = async (documentId) => {
    try {
        const participant = await db.ConversationParticipant.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'fullname', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Conversation,
                    as: 'conversation',
                    attributes: ['documentId', 'name', 'is_group_chat']
                }
            ]
        });

        if (!participant) {
            throw new Error('Không tìm thấy thành viên');
        }

        return participant;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin thành viên: ${error.message}`);
    }
};

// Thêm thành viên mới vào cuộc trò chuyện
export const addParticipant = async (participantData) => {
    try {
        // Kiểm tra xem thành viên đã tồn tại trong cuộc trò chuyện chưa
        const existingParticipant = await db.ConversationParticipant.findOne({
            where: {
                conversation_id: participantData.conversation_id,
                user_id: participantData.user_id
            }
        });

        if (existingParticipant) {
            throw new Error('Thành viên đã tồn tại trong cuộc trò chuyện');
        }

        const newParticipant = await db.ConversationParticipant.create(participantData);
        return await getParticipantById(newParticipant.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi thêm thành viên: ${error.message}`);
    }
};

// Cập nhật thông tin thành viên
export const updateParticipant = async (documentId, participantData) => {
    try {
        const participant = await db.ConversationParticipant.findByPk(documentId);

        if (!participant) {
            throw new Error('Không tìm thấy thành viên');
        }

        await participant.update(participantData);
        return await getParticipantById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật thông tin thành viên: ${error.message}`);
    }
};

// Xóa thành viên khỏi cuộc trò chuyện
export const removeParticipant = async (documentId) => {
    try {
        const participant = await db.ConversationParticipant.findByPk(documentId);

        if (!participant) {
            throw new Error('Không tìm thấy thành viên');
        }

        await participant.destroy();
        return { message: 'Xóa thành viên thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa thành viên: ${error.message}`);
    }
}; 