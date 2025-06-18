import express from 'express';
import { getYearlyStatistics } from '../controllers/statistics.controller.js';

const router = express.Router();

router.get('/yearly', getYearlyStatistics);

export default router; 