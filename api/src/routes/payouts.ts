import express from 'express';
import { PayoutController } from '../controllers/payoutController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest, requestPayoutSchema } from '../utils/validation';

const router = express.Router();

// All payout routes require seller authentication
router.use(authenticateToken);
router.use(authorizeRoles('seller'));

// Get seller balance
router.get('/balance', PayoutController.getBalance);

// Get payout history
router.get('/history', PayoutController.getHistory);

// Request payout
router.post('/request', validateRequest(requestPayoutSchema), PayoutController.requestPayout);

// Get payout by ID
router.get('/:payoutId', PayoutController.getPayoutById);

export default router;

