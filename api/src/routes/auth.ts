import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireBuyer, requireSeller, requireAdmin } from '../middleware/auth';
import { 
  validateRequest, 
  registerSchema, 
  loginSchema, 
  changePasswordSchema, 
  updateProfileSchema,
  refreshTokenSchema 
} from '../utils/validation';

const router = Router();

// Register new user
router.post('/register', validateRequest(registerSchema), AuthController.register);

// Login user
router.post('/login', validateRequest(loginSchema), AuthController.login);

// Refresh token
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refreshToken);

// Get current user profile
router.get('/me', authenticateToken, AuthController.getProfile);

// Update user profile
router.put('/me', authenticateToken, validateRequest(updateProfileSchema), AuthController.updateProfile);

// Change password
router.put('/change-password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);

// Logout (client-side token removal)
router.post('/logout', authenticateToken, AuthController.logout);

// Test protected route for buyers
router.get('/buyer-test', authenticateToken, requireBuyer, AuthController.buyerTest);

// Test protected route for sellers
router.get('/seller-test', authenticateToken, requireSeller, AuthController.sellerTest);

// Test protected route for admins
router.get('/admin-test', authenticateToken, requireAdmin, AuthController.adminTest);

export default router;
