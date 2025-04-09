import db from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả comment document có phân trang và lọc
export const getAllCmtDocument = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    parentId = null,
    document_share_id = null
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

        // Lọc theo parentId nếu được cung cấp
        if (parentId !== null) {
            whereConditions.parent_id = parentId;
        } else {
            whereConditions.parent_id = { [Op.is]: null };
        }

        // Lọc theo document_share_id nếu được cung cấp
        if (document_share_id) {
            whereConditions.document_id = document_share_id;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['documentId', 'username', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.DocumentShare,
                    as: 'documentShare',
                    attributes: ['documentId', 'title']
                },
                {
                    model: db.CmtDocument,
                    as: 'replies',
                    attributes: ['documentId', 'parent_id', 'content'],
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['documentId', 'username', 'avatar_id'],
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
            );
        }

        // Thực hiện truy vấn
        const { count, rows } = await db.CmtDocument.findAndCountAll({
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
        throw new Error(`Lỗi khi lấy danh sách comment document: ${error.message}`);
    }
};

// Lấy comment document theo ID
export const getCmtDocumentById = async (documentId) => {
    try {
        const cmtDocument = await db.CmtDocument.findByPk(documentId, {
            include: [
                {
                    model: db.DocumentShare,
                    as: 'documentShare',
                    attributes: ['documentId', 'title']
                }
            ]
        });

        if (!cmtDocument) {
            throw new Error('Không tìm thấy comment document');
        }

        return cmtDocument;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin comment document: ${error.message}`);
    }
};

// Tạo comment document mới
export const createCmtDocument = async (cmtDocumentData) => {
    try {
        const newCmtDocument = await db.CmtDocument.create(cmtDocumentData);
        return await getCmtDocumentById(newCmtDocument.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi tạo comment document mới: ${error.message}`);
    }
};

// Cập nhật comment document
export const updateCmtDocument = async (documentId, cmtDocumentData) => {
    try {
        const cmtDocument = await db.CmtDocument.findByPk(documentId);

        if (!cmtDocument) {
            throw new Error('Không tìm thấy comment document');
        }

        await cmtDocument.update(cmtDocumentData);
        return await getCmtDocumentById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật comment document: ${error.message}`);
    }
};

// Xóa comment document
export const deleteCmtDocument = async (documentId) => {
    try {
        const cmtDocument = await db.CmtDocument.findByPk(documentId);

        if (!cmtDocument) {
            throw new Error('Không tìm thấy comment document');
        }

        await cmtDocument.destroy();
        return { message: 'Xóa comment document thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa comment document: ${error.message}`);
    }
}; 