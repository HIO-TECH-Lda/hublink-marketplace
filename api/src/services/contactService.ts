import { EmailService } from './emailService';
import { ApiError } from '../utils/ApiError';
import Messages from '../utils/messages';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  orderNumber?: string;
}

export class ContactService {
  /**
   * Submit contact form
   */
  static async submitContactForm(data: ContactFormData) {
    const { name, email, subject, message, phone, orderNumber } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL || 'support@txova.com';
    
    const emailHtml = `
      <h2>Nova Mensagem de Contato</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
      ${orderNumber ? `<p><strong>Número do Pedido:</strong> ${orderNumber}</p>` : ''}
      <p><strong>Assunto:</strong> ${subject}</p>
      <hr>
      <p><strong>Mensagem:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Esta mensagem foi enviada através do formulário de contato em ${new Date().toLocaleString('pt-BR')}
      </p>
    `;

    try {
      await EmailService.sendRawEmail({
        to: adminEmail,
        subject: `Contato: ${subject}`,
        html: emailHtml,
        replyTo: email
      });

      // Send confirmation email to user
      const confirmationHtml = `
        <h2>Obrigado por entrar em contato!</h2>
        <p>Olá ${name},</p>
        <p>Recebemos sua mensagem e responderemos em até 24 horas.</p>
        <p><strong>Sua mensagem:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </p>
        <p>Atenciosamente,<br><strong>Equipe Txova</strong></p>
      `;

      await EmailService.sendRawEmail({
        to: email,
        subject: 'Recebemos sua mensagem - Txova',
        html: confirmationHtml
      });

      return {
        success: true,
        message: Messages.CONTACT.MESSAGE_SENT
      };
    } catch (error) {
      console.error('Error sending contact form email:', error);
      throw new ApiError(500, 'Falha ao enviar mensagem. Por favor, tente novamente.');
    }
  }
}
