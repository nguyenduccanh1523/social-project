import db from '../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả cuộc trò chuyện có phân trang và lọc
export const getAllConversations = async ({
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    isGroupChat = null,
    participantId = null,
    sortByLatestMessage = false
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        if (userId && participantId) {
            whereConditions[Op.or] = [
                {
                    [Op.and]: [
                        { conversation_created_by: userId },
                        { user_chated_with: participantId }
                    ]
                },
                {
                    [Op.and]: [
                        { conversation_created_by: participantId },
                        { user_chated_with: userId }
                    ]
                }
            ];
        } else if (userId) {
            whereConditions[Op.or] = [
                { conversation_created_by: userId },
                { user_chated_with: userId }
            ];
        } else if (participantId) {
            whereConditions[Op.or] = [
                { conversation_created_by: participantId },
                { user_chated_with: participantId }
            ];
        }

        // Lọc theo group chat (1 là group, 0 là chat đơn)
        if (isGroupChat !== null) {
            whereConditions.is_group_chat = isGroupChat ? 1 : 0;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate || sortByLatestMessage) {
            includes.push(
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
                {
                    model: db.Media,
                    as: 'groupImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['documentId', 'username', 'email', 'date_of_birth', 'about', 'phone'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        },
                        {
                            model: db.Nation,
                            as: 'nation',
                            attributes: ['documentId', 'name']
                        },
                    ]
                },
                {
                    model: db.User,
                    as: 'participant',
                    attributes: ['documentId', 'username', 'email', 'date_of_birth', 'about', 'phone'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        },
                        {
                            model: db.Nation,
                            as: 'nation',
                            attributes: ['documentId', 'name']
                        },
                    ]
                },
                {
                    model: db.Message,
                    as: 'messages',
                    attributes: ['documentId', 'content', 'createdAt', 'is_read', 'sender_id', 'media_id'],
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    required: sortByLatestMessage
                }
            );
        }

        let orderClause = [[sortField, sortOrder]];

        let attributes = undefined;

        if (sortByLatestMessage) {
            attributes = {
                include: [
                    [
                        Sequelize.literal(`(
          SELECT MAX(createdAt)
          FROM Messages
          WHERE Messages.conversation_id = Conversation.documentId
        )`),
                        'latestMessageAt'
                    ]
                ]
            };
        }


        // Thực hiện truy vấn
        const { count, rows } = await db.Conversation.findAndCountAll({
            where: whereConditions,
            include: includes,
            ...(attributes ? { attributes } : {}),
            order: orderClause,
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
        throw new Error(`Lỗi khi lấy danh sách cuộc trò chuyện: ${error.message}`);
    }
};

// Lấy cuộc trò chuyện theo ID
export const getConversationById = async (documentId) => {
    try {
        const conversation = await db.Conversation.findByPk(documentId, {
            include: [
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
                {
                    model: db.Media,
                    as: 'groupImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.User,
                    as: 'creator',
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
                    model: db.User,
                    as: 'participant',
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
                    model: db.Message,
                    as: 'messages',
                    attributes: ['documentId', 'content', 'createdAt'],
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!conversation) {
            throw new Error('Không tìm thấy cuộc trò chuyện');
        }

        return conversation;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin cuộc trò chuyện: ${error.message}`);
    }
};

// Tạo cuộc trò chuyện mới
export const createConversation = async (conversationData) => {
    try {
        // Kiểm tra xem đã có cuộc trò chuyện giữa 2 người chưa (nếu là chat đơn)
        if (!conversationData.is_group_chat) {
            const existingConversation = await db.Conversation.findOne({
                where: {
                    is_group_chat: 0,
                    [Op.or]: [
                        {
                            conversation_created_by: conversationData.conversation_created_by,
                            user_chated_with: conversationData.user_chated_with
                        },
                        {
                            conversation_created_by: conversationData.user_chated_with,
                            user_chated_with: conversationData.conversation_created_by
                        }
                    ]
                }
            });

            if (existingConversation) {
                return await getConversationById(existingConversation.documentId);
            }
        }

        const newConversation = await db.Conversation.create(conversationData);
        return newConversation
    } catch (error) {
        throw new Error(`Lỗi khi tạo cuộc trò chuyện mới: ${error.message}`);
    }
};

// Cập nhật cuộc trò chuyện
export const updateConversation = async (documentId, conversationData) => {
    try {
        const conversation = await db.Conversation.findByPk(documentId);

        if (!conversation) {
            throw new Error('Không tìm thấy cuộc trò chuyện');
        }

        await conversation.update(conversationData);
        return await getConversationById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật cuộc trò chuyện: ${error.message}`);
    }
};

// Xóa cuộc trò chuyện
export const deleteConversation = async (documentId) => {
    try {
        const conversation = await db.Conversation.findByPk(documentId);

        if (!conversation) {
            throw new Error('Không tìm thấy cuộc trò chuyện');
        }

        await conversation.destroy();
        return { message: 'Xóa cuộc trò chuyện thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa cuộc trò chuyện: ${error.message}`);
    }
}; 