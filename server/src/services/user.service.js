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

// Thống kê số tài khoản theo tháng và tỷ lệ giới tính
export const getUserStatistics = async () => {
    try {
        const currentYear = new Date().getFullYear();
        
        // Lấy thống kê theo tháng
        const monthlyStats = await db.User.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('documentId')), 'count']
            ],
            where: Sequelize.where(
                Sequelize.fn('YEAR', Sequelize.col('createdAt')),
                currentYear
            ),
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']]
        });

        // Lấy thống kê theo giới tính
        const genderStats = await db.User.findAll({
            attributes: [
                'gender',
                [Sequelize.fn('COUNT', Sequelize.col('documentId')), 'count']
            ],
            group: ['gender']
        });

        // Tính tổng số user
        const totalUsers = await db.User.count();

        // Tính phần trăm theo giới tính
        const genderPercentages = genderStats.map(stat => ({
            gender: stat.gender,
            count: parseInt(stat.getDataValue('count')),
            percentage: ((parseInt(stat.getDataValue('count')) / totalUsers) * 100).toFixed(2)
        }));

        // Format dữ liệu thống kê theo tháng
        const formattedMonthlyStats = monthlyStats.map(stat => ({
            month: parseInt(stat.getDataValue('month')),
            count: parseInt(stat.getDataValue('count'))
        }));

        return {
            monthlyStats: formattedMonthlyStats,
            genderStats: genderPercentages,
            totalUsers
        };
    } catch (error) {
        throw new Error(`Lỗi khi thống kê user: ${error.message}`);
    }
};

// Thống kê số lượng user theo quốc gia
export const getNationStatistics = async ({ page = 1, pageSize = 10 }) => {
    try {
        const offset = (page - 1) * pageSize;

        // Lấy thống kê số lượng user theo quốc gia
        const { count, rows } = await db.User.findAndCountAll({
            attributes: [
                'nation_id',
                [Sequelize.fn('COUNT', Sequelize.col('User.documentId')), 'userCount']
            ],
            include: [
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: [
                        ['documentId', 'nationId'],
                        'name',
                        'niceName',
                        'iso',
                        'phoneCode'
                    ]
                }
            ],
            group: [
                'User.nation_id',
                'nation.documentId',
                'nation.name',
                'nation.niceName',
                'nation.iso',
                'nation.phoneCode'
            ],
            order: [[Sequelize.literal('userCount'), 'DESC']],
            offset,
            limit: pageSize,
            raw: true,
            nest: true
        });

        // Format dữ liệu trả về
        const formattedData = rows.map(row => ({
            nation: {
                documentId: row.nation.nationId,
                name: row.nation.name,
                niceName: row.nation.niceName,
                iso: row.nation.iso,
                phoneCode: row.nation.phoneCode
            },
            userCount: parseInt(row.userCount)
        }));

        return {
            data: formattedData,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    pageCount: Math.ceil(count.length / pageSize),
                    total: count.length
                }
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi thống kê user theo quốc gia: ${error.message}`);
    }
}; 