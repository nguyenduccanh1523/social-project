import { Op } from 'sequelize';
import db from '../models/index.js';


export const getYearlyStatistics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    // Lấy tổng số lượng của mỗi model trong năm
    const [
      totalPages,
      totalLivestreams,
      totalEvents,
      totalGroups,
      totalDocuments,
      totalConversations
    ] = await Promise.all([
      db.Page.count({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      }),
      db.Livestream.count({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      }),
      db.Event.count({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      }),
      db.Group.count({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      }),
      db.DocumentShare.count({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      }),
      db.Conversation.count({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear]
          }
        }
      })
    ]);

    // Tính tổng số lượng
    const total = totalPages + totalLivestreams + totalEvents + totalGroups + totalDocuments + totalConversations;

    // Tính phần trăm cho mỗi loại
    const statistics = {
      pages: {
        count: totalPages,
        percentage: totalPages > 0 ? ((totalPages / total) * 100).toFixed(2) : 0
      },
      livestreams: {
        count: totalLivestreams,
        percentage: totalLivestreams > 0 ? ((totalLivestreams / total) * 100).toFixed(2) : 0
      },
      events: {
        count: totalEvents,
        percentage: totalEvents > 0 ? ((totalEvents / total) * 100).toFixed(2) : 0
      },
      groups: {
        count: totalGroups,
        percentage: totalGroups > 0 ? ((totalGroups / total) * 100).toFixed(2) : 0
      },
      documents: {
        count: totalDocuments,
        percentage: totalDocuments > 0 ? ((totalDocuments / total) * 100).toFixed(2) : 0
      },
      conversations: {
        count: totalConversations,
        percentage: totalConversations > 0 ? ((totalConversations / total) * 100).toFixed(2) : 0
      },
      total: total
    };

    return res.status(200).json({
      success: true,
      data: statistics,
      year: currentYear
    });

  } catch (error) {
    console.error('Error in getYearlyStatistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: error.message
    });
  }
}; 