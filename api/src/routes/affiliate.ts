import express from 'express';
import { AffiliateController } from '../controllers/affiliateController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public tracking endpoint
router.get('/track/:code', optionalAuth, AffiliateController.track);

// Authenticated affiliate endpoints
router.get('/me', authenticateToken, AffiliateController.getMe);
router.get('/me/dashboard', authenticateToken, AffiliateController.getMyDashboard);
router.get('/me/conversions', authenticateToken, AffiliateController.getMyConversions);

export default router;

