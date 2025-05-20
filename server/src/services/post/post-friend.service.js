import db from '../../models/index.js';
import { Op } from 'sequelize';

// Lấy tất cả post-friends có phân trang và lọc
export const getAllPostFriends = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    postId = null,
    userId = null,
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { post_id: { [Op.like]: `%${filters.keyword}%` } },
                { user_id: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }
        if (postId) whereConditions.post_id = postId;
        if (userId) whereConditions.user_id = userId;

        const includes = [];
        if (populate) {
            includes.push(
                { model: db.Post, as: 'post', attributes: ['documentId', 'content'] },
                { model: db.User, as: 'user', attributes: ['documentId', 'username', 'email'] }
            );
        }

        const { count, rows } = await db.PostFriend.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách post-friends: ${error.message}`);
    }
};

export const getPostFriendById = async (documentId) => {
    try {
        const postFriend = await db.PostFriend.findByPk(documentId, {
            include: [
                { model: db.Post, as: 'post', attributes: ['documentId', 'content'] },
                { model: db.User, as: 'user', attributes: ['documentId', 'username', 'email'] }
            ]
        });
        if (!postFriend) throw new Error('Không tìm thấy post-friend');
        return postFriend;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin post-friend: ${error.message}`);
    }
};

export const createPostFriend = async (data) => {
    try {
        const newPostFriend = await db.PostFriend.create(data);
        return await getPostFriendById(newPostFriend.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo post-friend mới: ${error.message}`);
    }
};

export const updatePostFriend = async (documentId, data) => {
    try {
        const postFriend = await db.PostFriend.findByPk(documentId);
        if (!postFriend) throw new Error('Không tìm thấy post-friend');
        await postFriend.update(data);
        return await getPostFriendById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật post-friend: ${error.message}`);
    }
};

export const deletePostFriend = async (documentId) => {
    try {
        const postFriend = await db.PostFriend.findByPk(documentId);
        if (!postFriend) throw new Error('Không tìm thấy post-friend');
        await postFriend.destroy();
        return { message: 'Xóa post-friend thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa post-friend: ${error.message}`);
    }
}; 