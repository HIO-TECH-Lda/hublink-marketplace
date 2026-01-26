import { Router } from 'express';
import { SellerController } from '../controllers/sellerController';

const router = Router();

// Public routes (no authentication required)

// Get top-rated sellers (must be before /:sellerId to avoid route conflict)
router.get('/top', SellerController.getTopSellers);

// Get featured sellers
router.get('/featured', SellerController.getFeaturedSellers);

// Get all sellers with filters
router.get('/', SellerController.getPublicSellers);

// Get seller profile by ID
router.get('/:sellerId', SellerController.getPublicSellerProfile);

// Get seller's products
router.get('/:sellerId/products', SellerController.getSellerProducts);

export default router;
