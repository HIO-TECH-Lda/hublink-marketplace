import express from 'express';
import { ImaliController } from '../controllers/imaliController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate transaction (QR code)
router.post('/generate-transaction', 
  authenticateToken, 
  ImaliController.generateTransaction
);

// Get static QR code for store
router.get('/qrcode/:storeAccountNumber', 
  ImaliController.getStaticQRCode
);

// Generate payment push
router.post('/generate-payment-push', 
  authenticateToken, 
  ImaliController.generatePaymentPush
);

// Check transaction status
router.get('/check-transaction/:transactionId', 
  ImaliController.checkTransactionStatus
);

// Create pay-by-link payment
router.post('/create-pay-by-link', 
  // authenticateToken, 
  ImaliController.createPayByLink
);

export default router;
