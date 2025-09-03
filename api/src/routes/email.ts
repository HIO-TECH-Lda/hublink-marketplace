import express from 'express';
import { EmailController } from '../controllers/emailController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/v1/email/test
 * @desc    Test email service
 * @access  Public (for testing)
 */
router.post('/test', EmailController.testEmailService);

/**
 * @route   GET /api/v1/email/status
 * @desc    Get email service status
 * @access  Public (for testing)
 */
router.get('/status', EmailController.getEmailServiceStatus);

/**
 * @route   POST /api/v1/email/send
 * @desc    Send custom email
 * @access  Admin only
 */
router.post('/send', authenticateToken, authorizeRoles('admin'), EmailController.sendCustomEmail);

/**
 * @route   POST /api/v1/email/welcome
 * @desc    Send welcome email
 * @access  Public (for testing)
 */
router.post('/welcome', EmailController.sendWelcomeEmail);

/**
 * @route   POST /api/v1/email/password-reset
 * @desc    Send password reset email
 * @access  Public (for testing)
 */
router.post('/password-reset', EmailController.sendPasswordResetEmail);

/**
 * @route   POST /api/v1/email/newsletter
 * @desc    Send newsletter email
 * @access  Admin only
 */
router.post('/newsletter', authenticateToken, authorizeRoles('admin'), EmailController.sendNewsletterEmail);

export default router;
