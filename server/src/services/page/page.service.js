import db from '../../models';
import { Op } from 'sequelize';

// Lấy tất cả pages có phân trang và lọc
export const getAllPages = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null,
    authorId = null
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Áp dụng các bộ lọc nếu có
        if (filters.page_name) {
            whereConditions.page_name = { [Op.like]: `%${filters.page_name}%` };
        }

        if (filters.lives_in) {
            whereConditions.lives_in = filters.lives_in;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { page_name: { [Op.like]: `%${filters.keyword}%` } },
                { intro: { [Op.like]: `%${filters.keyword}%` } },
                { about: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Nếu có authorId, tìm trang có author bằng authorId
        if (authorId) {
            whereConditions.author = authorId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'creator',
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
                    as: 'profileImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Media,
                    as: 'coverImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name']
                }
            );
        }

        // Nếu có userId, lọc theo các trang mà user đó là thành viên
        let query = {};
        if (userId) {
            query = {
                include: [
                    ...includes,
                    {
                        model: db.PageMember,
                        as: 'members',
                        where: { user_id: userId },
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
        const { count, rows } = await db.Page.findAndCountAll(query);

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

// Lấy page theo ID
export const getPageById = async (documentId) => {
    try {
        const page = await db.Page.findByPk(documentId, {
            include: [
                {
                    model: db.User,
                    as: 'creator',
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
                    as: 'profileImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Media,
                    as: 'coverImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name']
                },
                {
                    model: db.PageMember,
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
                },
                {
                    model: db.PageOpenHour,
                    as: 'openHours'
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

// Tạo page mới
export const createPage = async (pageData) => {
    try {
        const newPage = await db.Page.create(pageData);
        
        // Tự động thêm người tạo trang vào danh sách thành viên với vai trò admin
        await db.PageMember.create({
            user_id: pageData.author,
            page_id: newPage.documentId,
            role: 'admin',
            joined_at: new Date()
        });
        
        return await getPageById(newPage.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo trang mới: ${error.message}`);
    }
};

// Cập nhật page
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

// Xóa page
export const deletePage = async (documentId) => {
    try {
        const page = await db.Page.findByPk(documentId);
        
        if (!page) {
            throw new Error('Không tìm thấy trang');
        }

        // Xóa các thành viên và giờ mở cửa liên quan đến trang
        await db.PageMember.destroy({ where: { page_id: documentId } });
        await db.PageOpenHour.destroy({ where: { page_id: documentId } });
        
        // Xóa trang
        await page.destroy();
        
        return { message: 'Xóa trang thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa trang: ${error.message}`);
    }
};

// Lấy các trang mà một người dùng là thành viên
export const getPagesByUserId = async (userId) => {
    try {
        const pages = await db.Page.findAll({
            include: [
                {
                    model: db.PageMember,
                    as: 'members',
                    where: { user_id: userId },
                    attributes: []
                },
                {
                    model: db.User,
                    as: 'creator',
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
                    as: 'profileImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Media,
                    as: 'coverImage',
                    attributes: ['documentId', 'file_path']
                },
                {
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name']
                }
            ]
        });

        return pages;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách trang của người dùng: ${error.message}`);
    }
};

// Lấy các trang mà một người dùng là author
export const getPagesAuthorByUserId = async (userId) => {
    try {
        const pages = await db.Page.findAll({
            where: { author: userId },
            include: [
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
                    model: db.Nation,
                    as: 'nation',
                    attributes: ['documentId', 'name']
                },
                {
                    model: db.PageMember,
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

        return pages;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách trang do người dùng tạo: ${error.message}`);
    }
}; 