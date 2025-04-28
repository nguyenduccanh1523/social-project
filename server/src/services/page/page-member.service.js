import db from '../../models';
import { Op } from 'sequelize';


export const getPageMembers = async ({
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    pageId = null,
    userId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Lọc theo pageId nếu được cung cấp
        if (pageId) {
            whereConditions.page_id = pageId;
        }

        // Lọc theo userId nếu được cung cấp
        if (userId) {
            whereConditions.user_id = userId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name', 'profile_picture']
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'email', 'avatar_id']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.PageMember.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách thành viên trang: ${error.message}`);
    }
};

// Lấy chi tiết thành viên
export const getPageMemberById = async (documentId) => {
    try {
        const member = await db.PageMember.findByPk(documentId, {
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
                },
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name']
                }
            ]
        });

        if (!member) {
            throw new Error('Không tìm thấy thành viên');
        }

        return member;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin thành viên: ${error.message}`);
    }
};

// Lấy thành viên theo user_id và page_id
export const getPageMemberByUserAndPage = async (userId, pageId) => {
    try {
        const member = await db.PageMember.findOne({
            where: {
                user_id: userId,
                page_id: pageId
            },
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
        });

        return member;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra thành viên: ${error.message}`);
    }
};

// Thêm thành viên vào trang
export const addPageMember = async (memberData) => {
    try {
        // Kiểm tra xem thành viên đã tồn tại chưa
        const existingMember = await db.PageMember.findOne({
            where: {
                user_id: memberData.user_id,
                page_id: memberData.page_id
            }
        });

        if (existingMember) {
            throw new Error('Người dùng đã là thành viên của trang này');
        }

        // Thêm thành viên mới
        const newMember = await db.PageMember.create({
            ...memberData,
            joined_at: new Date()
        });

        return await getPageMemberById(newMember.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi thêm thành viên mới: ${error.message}`);
    }
};

// Cập nhật thông tin thành viên
export const updatePageMember = async (documentId, memberData) => {
    try {
        const member = await db.PageMember.findByPk(documentId);

        if (!member) {
            throw new Error('Không tìm thấy thành viên');
        }

        await member.update(memberData);
        return await getPageMemberById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật thành viên: ${error.message}`);
    }
};

// Cập nhật vai trò của thành viên
export const updatePageMemberRole = async (userId, pageId, role) => {
    try {
        const member = await db.PageMember.findOne({
            where: {
                user_id: userId,
                page_id: pageId
            }
        });

        if (!member) {
            throw new Error('Không tìm thấy thành viên');
        }

        await member.update({ role });
        return await getPageMemberById(member.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật vai trò thành viên: ${error.message}`);
    }
};

// Xóa thành viên khỏi trang
export const removePageMember = async (documentId) => {
    try {
        const member = await db.PageMember.findByPk(documentId)

        if (!member) {
            throw new Error('Không tìm thấy thành viên');
        }

        await member.destroy();
        return { message: 'Đã xóa thành viên khỏi trang' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa thành viên: ${error.message}`);
    }
};

// Kiểm tra xem người dùng có phải là thành viên của trang không
export const isPageMember = async (userId, pageId) => {
    try {
        const member = await db.PageMember.find({
            where: {
                user_id: userId,
                page_id: pageId
            }
        });

        return !!member;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra thành viên: ${error.message}`);
    }
};

// Kiểm tra xem người dùng có phải là admin của trang không
export const isPageAdmin = async (userId, pageId) => {
    try {
        const member = await db.PageMember.findOne({
            where: {
                user_id: userId,
                page_id: pageId,
                role: 'admin'
            }
        });

        return !!member;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra quyền admin: ${error.message}`);
    }
};