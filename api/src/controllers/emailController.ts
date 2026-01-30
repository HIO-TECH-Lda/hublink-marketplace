import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import Messages from '../utils/messages';

export class EmailController {
  /**
   * Test email service
   * POST /api/v1/email/test
   */
  static testEmailService = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
          message: Messages.EMAIL.EMAIL_REQUIRED
      });
    }

    try {
      const isWorking = await EmailService.testEmailService();
      
      if (isWorking) {
        return res.status(200).json(
          new ApiResponse(200, {
            message: Messages.EMAIL.TEST_SUCCESS,
            email: email,
            status: 'working'
          })
        );
      } else {
        return res.status(500).json(
          new ApiResponse(500, {
            message: Messages.EMAIL.TEST_FAILED,
            email: email,
            status: 'failed'
          })
        );
      }
    } catch (error: any) {
      return res.status(500).json(
        new ApiResponse(500, {
          message: Messages.EMAIL.TEST_FAILED,
          error: error.message,
          status: 'error'
        })
      );
    }
  });

  /**
   * Send custom email
   * POST /api/v1/email/send
   */
  static sendCustomEmail = catchAsync(async (req: Request, res: Response) => {
    const { to, subject, template, data } = req.body;

    // Validate required fields
    if (!to || !subject || !template) {
      return res.status(400).json({
        success: false,
        message: Messages.EMAIL.TO_SUBJECT_TEMPLATE_REQUIRED
      });
    }

    try {
      await EmailService.sendEmail({
        to,
        subject,
        template,
        data: data || {}
      });

      return res.status(200).json(
        new ApiResponse(200, {
          message: Messages.EMAIL.SENT,
          to,
          subject,
          template
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        new ApiResponse(500, {
          message: Messages.EMAIL.SEND_FAILED,
          error: error.message
        })
      );
    }
  });

  /**
   * Get email service status
   * GET /api/v1/email/status
   */
  static getEmailServiceStatus = catchAsync(async (req: Request, res: Response) => {
    try {
      // Check if email service is configured
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      const isConfigured = !!(smtpHost && smtpUser && smtpPass);

      return res.status(200).json(
        new ApiResponse(200, {
          message: Messages.EMAIL.STATUS_RETRIEVED,
          status: {
            configured: isConfigured,
            smtpHost: smtpHost ? 'Configured' : 'Not configured',
            smtpUser: smtpUser ? 'Configured' : 'Not configured',
            smtpPass: smtpPass ? 'Configured' : 'Not configured'
          }
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        new ApiResponse(500, {
          message: Messages.EMAIL.STATUS_FAILED,
          error: error.message
        })
      );
    }
  });

  /**
   * Send welcome email
   * POST /api/v1/email/welcome
   */
  static sendWelcomeEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, firstName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
          message: Messages.EMAIL.EMAIL_REQUIRED
      });
    }

    try {
      // Create a mock user object for the welcome email
      const mockUser = {
        email,
        firstName: firstName || email.split('@')[0]
      };

      await EmailService.sendWelcomeEmail(mockUser as any);

      return res.status(200).json(
        new ApiResponse(200, {
          message: Messages.EMAIL.WELCOME_SENT,
          email
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        new ApiResponse(500, {
          message: Messages.EMAIL.WELCOME_FAILED,
          error: error.message
        })
      );
    }
  });

  /**
   * Send password reset email
   * POST /api/v1/email/password-reset
   */
  static sendPasswordResetEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, firstName, resetToken } = req.body;

    if (!email || !resetToken) {
      return res.status(400).json({
        success: false,
        message: Messages.EMAIL.EMAIL_TOKEN_REQUIRED
      });
    }

    try {
      // Create a mock user object for the password reset email
      const mockUser = {
        email,
        firstName: firstName || email.split('@')[0]
      };

      await EmailService.sendPasswordReset(mockUser as any, resetToken);

      return res.status(200).json(
        new ApiResponse(200, {
          message: Messages.EMAIL.PASSWORD_RESET_SENT,
          email
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        new ApiResponse(500, {
          message: Messages.EMAIL.PASSWORD_RESET_FAILED,
          error: error.message
        })
      );
    }
  });

  /**
   * Send newsletter email
   * POST /api/v1/email/newsletter
   */
  static sendNewsletterEmail = catchAsync(async (req: Request, res: Response) => {
    const { to, subject, content, subscriberName } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({
        success: false,
          message: Messages.EMAIL.TO_SUBJECT_CONTENT_REQUIRED
      });
    }

    try {
      await EmailService.sendNewsletterEmail(to, subject, content, subscriberName);

      return res.status(200).json(
        new ApiResponse(200, {
          message: Messages.EMAIL.NEWSLETTER_SENT,
          to,
          subject
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        new ApiResponse(500, {
          message: Messages.EMAIL.NEWSLETTER_FAILED,
          error: error.message
        })
      );
    }
  });
}
