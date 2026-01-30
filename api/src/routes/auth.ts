import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireBuyer, requireSeller, requireAdmin } from '../middleware/auth';
import { uploadAvatar } from '../middleware/upload';
import { 
  validateRequest, 
  registerSchema, 
  loginSchema, 
  changePasswordSchema, 
  updateProfileSchema,
  refreshTokenSchema 
} from '../utils/validation';

const router = Router();

// Normalize FormData body before validation (parse JSON strings, set avatar from file)
const normalizeProfileBody = (req: Request, _res: Response, next: NextFunction) => {
  if ((req as any).file) {
    const file = (req as any).file;
    (req as any).body.avatar = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
  const body = req.body as Record<string, unknown>;
  for (const key of ['billingAddress', 'shippingAddress', 'preferences']) {
    if (typeof body[key] === 'string') {
      try {
        body[key] = JSON.parse(body[key] as string);
      } catch {
        delete body[key];
      }
    }
  }
  next();
};

// Register new user
router.post('/register', validateRequest(registerSchema), AuthController.register);

// Login user
router.post('/login', validateRequest(loginSchema), AuthController.login);

// Refresh token
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refreshToken);

// Get current user profile
router.get('/me', authenticateToken, AuthController.getProfile);

// Update user profile (supports FormData with avatar)
router.put('/me', authenticateToken, uploadAvatar, normalizeProfileBody, validateRequest(updateProfileSchema), AuthController.updateProfile);

// Change password
router.put('/change-password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);

// Forgot password (request reset)
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password (with token)
router.post('/reset-password', AuthController.resetPassword);

// Logout (client-side token removal)
router.post('/logout', authenticateToken, AuthController.logout);

// Test protected route for buyers
router.get('/buyer-test', authenticateToken, requireBuyer, AuthController.buyerTest);

// Test protected route for sellers
router.get('/seller-test', authenticateToken, requireSeller, AuthController.sellerTest);

// Test protected route for admins
router.get('/admin-test', authenticateToken, requireAdmin, AuthController.adminTest);

export default router;
