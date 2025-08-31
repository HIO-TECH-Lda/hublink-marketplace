import { Wishlist, IWishlistDocument } from '../models/Wishlist';
import Product from '../models/Product';
import Cart from '../models/Cart';
import { IWishlist, IWishlistItem, IProduct, ICartItem } from '../types';
import mongoose from 'mongoose';

export class WishlistService {
  /**
   * Get user's wishlist with populated product details
   */
  static async getUserWishlist(userId: string): Promise<IWishlist & { products?: IProduct[] }> {
    try {
      const wishlist = await (Wishlist as any).getOrCreateWishlist(userId);
      
      // Populate product details
      const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate({
          path: 'items.productId',
          select: 'name description price originalPrice discountPercentage primaryImage stock status sellerName averageRating totalReviews slug'
        })
        .lean();

      return populatedWishlist as IWishlist & { products?: IProduct[] };
    } catch (error: any) {
      throw new Error(`Failed to get wishlist: ${error.message}`);
    }
  }

  /**
   * Add product to wishlist
   */
  static async addToWishlist(userId: string, productId: string, notes?: string): Promise<IWishlist> {
    try {
      // Validate product exists
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.status !== 'active') {
        throw new Error('Product is not available');
      }

      const wishlist = await (Wishlist as any).getOrCreateWishlist(userId);
      await wishlist.addItem(productId, notes);

      return wishlist;
    } catch (error: any) {
      throw new Error(`Failed to add to wishlist: ${error.message}`);
    }
  }

  /**
   * Remove product from wishlist
   */
  static async removeFromWishlist(userId: string, productId: string): Promise<void> {
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        throw new Error('Wishlist not found');
      }

      await (wishlist as any).removeItem(productId);
    } catch (error: any) {
      throw new Error(`Failed to remove from wishlist: ${error.message}`);
    }
  }

  /**
   * Check if product is in user's wishlist
   */
  static async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        return false;
      }

      return (wishlist as any).hasItem(productId);
    } catch (error: any) {
      throw new Error(`Failed to check wishlist status: ${error.message}`);
    }
  }

  /**
   * Clear user's wishlist
   */
  static async clearWishlist(userId: string): Promise<void> {
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        throw new Error('Wishlist not found');
      }

      await (wishlist as any).clearWishlist();
    } catch (error: any) {
      throw new Error(`Failed to clear wishlist: ${error.message}`);
    }
  }

  /**
   * Move item from wishlist to cart
   */
  static async moveToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get wishlist
      const wishlist = await Wishlist.findOne({ userId }).session(session);
      if (!wishlist) {
        throw new Error('Wishlist not found');
      }

      // Get product details
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.status !== 'active') {
        throw new Error('Product is not available');
      }

      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      // Move item from wishlist to cart
      const wishlistItem = await (wishlist as any).moveToCart(productId);

      // Get or create cart
      let cart = await Cart.findOne({ userId }).session(session);
      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
          totalItems: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          currency: 'USD',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
      }

      // Check if product already exists in cart
      const existingCartItem = cart.items.find((item: any) => 
        item.productId.toString() === productId
      );

      if (existingCartItem) {
        // Update quantity
        existingCartItem.quantity += quantity;
        existingCartItem.totalPrice = existingCartItem.quantity * existingCartItem.unitPrice;
      } else {
        // Add new item to cart
        const cartItem = {
          productId: product._id,
          productName: product.name,
          productImage: product.primaryImage,
          productSlug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
          sellerId: product.sellerId as any,
          sellerName: product.sellerName,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity,
          isAvailable: product.stock > 0,
          stockAvailable: product.stock,
          addedAt: new Date()
        };

        cart.items.push(cartItem);
      }

      // Recalculate cart totals
      cart.totalItems = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
      cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;

      await cart.save({ session });

      await session.commitTransaction();
    } catch (error: any) {
      await session.abortTransaction();
      throw new Error(`Failed to move to cart: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  /**
   * Get wishlist statistics
   */
  static async getWishlistStats(userId: string): Promise<{
    totalItems: number;
    totalValue: number;
    averagePrice: number;
    categories: string[];
  }> {
    try {
      const wishlist = await Wishlist.findOne({ userId })
        .populate({
          path: 'items.productId',
          select: 'price categoryId'
        })
        .lean();

      if (!wishlist) {
        return {
          totalItems: 0,
          totalValue: 0,
          averagePrice: 0,
          categories: []
        };
      }

      const totalItems = wishlist.items.length;
      const totalValue = wishlist.items.reduce((sum: number, item: any) => {
        const product = item.productId as any;
        return sum + (product?.price || 0);
      }, 0);
      const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;
      const categories = Array.from(new Set(wishlist.items.map((item: any) => {
        const product = item.productId as any;
        return product?.categoryId?.toString();
      }).filter(Boolean)));

      return {
        totalItems,
        totalValue,
        averagePrice,
        categories
      };
    } catch (error: any) {
      throw new Error(`Failed to get wishlist stats: ${error.message}`);
    }
  }

  /**
   * Get wishlist items with product details
   */
  static async getWishlistItems(userId: string, page: number = 1, limit: number = 10): Promise<{
    items: IWishlistItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const wishlist = await Wishlist.findOne({ userId })
        .populate({
          path: 'items.productId',
          select: 'name description price originalPrice discountPercentage primaryImage stock status sellerName averageRating totalReviews slug'
        })
        .lean();

      if (!wishlist) {
        return {
          items: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        };
      }

      const total = wishlist.items.length;
      const pages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = wishlist.items.slice(startIndex, endIndex);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to get wishlist items: ${error.message}`);
    }
  }

  /**
   * Update wishlist item notes
   */
  static async updateItemNotes(userId: string, productId: string, notes: string): Promise<void> {
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        throw new Error('Wishlist not found');
      }

      const item = wishlist.items.find((item: any) => 
        item.productId.toString() === productId
      );

      if (!item) {
        throw new Error('Item not found in wishlist');
      }

      item.notes = notes;
      wishlist.updatedAt = new Date();
      await wishlist.save();
    } catch (error: any) {
      throw new Error(`Failed to update item notes: ${error.message}`);
    }
  }

  /**
   * Get wishlist recommendations based on wishlist items
   */
  static async getRecommendations(userId: string, limit: number = 10): Promise<IProduct[]> {
    try {
      const wishlist = await Wishlist.findOne({ userId })
        .populate({
          path: 'items.productId',
          select: 'categoryId tags'
        })
        .lean();

      if (!wishlist || wishlist.items.length === 0) {
        // Return trending products if no wishlist items
        return await Product.find({ status: 'active' })
          .sort({ viewCount: -1, averageRating: -1 })
          .limit(limit)
          .select('name description price primaryImage averageRating totalReviews slug')
          .lean();
      }

      // Get categories and tags from wishlist items
      const categories = wishlist.items.map((item: any) => {
        const product = item.productId as any;
        return product?.categoryId;
      }).filter(Boolean);

      const tags = wishlist.items.flatMap((item: any) => {
        const product = item.productId as any;
        return product?.tags || [];
      });

      // Find similar products
      const recommendations = await Product.find({
        status: 'active',
        _id: { $nin: wishlist.items.map((item: any) => item.productId) },
        $or: [
          { categoryId: { $in: categories } },
          { tags: { $in: tags } }
        ]
      })
        .sort({ averageRating: -1, viewCount: -1 })
        .limit(limit)
        .select('name description price primaryImage averageRating totalReviews slug categoryId tags')
        .lean();

      return recommendations;
    } catch (error: any) {
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }
}
