import db from '../../models';
import { Op } from 'sequelize';



// Lấy tất cả giờ mở cửa của trang
export const getPageOpenHours = async (pageId) => {
    try {
        const openHours = await db.PageOpenHour.findAll({
            where: { page_id: pageId },
            order: [
                [
                    db.sequelize.literal(`CASE day_of_week 
                    WHEN 'Monday' THEN 1 
                    WHEN 'Tuesday' THEN 2 
                    WHEN 'Wednesday' THEN 3 
                    WHEN 'Thursday' THEN 4 
                    WHEN 'Friday' THEN 5 
                    WHEN 'Saturday' THEN 6 
                    WHEN 'Sunday' THEN 7 
                    WHEN 'Weekday' THEN 8 
                    WHEN 'Weekend' THEN 9 
                    END`),
                    'ASC'
                ]
            ]
        });

        return openHours;
    } catch (error) {
        throw new Error(`Lỗi khi lấy giờ mở cửa: ${error.message}`);
    }
};

// Lấy chi tiết giờ mở cửa
export const getPageOpenHourById = async (documentId) => {
    try {
        const openHour = await db.PageOpenHour.findByPk(documentId, {
            include: [
                {
                    model: db.Page,
                    as: 'page',
                    attributes: ['documentId', 'page_name']
                }
            ]
        });

        if (!openHour) {
            throw new Error('Không tìm thấy giờ mở cửa');
        }

        return openHour;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin giờ mở cửa: ${error.message}`);
    }
};

// Lấy giờ mở cửa theo ngày
export const getPageOpenHourByDay = async (pageId, dayOfWeek) => {
    try {
        const openHour = await db.PageOpenHour.findOne({
            where: {
                page_id: pageId,
                day_of_week: dayOfWeek
            }
        });

        return openHour;
    } catch (error) {
        throw new Error(`Lỗi khi kiểm tra giờ mở cửa: ${error.message}`);
    }
};

// Thêm giờ mở cửa mới
export const addPageOpenHour = async (openHourData) => {
    try {
        // Kiểm tra xem đã tồn tại giờ mở cửa cho ngày này chưa
        const existingOpenHour = await db.PageOpenHour.findOne({
            where: {
                page_id: openHourData.page_id,
                day_of_week: openHourData.day_of_week
            }
        });

        if (existingOpenHour) {
            throw new Error(`Đã tồn tại giờ mở cửa cho ngày ${openHourData.day_of_week}`);
        }

        const newOpenHour = await db.PageOpenHour.create(openHourData);
        return await getPageOpenHourById(newOpenHour.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi thêm giờ mở cửa mới: ${error.message}`);
    }
};

// Cập nhật giờ mở cửa
export const updatePageOpenHour = async (documentId, openHourData) => {
    try {
        const openHour = await db.PageOpenHour.findByPk(documentId);

        if (!openHour) {
            throw new Error('Không tìm thấy giờ mở cửa');
        }

        // Nếu cập nhật ngày trong tuần, kiểm tra xem đã tồn tại chưa
        if (openHourData.day_of_week && openHourData.day_of_week !== openHour.day_of_week) {
            const existingOpenHour = await db.PageOpenHour.findOne({
                where: {
                    page_id: openHour.page_id,
                    day_of_week: openHourData.day_of_week
                }
            });

            if (existingOpenHour) {
                throw new Error(`Đã tồn tại giờ mở cửa cho ngày ${openHourData.day_of_week}`);
            }
        }

        await openHour.update(openHourData);
        return await getPageOpenHourById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật giờ mở cửa: ${error.message}`);
    }
};

// Cập nhật hoặc tạo mới giờ mở cửa
export const upsertPageOpenHour = async (pageId, dayOfWeek, openHourData) => {
    try {
        const [openHour, created] = await db.PageOpenHour.findOrCreate({
            where: {
                page_id: pageId,
                day_of_week: dayOfWeek
            },
            defaults: {
                ...openHourData,
                page_id: pageId,
                day_of_week: dayOfWeek
            }
        });

        if (!created) {
            await openHour.update(openHourData);
        }

        return await getPageOpenHourById(openHour.documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật/tạo mới giờ mở cửa: ${error.message}`);
    }
};

// Xóa giờ mở cửa
export const deletePageOpenHour = async (documentId) => {
    try {
        const openHour = await db.PageOpenHour.findByPk(documentId);

        if (!openHour) {
            throw new Error('Không tìm thấy giờ mở cửa');
        }

        await openHour.destroy();
        return { message: 'Xóa giờ mở cửa thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa giờ mở cửa: ${error.message}`);
    }
};

// Xóa giờ mở cửa theo ngày
export const deletePageOpenHourByDay = async (pageId, dayOfWeek) => {
    try {
        const openHour = await db.PageOpenHour.findOne({
            where: {
                page_id: pageId,
                day_of_week: dayOfWeek
            }
        });

        if (!openHour) {
            throw new Error(`Không tìm thấy giờ mở cửa cho ngày ${dayOfWeek}`);
        }

        await openHour.destroy();
        return { message: `Xóa giờ mở cửa cho ngày ${dayOfWeek} thành công` };
    } catch (error) {
        throw new Error(`Lỗi khi xóa giờ mở cửa: ${error.message}`);
    }
};

// Cập nhật trạng thái giờ mở cửa (mở/đóng)
export const updatePageOpenHourStatus = async (documentId, status) => {
    try {
        const openHour = await db.PageOpenHour.findByPk(documentId);

        if (!openHour) {
            throw new Error('Không tìm thấy giờ mở cửa');
        }

        await openHour.update({ status });
        return await getPageOpenHourById(documentId);
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật trạng thái giờ mở cửa: ${error.message}`);
    }
}; 