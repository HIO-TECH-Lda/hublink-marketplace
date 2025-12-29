import express from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All dashboard routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard stats
router.get('/', DashboardController.getDashboard);

export default router;

