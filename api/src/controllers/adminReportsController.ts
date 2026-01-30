import { Request, Response } from 'express';
import { AdminReportsService } from '../services/adminReportsService';
import Messages from '../utils/messages';

export class AdminReportsController {
  // Get comprehensive reports
  static async getReports(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, period } = req.query;

      const filters: any = {
        period: period as '7' | '30' | '90' | '365' | 'custom' || '30'
      };

      if (startDate && endDate) {
        filters.startDate = new Date(startDate as string);
        filters.endDate = new Date(endDate as string);
      }

      const reports = await AdminReportsService.getReports(filters);
      res.json({
        success: true,
        data: reports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_REPORTS.FETCH_FAILED
      });
    }
  }

  // Export sales data
  static async exportSales(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: Messages.VALIDATION.REQUIRED_FIELD
        });
        return;
      }

      const data = await AdminReportsService.exportSales(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data,
        message: Messages.ADMIN_REPORTS.SALES_EXPORTED
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_REPORTS.SALES_EXPORT_FAILED
      });
    }
  }

  // Export products data
  static async exportProducts(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: Messages.VALIDATION.REQUIRED_FIELD
        });
        return;
      }

      const data = await AdminReportsService.exportProducts(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data,
        message: Messages.ADMIN_REPORTS.PRODUCTS_EXPORTED
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_REPORTS.PRODUCTS_EXPORT_FAILED
      });
    }
  }
}

