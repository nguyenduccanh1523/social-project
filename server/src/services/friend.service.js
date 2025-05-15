import db from '../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả bạn bè có phân trang và lọc
export const getAllFriend = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    statusId = null,
    filterDate = null,
    lastSevenDays = false,
    friendId = null
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

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions[Op.or] = [
                { user_id: userId },
                { friend_id: userId }
            ];
        }

        if (friendId) {
            whereConditions[Op.or] = [
                { user_id: friendId },
                { friend_id: friendId }
            ];
        }
        // Lọc theo statusId nếu được cung cấp
        if (statusId) {
            whereConditions.status_action_id = statusId;
        }

        // Lọc theo ngày cập nhật cụ thể nếu được cung cấp
        if (filterDate) {
            const date = new Date(filterDate);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            
            whereConditions.updatedAt = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        // Lọc theo 7 ngày gần đây
        if (lastSevenDays) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            whereConditions.updatedAt = {
                [Op.gte]: sevenDaysAgo
            };
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.StatusAction,
                    as: 'status',
                    attributes: ['documentId', 'name', 'description']
                }
            );
            
            // Thay vì include cả hai user cùng lúc, sử dụng các query riêng biệt
            const { count, rows } = await db.Friend.findAndCountAll({
                where: whereConditions,
                include: includes,
                order: [[sortField, sortOrder]],
                offset,
                limit: pageSize,
                distinct: true
            });
            
            // Lấy user_id và friend_id từ kết quả
            const userIds = rows.map(friend => friend.user_id);
            const friendIds = rows.map(friend => friend.friend_id);
            
            // Truy vấn thông tin của cả user và friend
            const users = await db.User.findAll({
                where: {
                    documentId: { [Op.in]: [...userIds, ...friendIds] }
                },
                attributes: ['documentId', 'fullname', 'email', 'phone', 'avatar_id', 'cover_photo_id']
            });
            
            // Tạo map cho việc tra cứu nhanh thông tin user
            const userMap = {};
            users.forEach(user => {
                userMap[user.documentId] = user;
            });
            
            // Lấy avatar_id từ tất cả users
            const avatarIds = users
                .map(user => user.avatar_id)
                .filter(id => id !== null);
            
            // Truy vấn thông tin media cho avatar
            const avatarMedia = await db.Media.findAll({
                where: {
                    documentId: { [Op.in]: avatarIds }
                },
                attributes: ['documentId', 'file_path']
            });
            
            // Tạo map cho việc tra cứu nhanh thông tin media
            const mediaMap = {};
            avatarMedia.forEach(media => {
                mediaMap[media.documentId] = media;
            });
            
            // Lấy số lượng bạn bè cho mỗi user
            const friendCountPromises = [...userIds, ...friendIds].map(async (id) => {
                const count = await db.Friend.count({
                    where: {
                        [Op.or]: [
                            { user_id: id },
                            { friend_id: id }
                        ],
                        status_action_id: statusId || 'vr8ygnd5y17xs4vcq6du3q7c'
                    }
                });
                return { id, count };
            });
            
            const friendCounts = await Promise.all(friendCountPromises);
            const friendCountMap = {};
            friendCounts.forEach(({ id, count }) => {
                friendCountMap[id] = count;
            });
            
            // Thêm thông tin user và friend vào mỗi kết quả
            const enrichedData = rows.map(friend => {
                const plainFriend = friend.get({ plain: true });
                const user = userMap[friend.user_id];
                const friendUser = userMap[friend.friend_id];
                
                if (user) {
                    const userData = user.toJSON();
                    // Thêm thông tin avatar media nếu có
                    if (userData.avatar_id && mediaMap[userData.avatar_id]) {
                        userData.avatarMedia = mediaMap[userData.avatar_id];
                    }
                    
                    plainFriend.user = {
                        ...userData,
                        friendCount: friendCountMap[friend.user_id] || 0
                    };
                }
                
                if (friendUser) {
                    const friendData = friendUser.toJSON();
                    // Thêm thông tin avatar media nếu có
                    if (friendData.avatar_id && mediaMap[friendData.avatar_id]) {
                        friendData.avatarMedia = mediaMap[friendData.avatar_id];
                    }
                    
                    plainFriend.friend = {
                        ...friendData,
                        friendCount: friendCountMap[friend.friend_id] || 0
                    };
                }
                
                return plainFriend;
            });

            return {
                data: enrichedData,
                meta: {
                    pagination: {
                        page: parseInt(page),
                        pageSize: parseInt(pageSize),
                        pageCount: Math.ceil(count / pageSize),
                        total: count
                    }
                }
            };
        } else {
            const { count, rows } = await db.Friend.findAndCountAll({
                where: whereConditions,
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
        }
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách bạn bè: ${error.message}`);
    }
};

// Lấy bạn bè theo ID
export const getFriendById = async (documentId) => {
    try {
        const friend = await db.Friend.findByPk(documentId, {
            include: [
                {
                    model: db.StatusAction,
                    as: 'status',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        if (!friend) {
            throw new Error('Không tìm thấy bạn bè');
        }

        // Lấy thông tin user và friend riêng biệt
        const [user, friendUser] = await Promise.all([
            db.User.findByPk(friend.user_id, {
                attributes: ['documentId', 'fullname', 'email', 'phone', 'avatar_id', 'cover_photo_id']
            }),
            db.User.findByPk(friend.friend_id, {
                attributes: ['documentId', 'fullname', 'email', 'phone', 'avatar_id', 'cover_photo_id']
            })
        ]);

        // Kết hợp dữ liệu
        const result = friend.get({ plain: true });
        result.user = user;
        result.friend = friendUser;

        return result;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin bạn bè: ${error.message}`);
    }
};

// Tạo bạn bè mới
export const createFriend = async (friendData) => {
    try {
        const newFriend = await db.Friend.create(friendData);
        return await getFriendById(newFriend.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo bạn bè mới: ${error.message}`);
    }
};

// Cập nhật bạn bè
export const updateFriend = async (documentId, friendData) => {
    try {
        const friend = await db.Friend.findByPk(documentId);
        
        if (!friend) {
            throw new Error('Không tìm thấy bạn bè');
        }

        await friend.update(friendData);
        return await getFriendById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật bạn bè: ${error.message}`);
    }
};

// Xóa bạn bè
export const deleteFriend = async (documentId) => {
    try {
        const friend = await db.Friend.findByPk(documentId);
        
        if (!friend) {
            throw new Error('Không tìm thấy bạn bè');
        }

        await friend.destroy();
        return { message: 'Xóa bạn bè thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa bạn bè: ${error.message}`);
    }
};

// Lấy danh sách bạn bè cập nhật 7 ngày trước
export const getFriendsUpdatedBefore7Days = async ({
    page = 1,
    pageSize = 10,
    sortField = 'updatedAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null
}) => {
    try {
        // Tính toán ngày cách hiện tại 7 ngày
        const before7Days = new Date();
        before7Days.setDate(before7Days.getDate() - 7);
        
        const whereConditions = {
            updatedAt: {
                [Op.lt]: before7Days
            }
        };
        
        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions[Op.or] = [
                { user_id: userId },
                { friend_id: userId }
            ];
        }
        
        const offset = (page - 1) * pageSize;
        
        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.StatusAction,
                    as: 'status',
                    attributes: ['documentId', 'name', 'description']
                }
            );
        }
        
        // Thực hiện truy vấn
        const { count, rows } = await db.Friend.findAndCountAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize,
            distinct: true
        });
        
        if (populate) {
            // Lấy user_id và friend_id từ kết quả
            const userIds = rows.map(friend => friend.user_id);
            const friendIds = rows.map(friend => friend.friend_id);
            
            // Truy vấn thông tin của cả user và friend
            const users = await db.User.findAll({
                where: {
                    documentId: { [Op.in]: [...userIds, ...friendIds] }
                },
                attributes: ['documentId', 'fullname', 'email', 'phone', 'avatar_id', 'cover_photo_id']
            });
            
            // Tạo map cho việc tra cứu nhanh thông tin user
            const userMap = {};
            users.forEach(user => {
                userMap[user.documentId] = user;
            });
            
            // Thêm thông tin user và friend vào mỗi kết quả
            const enrichedData = rows.map(friend => {
                const plainFriend = friend.get({ plain: true });
                plainFriend.user = userMap[friend.user_id];
                plainFriend.friend = userMap[friend.friend_id];
                return plainFriend;
            });
            
            return {
                data: enrichedData,
                meta: {
                    pagination: {
                        page: parseInt(page),
                        pageSize: parseInt(pageSize),
                        pageCount: Math.ceil(count / pageSize),
                        total: count
                    }
                }
            };
        }
        
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
        throw new Error(`Lỗi khi lấy danh sách bạn bè cập nhật cách đây 7 ngày: ${error.message}`);
    }
};

// Lấy danh sách bạn bè và đếm số lượng bạn bè
export const getFriendsWithCount = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    statusId = null
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

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions[Op.or] = [
                { user_id: userId },
                { friend_id: userId }
            ];
        }

        // Lọc theo statusId nếu được cung cấp
        if (statusId) {
            whereConditions.status_action_id = statusId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.StatusAction,
                    as: 'status',
                    attributes: ['documentId', 'name', 'description']
                }
            );
        }

        // Thực hiện truy vấn để lấy danh sách bạn bè
        const { count, rows } = await db.Friend.findAndCountAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize,
            distinct: true
        });

        // Đếm tổng số bạn bè của người dùng
        let totalFriends = 0;
        if (userId) {
            const friendCount = await db.Friend.count({
                where: {
                    [Op.or]: [
                        { user_id: userId },
                        { friend_id: userId }
                    ],
                    status_action_id: 'vr8ygnd5y17xs4vcq6du3q7c' // Giả sử status_action_id = 1 là trạng thái đã kết bạn
                }
            });
            totalFriends = friendCount;
        }

        return {
            data: rows,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    pageCount: Math.ceil(count / pageSize),
                    total: count
                },
                totalFriends: totalFriends
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách bạn bè và đếm số lượng: ${error.message}`);
    }
};

// Lấy danh sách người dùng chưa kết bạn với userId
export const getNonFriendUsers = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    userId = null
}) => {
    try {
        if (!userId) {
            throw new Error('UserId là bắt buộc');
        }

        const offset = (page - 1) * pageSize;

        // Lấy tất cả các ID user là bạn bè với userId truyền vào
        const friendships = await db.Friend.findAll({
            where: {
                [Op.or]: [
                    { user_id: userId },
                    { friend_id: userId }
                ]
            },
            attributes: ['user_id', 'friend_id']
        });

        // Tạo mảng chứa tất cả ID là bạn bè với userId
        const friendIds = new Set();
        
        friendships.forEach(friendship => {
            if (friendship.user_id === userId) {
                friendIds.add(friendship.friend_id);
            } else {
                friendIds.add(friendship.user_id);
            }
        });
        
        // Thêm chính userId vào danh sách loại trừ
        friendIds.add(userId);

        // Xây dựng điều kiện WHERE để lấy người dùng không có trong danh sách bạn bè
        const whereConditions = {
            documentId: {
                [Op.notIn]: Array.from(friendIds)
            }
        };

        // Áp dụng bộ lọc nếu có
        if (filters.keyword) {
            whereConditions[Op.or] = [
                { fullname: { [Op.like]: `%${filters.keyword}%` } },
                { email: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Thực hiện truy vấn lấy danh sách người dùng chưa là bạn bè
        const { count, rows } = await db.User.findAndCountAll({
            where: whereConditions,
            attributes: ['documentId', 'fullname', 'email', 'phone', 'avatar_id', 'cover_photo_id'],
            order: [[sortField, sortOrder]],
            offset,
            limit: pageSize
        });

        // Lấy avatar_id từ tất cả users
        const avatarIds = rows
            .map(user => user.avatar_id)
            .filter(id => id !== null);
        
        // Truy vấn thông tin media cho avatar
        const avatarMedia = await db.Media.findAll({
            where: {
                documentId: { [Op.in]: avatarIds }
            },
            attributes: ['documentId', 'file_path']
        });
        
        // Tạo map cho việc tra cứu nhanh thông tin media
        const mediaMap = {};
        avatarMedia.forEach(media => {
            mediaMap[media.documentId] = media;
        });

        // Lấy số lượng bạn bè cho mỗi user
        const friendCountPromises = rows.map(async (user) => {
            const friendCount = await db.Friend.count({
                where: {
                    [Op.or]: [
                        { user_id: user.documentId },
                        { friend_id: user.documentId }
                    ],
                    status_action_id: 'vr8ygnd5y17xs4vcq6du3q7c'
                }
            });
            return { id: user.documentId, count: friendCount };
        });
        
        const friendCounts = await Promise.all(friendCountPromises);
        const friendCountMap = {};
        friendCounts.forEach(({ id, count }) => {
            friendCountMap[id] = count;
        });

        // Thêm thông tin avatar và số lượng bạn bè vào kết quả
        const enrichedData = rows.map(user => {
            const userData = user.get({ plain: true });
            
            // Thêm thông tin avatar media nếu có
            if (userData.avatar_id && mediaMap[userData.avatar_id]) {
                userData.avatarMedia = mediaMap[userData.avatar_id];
            }
            
            // Thêm số lượng bạn bè
            userData.friendCount = friendCountMap[userData.documentId] || 0;
            
            return userData;
        });

        return {
            data: enrichedData,
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
        throw new Error(`Lỗi khi lấy danh sách người dùng chưa kết bạn: ${error.message}`);
    }
}; 