import express from 'express';
import { AdminAffiliateController } from '../controllers/adminAffiliateController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest, createAffiliateByAdminSchema } from '../utils/validation';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', validateRequest(createAffiliateByAdminSchema), AdminAffiliateController.createAffiliate);
router.get('/', AdminAffiliateController.getAffiliates);
router.patch('/:affiliateId/status', AdminAffiliateController.updateAffiliateStatus);

router.get('/conversions', AdminAffiliateController.getConversions);
router.patch('/conversions/:conversionId/approve', AdminAffiliateController.approveConversion);
router.patch('/conversions/:conversionId/reject', AdminAffiliateController.rejectConversion);

export default router;

