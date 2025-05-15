import db from '../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả story có phân trang và lọc
export const getAllStories = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    status = null
}) => {
    try {
        
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.story_type) {
            whereConditions.story_type = filters.story_type;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { text: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Lọc theo status nếu được cung cấp
        if (status) {
            whereConditions.status_story = status;
        } else if (filters.status_story) {
            whereConditions.status_story = filters.status_story;
        }

        // Lọc các story chưa hết hạn
        whereConditions.expired_at = {
            [Op.gt]: new Date()
        };

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
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
                    model: db.Media,
                    as: 'media',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.ViewStory,
                    as: 'views',
                    attributes: ['documentId', 'user_id', 'createdAt']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Story.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách story: ${error.message}`);
    }
};

// Lấy story theo ID
export const getStoryById = async (documentId) => {
    try {
        const story = await db.Story.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
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
                    model: db.Media,
                    as: 'media',
                    attributes: ['documentId', 'file_path', 'type', 'mime_type']
                },
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.ViewStory,
                    as: 'views',
                    attributes: ['documentId', 'user_id', 'createdAt']
                }
            ]
        });

        if (!story) {
            throw new Error('Không tìm thấy story');
        }

        return story;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin story: ${error.message}`);
    }
};

// Tạo story mới
export const createStory = async (storyData) => {
    try {
        const newStory = await db.Story.create(storyData);
        return await getStoryById(newStory.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo story mới: ${error.message}`);
    }
};

// Cập nhật story
export const updateStory = async (documentId, storyData) => {
    try {
        const story = await db.Story.findByPk(documentId);
        
        if (!story) {
            throw new Error('Không tìm thấy story');
        }

        await story.update(storyData);
        return await getStoryById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật story: ${error.message}`);
    }
};

// Xóa story
export const deleteStory = async (documentId) => {
    try {
        const story = await db.Story.findByPk(documentId);
        
        if (!story) {
            throw new Error('Không tìm thấy story');
        }

        await story.destroy();
        return { message: 'Xóa story thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa story: ${error.message}`);
    }
};

// Đánh dấu story đã xem
export const viewStory = async (viewData) => {
    try {
        // Kiểm tra story có tồn tại không
        const story = await db.Story.findByPk(viewData.story_id);
        if (!story) {
            throw new Error('Không tìm thấy story');
        }

        // Kiểm tra xem đã có view chưa
        const existingView = await db.ViewStory.findOne({
            where: {
                user_id: viewData.user_id,
                story_id: viewData.story_id
            }
        });

        if (existingView) {
            // Nếu đã tồn tại view, trả về view đó
            return existingView;
        }

        // Tạo view mới
        const newView = await db.ViewStory.create({
            user_id: viewData.user_id,
            story_id: viewData.story_id,
            expired_at: story.expired_at // Thời gian hết hạn theo story
        });

        return newView;
    } catch (error) {
        throw new Error(`Lỗi khi đánh dấu story đã xem: ${error.message}`);
    }
};

// Lấy danh sách người xem story
export const getStoryViewers = async (storyId, {
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC'
}) => {
    try {
        const offset = (page - 1) * pageSize;
        
        // Thực hiện truy vấn
        const { count, rows } = await db.ViewStory.findAndCountAll({
            where: {
                story_id: storyId
            },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                }
            ],
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
        throw new Error(`Lỗi khi lấy danh sách người xem story: ${error.message}`);
    }
}; 