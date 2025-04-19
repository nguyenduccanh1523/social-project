import db from '../../models';
import { Op } from 'sequelize';

// Lấy tất cả groups có phân trang và lọc
export const getAllGroups = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    adminId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.group_name) {
            whereConditions.group_name = { [Op.like]: `%${filters.group_name}%` };
        }

        if (filters.type_id) {
            whereConditions.type_id = filters.type_id;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { group_name: { [Op.like]: `%${filters.keyword}%` } },
                { description: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Nếu có adminId, tìm nhóm có admin_id bằng adminId
        if (adminId) {
            whereConditions.admin_id = adminId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'admin',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path', 'file_type']
                        }
                    ]
                },
                {
                    model: db.Media,
                    as: 'image',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                }
            );
        }

        // Nếu có userId, lọc theo các nhóm mà user đó là thành viên
        let query = {};
        if (userId) {
            query = {
                include: [
                    ...includes,
                    {
                        model: db.User,
                        as: 'users',
                        where: { documentId: userId },
                        attributes: []
                    }
                ],
                where: whereConditions,
                order: [[sortField, sortOrder]],
                offset,
                limit: pageSize,
                distinct: true
            };
        } else {
            query = {
                include: includes,
                where: whereConditions,
                order: [[sortField, sortOrder]],
                offset,
                limit: pageSize,
                distinct: true
            };
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Group.findAndCountAll(query);

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
        throw new Error(`Lỗi khi lấy danh sách nhóm: ${error.message}`);
    }
};

// Lấy group theo ID
export const getGroupById = async (documentId) => {
    try {
        const group = await db.Group.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'admin',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path', 'file_type']
                        }
                    ]
                },
                {
                    model: db.Media,
                    as: 'image',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.group_members,
                    as: 'members',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['documentId', 'fullname', 'email', 'avatar_id'],
                            include: [
                                {
                                    model: db.Media,
                                    as: 'avatarMedia',
                                    attributes: ['documentId', 'file_path', 'file_type']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!group) {
            throw new Error('Không tìm thấy nhóm');
        }

        return group;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin nhóm: ${error.message}`);
    }
};

// Tạo group mới
export const createGroup = async (groupData) => {
    try {
        const newGroup = await db.Group.create(groupData);
        
        // Tự động thêm người tạo nhóm vào danh sách thành viên
        await db.group_members.create({
            user_id: groupData.admin_id,
            group_id: newGroup.documentId,
            joined_at: new Date()
        });
        
        return await getGroupById(newGroup.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo nhóm mới: ${error.message}`);
    }
};

// Cập nhật group
export const updateGroup = async (documentId, groupData) => {
    try {
        const group = await db.Group.findByPk(documentId);
        
        if (!group) {
            throw new Error('Không tìm thấy nhóm');
        }

        await group.update(groupData);
        return await getGroupById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật nhóm: ${error.message}`);
    }
};

// Xóa group
export const deleteGroup = async (documentId) => {
    try {
        const group = await db.Group.findByPk(documentId);
        
        if (!group) {
            throw new Error('Không tìm thấy nhóm');
        }

        // Xóa các thành viên, yêu cầu, lời mời liên quan đến nhóm
        await db.group_members.destroy({ where: { group_id: documentId } });
        await db.group_request.destroy({ where: { group_id: documentId } });
        await db.group_invitation.destroy({ where: { group_id: documentId } });
        
        // Xóa nhóm
        await group.destroy();
        
        return { message: 'Xóa nhóm thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa nhóm: ${error.message}`);
    }
};

// Lấy các nhóm mà một người dùng là thành viên
export const getGroupsByUserId = async (userId) => {
    try {
        const groups = await db.Group.findAll({
            include: [
                {
                    model: db.User,
                    as: 'users',
                    where: { documentId: userId },
                    attributes: []
                },
                {
                    model: db.User,
                    as: 'admin',
                    attributes: ['documentId', 'fullname', 'email'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path', 'file_type']
                        }
                    ]
                },
                {
                    model: db.Media,
                    as: 'image',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        return groups;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách nhóm của người dùng: ${error.message}`);
    }
};

// Lấy các nhóm mà một người dùng là admin
export const getGroupsAdminByUserId = async (userId) => {
    try {
        const groups = await db.Group.findAll({
            where: { admin_id: userId },
            include: [
                {
                    model: db.Media,
                    as: 'image',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.group_members,
                    as: 'members',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['documentId', 'fullname', 'email', 'avatar_id'],
                            include: [
                                {
                                    model: db.Media,
                                    as: 'avatarMedia',
                                    attributes: ['documentId', 'file_path', 'file_type']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        return groups;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách nhóm do người dùng quản lý: ${error.message}`);
    }
}; 