import * as pageOpenHourService from '../../services/page/page-open-hours.service.js';
import * as pageService from '../../services/page/page.service.js';
import * as pageMemberService from '../../services/page/page-member.service.js';

// Lấy tất cả giờ mở cửa của trang
export const getPageOpenHours = async (req, res) => {
    try {
        const { pageId } = req.params;
        const openHours = await pageOpenHourService.getPageOpenHours(pageId);
        return res.status(200).json(openHours);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Lấy chi tiết giờ mở cửa
export const getPageOpenHour = async (req, res) => {
    try {
        const { id } = req.params;
        const openHour = await pageOpenHourService.getPageOpenHourById(id);
        return res.status(200).json(openHour);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Lấy giờ mở cửa theo ngày
export const getPageOpenHourByDay = async (req, res) => {
    try {
        const { pageId, dayOfWeek } = req.params;
        const openHour = await pageOpenHourService.getPageOpenHourByDay(pageId, dayOfWeek);
        
        if (!openHour) {
            return res.status(404).json({
                message: `Không tìm thấy giờ mở cửa cho ngày ${dayOfWeek}`
            });
        }
        
        return res.status(200).json(openHour);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Thêm giờ mở cửa mới
export const addPageOpenHour = async (req, res) => {
    try {

        
        // // Kiểm tra quyền (chỉ người tạo trang hoặc admin mới được thêm giờ mở cửa)
        // const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        // const page = await pageService.getPageById(pageId);
        
        // if (page.author !== user.documentId && !isAdmin) {
        //     return res.status(StatusCodes.FORBIDDEN).json({
        //         message: 'Bạn không có quyền thêm giờ mở cửa cho trang này'
        //     });
        // }
        
        const openHourData = {
            ...req.body,
        };
        
        const newOpenHour = await pageOpenHourService.addPageOpenHour(openHourData);
        return res.status(200).json(newOpenHour);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Cập nhật giờ mở cửa
export const updatePageOpenHour = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        
        // Lấy thông tin giờ mở cửa
        const openHour = await pageOpenHourService.getPageOpenHourById(id);
        
        // Kiểm tra quyền (chỉ người tạo trang hoặc admin mới được cập nhật giờ mở cửa)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, openHour.page_id);
        const page = await pageService.getPageById(openHour.page_id);
        
        if (page.author !== user.documentId && !isAdmin) {
            return res.status(403).json({
                message: 'Bạn không có quyền cập nhật giờ mở cửa cho trang này'
            });
        }
        
        const updatedOpenHour = await pageOpenHourService.updatePageOpenHour(id, req.body);
        return res.status(200).json(updatedOpenHour);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Cập nhật hoặc tạo mới giờ mở cửa
export const upsertPageOpenHour = async (req, res) => {
    try {
        const { pageId, dayOfWeek } = req.params;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ người tạo trang hoặc admin mới được cập nhật giờ mở cửa)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        const page = await pageService.getPageById(pageId);
        
        if (page.author !== user.documentId && !isAdmin) {
            return res.status(403).json({
                message: 'Bạn không có quyền cập nhật giờ mở cửa cho trang này'
            });
        }
        
        const openHourData = req.body;
        
        const updatedOpenHour = await pageOpenHourService.upsertPageOpenHour(pageId, dayOfWeek, openHourData);
        return res.status(200).json(updatedOpenHour);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Xóa giờ mở cửa
export const deletePageOpenHour = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        
        // Lấy thông tin giờ mở cửa
        const openHour = await pageOpenHourService.getPageOpenHourById(id);
        
        // Kiểm tra quyền (chỉ người tạo trang hoặc admin mới được xóa giờ mở cửa)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, openHour.page_id);
        const page = await pageService.getPageById(openHour.page_id);
        
        if (page.author !== user.documentId && !isAdmin) {
            return res.status(403).json({
                message: 'Bạn không có quyền xóa giờ mở cửa của trang này'
            });
        }
        
        const result = await pageOpenHourService.deletePageOpenHour(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Xóa giờ mở cửa theo ngày
export const deletePageOpenHourByDay = async (req, res) => {
    try {
        const { pageId, dayOfWeek } = req.params;
        const { user } = req;
        
        // Kiểm tra quyền (chỉ người tạo trang hoặc admin mới được xóa giờ mở cửa)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, pageId);
        const page = await pageService.getPageById(pageId);
        
        if (page.author !== user.documentId && !isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Bạn không có quyền xóa giờ mở cửa của trang này'
            });
        }
        
        const result = await pageOpenHourService.deletePageOpenHourByDay(pageId, dayOfWeek);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// Cập nhật trạng thái giờ mở cửa (mở/đóng)
export const updatePageOpenHourStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { user } = req;
        
        // Lấy thông tin giờ mở cửa
        const openHour = await pageOpenHourService.getPageOpenHourById(id);
        
        // Kiểm tra quyền (chỉ người tạo trang hoặc admin mới được cập nhật trạng thái)
        const isAdmin = await pageMemberService.isPageAdmin(user.documentId, openHour.page_id);
        const page = await pageService.getPageById(openHour.page_id);
        
        if (page.author !== user.documentId && !isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Bạn không có quyền cập nhật trạng thái giờ mở cửa'
            });
        }
        
        const updatedOpenHour = await pageOpenHourService.updatePageOpenHourStatus(id, status);
        return res.status(StatusCodes.OK).json(updatedOpenHour);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}; 