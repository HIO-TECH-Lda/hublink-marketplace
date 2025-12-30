import express from 'express';
import { AdminUserController } from '../controllers/adminUserController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get user statistics
router.get('/stats', AdminUserController.getUserStats);

// Get sellers list for dropdown
router.get('/sellers', AdminUserController.getSellers);

// Get all users with filters
router.get('/', AdminUserController.getUsers);

// Get user by ID
router.get('/:userId', AdminUserController.getUserById);

// Create new user
router.post('/', AdminUserController.createUser);

// Update user
router.put('/:userId', AdminUserController.updateUser);

// Update user status
router.patch('/:userId/status', AdminUserController.updateUserStatus);

// Delete user
router.delete('/:userId', AdminUserController.deleteUser);

export default router;

