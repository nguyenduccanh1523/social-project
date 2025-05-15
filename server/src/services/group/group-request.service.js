import db from '../../models/index.js';
import { Op } from 'sequelize';
import * as groupMemberService from './group-member.service.js';

// Lấy tất cả group-requests có phân trang và lọc
export const getAllGroupRequests = async ({
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    groupId = null,
    statusId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_request = userId;
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
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'email'],
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
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.group_request.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách yêu cầu tham gia nhóm: ${error.message}`);
    }
};

// Lấy group-request theo ID
export const getGroupRequestById = async (documentId) => {
    try {
        const request = await db.group_request.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'email'],
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
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        if (!request) {
            throw new Error('Không tìm thấy yêu cầu tham gia nhóm');
        }

        return request;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin yêu cầu tham gia nhóm: ${error.message}`);
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

// Tạo yêu cầu tham gia nhóm
export const createGroupRequest = async (requestData) => {
    try {
        // Kiểm tra xem người dùng đã có yêu cầu tham gia nhóm này chưa
        const existingRequest = await db.group_request.findOne({
            where: {
                group_id: requestData.group_id,
                user_request: requestData.user_request,
            }
        });

        if (existingRequest) {
            throw new Error('Bạn đã gửi yêu cầu tham gia nhóm này và đang chờ xử lý');
        }

        // Kiểm tra xem người dùng đã là thành viên của nhóm chưa
        const isMember = await groupMemberService.checkGroupMembership(requestData.user_request, requestData.group_id);
        if (isMember) {
            throw new Error('Bạn đã là thành viên của nhóm này');
        }

        const newRequest = await db.group_request.create(requestData);
        return await getGroupRequestById(newRequest.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo yêu cầu tham gia nhóm: ${error.message}`);
    }
};

// Phản hồi yêu cầu tham gia nhóm
export const respondToRequest = async (requestId, statusActionId) => {
    try {
        const request = await db.group_request.findByPk(requestId);
        
        if (!request) {
            throw new Error('Không tìm thấy yêu cầu tham gia nhóm');
        }

        // // Nếu yêu cầu đã được phản hồi
        // console.log(request);
        // if (request.status_action_id) {
        //     throw new Error('Yêu cầu này đã được phản hồi');
        // }

        // Cập nhật trạng thái yêu cầu
        await request.update({
            status_action_id: statusActionId
        });

        // Nếu chấp nhận yêu cầu, thêm người dùng vào nhóm
        const acceptStatus = await db.StatusAction.findOne({
            where: { name: 'accepted' }
        });

        if (statusActionId === acceptStatus.documentId) {
            await groupMemberService.addGroupMember({
                group_id: request.group_id,
                user_id: request.user_request,
                joined_at: new Date()
            });
        }

        return await getGroupRequestById(requestId);
    } catch (error) {
        throw new Error(`Lỗi khi phản hồi yêu cầu tham gia nhóm: ${error.message}`);
    }
};

// Hủy yêu cầu tham gia nhóm
export const cancelRequest = async (requestId) => {
    try {
        const request = await db.group_request.findByPk(requestId);
        
        if (!request) {
            throw new Error('Không tìm thấy yêu cầu tham gia nhóm');
        }

        // Nếu yêu cầu đã được phản hồi
        if (request.status_action_id) {
            throw new Error('Yêu cầu này đã được phản hồi, không thể hủy');
        }

        // Xóa yêu cầu
        await request.destroy();
        return { message: 'Hủy yêu cầu tham gia nhóm thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi hủy yêu cầu tham gia nhóm: ${error.message}`);
    }
};

// Lấy danh sách yêu cầu tham gia một nhóm
export const getRequestsByGroupId = async (groupId) => {
    try {
        const requests = await db.group_request.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'fullname', 'email'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.StatusAction,
                    as: 'statusAction',
                    attributes: ['documentId', 'name', 'description']
                }
            ]
        });

        return requests;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách yêu cầu tham gia nhóm: ${error.message}`);
    }
};

// Lấy danh sách yêu cầu tham gia nhóm của một người dùng
export const getRequestsByUserId = async (userId) => {
    try {
        const requests = await db.group_request.findAll({
            where: { user_request: userId },
            include: [
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

        return requests;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách yêu cầu tham gia nhóm của người dùng: ${error.message}`);
    }
};

// Lấy số lượng yêu cầu đang chờ xử lý của một nhóm
export const getPendingRequestCount = async (groupId) => {
    try {
        const count = await db.group_request.count({
            where: {
                group_id: groupId,
                status_action_id: null
            }
        });

        return count;
    } catch (error) {
        throw new Error(`Lỗi khi lấy số lượng yêu cầu đang chờ xử lý: ${error.message}`);
    }
}; 