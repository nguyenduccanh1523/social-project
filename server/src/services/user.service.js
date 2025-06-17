import db from '../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả users có phân trang và lọc
export const getAllUsers = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
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
                { name: { [Op.like]: `%${filters.keyword}%` } },
                { description: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }



        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Social,
                    as: 'socialAccounts',
                    attributes: ['documentId', 'platform', 'iconUrl']
                },
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.StatusActivity,
                    as: 'status',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.Media,
                    as: 'avatarMedia',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Media,
                    as: 'coverPhotoMedia',
                    attributes: ['documentId', 'file_path']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.User.findAndCountAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize,
            distinct: true,
            attributes: {
                exclude: ['password', 'reset_password_token']
            }
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
        throw new Error(`Lỗi khi lấy danh sách users: ${error.message}`);
    }
};

// Lấy user theo ID
export const getUserById = async (documentId) => {
    try {
        const user = await db.User.findByPk(documentId, {
            include: [
                {
                    model: db.userSocial,
                    as: 'socialAccounts',
                    attributes: ['documentId', 'social_id', 'accountUrl']
                },
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name']
                },
                {
                    model: db.StatusActivity,
                    as: 'status',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.Media,
                    as: 'avatarMedia',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Media,
                    as: 'coverPhotoMedia',
                    attributes: ['documentId', 'file_path']
                }
            ],
            attributes: {
                exclude: ['password', 'reset_password_token', 'refresh_token', 'refresh_token_expires']
            }
        });

        if (!user) {
            throw new Error('Không tìm thấy user');
        }

        // Lấy danh sách bạn bè của người dùng
        const friends = await db.Friend.findAll({
            where: {
                [Op.or]: [
                    { user_id: documentId },
                    { friend_id: documentId }
                ],
                status_action_id: 'vr8ygnd5y17xs4vcq6du3q7c' // Status đã kết bạn
            },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'username'],
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
                    as: 'friendUser',
                    attributes: ['documentId', 'fullname', 'username'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                }
            ]
        });

        // Lấy danh sách bạn bè đã gửi lời mời
        const sentFriendRequests = await db.Friend.findAll({
            where: {
                user_id: documentId,
                status_action_id: 'w1t6ex59sh5auezhau5e2ovu' // Status đã gửi lời mời
            },
            include: [
                {
                    model: db.User,
                    as: 'friendUser',
                    attributes: ['documentId', 'fullname', 'username'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                }
            ]
        });

        // Lấy danh sách bạn bè đã nhận lời mời
        const receivedFriendRequests = await db.Friend.findAll({
            where: {
                friend_id: documentId,
                status_action_id: 'w1t6ex59sh5auezhau5e2ovu' // Status đã nhận lời mời
            },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'username'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                }
            ]
        });

        // Chuyển đổi user thành object thuần túy để thêm thông tin
        const userWithFriends = user.get({ plain: true });
        
        // Xử lý danh sách bạn bè
        userWithFriends.friends = friends.map(friend => {
            const friendData = friend.user_id === documentId ? friend.friendUser : friend.user;
            return {
                documentId: friendData.documentId,
                fullname: friendData.fullname,
                username: friendData.username,
                avatar: friendData.avatarMedia?.file_path
            };
        });

        // Xử lý danh sách lời mời kết bạn đã gửi
        userWithFriends.sentFriendRequests = sentFriendRequests.map(request => ({
            documentId: request.friendUser.documentId,
            fullname: request.friendUser.fullname,
            username: request.friendUser.username,
            avatar: request.friendUser.avatarMedia?.file_path
        }));

        // Xử lý danh sách lời mời kết bạn đã nhận
        userWithFriends.receivedFriendRequests = receivedFriendRequests.map(request => ({
            documentId: request.user.documentId,
            fullname: request.user.fullname,
            username: request.user.username,
            avatar: request.user.avatarMedia?.file_path
        }));

        userWithFriends.friendCount = friends.length;

        return userWithFriends;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin user: ${error.message}`);
    }
};

// Tạo user mới
export const createUser = async (userData) => {
    try {
        const newUser = await db.User.create(userData);
        return await getUserById(newUser.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo user mới: ${error.message}`);
    }
};

// Cập nhật user
export const updateUser = async (documentId, userData) => {
    try {
        const user = await db.User.findByPk(documentId);

        if (!user) {
            throw new Error('Không tìm thấy user');
        }

        await user.update(userData);
        return await getUserById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật user: ${error.message}`);
    }
};

// Xóa user
export const deleteUser = async (documentId) => {
    try {
        const user = await db.User.findByPk(documentId);

        if (!user) {
            throw new Error('Không tìm thấy user');
        }

        await user.destroy();
        return { message: 'Xóa user thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa user: ${error.message}`);
    }
}; 