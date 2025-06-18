import db from '../../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả comment có phân trang và lọc
export const getAllComments = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    parent_id = null,
    post_id = null,
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.status) {
            whereConditions.status = filters.status;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { content: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Lọc theo parent_id nếu được cung cấp
        if (parent_id !== undefined) {
            if (parent_id === null) {
                whereConditions.parent_id = { [Op.is]: null };
            } else {
                whereConditions.parent_id = parent_id;
            }
        }

        // Lọc theo post_id nếu được cung cấp
        if (post_id) {
            whereConditions.post_id = post_id;
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
                    as: 'replies',
                    attributes: ['documentId', 'content', 'parent_id', 'createdAt'],
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
                        }
                    ],
                    separate: true, // Thêm dòng này
                    order: [['createdAt', 'ASC']]
                }
            );

            // Thêm relation với Post nếu cần
            if (post_id) {
                includes.push({
                    model: db.Post,
                    as: 'post',
                    attributes: ['documentId', 'content']
                });
            }
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Comment.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách comment: ${error.message}`);
    }
};

// Lấy comment theo ID
export const getCommentById = async (documentId) => {
    try {
        const comment = await db.Comment.findByPk(documentId, {
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
                    model: db.Comment,
                    as: 'replies',
                    attributes: ['documentId', 'content', 'parent_id', 'createdAt'],
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['documentId', 'username', 'avatar_id']
                        }
                    ]
                }
            ]
        });

        if (!comment) {
            throw new Error('Không tìm thấy comment');
        }

        return comment;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin comment: ${error.message}`);
    }
};

// Tạo comment mới
export const createComment = async (commentData) => {
    try {
        const newComment = await db.Comment.create(commentData);
        return await getCommentById(newComment.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo comment mới: ${error.message}`);
    }
};

// Cập nhật comment
export const updateComment = async (documentId, commentData) => {
    try {
        const comment = await db.Comment.findByPk(documentId);

        if (!comment) {
            throw new Error('Không tìm thấy comment');
        }

        await comment.update(commentData);
        return await getCommentById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật comment: ${error.message}`);
    }
};

// Xóa comment
export const deleteComment = async (documentId) => {
    try {
        const comment = await db.Comment.findByPk(documentId);

        if (!comment) {
            throw new Error('Không tìm thấy comment');
        }

        await comment.destroy();
        return { message: 'Xóa comment thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa comment: ${error.message}`);
    }
}; 

export const getMonthlyCommentStats = async () => {
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

        const currentCount = await db.Comment.count({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), currentMonth),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), currentYear)
                ]
            }
        });

        const prevCount = await db.Comment.count({
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