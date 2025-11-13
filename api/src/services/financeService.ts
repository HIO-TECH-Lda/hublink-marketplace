import SellerFinance, { ISellerFinanceDocument } from '../models/SellerFinance';
import Order from '../models/Order';
import { ISellerFinance, FinanceType, ReportType } from '../types';
import { uploadBase64Image, deleteImage } from '../utils/cloudinary';

const EXPENSE_CATEGORIES = [
  { name: 'Shipping & Delivery', slug: 'shipping-delivery', icon: '🚚', color: '#3B82F6', isDefault: true },
  { name: 'Marketing & Advertising', slug: 'marketing-advertising', icon: '📢', color: '#10B981', isDefault: true },
  { name: 'Product Costs', slug: 'product-costs', icon: '📦', color: '#F59E0B', isDefault: true },
  { name: 'Packaging', slug: 'packaging', icon: '📋', color: '#8B5CF6', isDefault: true },
  { name: 'Utilities', slug: 'utilities', icon: '⚡', color: '#EF4444', isDefault: true },
  { name: 'Rent & Storage', slug: 'rent-storage', icon: '🏢', color: '#06B6D4', isDefault: true },
  { name: 'Professional Services', slug: 'professional-services', icon: '💼', color: '#6366F1', isDefault: true },
  { name: 'Equipment & Tools', slug: 'equipment-tools', icon: '🔧', color: '#EC4899', isDefault: true },
  { name: 'Travel & Transportation', slug: 'travel-transportation', icon: '✈️', color: '#14B8A6', isDefault: true },
  { name: 'Taxes & Fees', slug: 'taxes-fees', icon: '📊', color: '#F97316', isDefault: true },
  { name: 'Other', slug: 'other', icon: '📝', color: '#6B7280', isDefault: true }
];

export interface DashboardData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    activeOrders: number;
    pendingRevenue: number;
  };
  charts: {
    incomeVsExpenses: Array<{ date: string; income: number; expenses: number }>;
    expenseBreakdown: Array<{ category: string; amount: number }>;
    incomeSources: { marketplace: number; manual: number; other: number };
  };
  recentTransactions: {
    income: ISellerFinance[];
    expenses: ISellerFinance[];
  };
}

export interface TransactionListResponse {
  transactions: ISellerFinance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReportData {
  reportType: ReportType;
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    transactionCount: number;
  };
  incomeBreakdown: {
    marketplace: number;
    manual: number;
    other: number;
  };
  expenseBreakdown: Array<{ category: string; amount: number; percentage: number }>;
  transactions: ISellerFinance[];
}

export class FinanceService {
  /**
   * Get expense categories
   */
  static getExpenseCategories() {
    return EXPENSE_CATEGORIES;
  }

  /**
   * Get dashboard data
   */
  static async getDashboard(
    sellerId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      period?: 'today' | 'week' | 'month' | 'year';
    } = {}
  ): Promise<DashboardData> {
    try {
      const { startDate, endDate, period = 'month' } = options;
      
      let dateRange: { start: Date; end: Date };
      if (startDate && endDate) {
        dateRange = { start: startDate, end: endDate };
      } else {
        const now = new Date();
        switch (period) {
          case 'today':
            dateRange = {
              start: new Date(now.setHours(0, 0, 0, 0)),
              end: new Date(now.setHours(23, 59, 59, 999))
            };
            break;
          case 'week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            dateRange = { start: weekStart, end: now };
            break;
          case 'month':
            dateRange = {
              start: new Date(now.getFullYear(), now.getMonth(), 1),
              end: now
            };
            break;
          case 'year':
            dateRange = {
              start: new Date(now.getFullYear(), 0, 1),
              end: now
            };
            break;
          default:
            dateRange = {
              start: new Date(now.getFullYear(), now.getMonth(), 1),
              end: now
            };
        }
      }

      const query: any = {
        sellerId,
        deletedAt: null,
        date: { $gte: dateRange.start, $lte: dateRange.end }
      };

      const [income, expenses, activeOrders] = await Promise.all([
        SellerFinance.find({ ...query, type: 'income' }).lean(),
        SellerFinance.find({ ...query, type: 'expense' }).lean(),
        Order.countDocuments({
          'items.sellerId': sellerId,
          status: { $in: ['pending', 'confirmed', 'processing', 'shipped'] }
        })
      ]);

      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      // Calculate pending revenue from active orders
      const activeOrdersData = await Order.find({
        'items.sellerId': sellerId,
        status: { $in: ['pending', 'confirmed', 'processing', 'shipped'] }
      }).lean();
      const pendingRevenue = activeOrdersData.reduce((sum, order) => {
        const sellerItems = order.items.filter((item: any) => item.sellerId.toString() === sellerId);
        return sum + sellerItems.reduce((itemSum: number, item: any) => itemSum + item.totalPrice, 0);
      }, 0);

      // Income vs Expenses chart data (grouped by date)
      const incomeByDate = new Map<string, number>();
      const expensesByDate = new Map<string, number>();
      
      income.forEach(t => {
        const dateKey = new Date(t.date).toISOString().split('T')[0];
        incomeByDate.set(dateKey, (incomeByDate.get(dateKey) || 0) + t.amount);
      });
      
      expenses.forEach(t => {
        const dateKey = new Date(t.date).toISOString().split('T')[0];
        expensesByDate.set(dateKey, (expensesByDate.get(dateKey) || 0) + t.amount);
      });

      const allDates = Array.from(new Set([...incomeByDate.keys(), ...expensesByDate.keys()])).sort();
      const incomeVsExpenses = allDates.map(date => ({
        date,
        income: incomeByDate.get(date) || 0,
        expenses: expensesByDate.get(date) || 0
      }));

      // Expense breakdown by category
      const expenseByCategory = new Map<string, number>();
      expenses.forEach(t => {
        if (t.category) {
          expenseByCategory.set(t.category, (expenseByCategory.get(t.category) || 0) + t.amount);
        }
      });
      const expenseBreakdown = Array.from(expenseByCategory.entries()).map(([category, amount]) => ({
        category,
        amount
      }));

      // Income sources
      const incomeSources = {
        marketplace: income.filter(t => t.source === 'marketplace').reduce((sum, t) => sum + t.amount, 0),
        manual: income.filter(t => t.source === 'manual').reduce((sum, t) => sum + t.amount, 0),
        other: income.filter(t => t.source === 'other').reduce((sum, t) => sum + t.amount, 0)
      };

      // Recent transactions
      const recentIncome = income.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
      const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      return {
        summary: {
          totalIncome,
          totalExpenses,
          netProfit,
          profitMargin: Math.round(profitMargin * 10) / 10,
          activeOrders,
          pendingRevenue
        },
        charts: {
          incomeVsExpenses,
          expenseBreakdown,
          incomeSources
        },
        recentTransactions: {
          income: recentIncome as ISellerFinance[],
          expenses: recentExpenses as ISellerFinance[]
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transactions
   */
  static async getTransactions(
    sellerId: string,
    options: {
      page?: number;
      limit?: number;
      type?: FinanceType;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<TransactionListResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        category,
        startDate,
        endDate,
        search,
        sortBy = 'date',
        sortOrder = 'desc'
      } = options;

      const query: any = {
        sellerId,
        deletedAt: null
      };

      if (type) query.type = type;
      if (category) query.category = category;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }
      if (search) {
        query.$or = [
          { description: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { vendor: { $regex: search, $options: 'i' } }
        ];
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const transactions = await SellerFinance.find(query)
        .populate('orderId', 'orderNumber')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await SellerFinance.countDocuments(query);

      return {
        transactions: transactions as ISellerFinance[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create manual income entry
   */
  static async createIncome(
    sellerId: string,
    data: {
      amount: number;
      date: Date;
      description: string;
      customerName?: string;
      paymentMethod: string;
      category?: string;
    }
  ): Promise<ISellerFinanceDocument> {
    try {
      const finance = new SellerFinance({
        sellerId,
        type: 'income',
        source: 'manual',
        amount: data.amount,
        currency: 'MZN',
        description: data.description,
        date: data.date,
        paymentMethod: data.paymentMethod,
        customerName: data.customerName,
        category: data.category,
        attachments: [],
        isRecurring: false
      });

      await finance.save();
      return finance;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create expense entry
   */
  static async createExpense(
    sellerId: string,
    data: {
      amount: number;
      date: Date;
      category: string;
      description: string;
      vendor?: string;
      paymentMethod: string;
      isRecurring?: boolean;
      recurringConfig?: any;
    }
  ): Promise<ISellerFinanceDocument> {
    try {
      const finance = new SellerFinance({
        sellerId,
        type: 'expense',
        source: 'manual',
        amount: data.amount,
        currency: 'MZN',
        category: data.category,
        description: data.description,
        date: data.date,
        paymentMethod: data.paymentMethod,
        vendor: data.vendor,
        attachments: [],
        isRecurring: data.isRecurring || false,
        recurringConfig: data.recurringConfig
      });

      await finance.save();
      return finance;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update transaction
   */
  static async updateTransaction(
    transactionId: string,
    sellerId: string,
    data: {
      amount?: number;
      description?: string;
      category?: string;
      date?: Date;
      vendor?: string;
      customerName?: string;
      paymentMethod?: string;
    }
  ): Promise<ISellerFinanceDocument> {
    try {
      const finance = await SellerFinance.findOne({ _id: transactionId, sellerId, deletedAt: null });
      if (!finance) {
        throw new Error('Transaction not found');
      }

      // Cannot update marketplace-synced transactions
      if (finance.source === 'marketplace') {
        throw new Error('Cannot update marketplace-synced transactions');
      }

      if (data.amount !== undefined) finance.amount = data.amount;
      if (data.description !== undefined) finance.description = data.description;
      if (data.category !== undefined) finance.category = data.category;
      if (data.date !== undefined) finance.date = data.date;
      if (data.vendor !== undefined) finance.vendor = data.vendor;
      if (data.customerName !== undefined) finance.customerName = data.customerName;
      if (data.paymentMethod !== undefined) finance.paymentMethod = data.paymentMethod as any;

      await finance.save();
      return finance;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete transaction (soft delete)
   */
  static async deleteTransaction(transactionId: string, sellerId: string): Promise<void> {
    try {
      const finance = await SellerFinance.findOne({ _id: transactionId, sellerId, deletedAt: null });
      if (!finance) {
        throw new Error('Transaction not found');
      }

      // Cannot delete marketplace-synced transactions
      if (finance.source === 'marketplace') {
        throw new Error('Cannot delete marketplace-synced transactions');
      }

      finance.deletedAt = new Date();
      await finance.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(transactionId: string, sellerId: string): Promise<ISellerFinanceDocument | null> {
    try {
      const finance = await SellerFinance.findOne({
        _id: transactionId,
        sellerId,
        deletedAt: null
      })
        .populate('orderId', 'orderNumber items')
        .lean();

      return finance as ISellerFinanceDocument | null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate report
   */
  static async generateReport(
    sellerId: string,
    options: {
      type: ReportType;
      date?: Date;
      week?: Date;
      month?: string;
      year?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<ReportData> {
    try {
      const { type, date, week, month, year, startDate, endDate } = options;

      let periodStart: Date;
      let periodEnd: Date;

      const now = new Date();

      switch (type) {
        case 'daily':
          if (!date) throw new Error('Date is required for daily report');
          periodStart = new Date(date);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd = new Date(date);
          periodEnd.setHours(23, 59, 59, 999);
          break;
        case 'weekly':
          if (!week) throw new Error('Week date is required for weekly report');
          const weekDate = new Date(week);
          const dayOfWeek = weekDate.getDay();
          periodStart = new Date(weekDate);
          periodStart.setDate(weekDate.getDate() - dayOfWeek);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd = new Date(periodStart);
          periodEnd.setDate(periodStart.getDate() + 6);
          periodEnd.setHours(23, 59, 59, 999);
          break;
        case 'monthly':
          if (!month) throw new Error('Month is required for monthly report');
          const [yearStr, monthStr] = month.split('-');
          periodStart = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
          periodEnd = new Date(parseInt(yearStr), parseInt(monthStr), 0, 23, 59, 59, 999);
          break;
        case 'yearly':
          if (!year) throw new Error('Year is required for yearly report');
          periodStart = new Date(parseInt(year), 0, 1);
          periodEnd = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
          break;
        case 'custom':
          if (!startDate || !endDate) throw new Error('Start and end dates are required for custom report');
          periodStart = new Date(startDate);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd = new Date(endDate);
          periodEnd.setHours(23, 59, 59, 999);
          break;
        default:
          throw new Error('Invalid report type');
      }

      const query: any = {
        sellerId,
        deletedAt: null,
        date: { $gte: periodStart, $lte: periodEnd }
      };

      const transactions = await SellerFinance.find(query)
        .populate('orderId', 'orderNumber')
        .sort({ date: -1 })
        .lean();

      const income = transactions.filter(t => t.type === 'income');
      const expenses = transactions.filter(t => t.type === 'expense');

      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      const incomeBreakdown = {
        marketplace: income.filter(t => t.source === 'marketplace').reduce((sum, t) => sum + t.amount, 0),
        manual: income.filter(t => t.source === 'manual').reduce((sum, t) => sum + t.amount, 0),
        other: income.filter(t => t.source === 'other').reduce((sum, t) => sum + t.amount, 0)
      };

      const expenseByCategory = new Map<string, number>();
      expenses.forEach(t => {
        if (t.category) {
          expenseByCategory.set(t.category, (expenseByCategory.get(t.category) || 0) + t.amount);
        }
      });

      const expenseBreakdown = Array.from(expenseByCategory.entries()).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100 * 10) / 10 : 0
      }));

      return {
        reportType: type,
        period: {
          startDate: periodStart,
          endDate: periodEnd
        },
        summary: {
          totalIncome,
          totalExpenses,
          netProfit,
          profitMargin: Math.round(profitMargin * 10) / 10,
          transactionCount: transactions.length
        },
        incomeBreakdown,
        expenseBreakdown,
        transactions: transactions as ISellerFinance[]
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync marketplace sales (create income entries from orders)
   */
  static async syncMarketplaceSales(sellerId: string, orderId: string): Promise<ISellerFinanceDocument | null> {
    try {
      // Check if income entry already exists for this order
      const existing = await SellerFinance.findOne({ sellerId, orderId, deletedAt: null });
      if (existing) {
        return existing;
      }

      const order = await Order.findById(orderId).lean();
      if (!order) {
        throw new Error('Order not found');
      }

      // Get seller's items from the order
      const sellerItems = order.items.filter((item: any) => {
        const itemSellerId = item.sellerId?.toString ? item.sellerId.toString() : item.sellerId;
        return itemSellerId === sellerId;
      });
      if (sellerItems.length === 0) {
        return null; // No items for this seller
      }

      // Calculate total amount for seller's items
      const totalAmount = sellerItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

      // Only create income entry if order is delivered/completed and payment is confirmed
      if (order.status === 'delivered' && order.payment.status === 'completed') {
        const finance = new SellerFinance({
          sellerId,
          type: 'income',
          source: 'marketplace',
          orderId,
          amount: totalAmount,
          currency: order.currency || 'MZN',
          description: `Sale from order ${order.orderNumber}`,
          date: order.deliveredAt || order.updatedAt || new Date(),
          paymentMethod: order.payment.method || 'other',
          attachments: [],
          isRecurring: false
        });

        await finance.save();
        return finance;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync all eligible marketplace sales for a seller
   */
  static async syncAllMarketplaceSales(sellerId: string): Promise<{ synced: number; skipped: number }> {
    try {
      const mongoose = require('mongoose');
      
      // Find all delivered orders with completed payment
      const orders = await Order.find({
        status: 'delivered',
        'payment.status': 'completed'
      }).lean();

      let synced = 0;
      let skipped = 0;

      for (const order of orders) {
        try {
          // Check if this order has items for this seller
          const sellerItems = order.items.filter((item: any) => {
            const itemSellerId = item.sellerId?.toString ? item.sellerId.toString() : item.sellerId;
            return itemSellerId === sellerId;
          });

          if (sellerItems.length === 0) {
            continue; // Skip orders without this seller's items
          }

          const result = await this.syncMarketplaceSales(sellerId, order._id.toString());
          if (result) {
            synced++;
          } else {
            skipped++;
          }
        } catch (error) {
          console.error(`Error syncing order ${order._id}:`, error);
          skipped++;
        }
      }

      return { synced, skipped };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload attachment to transaction
   */
  static async uploadAttachment(
    transactionId: string,
    sellerId: string,
    fileData: { fileName: string; fileSize: number; mimeType: string; base64: string }
  ): Promise<any> {
    try {
      const finance = await SellerFinance.findOne({ _id: transactionId, sellerId, deletedAt: null });
      if (!finance) {
        throw new Error('Transaction not found');
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (fileData.fileSize > maxSize) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Upload to Cloudinary
      const uploaded = await uploadBase64Image(fileData.base64, 'seller-finances/attachments');

      const attachment = {
        fileName: fileData.fileName,
        fileUrl: uploaded.url,
        publicId: uploaded.publicId,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType,
        uploadedAt: new Date()
      };

      finance.attachments.push(attachment);
      await finance.save();

      return attachment;
    } catch (error) {
      throw error;
    }
  }
}

