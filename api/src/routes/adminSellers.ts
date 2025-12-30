import { Router } from 'express';
import { AdminSellerController } from '../controllers/adminSellerController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get seller statistics
router.get('/stats', AdminSellerController.getSellerStats);

// Get all sellers with filters
router.get('/', AdminSellerController.getSellers);

// Get seller by ID
router.get('/:sellerId', AdminSellerController.getSellerById);

// Update seller status (approve/reject)
router.patch('/:sellerId/status', AdminSellerController.updateSellerStatus);

export default router;

