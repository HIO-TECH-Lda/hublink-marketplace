import * as express from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// Wrapper functions to handle type conversion
const wrapHandler = (handler: (req: AuthenticatedRequest, res: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return handler(req as unknown as AuthenticatedRequest, res);
  };
};

/**
 * @route   GET /api/v1/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', authenticateToken, wrapHandler(WishlistController.getUserWishlist));

/**
 * @route   POST /api/v1/wishlist/add
 * @desc    Add product to wishlist
 * @access  Private
 */
router.post('/add', authenticateToken, wrapHandler(WishlistController.addToWishlist));

/**
 * @route   DELETE /api/v1/wishlist/remove/:productId
 * @desc    Remove product from wishlist
 * @access  Private
 */
router.delete('/remove/:productId', authenticateToken, wrapHandler(WishlistController.removeFromWishlist));

/**
 * @route   GET /api/v1/wishlist/check/:productId
 * @desc    Check if product is in wishlist
 * @access  Private
 */
router.get('/check/:productId', authenticateToken, wrapHandler(WishlistController.checkWishlistStatus));

/**
 * @route   DELETE /api/v1/wishlist/clear
 * @desc    Clear user's wishlist
 * @access  Private
 */
router.delete('/clear', authenticateToken, wrapHandler(WishlistController.clearWishlist));

/**
 * @route   POST /api/v1/wishlist/move-to-cart/:productId
 * @desc    Move item from wishlist to cart
 * @access  Private
 */
router.post('/move-to-cart/:productId', authenticateToken, wrapHandler(WishlistController.moveToCart));

/**
 * @route   GET /api/v1/wishlist/stats
 * @desc    Get wishlist statistics
 * @access  Private
 */
router.get('/stats', authenticateToken, wrapHandler(WishlistController.getWishlistStats));

/**
 * @route   GET /api/v1/wishlist/items
 * @desc    Get wishlist items with pagination
 * @access  Private
 */
router.get('/items', authenticateToken, wrapHandler(WishlistController.getWishlistItems));

/**
 * @route   PUT /api/v1/wishlist/update-notes/:productId
 * @desc    Update wishlist item notes
 * @access  Private
 */
router.put('/update-notes/:productId', authenticateToken, wrapHandler(WishlistController.updateItemNotes));

/**
 * @route   GET /api/v1/wishlist/recommendations
 * @desc    Get wishlist recommendations
 * @access  Private
 */
router.get('/recommendations', authenticateToken, wrapHandler(WishlistController.getRecommendations));

/**
 * @route   POST /api/v1/wishlist/bulk-add
 * @desc    Bulk add products to wishlist
 * @access  Private
 */
router.post('/bulk-add', authenticateToken, wrapHandler(WishlistController.bulkAddToWishlist));

/**
 * @route   DELETE /api/v1/wishlist/bulk-remove
 * @desc    Bulk remove products from wishlist
 * @access  Private
 */
router.delete('/bulk-remove', authenticateToken, wrapHandler(WishlistController.bulkRemoveFromWishlist));

export default router;
