import express from 'express';
import db from '../models/index.js';
import { Sequelize } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { query, page = 1, limit = 10, type } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const offset = (page - 1) * limit;

    // Tìm kiếm Users
    const users = await db.User.findAndCountAll({
      where: {
        [Sequelize.Op.or]: [
          { fullname: { [Sequelize.Op.like]: `%${query}%` } },
          { username: { [Sequelize.Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['documentId', 'fullname', 'username', 'avatar_id', 'cover_photo_id'],
      include: [
        {
          model: db.Media,
          as: 'avatarMedia',
          attributes: ['documentId', 'file_path']
        },
        {
          model: db.Media,
          as: 'coverPhotoMedia',
          attributes: ['documentId', 'file_path']
        }
      ],
      ...(type === 'user' ? { limit, offset } : {})
    });

    // Tìm kiếm Groups
    const groups = await db.Group.findAndCountAll({
      where: {
        group_name: { [Sequelize.Op.like]: `%${query}%` }
      },
      attributes: ['documentId', 'group_name', 'group_image', 'description'],
      include: [
        {
          model: db.Media,
          as: 'image',
          attributes: ['documentId', 'file_path']
        }
      ],
      ...(type === 'group' ? { limit, offset } : {})
    });

    // Tìm kiếm Pages
    const pages = await db.Page.findAndCountAll({
      where: {
        page_name: { [Sequelize.Op.like]: `%${query}%` }
      },
      attributes: ['documentId', 'page_name', 'profile_picture', 'cover_picture', 'intro'],
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
        }
      ],
      ...(type === 'page' ? { limit, offset } : {})
    });

    // Tìm kiếm Events
    const events = await db.Event.findAndCountAll({
      where: {
        name: { [Sequelize.Op.like]: `%${query}%` }
      },
      attributes: ['documentId', 'name', 'event_image', 'description', 'start_time', 'end_time', 'location'],
      include: [
        {
          model: db.Media,
          as: 'image',
          attributes: ['documentId', 'file_path']
        }
      ],
      ...(type === 'event' ? { limit, offset } : {})
    });

    // Tìm kiếm Posts
    const posts = await db.Post.findAndCountAll({
      where: {
        content: { [Sequelize.Op.like]: `%${query}%` }
      },
      attributes: ['documentId', 'content', 'created_at', 'type'],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['documentId', 'fullname', 'username', 'avatar_id'],
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
          as: 'medias',
          attributes: ['documentId', 'file_path']
        }
      ],
      ...(type === 'post' ? { limit, offset } : {})
    });

    // Nếu có type, chỉ trả về kết quả của type đó
    if (type) {
      let result;
      switch (type) {
        case 'user':
          result = {
            total: users.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(users.count / limit),
            data: users.rows.map(user => ({
              ...user.toJSON(),
              type: 'user',
              avatar: user.avatarMedia,
              coverPhoto: user.coverPhotoMedia
            }))
          };
          break;
        case 'group':
          result = {
            total: groups.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(groups.count / limit),
            data: groups.rows.map(group => ({
              ...group.toJSON(),
              type: 'group',
              image: group.image
            }))
          };
          break;
        case 'page':
          result = {
            total: pages.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(pages.count / limit),
            data: pages.rows.map(page => ({
              ...page.toJSON(),
              type: 'page',
              profileImage: page.profileImage,
              coverImage: page.coverImage
            }))
          };
          break;
        case 'event':
          result = {
            total: events.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(events.count / limit),
            data: events.rows.map(event => ({
              ...event.toJSON(),
              type: 'event',
              image: event.image
            }))
          };
          break;
        case 'post':
          result = {
            total: posts.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(posts.count / limit),
            data: posts.rows.map(post => ({
              ...post.toJSON(),
              type: 'post',
              user: post.user ? {
                ...post.user.toJSON(),
                avatar: post.user.avatarMedia
              } : null,
              medias: post.medias || []
            }))
          };
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Loại tìm kiếm không hợp lệ'
          });
      }

      return res.status(200).json({
        success: true,
        data: result
      });
    }

    // Nếu không có type, trả về tất cả kết quả
    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: users.count,
          data: users.rows.map(user => ({
            ...user.toJSON(),
            type: 'user',
            avatar: user.avatarMedia,
            coverPhoto: user.coverPhotoMedia
          }))
        },
        groups: {
          total: groups.count,
          data: groups.rows.map(group => ({
            ...group.toJSON(),
            type: 'group',
            image: group.image
          }))
        },
        pages: {
          total: pages.count,
          data: pages.rows.map(page => ({
            ...page.toJSON(),
            type: 'page',
            profileImage: page.profileImage,
            coverImage: page.coverImage
          }))
        },
        events: {
          total: events.count,
          data: events.rows.map(event => ({
            ...event.toJSON(),
            type: 'event',
            image: event.image
          }))
        },
        posts: {
          total: posts.count,
          data: posts.rows.map(post => ({
            ...post.toJSON(),
            type: 'post',
            user: post.user ? {
              ...post.user.toJSON(),
              avatar: post.user.avatarMedia
            } : null,
            medias: post.medias || []
          }))
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

export default router; 