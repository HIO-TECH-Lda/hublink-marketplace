import { Router } from 'express';
import { AdminReportsController } from '../controllers/adminReportsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get comprehensive reports
router.get('/', AdminReportsController.getReports);

// Export sales data
router.get('/export/sales', AdminReportsController.exportSales);

// Export products data
router.get('/export/products', AdminReportsController.exportProducts);

export default router;

