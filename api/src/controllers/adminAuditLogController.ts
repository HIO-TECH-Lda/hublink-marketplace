import { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService';
import Messages from '../utils/messages';

export class AdminAuditLogController {
  // Get audit logs
  static async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        userId: req.query.userId as string | undefined,
        entityType: req.query.entityType as string | undefined,
        entityId: req.query.entityId as string | undefined,
        action: req.query.action as string | undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await AuditLogService.getLogs(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_AUDIT.FETCH_FAILED
      });
    }
  }

  // Get audit log statistics
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const stats = await AuditLogService.getStatistics(startDate, endDate);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_AUDIT.STATS_FAILED
      });
    }
  }
}

