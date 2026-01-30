import { Request, Response } from 'express';
import { PublicNewsletterService } from '../services/publicNewsletterService';
import Messages from '../utils/messages';

export class PublicNewsletterController {
  /**
   * Subscribe to newsletter (public)
   */
  static async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, source } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: Messages.NEWSLETTER.EMAIL_REQUIRED
        });
        return;
      }

      // Capture metadata
      const metadata = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || req.headers.referrer
      };

      const result = await PublicNewsletterService.subscribe(
        { email, name, source },
        metadata
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          alreadySubscribed: result.alreadySubscribed || false
        }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Falha ao inscrever na newsletter'
      });
    }
  }

  /**
   * Unsubscribe from newsletter (public)
   */
  static async unsubscribe(req: Request, res: Response): Promise<void> {
    try {
      const { email, reason } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: Messages.NEWSLETTER.EMAIL_REQUIRED
        });
        return;
      }

      const result = await PublicNewsletterService.unsubscribe(email, reason);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Falha ao cancelar inscrição'
      });
    }
  }

  /**
   * Check subscription status (public)
   */
  static async checkStatus(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      if (!email) {
        res.status(400).json({
          success: false,
          message: Messages.NEWSLETTER.EMAIL_REQUIRED
        });
        return;
      }

      const status = await PublicNewsletterService.checkStatus(email);

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Falha ao verificar status'
      });
    }
  }
}
