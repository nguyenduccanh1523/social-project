import db from '../../models/index.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

// Lấy tất cả bài viết có phân trang
export const getAllPosts = async ({
    page = 1,
    pageSize = 10,
    filters = {},
    sortField = 'createdAt',
    sortOrder = 'DESC',
    populate = false,
    userId = null, // Thêm tham số userId để kiểm tra quyền truy cập
    groupId = null, // Thêm tham số groupId để lọc bài viết theo nhóm
    pageId = null, // Thêm tham số pageId để lọc bài viết theo trang
    eventId = null // Thêm tham số eventId để lọc bài viết theo sự kiện
}) => {
    try {
        const offset = (page - 1) * pageSize;
        const whereConditions = {};

        // Nếu có userId từ filter, lấy bài viết của người dùng đó
        if (filters.userId) {
            whereConditions.user_id = filters.userId;
        }

        // Áp dụng các bộ lọc nếu có
        if (filters.status) {
            whereConditions.status = filters.status;
        }

        if (filters.keyword) {
            whereConditions[Op.or] = [
                { content: { [Op.like]: `%${filters.keyword}%` } }
            ];
        }

        // Lọc theo groupId nếu được cung cấp
        if (groupId) {
            whereConditions.group_id = groupId;
        }

        // Lọc theo pageId nếu được cung cấp
        if (pageId) {
            whereConditions.page_id = pageId;
        }

        // Lọc theo eventId nếu được cung cấp
        if (eventId) {
            whereConditions.event_id = eventId;
        }

        // Chuẩn bị các mối quan hệ cần include
        const includes = [];

        if (populate) {
            includes.push(
                {
                    model: db.User,
                    as: 'user',
                    attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires', 'refresh_token', 'refresh_token_expires'] },
                    include: [
                        {
                            model: db.Media,
                            as: 'avatarMedia',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Type,
                    as: 'postType',
                    attributes: ['documentId', 'name', 'description']
                },
                {
                    model: db.Comment,
                    as: 'comments',
                    separate: true,
                    limit: 10,
                    order: [['createdAt', 'DESC']],
                    attributes: ['documentId', 'content', 'createdAt', 'updatedAt']
                },
                {
                    model: db.Reaction,
                    as: 'reactions'
                },
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['documentId', 'group_name', 'description', 'group_image'],
                    include: [
                        {
                            model: db.Media,
                            as: 'image',
                            attributes: ['documentId', 'file_path']
                        }
                    ]
                },
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name']
                },
                {
                    model: db.Share,
                    as: 'shares',
                    separate: true,
                    limit: 5,
                    attributes: ['documentId', 'createdAt', 'updatedAt']
                },
                {
                    model: db.MarkPost,
                    as: 'marks',
                    attributes: ['documentId', 'createdAt', 'updatedAt']
                },
                {
                    model: db.PostFriend,
                    as: 'friends',
                    attributes: ['documentId', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['documentId', 'username']
                        }
                    ]
                }
            );

            // Thêm riêng quan hệ với Media
            try {
                const mediaInclude = {
                    model: db.Media,
                    as: 'medias',
                    attributes: ['documentId', 'file_path', 'file_type', 'file_size'],
                    through: {
                        attributes: []
                    }
                };
                includes.push(mediaInclude);
            } catch (error) {
                console.error('Lỗi khi thêm Media include:', error);
            }

            // Thêm riêng quan hệ với Tag
            try {
                const tagInclude = {
                    model: db.Tag,
                    as: 'tags',
                    attributes: ['documentId', 'name', 'description'],
                    through: {
                        attributes: []
                    }
                };
                includes.push(tagInclude);
            } catch (error) {
                console.error('Lỗi khi thêm Tag include:', error);
            }
        }

        // Nếu có userId, lấy danh sách nhóm mà người dùng là thành viên
        let userGroupIds = [];
        if (userId) {
            const userGroups = await db.group_members.findAll({
                where: { user_id: userId },
                attributes: ['group_id']
            });
            userGroupIds = userGroups.map(group => group.group_id);
        }

        // Thực hiện truy vấn tất cả bài viết (không giới hạn offset/limit) để lọc

        const allPostsQuery = await db.Post.findAll({
            where: whereConditions,
            include: includes,
            order: [[sortField, sortOrder]],
            distinct: true
        });

        //console.log(`Tổng số bài viết sau khi truy vấn: ${allPostsQuery.length}`);

        // In ra ID của một số bài viết đầu tiên để debug
        allPostsQuery.slice(0, 5).forEach((post, index) => {
            //   console.log(`Bài viết ${index + 1}: group_id = ${post.group_id}, documentId = ${post.documentId}`);
        });

        // Lọc kết quả để chỉ hiển thị bài viết mà người dùng có quyền xem
        let filteredAllPosts = allPostsQuery;
        if (userId) {
            filteredAllPosts = allPostsQuery.filter(post => {
                // Nếu bài viết không thuộc nhóm nào, cho phép xem
                if (!post.group_id) return true;

                // Nếu bài viết thuộc nhóm và người dùng là thành viên, cho phép xem
                if (userGroupIds.includes(post.group_id)) return true;

                // Nếu bài viết thuộc người dùng hiện tại, cho phép xem
                if (post.user_id === userId) return true;

                // Trong các trường hợp khác, không cho phép xem
                return false;
            });
        }

        // Tính tổng số bài viết mà người dùng có quyền xem
        const totalFilteredCount = filteredAllPosts.length;

        // Phân trang sau khi lọc
        const paginatedFilteredPosts = filteredAllPosts.slice(offset, offset + parseInt(pageSize));

        // Tạo thông tin phân trang dựa trên số lượng bài viết đã lọc
        const pagination = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: Math.ceil(totalFilteredCount / pageSize),
            total: totalFilteredCount
        };

        // Trả về kết quả định dạng theo yêu cầu
        return {
            data: paginatedFilteredPosts,
            meta: {
                pagination
            }
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách bài viết: ${error.message}`);
    }
};

// Lấy bài viết theo ID
export const getPostById = async (documentId, userId = null) => {
    try {
        // Chuẩn bị các mối quan hệ cần include
        const includes = [
            {
                model: db.User,
                as: 'user',
                attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires', 'refresh_token', 'refresh_token_expires'] }
            },
            {
                model: db.Type,
                as: 'postType',
                attributes: ['documentId', 'name', 'description']
            },
            {
                model: db.Comment,
                as: 'comments',
                separate: true,
                limit: 10,
                order: [['createdAt', 'DESC']],
                attributes: ['documentId', 'content', 'createdAt', 'updatedAt']
            },
            {
                model: db.Reaction,
                as: 'reactions'
            },
            {
                model: db.Group,
                as: 'group',
                attributes: ['documentId', 'group_name', 'description', 'group_image'],
                include: [
                    {
                        model: db.Media,
                        as: 'image',
                        attributes: ['documentId', 'file_path']
                    }
                ]
            },
            {
                model: db.Page,
                as: 'page',
                attributes: ['documentId', 'page_name']
            },
            {
                model: db.Share,
                as: 'shares',
                separate: true,
                limit: 5,
                attributes: ['documentId', 'createdAt', 'updatedAt']
            },
            {
                model: db.MarkPost,
                as: 'marks',
                attributes: ['documentId', 'createdAt', 'updatedAt']
            },
            {
                model: db.PostFriend,
                as: 'friends',
                attributes: ['documentId', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['documentId', 'username', 'avatar_id']
                    }
                ]
            }
        ];

        // Thêm riêng quan hệ với Media
        try {
            const mediaInclude = {
                model: db.Media,
                as: 'medias',
                attributes: ['documentId', 'file_path'],
                through: {
                    attributes: []
                }
            };
            includes.push(mediaInclude);
        } catch (error) {
            console.error('Lỗi khi thêm Media include:', error);
        }

        // Thêm riêng quan hệ với Tag
        try {
            const tagInclude = {
                model: db.Tag,
                as: 'tags',
                attributes: ['documentId', 'name', 'description'],
                through: {
                    attributes: []
                }
            };
            includes.push(tagInclude);
        } catch (error) {
            console.error('Lỗi khi thêm Tag include:', error);
        }

        const post = await db.Post.findByPk(documentId, {
            include: includes
        });

        if (!post) {
            throw new Error('Không tìm thấy bài viết');
        }

        // Kiểm tra quyền xem bài viết nếu bài viết thuộc nhóm
        if (userId && post.group_id) {
            // Kiểm tra xem người dùng có phải là thành viên của nhóm không
            const isMember = await db.group_members.findOne({
                where: {
                    group_id: post.group_id,
                    user_id: userId
                }
            });

            // Nếu người dùng không phải là thành viên của nhóm và không phải là người tạo bài viết
            if (!isMember && post.user_id !== userId) {
                throw new Error('Bạn không có quyền xem bài viết này');
            }
        }

        return {
            data: post
        };
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin bài viết: ${error.message}`);
    }
};

// Tạo bài viết mới
export const createPost = async (postData, userId) => {
    try {
        // // Thêm user_id vào dữ liệu bài viết
        // const postWithUserId = {
        //     ...postData,
        //     user_id: userId
        // };

        // // Nếu bài viết thuộc về một nhóm, kiểm tra xem người dùng có phải là thành viên không
        // if (postWithUserId.group_id) {
        //     const isMember = await db.group_members.findOne({
        //         where: {
        //             group_id: postWithUserId.group_id,
        //             user_id: userId
        //         }
        //     });

        //     if (!isMember) {
        //         throw new Error('Bạn không phải là thành viên của nhóm này');
        //     }
        // }

        console.log(postData)
        const newPost = await db.Post.create(postData);


        // // Nếu có thông tin phương tiện (hình ảnh, video), thêm vào bảng Media
        // if (postData.media && postData.media.length > 0) {
        //     const mediaItems = postData.media.map(item => ({
        //         ...item,
        //         post_id: newPost.documentId
        //     }));

        //     await db.Media.bulkCreate(mediaItems, { transaction });
        // }

        // // Commit transaction
        // await transaction.commit();

        // Lấy bài viết đã tạo kèm theo thông tin liên quan
        const createdPost = await getPostById(newPost.documentId);

        
        return createdPost;
    } catch (error) {
        // Rollback nếu có lỗi
        // await transaction.rollback();
        throw new Error(`Lỗi khi tạo bài viết mới: ${error.message}`);
    }
};

// Cập nhật bài viết
export const updatePost = async (documentId, postData, userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const post = await db.Post.findByPk(documentId);

        if (!post) {
            throw new Error('Không tìm thấy bài viết');
        }

        // Kiểm tra quyền chỉnh sửa
        if (post.user_id !== userId) {
            throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
        }

        // Cập nhật thông tin bài viết
        await post.update(postData, { transaction });

        // Nếu có thông tin phương tiện mới, xử lý cập nhật
        if (postData.media && postData.media.length > 0) {
            // Xóa phương tiện cũ
            await db.Media.destroy({
                where: { post_id: documentId },
                transaction
            });

            // Thêm phương tiện mới
            const mediaItems = postData.media.map(item => ({
                ...item,
                post_id: documentId
            }));

            await db.Media.bulkCreate(mediaItems, { transaction });
        }

        // Commit transaction
        await transaction.commit();

        // Lấy bài viết đã cập nhật kèm theo thông tin liên quan
        const updatedPost = await getPostById(documentId, userId);

        return updatedPost;
    } catch (error) {
        // Rollback nếu có lỗi
        await transaction.rollback();
        throw new Error(`Lỗi khi cập nhật bài viết: ${error.message}`);
    }
};

// Xóa bài viết
export const deletePost = async (documentId, userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const post = await db.Post.findByPk(documentId);

        if (!post) {
            throw new Error('Không tìm thấy bài viết');
        }

        // Kiểm tra quyền xóa
        if (post.user_id !== userId) {
            throw new Error('Bạn không có quyền xóa bài viết này');
        }

        // Xóa các comments liên quan
        await db.Comment.destroy({
            where: { post_id: documentId },
            transaction
        });

        // Xóa các media liên quan
        await db.Media.destroy({
            where: { post_id: documentId },
            transaction
        });

        // Xóa bài viết
        await post.destroy({ transaction });

        // Commit transaction
        await transaction.commit();

        return { message: 'Xóa bài viết thành công' };
    } catch (error) {
        // Rollback nếu có lỗi
        await transaction.rollback();
        throw new Error(`Lỗi khi xóa bài viết: ${error.message}`);
    }
}; 