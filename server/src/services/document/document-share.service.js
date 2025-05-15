import db from '../../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';


export const getAllDocumentShares = async ({
    page = 1,
    pageSize = 10,
    sort,
    populate = false,
    searchText,
    userId = null
}) => {
    try {
        const offset = (page - 1) * pageSize
        const whereConditions = {};
        if (userId) {
            whereConditions.author = userId;
        }

        if (searchText) {
            whereConditions[Op.or] = [
                { title: { [Op.like]: `%${searchText}%` } },
                { description: { [Op.like]: `%${searchText}%` } }
            ]
        }

        let order = [['createdAt', 'DESC']]
        if (sort) {
            const [field, direction] = sort.split(':')
            order = [[field, direction.toUpperCase()]]
        }

        const includes = []
        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['documentId', 'username', 'email', 'avatar_id'],
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                }
            )
        }

        const { count, rows } = await db.DocumentShare.findAndCountAll({
            where: whereConditions,
            include: includes,
            order,
            offset,
            limit: pageSize,
            distinct: true
        })

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
        }
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách document shares: ${error.message}`)
    }
}

export const getDocumentShareById = async (id) => {
    try {
        const documentShare = await db.DocumentShare.findByPk(id, {
            include: [
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['documentId', 'username', 'email', 'avatar_id']
                }
            ]
        })

        if (!documentShare) {
            throw new Error('Không tìm thấy document share')
        }

        return documentShare
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin document share: ${error.message}`)
    }
}

export const createDocumentShare = async (documentShareData) => {
    try {
        const newDocumentShare = await db.DocumentShare.create(documentShareData)
        return await getDocumentShareById(newDocumentShare.documentId)
    } catch (error) {
        throw new Error(`Lỗi khi tạo document share mới: ${error.message}`)
    }
}

export const updateDocumentShare = async (id, documentShareData) => {
    try {
        const documentShare = await db.DocumentShare.findByPk(id)
        
        if (!documentShare) {
            throw new Error('Không tìm thấy document share')
        }

        await documentShare.update(documentShareData)
        return await getDocumentShareById(id)
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật document share: ${error.message}`)
    }
}

export const deleteDocumentShare = async (id) => {
    try {
        const documentShare = await db.DocumentShare.findByPk(id)
        
        if (!documentShare) {
            throw new Error('Không tìm thấy document share')
        }

        await documentShare.destroy()
        return { message: 'Xóa document share thành công' }
    } catch (error) {
        throw new Error(`Lỗi khi xóa document share: ${error.message}`)
    }
} 