import db from '../../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả reaction có phân trang và lọc
export const getAllReactions = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    postId = null,
    userId = null,
    type = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.status) {
            whereConditions.status = filters.status;
        }

        // Lọc theo postId nếu được cung cấp
        if (postId) {
            whereConditions.post_id = postId;
        }

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Lọc theo loại reaction nếu được cung cấp
        if (type) {
            whereConditions.type = type;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content'],
                },
                {
                    model: db.Comment,
                    as: 'comment',
                    attributes: ['documentId', 'content'],
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Reaction.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách reaction: ${error.message}`);
    }
};

// Lấy reaction theo ID
export const getReactionById = async (documentId) => {
    try {
        const reaction = await db.Reaction.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content']
                }
            ]
        });

        if (!reaction) {
            throw new Error('Không tìm thấy reaction');
        }

        return reaction;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin reaction: ${error.message}`);
    }
};


// Tạo reaction mới
export const createReaction = async (reactionData) => {
    try {
        // Kiểm tra xem đã có reaction chưa
        // const existingReaction = await db.Reaction.findOne({
        //     where: {
        //         post_id: reactionData.post_id,
        //         user_id: reactionData.user_id
        //     }
        // });

        // // Nếu đã có reaction, cập nhật loại reaction
        // if (existingReaction) {
        //     await existingReaction.update({ type: reactionData.type });
        //     return await getReactionById(existingReaction.documentId);
        // }

        // Nếu chưa có, tạo mới
        const newReaction = await db.Reaction.create(reactionData);
        return await getReactionById(newReaction.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo reaction mới: ${error.message}`);
    }
};

// Cập nhật reaction
export const updateReaction = async (documentId, reactionData) => {
    try {
        const reaction = await db.Reaction.findByPk(documentId);
        
        if (!reaction) {
            throw new Error('Không tìm thấy reaction');
        }

        await reaction.update(reactionData);
        return await getReactionById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật reaction: ${error.message}`);
    }
};

// Xóa reaction
export const deleteReaction = async (documentId) => {
    try {
        const reaction = await db.Reaction.findByPk(documentId);
        
        if (!reaction) {
            throw new Error('Không tìm thấy reaction');
        }

        await reaction.destroy({ force: true });
        return { message: 'Xóa reaction thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa reaction: ${error.message}`);
    }
};

// Xóa reaction theo postId và userId
export const deleteReactionByPostAndUser = async (postId, userId) => {
    try {
        const reaction = await db.Reaction.findOne({
            where: {
                post_id: postId,
                user_id: userId
            }
        });
        
        if (!reaction) {
            throw new Error('Không tìm thấy reaction');
        }

        await reaction.destroy();
        return { message: 'Xóa reaction thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa reaction: ${error.message}`);
    }
}; 

export const getMonthlyReactionStats = async () => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = currentYear - 1;
        }

        const currentCount = await db.Reaction.count({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), currentMonth),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), currentYear)
                ]
            }
        });

        const prevCount = await db.Reaction.count({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), prevMonth),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), prevYear)
                ]
            }
        });

        let percentChange = 0;
        if (prevCount === 0 && currentCount > 0) {
            percentChange = 100;
        } else if (prevCount === 0 && currentCount === 0) {
            percentChange = 0;
        } else {
            percentChange = ((currentCount - prevCount) / prevCount) * 100;
        }

        return {
            currentMonth,
            currentYear,
            currentCount,
            prevMonth,
            prevYear,
            prevCount,
            percentChange
        };
    } catch (error) {
        throw new Error('Lỗi khi thống kê số lượng bài post: ' + error.message);
    }
}; 