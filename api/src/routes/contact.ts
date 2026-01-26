import { Router } from 'express';
import { ContactController } from '../controllers/contactController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for contact form (5 submissions per hour per IP)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Muitas mensagens enviadas. Por favor, tente novamente em 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Submit contact form (public)
router.post('/', contactLimiter, ContactController.submitContactForm);

export default router;
