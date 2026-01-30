import { Router } from 'express';
import { ContactController } from '../controllers/contactController';
import rateLimit from 'express-rate-limit';
import Messages from '../utils/messages';

const router = Router();

// Rate limiter for contact form (5 submissions per hour per IP)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: Messages.CONTACT.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
});

// Submit contact form (public)
router.post('/', contactLimiter, ContactController.submitContactForm);

export default router;
