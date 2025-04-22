import db from '../../models';
import { Op } from 'sequelize';
import * as groupMemberService from './group-member.service';

// Lấy tất cả group-invitations có phân trang và lọc
export const getAllGroupInvitations = async ({
    page = 1,
    pageSize = 10,
    sortField = 'created_at',
    sortOrder = 'DESC',
    populate = false,
    invitedBy = null,
    invitedTo = null,
    groupId = null,
    statusId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Lọc theo invitedBy nếu được cung cấp
        if (invitedBy) {
            whereConditions.invited_by = invitedBy;
        }

        // Lọc theo invitedTo nếu được cung cấp
        if (invitedTo) {
            whereConditions.invited_to = invitedTo;
        }

        // Lọc theo groupId nếu được cung cấp
        if (groupId) {
            whereConditions.group_id = groupId;
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
                    model: db.User,
                    as: 'inviter',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.User,
                    as: 'invitee',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['documentId', 'group_name', 'description', 'admin_id']
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.group_invitation.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách lời mời vào nhóm: ${error.message}`);
    }
};

// Lấy group-invitation theo ID
export const getGroupInvitationById = async (documentId) => {
    try {
        const invitation = await db.group_invitation.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'inviter',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.User,
                    as: 'invitee',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['documentId', 'group_name', 'description', 'admin_id']
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        if (!invitation) {
            throw new Error('Không tìm thấy lời mời');
        }

        return invitation;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin lời mời: ${error.message}`);
    }
};

// Kiểm tra quyền gửi lời mời vào nhóm (chỉ admin hoặc thành viên của nhóm mới có quyền gửi)
export const checkInvitePermission = async (userId, groupId) => {
    try {
        // Kiểm tra xem người dùng có phải là admin của nhóm không
        const group = await db.Group.findByPk(groupId);
        if (group && group.admin_id === userId) {
            return true;
        }

        // Kiểm tra xem người dùng có phải là thành viên của nhóm không
        const isMember = await groupMemberService.checkGroupMembership(userId, groupId);
        return isMember;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra quyền gửi lời mời: ${error.message}`);
    }
};

// Kiểm tra xem người dùng có phải là admin của nhóm không
export const checkGroupAdmin = async (userId, groupId) => {
    try {
        const group = await db.Group.findByPk(groupId);
        return group && group.admin_id === userId;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra quyền admin: ${error.message}`);
    }
};

// Kiểm tra quyền hủy lời mời (chỉ người gửi lời mời hoặc admin của nhóm mới có quyền hủy)
export const checkCancelPermission = async (userId, invitation) => {
    try {
        // Kiểm tra xem người dùng có phải là người gửi lời mời không
        if (invitation.invited_by === userId) {
            return true;
        }

        // Kiểm tra xem người dùng có phải là admin của nhóm không
        const isAdmin = await checkGroupAdmin(userId, invitation.group_id);
        return isAdmin;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra quyền hủy lời mời: ${error.message}`);
    }
};

// Tạo lời mời vào nhóm
export const createGroupInvitation = async (invitationData) => {
    try {
        // // Kiểm tra xem người dùng đã có lời mời vào nhóm này chưa
        // const existingInvitation = await db.group_invitation.findOne({
        //     where: {
        //         group_id: invitationData.group_id,
        //         invited_to: invitationData.invited_to,
        //         [Op.or]: [
        //             { status_action_id: null },
        //             { status_action_id: { [Op.eq]: null } }
        //         ]
        //     }
        // });

        // if (existingInvitation) {
        //     throw new Error('Người dùng này đã có lời mời vào nhóm chưa được phản hồi');
        // }

        // Kiểm tra xem người dùng đã là thành viên của nhóm chưa
        const isMember = await groupMemberService.checkGroupMembership(invitationData.invited_to, invitationData.group_id);
        if (isMember) {
            throw new Error('Người dùng này đã là thành viên của nhóm');
        }

        const newInvitation = await db.group_invitation.create(invitationData);
        return await getGroupInvitationById(newInvitation.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo lời mời vào nhóm: ${error.message}`);
    }
};


// Phản hồi lời mời vào nhóm
export const respondToInvitation = async (invitationId, statusActionId) => {
    try {
        const invitation = await db.group_invitation.findByPk(invitationId);
        
        if (!invitation) {
            throw new Error('Không tìm thấy lời mời');
        }

        // Nếu lời mời đã được phản hồi
        if (invitation.status_action_id) {
            throw new Error('Lời mời này đã được phản hồi');
        }

        // Cập nhật trạng thái lời mời
        await invitation.update({
            status_action_id: statusActionId,
            responded_at: new Date()
        });

        // Nếu chấp nhận lời mời, thêm người dùng vào nhóm
        const acceptStatus = await db.StatusAction.findOne({
            where: { name: 'accepted' }
        });

        if (statusActionId === acceptStatus.documentId) {
            await groupMemberService.addGroupMember({
                group_id: invitation.group_id,
                user_id: invitation.invited_to,
                joined_at: new Date()
            });
        }

        return await getGroupInvitationById(invitationId);
    } catch (error) {
        throw new Error(`Lỗi khi phản hồi lời mời: ${error.message}`);
    }
};

// Hủy lời mời vào nhóm
export const cancelInvitation = async (invitationId) => {
    try {
        const invitation = await db.group_invitation.findByPk(invitationId);
        
        if (!invitation) {
            throw new Error('Không tìm thấy lời mời');
        }

        // Nếu lời mời đã được phản hồi
        if (invitation.status_action_id) {
            throw new Error('Lời mời này đã được phản hồi, không thể hủy');
        }

        // Xóa lời mời
        await invitation.destroy();
        return { message: 'Hủy lời mời thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi hủy lời mời: ${error.message}`);
    }
};

// Lấy danh sách lời mời của một nhóm
export const getInvitationsByGroupId = async (groupId) => {
    try {
        const invitations = await db.group_invitation.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: db.User,
                    as: 'inviter',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.User,
                    as: 'invitee',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        return invitations;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách lời mời của nhóm: ${error.message}`);
    }
};

// Lấy danh sách lời mời của một người dùng
export const getInvitationsByUserId = async (userId) => {
    try {
        const invitations = await db.group_invitation.findAll({
            where: { invited_to: userId },
            include: [
                {
                    model: db.User,
                    as: 'inviter',
                    attributes: ['documentId', 'fullname', 'email', 'avatar_id']
                },
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['documentId', 'group_name', 'description', 'admin_id']
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        return invitations;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách lời mời của người dùng: ${error.message}`);
    }
}; 