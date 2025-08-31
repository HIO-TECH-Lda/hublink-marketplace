# Environment Variables Documentation

This document describes all environment variables used in the Txova Marketplace API project.

## Quick Setup

1. Copy `env.example` to `.env`
2. Fill in your actual values for each variable
3. Never commit `.env` to version control

## Server Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | Yes |
| `PORT` | Server port | `3002` | No |

## Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | - | Yes |
| `MONGO_URI` | Alternative MongoDB URI | - | No |

## Redis Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Redis connection URL (development) | `redis://localhost:6379` | No |
| `REDIS_URL_PROD` | Redis connection URL (production) | - | No |

## JWT Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `30d` | No |

## Payment Gateway Configuration

### Stripe
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | - | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | - | Yes |

### PayPal
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PAYPAL_CLIENT_ID` | PayPal client ID | - | No |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret | - | No |
| `PAYPAL_MODE` | PayPal mode (sandbox/live) | `sandbox` | No |
| `PAYPAL_WEBHOOK_ID` | PayPal webhook ID | - | No |

### M-Pesa (Mozambique)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MPESA_API_KEY` | M-Pesa API key | - | No |
| `MPESA_BASE_URL` | M-Pesa API base URL | `https://sandbox.safaricom.co.ke` | No |
| `MPESA_BUSINESS_SHORT_CODE` | M-Pesa business short code | - | No |
| `MPESA_PASSKEY` | M-Pesa passkey | - | No |

### E-Mola (Mozambique)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EMOLA_API_KEY` | E-Mola API key | - | No |
| `EMOLA_BASE_URL` | E-Mola API base URL | `https://api.emola.co.mz` | No |

## Email Configuration

### Nodemailer (SMTP)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SMTP_HOST` | SMTP host | `smtp.gmail.com` | No |
| `SMTP_PORT` | SMTP port | `587` | No |
| `SMTP_USER` | SMTP username | - | No |
| `SMTP_PASS` | SMTP password | - | No |
| `SMTP_SECURE` | Use SSL/TLS | `false` | No |

### SendGrid
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SENDGRID_API_KEY` | SendGrid API key | - | No |
| `EMAIL_FROM` | Default sender email | `noreply@txova.com` | No |
| `EMAIL_FROM_NAME` | Default sender name | `Txova Marketplace` | No |

## Cloudinary Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | No |

## File Upload Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MAX_FILE_SIZE` | Maximum file size in bytes | `5242880` (5MB) | No |
| `ALLOWED_FILE_TYPES` | Comma-separated allowed MIME types | `image/jpeg,image/png,image/webp` | No |

## Rate Limiting

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per window | `100` | No |

## CORS Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CORS_ORIGIN` | Comma-separated allowed origins | `http://localhost:3000` | No |

## Review System Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REVIEW_MODERATION_ENABLED` | Enable review moderation | `true` | No |
| `AUTO_APPROVE_REVIEWS` | Auto-approve reviews | `false` | No |
| `REVIEW_RATING_THRESHOLD` | Minimum rating threshold | `1` | No |

## Wishlist Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `WISHLIST_MAX_ITEMS` | Maximum items in wishlist | `100` | No |
| `WISHLIST_EXPIRY_DAYS` | Wishlist expiry in days | `365` | No |

## Recommendation System

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RECOMMENDATION_ENGINE_ENABLED` | Enable recommendation engine | `true` | No |
| `RECOMMENDATION_ALGORITHM` | Recommendation algorithm | `collaborative` | No |
| `RECOMMENDATION_MAX_ITEMS` | Maximum recommended items | `10` | No |

## Security Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | `12` | No |
| `SESSION_SECRET` | Session secret key | - | No |
| `COOKIE_SECRET` | Cookie secret key | - | No |

## API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_VERSION` | API version | `v1` | No |
| `API_PREFIX` | API route prefix | `/api/v1` | No |
| `API_RATE_LIMIT` | API rate limit | `100` | No |
| `API_RATE_LIMIT_WINDOW` | API rate limit window | `900000` | No |

## Development Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEBUG_MODE` | Enable debug mode | `true` | No |
| `ENABLE_SWAGGER` | Enable Swagger documentation | `true` | No |
| `ENABLE_LOGGING` | Enable detailed logging | `true` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
DEBUG_MODE=true
ENABLE_SWAGGER=true
LOG_LEVEL=debug
```

### Production
```bash
NODE_ENV=production
DEBUG_MODE=false
ENABLE_SWAGGER=false
LOG_LEVEL=error
```

### Testing
```bash
NODE_ENV=test
DEBUG_MODE=true
ENABLE_SWAGGER=false
LOG_LEVEL=warn
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET, SESSION_SECRET, etc.
3. **Rotate secrets regularly** in production
4. **Use environment-specific values** for different deployments
5. **Validate all environment variables** on application startup
6. **Use secure payment gateway credentials** in production
7. **Enable HTTPS** in production environments

## Validation

The application validates required environment variables on startup. Missing required variables will cause the application to exit with an error message.

## Example .env File

```bash
# Server Configuration
NODE_ENV=development
PORT=3002

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/txova_marketplace

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
