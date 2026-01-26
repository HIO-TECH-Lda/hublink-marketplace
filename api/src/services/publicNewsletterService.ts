import NewsletterSubscriber from '../models/NewsletterSubscriber';
import { EmailService } from './emailService';
import { ApiError } from '../utils/ApiError';
import crypto from 'crypto';

interface SubscribeData {
  email: string;
  name?: string;
  source?: 'popup' | 'footer' | 'checkout';
}

export class PublicNewsletterService {
  /**
   * Subscribe to newsletter (public endpoint)
   */
  static async subscribe(data: SubscribeData, metadata?: any) {
    const { email, name, source = 'signup' } = data;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Email inválido');
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.status === 'active') {
        return {
          success: true,
          message: 'Este email já está inscrito na nossa newsletter!',
          alreadySubscribed: true
        };
      } else if (existing.status === 'unsubscribed') {
        // Reactivate subscription
        existing.status = 'active';
        existing.origin = source;
        existing.unsubscribedAt = undefined;
        existing.unsubscribedReason = undefined;
        
        if (name) {
          const names = name.split(' ');
          existing.firstName = names[0];
          existing.lastName = names.slice(1).join(' ');
        }

        await existing.save();

        // Send welcome email
        await this.sendWelcomeEmail(email, name || email);

        return {
          success: true,
          message: 'Bem-vindo de volta! Sua inscrição foi reativada.'
        };
      }
    }

    // Create new subscriber
    const names = name ? name.split(' ') : [];
    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      firstName: names[0] || undefined,
      lastName: names.slice(1).join(' ') || undefined,
      status: 'active', // Direct subscription without verification
      origin: source,
      metadata: metadata || {},
      stats: {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0
      }
    });

    await subscriber.save();

    // Send welcome email
    await this.sendWelcomeEmail(email, name || email);

    return {
      success: true,
      message: 'Inscrição realizada com sucesso! Bem-vindo à newsletter da Txova.'
    };
  }

  /**
   * Unsubscribe from newsletter
   */
  static async unsubscribe(email: string, reason?: string) {
    const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      throw new ApiError(404, 'Email não encontrado');
    }

    if (subscriber.status === 'unsubscribed') {
      return {
        success: true,
        message: 'Este email já estava cancelado'
      };
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    subscriber.unsubscribedReason = reason || 'User requested';

    await subscriber.save();

    // Send goodbye email
    await this.sendGoodbyeEmail(email, subscriber.firstName || email);

    return {
      success: true,
      message: 'Inscrição cancelada com sucesso. Sentiremos sua falta!'
    };
  }

  /**
   * Check subscription status
   */
  static async checkStatus(email: string) {
    const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return {
        subscribed: false,
        verified: false
      };
    }

    return {
      subscribed: subscriber.status === 'active',
      verified: subscriber.status === 'active',
      subscribedAt: subscriber.createdAt,
      status: subscriber.status
    };
  }

  /**
   * Send welcome email to new subscriber
   */
  private static async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo à Newsletter da Txova!</h1>
          </div>
          <div class="content">
            <h2>Olá ${name}!</h2>
            <p>Obrigado por se inscrever na nossa newsletter! 📬</p>
            <p>Você agora receberá:</p>
            <ul>
              <li>✨ Novidades sobre produtos</li>
              <li>🎁 Ofertas exclusivas</li>
              <li>📝 Artigos do nosso blog</li>
              <li>💡 Dicas e tutoriais</li>
            </ul>
            <p>Fique atento à sua caixa de entrada!</p>
            <a href="${process.env.FRONTEND_URL || 'https://txova.com'}" class="button">Explorar Txova</a>
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Não quer mais receber nossos emails? 
              <a href="${process.env.FRONTEND_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}">Cancelar inscrição</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Txova Marketplace. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await EmailService.sendRawEmail({
        to: email,
        subject: '🎉 Bem-vindo à Newsletter da Txova!',
        html
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error - subscription should succeed even if email fails
    }
  }

  /**
   * Send goodbye email to unsubscribed user
   */
  private static async sendGoodbyeEmail(email: string, name: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>😢 Sentiremos sua falta, ${name}!</h2>
            <p>Sua inscrição na newsletter foi cancelada com sucesso.</p>
            <p>Se mudou de ideia, você pode se inscrever novamente a qualquer momento.</p>
            <p style="margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'https://txova.com'}" style="color: #667eea;">Voltar ao Txova</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await EmailService.sendRawEmail({
        to: email,
        subject: 'Sua inscrição foi cancelada - Txova',
        html
      });
    } catch (error) {
      console.error('Error sending goodbye email:', error);
    }
  }
}
