import { Request, Response } from 'express';
import { ContactService } from '../services/contactService';

export class ContactController {
  /**
   * Submit contact form
   */
  static async submitContactForm(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, subject, message, phone, orderNumber } = req.body;

      const result = await ContactService.submitContactForm({
        name,
        email,
        subject,
        message,
        phone,
        orderNumber
      });

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Falha ao enviar mensagem'
      });
    }
  }
}
