import express from 'express'
import * as pageOpenHoursController from '../../controllers/page/page-open-hours'
import verifyToken from '../../middlewares/verify-token'

const router = express.Router()

// Route công khai
router.get('/page/:pageId', pageOpenHoursController.getPageOpenHours)
router.get('/:id', pageOpenHoursController.getPageOpenHour)
router.get('/page/:pageId/day/:dayOfWeek', pageOpenHoursController.getPageOpenHourByDay)

// Route yêu cầu xác thực
router.use(verifyToken)
router.post('/page/:pageId', pageOpenHoursController.addPageOpenHour)
router.put('/:id', pageOpenHoursController.updatePageOpenHour)
router.put('/page/:pageId/day/:dayOfWeek', pageOpenHoursController.upsertPageOpenHour)
router.delete('/:id', pageOpenHoursController.deletePageOpenHour)
router.delete('/page/:pageId/day/:dayOfWeek', pageOpenHoursController.deletePageOpenHourByDay)
router.put('/:id/status', pageOpenHoursController.updatePageOpenHourStatus)

export default router
