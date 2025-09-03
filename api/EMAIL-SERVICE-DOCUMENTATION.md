# Email Service Documentation

## Overview

The Email Service has been successfully implemented for the Txova Marketplace API. This service provides comprehensive email functionality including order confirmations, password resets, welcome emails, and newsletter management.

## 🚀 **Features Implemented**

### **Core Email Service**
- ✅ **Nodemailer Integration** - SMTP email sending with support for Gmail, Outlook, and other providers
- ✅ **Email Templates** - Professional HTML templates using Handlebars
- ✅ **Template System** - Modular template system with fallback support
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Configuration Management** - Environment-based configuration

### **Email Types Supported**
- ✅ **Order Confirmations** - Detailed order information with tracking
- ✅ **Password Reset** - Secure password reset with token validation
- ✅ **Welcome Emails** - Onboarding emails for new users
- ✅ **Review Requests** - Automated review requests for completed orders
- ✅ **Newsletter Management** - Subscription and bulk email sending
- ✅ **Order Status Updates** - Real-time order status notifications
- ✅ **Payment Confirmations** - Payment receipt emails

## 📁 **File Structure**

```
src/
├── services/
│   ├── emailService.ts          # Main email service
│   └── newsletterService.ts     # Newsletter management
├── controllers/
│   └── emailController.ts       # Email API endpoints
├── routes/
│   └── email.ts                 # Email routes
├── templates/
│   └── emails/
│       ├── order-confirmation.hbs
│       ├── password-reset.hbs
│       ├── welcome.hbs
│       └── test.hbs
└── utils/
    ├── ApiError.ts              # Error handling
    ├── ApiResponse.ts           # Response formatting
    ├── catchAsync.ts            # Async error wrapper
    └── wrapHandler.ts           # Route handler wrapper
```

## 🔧 **Configuration**

### **Environment Variables**

Add these to your `.env` file:

```env
# Email Service Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Email Settings
EMAIL_FROM=noreply@txova.com
EMAIL_FROM_NAME=Txova Marketplace

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Test Email
TEST_EMAIL=test@example.com
```

### **Gmail Setup**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in `SMTP_PASS`

## 📧 **Email Templates**

### **Available Templates**

1. **order-confirmation.hbs** - Order confirmation with details
2. **password-reset.hbs** - Password reset with security notice
3. **welcome.hbs** - Welcome email for new users
4. **test.hbs** - Simple test email template

### **Template Features**

- **Responsive Design** - Mobile-friendly email layouts
- **Professional Styling** - Consistent branding and colors
- **Dynamic Content** - Handlebars templating for personalization
- **Fallback Support** - Graceful degradation if templates are missing

## 🛠️ **API Endpoints**

### **Email Testing & Management**

```bash
# Test email service
POST /api/v1/email/test
{
  "email": "test@example.com"
}

# Get email service status
GET /api/v1/email/status

# Send custom email (admin only)
POST /api/v1/email/send
{
  "to": "user@example.com",
  "subject": "Custom Subject",
  "template": "template-name",
  "data": { "key": "value" }
}

# Send welcome email
POST /api/v1/email/welcome
{
  "email": "user@example.com",
  "firstName": "John"
}

# Send password reset email
POST /api/v1/email/password-reset
{
  "email": "user@example.com",
  "firstName": "John",
  "resetToken": "token-123"
}

# Send newsletter email (admin only)
POST /api/v1/email/newsletter
{
  "to": "subscriber@example.com",
  "subject": "Newsletter Subject",
  "content": "Newsletter content",
  "subscriberName": "John"
}
```

## 💻 **Usage Examples**

### **Sending Order Confirmation**

```typescript
import { EmailService } from '../services/emailService';

// In your order service
await EmailService.sendOrderConfirmation(order);
```

### **Sending Password Reset**

```typescript
import { EmailService } from '../services/emailService';

// In your auth service
await EmailService.sendPasswordReset(user, resetToken);
```

### **Sending Welcome Email**

```typescript
import { EmailService } from '../services/emailService';

// In your user registration
await EmailService.sendWelcomeEmail(user);
```

### **Sending Custom Email**

```typescript
import { EmailService } from '../services/emailService';

await EmailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  template: 'custom-template',
  data: {
    userName: 'John',
    message: 'Hello from Txova!'
  }
});
```

## 🧪 **Testing**

### **Manual Testing**

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test email service:**
   ```bash
   node test-email-service.js
   ```

3. **Test individual endpoints:**
   ```bash
   # Test email status
   curl http://localhost:3002/api/v1/email/status

   # Test email sending
   curl -X POST http://localhost:3002/api/v1/email/test \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

### **Email Service Test Results**

The test script will verify:
- ✅ Email service configuration
- ✅ SMTP connection
- ✅ Template loading
- ✅ Email sending functionality
- ✅ Error handling

## 🔒 **Security Features**

### **Email Security**
- **SMTP Authentication** - Secure SMTP with username/password
- **TLS/SSL Support** - Encrypted email transmission
- **Token Validation** - Secure password reset tokens
- **Rate Limiting** - Prevents email abuse
- **Input Validation** - Sanitized email addresses and content

### **Template Security**
- **XSS Prevention** - Handlebars auto-escapes content
- **No Script Injection** - Templates don't execute scripts
- **Safe Links** - All links are validated

## 📊 **Monitoring & Logging**

### **Email Logging**
- **Success Logs** - Email sent successfully with message ID
- **Error Logs** - Detailed error information for debugging
- **Configuration Logs** - Service initialization status

### **Performance Metrics**
- **Send Time** - Time taken to send each email
- **Success Rate** - Percentage of successful sends
- **Template Load Time** - Time to load and compile templates

## 🚨 **Error Handling**

### **Common Errors**

1. **SMTP Configuration Error**
   ```
   ❌ Failed to initialize email service: Invalid login
   ```
   **Solution:** Check SMTP credentials in environment variables

2. **Template Not Found**
   ```
   ❌ Template not found: custom-template
   ```
   **Solution:** Create the missing template or use existing one

3. **Email Send Failure**
   ```
   ❌ Failed to send email: Connection timeout
   ```
   **Solution:** Check network connection and SMTP settings

### **Error Recovery**

- **Automatic Retry** - Failed emails can be retried
- **Fallback Templates** - Default templates if custom ones fail
- **Graceful Degradation** - Service continues working even if email fails

## 🔄 **Integration Points**

### **Order System**
- Order confirmations sent automatically
- Status updates sent on order changes
- Review requests sent after delivery

### **User Management**
- Welcome emails on registration
- Password reset emails on request
- Email verification for accounts

### **Newsletter System**
- Subscription confirmations
- Bulk newsletter sending
- Preference management

## 📈 **Future Enhancements**

### **Planned Features**
- **Email Queue System** - Background job processing
- **SendGrid Integration** - Alternative email provider
- **Email Analytics** - Open rates, click tracking
- **Template Editor** - Web-based template management
- **A/B Testing** - Email campaign optimization

### **Performance Optimizations**
- **Template Caching** - Faster template loading
- **Connection Pooling** - Reuse SMTP connections
- **Batch Sending** - Send multiple emails efficiently

## 📝 **Best Practices**

### **Email Content**
- Keep subject lines clear and concise
- Use professional, branded templates
- Include clear call-to-action buttons
- Provide unsubscribe options for newsletters

### **Technical Implementation**
- Always handle email errors gracefully
- Use environment variables for configuration
- Test email templates across different clients
- Monitor email delivery rates

### **Security**
- Never log sensitive email content
- Validate all email addresses
- Use secure SMTP connections
- Implement rate limiting

## 🎯 **Conclusion**

The Email Service is now fully functional and ready for production use. It provides:

- ✅ **Complete Email Functionality** - All required email types implemented
- ✅ **Professional Templates** - Responsive, branded email designs
- ✅ **Robust Error Handling** - Graceful failure and recovery
- ✅ **Easy Integration** - Simple API for other services
- ✅ **Security Features** - Secure email transmission and validation
- ✅ **Testing Support** - Comprehensive testing tools

The service is production-ready and can handle all email requirements for the Txova Marketplace platform.
