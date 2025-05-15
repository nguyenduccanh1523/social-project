import express from 'express'
import * as pageOpenHoursController from '../../controllers/page/page-open-hours.js'
import { verifyToken } from '../../middlewares/auth.js'

const router = express.Router()

// Route công khai
router.get('/', pageOpenHoursController.getPageOpenHours)
router.get('/:id', pageOpenHoursController.getPageOpenHour)
router.get('/day/:dayOfWeek', pageOpenHoursController.getPageOpenHourByDay)

// Route yêu cầu xác thực
router.use(verifyToken)
router.post('/', pageOpenHoursController.addPageOpenHour)
router.put('/:id', pageOpenHoursController.updatePageOpenHour)
router.put('/day/:dayOfWeek', pageOpenHoursController.upsertPageOpenHour)
router.delete('/:id', pageOpenHoursController.deletePageOpenHour)
router.delete('/day/:dayOfWeek', pageOpenHoursController.deletePageOpenHourByDay)
router.put('/:id/status', pageOpenHoursController.updatePageOpenHourStatus)

export default router
