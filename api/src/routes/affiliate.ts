import express from 'express';
import { AffiliateController } from '../controllers/affiliateController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateRequest, applyAffiliateSchema } from '../utils/validation';

const router = express.Router();

// Public tracking endpoint
router.get('/track/:code', optionalAuth, AffiliateController.track);

// Authenticated affiliate endpoints
router.post('/apply', authenticateToken, validateRequest(applyAffiliateSchema), AffiliateController.apply);
router.get('/me', authenticateToken, AffiliateController.getMe);
router.get('/me/dashboard', authenticateToken, AffiliateController.getMyDashboard);
router.get('/me/conversions', authenticateToken, AffiliateController.getMyConversions);

export default router;

