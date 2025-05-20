import * as postFriendService from '../../services/post/post-friend.service.js';

export const getAllPostFriends = async (req, res) => {
    try {
        const pagination = req.query.pagination || {};
        const page = parseInt(pagination.page) || parseInt(req.query.page) || 1;
        const pageSize = parseInt(pagination.pageSize) || parseInt(req.query.pageSize) || 10;

        const sort = req.query.sort;
        let sortField = 'createdAt';
        let sortOrder = 'DESC';
        if (sort) {
            const sortParts = sort.split(':');
            if (sortParts.length === 2) {
                sortField = sortParts[0];
                sortOrder = sortParts[1].toUpperCase();
            }
        }

        const populate = req.query.populate === '*' ? true : false;
        const filters = {};
        if (req.query.keyword) filters.keyword = req.query.keyword;

        const postId = req.query.postId || null;
        const userId = req.query.userId || null;

        const postFriendsData = await postFriendService.getAllPostFriends({
            page,
            pageSize,
            filters,
            sortField,
            sortOrder,
            populate,
            postId,
            userId
        });

        return res.status(200).json(postFriendsData);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: 'Lỗi từ server: ' + error.message
        });
    }
};

export const getPostFriendById = async (req, res) => {
    try {
        const { id } = req.params;
        const postFriend = await postFriendService.getPostFriendById(id);
        return res.status(200).json({
            err: 0,
            message: 'Lấy thông tin post-friend thành công',
            data: postFriend
        });
    } catch (error) {
        return res.status(404).json({
            err: -1,
            message: error.message
        });
    }
};

export const createPostFriend = async (req, res) => {
    try {
        const postFriendData = req.body;
        const newPostFriend = await postFriendService.createPostFriend(postFriendData);
        return res.status(201).json({
            err: 0,
            message: 'Tạo post-friend mới thành công',
            data: newPostFriend
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const updatePostFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const postFriendData = req.body;
        const updatedPostFriend = await postFriendService.updatePostFriend(id, postFriendData);
        return res.status(200).json({
            err: 0,
            message: 'Cập nhật post-friend thành công',
            data: updatedPostFriend
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
};

export const deletePostFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await postFriendService.deletePostFriend(id);
        return res.status(200).json({
            err: 0,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            message: error.message
        });
    }
}; 