import { Router } from 'express';
import { AdminAuditLogController } from '../controllers/adminAuditLogController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get audit logs with filters
router.get('/', AdminAuditLogController.getLogs);

// Get audit log statistics
router.get('/statistics', AdminAuditLogController.getStatistics);

export default router;

