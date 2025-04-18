import db from '../../models';
import { Op } from 'sequelize';
import * as groupService from './group.service';

// Lấy tất cả group-members có phân trang và lọc
export const getAllGroupMembers = async ({
    page = 1,
    pageSize = 10,
    sortField = 'joined_at',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    groupId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Lọc theo groupId nếu được cung cấp
        if (groupId) {
            whereConditions.group_id = groupId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['documentId', 'group_name', 'description', 'admin_id']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.group_members.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách thành viên nhóm: ${error.message}`);
    }
};

// Lấy group-member theo ID
export const getGroupMemberById = async (documentId) => {
    try {
        const groupMember = await db.group_members.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['documentId', 'group_name', 'description', 'admin_id']
                }
            ]
        });

        if (!groupMember) {
            throw new Error('Không tìm thấy thành viên nhóm');
        }

        return groupMember;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin thành viên nhóm: ${error.message}`);
    }
};

// Lấy thông tin group từ service khác
export const getGroupById = async (groupId) => {
    try {
        return await groupService.getGroupById(groupId);
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin nhóm: ${error.message}`);
    }
};

// Thêm thành viên vào nhóm
export const addGroupMember = async (memberData) => {
    try {
        // Kiểm tra xem đã tồn tại thành viên trong nhóm chưa
        const existingMember = await db.group_members.findOne({
            where: {
                group_id: memberData.group_id,
                user_id: memberData.user_id
            }
        });

        if (existingMember) {
            throw new Error('Người dùng đã là thành viên của nhóm này');
        }

        const newGroupMember = await db.group_members.create(memberData);
        return await getGroupMemberById(newGroupMember.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi thêm thành viên vào nhóm: ${error.message}`);
    }
};

// Xóa thành viên khỏi nhóm
export const removeGroupMember = async (documentId) => {
    try {
        const groupMember = await db.group_members.findByPk(documentId);
        
        if (!groupMember) {
            throw new Error('Không tìm thấy thành viên nhóm');
        }

        // Kiểm tra xem thành viên này có phải là admin của nhóm không
        const group = await db.Group.findByPk(groupMember.group_id);
        
        if (group && group.admin_id === groupMember.user_id) {
            throw new Error('Không thể xóa admin ra khỏi nhóm. Hãy chuyển quyền admin trước khi rời nhóm.');
        }

        await groupMember.destroy();
        return { message: 'Xóa thành viên khỏi nhóm thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa thành viên khỏi nhóm: ${error.message}`);
    }
};

// Lấy danh sách thành viên của một nhóm
export const getGroupMembersByGroupId = async (groupId) => {
    try {
        const members = await db.group_members.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                }
            ]
        });

        return members;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách thành viên của nhóm: ${error.message}`);
    }
};

// Lấy danh sách nhóm mà một người dùng tham gia
export const getGroupMembersByUserId = async (userId) => {
    try {
        const memberships = await db.group_members.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Group,
                    as: 'group',
                    include: [
                        {
                            model: db.User,
                            as: 'admin',
                            attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                        },
                        {
                            model: db.Media,
                            as: 'image',
                            attributes: ['documentId', 'url', 'type']
                        }
                    ]
                }
            ]
        });

        return memberships;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách nhóm của người dùng: ${error.message}`);
    }
};

// Kiểm tra xem một người dùng có phải là thành viên của một nhóm hay không
export const checkGroupMembership = async (userId, groupId) => {
    try {
        const membership = await db.group_members.findOne({
            where: {
                group_id: groupId,
                user_id: userId
            }
        });

        return !!membership; // Trả về true nếu tìm thấy, false nếu không tìm thấy
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra thành viên nhóm: ${error.message}`);
    }
}; 