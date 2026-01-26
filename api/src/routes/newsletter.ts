import { Router } from 'express';
import { PublicNewsletterController } from '../controllers/publicNewsletterController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for newsletter subscription (3 per day per IP)
const subscribeLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  message: 'Muitas tentativas de inscrição. Por favor, tente novamente amanhã.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public newsletter routes

// Subscribe to newsletter
router.post('/subscribe', subscribeLimiter, PublicNewsletterController.subscribe);

// Unsubscribe from newsletter
router.post('/unsubscribe', PublicNewsletterController.unsubscribe);

// Check subscription status
router.get('/status/:email', PublicNewsletterController.checkStatus);

export default router;
