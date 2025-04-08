import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả post-tags có phân trang và lọc
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
    lastSevenDays = false
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