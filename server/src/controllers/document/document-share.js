import * as documentShareService from '../../services/document/document-share.service.js'


export const getAllDocumentShares = async (req, res) => {
    try {
        const { 
            sort,
            'pagination[page]': page = 1,
            'pagination[pageSize]': pageSize = 10,
            populate,
            searchText,
            userId
        } = req.query

        const result = await documentShareService.getAllDocumentShares({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            sort,
            populate: populate === '*' ? true : false,
            searchText,
            userId: userId || null
        })

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        })
    }
}

export const getDocumentShareById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await documentShareService.getDocumentShareById(id)
        
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin document share thành công',
            data: result
        })
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        })
    }
}

export const createDocumentShare = async (req, res) => {
    try {
        const documentShareData = {
            ...req.body,
            // userId: req.user.id
        }
        const result = await documentShareService.createDocumentShare(documentShareData)
        
        return res.status(201).json({
            err: 0,
            message: 'Tạo document share mới thành công',
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        })
    }
}

export const updateDocumentShare = async (req, res) => {
    try {
        const { id } = req.params
        const documentShareData = req.body
        const result = await documentShareService.updateDocumentShare(id, documentShareData)
        
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật document share thành công',
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        })
    }
}

export const deleteDocumentShare = async (req, res) => {
    try {
        const { id } = req.params
        const result = await documentShareService.deleteDocumentShare(id)
        
        return res.status(200).json({
            err: 0,
            message: result.message
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        })
    }
} 