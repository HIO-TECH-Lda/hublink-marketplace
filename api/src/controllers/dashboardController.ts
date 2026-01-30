import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import Messages from '../utils/messages';

export class DashboardController {
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const stats = await DashboardService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.DASHBOARD.FETCH_FAILED
      });
    }
  }
}

