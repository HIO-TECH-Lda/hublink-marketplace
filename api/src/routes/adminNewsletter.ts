import { Router } from 'express';
import { AdminNewsletterController } from '../controllers/adminNewsletterController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get newsletter statistics
router.get('/stats', AdminNewsletterController.getNewsletterStats);

// ==================== SUBSCRIBER ROUTES ====================

// Get all subscribers
router.get('/subscribers', AdminNewsletterController.getSubscribers);

// Get subscriber by ID
router.get('/subscribers/:subscriberId', AdminNewsletterController.getSubscriberById);

// Create subscriber
router.post('/subscribers', AdminNewsletterController.createSubscriber);

// Update subscriber
router.put('/subscribers/:subscriberId', AdminNewsletterController.updateSubscriber);

// Update subscriber status
router.patch('/subscribers/:subscriberId/status', AdminNewsletterController.updateSubscriberStatus);

// Delete subscriber
router.delete('/subscribers/:subscriberId', AdminNewsletterController.deleteSubscriber);

// ==================== CAMPAIGN ROUTES ====================

// Get all campaigns
router.get('/campaigns', AdminNewsletterController.getCampaigns);

// Get campaign by ID
router.get('/campaigns/:campaignId', AdminNewsletterController.getCampaignById);

// Create campaign
router.post('/campaigns', AdminNewsletterController.createCampaign);

// Update campaign
router.put('/campaigns/:campaignId', AdminNewsletterController.updateCampaign);

// Update campaign status
router.patch('/campaigns/:campaignId/status', AdminNewsletterController.updateCampaignStatus);

// Delete campaign
router.delete('/campaigns/:campaignId', AdminNewsletterController.deleteCampaign);

export default router;

