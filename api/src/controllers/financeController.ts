import { Request, Response } from 'express';
import { FinanceService } from '../services/financeService';

export class FinanceController {
  /**
   * Get financial dashboard
   */
  static async getDashboard(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { startDate, endDate, period } = req.query;

      const result = await FinanceService.getDashboard(sellerId, {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        period: period as 'today' | 'week' | 'month' | 'year'
      });

      return res.status(200).json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Get dashboard error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve dashboard data'
      });
    }
  }

  /**
   * Get transactions
   */
  static async getTransactions(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
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
      } = req.query;

      const result = await FinanceService.getTransactions(sellerId, {
        page: Number(page),
        limit: Number(limit),
        type: type as any,
        category: category as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Get transactions error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve transactions'
      });
    }
  }

  /**
   * Get single transaction
   */
  static async getTransactionById(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const sellerId = req.user!.userId;

      const transaction = await FinanceService.getTransactionById(transactionId, sellerId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction
      });
    } catch (error: any) {
      console.error('Get transaction error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve transaction'
      });
    }
  }

  /**
   * Create manual income entry
   */
  static async createIncome(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { amount, date, description, customerName, paymentMethod, category } = req.body;

      const transaction = await FinanceService.createIncome(sellerId, {
        amount,
        date: new Date(date),
        description,
        customerName,
        paymentMethod,
        category
      });

      return res.status(201).json({
        success: true,
        message: 'Income entry created successfully',
        data: transaction
      });
    } catch (error: any) {
      console.error('Create income error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create income entry'
      });
    }
  }

  /**
   * Create expense entry
   */
  static async createExpense(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { amount, date, category, description, vendor, paymentMethod, isRecurring, recurringConfig } = req.body;

      const transaction = await FinanceService.createExpense(sellerId, {
        amount,
        date: new Date(date),
        category,
        description,
        vendor,
        paymentMethod,
        isRecurring,
        recurringConfig
      });

      return res.status(201).json({
        success: true,
        message: 'Expense entry created successfully',
        data: transaction
      });
    } catch (error: any) {
      console.error('Create expense error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create expense entry'
      });
    }
  }

  /**
   * Update transaction
   */
  static async updateTransaction(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const sellerId = req.user!.userId;
      const { amount, description, category, date, vendor, customerName, paymentMethod } = req.body;

      const transaction = await FinanceService.updateTransaction(transactionId, sellerId, {
        amount,
        description,
        category,
        date: date ? new Date(date) : undefined,
        vendor,
        customerName,
        paymentMethod
      });

      return res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction
      });
    } catch (error: any) {
      console.error('Update transaction error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update transaction'
      });
    }
  }

  /**
   * Delete transaction
   */
  static async deleteTransaction(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const sellerId = req.user!.userId;

      await FinanceService.deleteTransaction(transactionId, sellerId);

      return res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete transaction error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete transaction'
      });
    }
  }

  /**
   * Generate report
   */
  static async generateReport(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { type, date, week, month, year, startDate, endDate } = req.query;

      const result = await FinanceService.generateReport(sellerId, {
        type: type as any,
        date: date ? new Date(date as string) : undefined,
        week: week ? new Date(week as string) : undefined,
        month: month as string,
        year: year as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      });

      return res.status(200).json({
        success: true,
        message: 'Report generated successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Generate report error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to generate report'
      });
    }
  }

  /**
   * Get expense categories
   */
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = FinanceService.getExpenseCategories();

      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: { categories }
      });
    } catch (error: any) {
      console.error('Get categories error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve categories'
      });
    }
  }

  /**
   * Upload attachment
   */
  static async uploadAttachment(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const sellerId = req.user!.userId;
      const { fileName, fileSize, mimeType, base64 } = req.body;

      const attachment = await FinanceService.uploadAttachment(transactionId, sellerId, {
        fileName,
        fileSize,
        mimeType,
        base64
      });

      return res.status(201).json({
        success: true,
        message: 'Attachment uploaded successfully',
        data: attachment
      });
    } catch (error: any) {
      console.error('Upload attachment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to upload attachment'
      });
    }
  }

  /**
   * Sync marketplace sales
   */
  static async syncSales(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { orderId, syncAll } = req.body;

      if (syncAll) {
        // Sync all eligible orders for this seller
        const result = await FinanceService.syncAllMarketplaceSales(sellerId);
        return res.status(200).json({
          success: true,
          message: `Synced ${result.synced} orders, skipped ${result.skipped} orders`,
          data: result
        });
      } else if (orderId) {
        // Sync specific order
        const finance = await FinanceService.syncMarketplaceSales(sellerId, orderId);
        return res.status(200).json({
          success: true,
          message: finance ? 'Sales synced successfully' : 'No income entry created (order not delivered or payment not confirmed)',
          data: finance
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Either orderId or syncAll=true is required'
        });
      }
    } catch (error: any) {
      console.error('Sync sales error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to sync sales'
      });
    }
  }
}

