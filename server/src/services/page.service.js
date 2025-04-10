import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả trang có phân trang và lọc
export const getAllPages = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false
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
                { page_name: { [Op.like]: `%${filters.keyword}%` } },
                { intro: { [Op.like]: `%${filters.keyword}%` } },
                { about: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        if (filters.author) {
            whereConditions.author = filters.author;
        }

        if (filters.lives_in) {
            whereConditions.lives_in = filters.lives_in;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name', 'code']
                },
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['documentId', 'username', 'email', 'avatar_id']
                },
                {
                    model: db.Media,
                    as: 'profileImage',
                    attributes: ['documentId', 'url', 'type']
                },
                {
                    model: db.Media,
                    as: 'coverImage',
                    attributes: ['documentId', 'url', 'type']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.Page.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách trang: ${error.message}`);
    }
};

// Lấy trang theo ID
export const getPageById = async (documentId) => {
    try {
        const page = await db.Page.findByPk(documentId, {
            include: [
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name']
                },
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['documentId', 'username', 'email'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Media,
                    as: 'profileImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Media,
                    as: 'coverImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.PageMember,
                    as: 'members',
                    attributes: ['documentId'],
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['documentId', 'username', 'email'],
                            include: [
                                {
                                    model: db.Media,
                                    as: 'avatarMedia',
                                    attributes: ['documentId', 'file_path']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!page) {
            throw new Error('Không tìm thấy trang');
        }

        return page;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin trang: ${error.message}`);
    }
};

// Tạo trang mới
export const createPage = async (pageData) => {
    try {
        const newPage = await db.Page.create(pageData);
        return await getPageById(newPage.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo trang mới: ${error.message}`);
    }
};

// Cập nhật trang
export const updatePage = async (documentId, pageData) => {
    try {
        const page = await db.Page.findByPk(documentId);
        
        if (!page) {
            throw new Error('Không tìm thấy trang');
        }

        await page.update(pageData);
        return await getPageById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật trang: ${error.message}`);
    }
};

// Xóa trang
export const deletePage = async (documentId) => {
    try {
        const page = await db.Page.findByPk(documentId);
        
        if (!page) {
            throw new Error('Không tìm thấy trang');
        }

        await page.destroy();
        return { message: 'Xóa trang thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa trang: ${error.message}`);
    }
};

// Lấy tất cả thành viên trang
export const getAllPageMembers = async ({
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

// Lấy thành viên trang theo ID
export const getPageMemberById = async (documentId) => {
    try {
        const pageMember = await db.PageMember.findByPk(documentId, {
            include: [
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
            ]
        });

        if (!pageMember) {
            throw new Error('Không tìm thấy thành viên trang');
        }

        return pageMember;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin thành viên trang: ${error.message}`);
    }
};

// Tạo thành viên trang mới
export const createPageMember = async (pageMemberData) => {
    try {
        const newPageMember = await db.PageMember.create(pageMemberData);
        return await getPageMemberById(newPageMember.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo thành viên trang mới: ${error.message}`);
    }
};

// Xóa thành viên trang
export const deletePageMember = async (documentId) => {
    try {
        const pageMember = await db.PageMember.findByPk(documentId);
        
        if (!pageMember) {
            throw new Error('Không tìm thấy thành viên trang');
        }

        await pageMember.destroy();
        return { message: 'Xóa thành viên trang thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa thành viên trang: ${error.message}`);
    }
};

// Lấy tất cả giờ mở cửa của trang
export const getAllPageOpenHours = async ({
    page = 1,
    pageSize = 10,
    sortField = 'day_of_week',
    sortOrder = 'ASC',
    populate = false,
    pageId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Lọc theo pageId nếu được cung cấp
        if (pageId) {
            whereConditions.page_id = pageId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name']
                }
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.PageOpenHour.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách giờ mở cửa trang: ${error.message}`);
    }
};

// Lấy giờ mở cửa trang theo ID
export const getPageOpenHourById = async (documentId) => {
    try {
        const pageOpenHour = await db.PageOpenHour.findByPk(documentId, {
            include: [
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name']
                }
            ]
        });

        if (!pageOpenHour) {
            throw new Error('Không tìm thấy giờ mở cửa trang');
        }

        return pageOpenHour;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin giờ mở cửa trang: ${error.message}`);
    }
};

// Tạo giờ mở cửa trang mới
export const createPageOpenHour = async (pageOpenHourData) => {
    try {
        const newPageOpenHour = await db.PageOpenHour.create(pageOpenHourData);
        return await getPageOpenHourById(newPageOpenHour.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo giờ mở cửa trang mới: ${error.message}`);
    }
};

// Cập nhật giờ mở cửa trang
export const updatePageOpenHour = async (documentId, pageOpenHourData) => {
    try {
        const pageOpenHour = await db.PageOpenHour.findByPk(documentId);
        
        if (!pageOpenHour) {
            throw new Error('Không tìm thấy giờ mở cửa trang');
        }

        await pageOpenHour.update(pageOpenHourData);
        return await getPageOpenHourById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật giờ mở cửa trang: ${error.message}`);
    }
}; 