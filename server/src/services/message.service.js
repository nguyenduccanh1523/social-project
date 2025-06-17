import db from '../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả tin nhắn có phân trang và lọc
export const getAllMessages = async ({
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    conversationId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Lọc theo conversationId nếu được cung cấp
        if (conversationId) {
            whereConditions.conversation_id = conversationId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'sender',
                    attributes: ['documentId', 'username', 'email', 'avatar_id'],
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
                },
                {
                    model: db.Media,
                    as: 'media',
                    attributes: ['documentId', 'file_path']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Message.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách tin nhắn: ${error.message}`);
    }
};

// Lấy tin nhắn theo ID
export const getMessageById = async (documentId) => {
    try {
        const message = await db.Message.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'sender',
                    attributes: ['documentId', 'username', 'email', 'avatar_id'],
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

        if (!message) {
            throw new Error('Không tìm thấy tin nhắn');
        }

        return message;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin tin nhắn: ${error.message}`);
    }
};

// Tạo tin nhắn mới
export const createMessage = async (messageData) => {
    try {
        const newMessage = await db.Message.create(messageData);

        // Cập nhật last_message_at cho cuộc trò chuyện
        await db.Conversation.update(
            { last_message_at: new Date() },
            { where: { documentId: messageData.conversation_id } }
        );

        return await getMessageById(newMessage.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo tin nhắn mới: ${error.message}`);
    }
};

// Cập nhật tin nhắn
export const updateMessage = async (documentId, messageData) => {
    try {
        const message = await db.Message.findByPk(documentId);

        if (!message) {
            throw new Error('Không tìm thấy tin nhắn');
        }

        await message.update(messageData);
        return await getMessageById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật tin nhắn: ${error.message}`);
    }
};

// Xóa tin nhắn
export const deleteMessage = async (documentId) => {
    try {
        const message = await db.Message.findByPk(documentId);

        if (!message) {
            throw new Error('Không tìm thấy tin nhắn');
        }

        await message.destroy();
        return { message: 'Xóa tin nhắn thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa tin nhắn: ${error.message}`);
    }
};

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsRead = async (conversationId, userId) => {
    try {
        // Tìm tất cả tin nhắn chưa đọc trong cuộc trò chuyện mà không phải do người dùng hiện tại gửi
        const unreadMessages = await db.Message.findAll({
            where: {
                conversation_id: conversationId,
                sender_id: { [Op.ne]: userId },
                is_read: false
            }
        });

        // Đánh dấu tất cả tin nhắn đã đọc
        if (unreadMessages.length > 0) {
            await db.Message.update(
                { is_read: true },
                {
                    where: {
                        documentId: unreadMessages.map(msg => msg.documentId)
                    }
                }
            );
        }

        return {
            message: 'Đánh dấu tin nhắn đã đọc thành công',
            count: unreadMessages.length
        };
    } catch (error) {
        throw new Error(`Lỗi khi đánh dấu tin nhắn đã đọc: ${error.message}`);
    }
};

// Đếm số tin nhắn chưa đọc
export const countUnreadMessages = async (userId) => {
    try {
        // Lấy tất cả cuộc trò chuyện của người dùng
        const conversations = await db.Conversation.findAll({
            where: {
                [Op.or]: [
                    { conversation_created_by: userId },
                    { user_chated_with: userId }
                ]
            },
            attributes: ['documentId']
        });

        const conversationIds = conversations.map(conv => conv.documentId);

        // Đếm số tin nhắn chưa đọc trong tất cả các cuộc trò chuyện
        const unreadCount = await db.Message.count({
            where: {
                conversation_id: { [Op.in]: conversationIds },
                sender_id: { [Op.ne]: userId },
                is_read: false
            }
        });

        return {
            unreadCount
        };
    } catch (error) {
        throw new Error(`Lỗi khi đếm tin nhắn chưa đọc: ${error.message}`);
    }
}; 