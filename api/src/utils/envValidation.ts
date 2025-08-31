/**
 * Environment Variable Validation Utility
 * Validates required environment variables on application startup
 */

interface RequiredEnvVars {
  [key: string]: {
    required: boolean;
    description: string;
    defaultValue?: string;
  };
}

const requiredEnvVars: RequiredEnvVars = {
  // Server Configuration
  NODE_ENV: {
    required: true,
    description: 'Application environment (development, production, test)',
    defaultValue: 'development'
  },
  PORT: {
    required: false,
    description: 'Server port',
    defaultValue: '3002'
  },

  // Database Configuration
  MONGODB_URI: {
    required: true,
    description: 'MongoDB Atlas connection string'
  },

  // JWT Configuration
  JWT_SECRET: {
    required: true,
    description: 'Secret key for JWT tokens'
  },
  JWT_EXPIRES_IN: {
    required: false,
    description: 'JWT token expiration time',
    defaultValue: '7d'
  },

  // Payment Gateway Configuration (Phase 5)
  STRIPE_SECRET_KEY: {
    required: false,
    description: 'Stripe secret key for payment processing'
  },
  STRIPE_PUBLISHABLE_KEY: {
    required: false,
    description: 'Stripe publishable key for frontend integration'
  },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    description: 'Stripe webhook secret for payment verification'
  },

  // Email Configuration (Phase 5)
  SMTP_HOST: {
    required: false,
    description: 'SMTP host for email service',
    defaultValue: 'smtp.gmail.com'
  },
  SMTP_PORT: {
    required: false,
    description: 'SMTP port',
    defaultValue: '587'
  },
  SMTP_USER: {
    required: false,
    description: 'SMTP username'
  },
  SMTP_PASS: {
    required: false,
    description: 'SMTP password'
  },

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: {
    required: false,
    description: 'Cloudinary cloud name for file uploads'
  },
  CLOUDINARY_API_KEY: {
    required: false,
    description: 'Cloudinary API key'
  },
  CLOUDINARY_API_SECRET: {
    required: false,
    description: 'Cloudinary API secret'
  }
};

/**
 * Validate environment variables
 * @returns {boolean} True if all required variables are present
 */
export function validateEnvironmentVariables(): boolean {
  const missingVars: string[] = [];
  const warnings: string[] = [];

  console.log('🔍 Validating environment variables...');

  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];

    if (config.required && !value) {
      missingVars.push(varName);
    } else if (!value && config.defaultValue) {
      // Set default value
      process.env[varName] = config.defaultValue;
      console.log(`⚠️  ${varName} not set, using default: ${config.defaultValue}`);
    } else if (!value) {
      warnings.push(`${varName}: ${config.description}`);
    }
  }

  // Check for missing required variables
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      const config = requiredEnvVars[varName];
      console.error(`   ${varName}: ${config.description}`);
    });
    console.error('\nPlease set these variables in your .env file');
    return false;
  }

  // Show warnings for optional variables
  if (warnings.length > 0) {
    console.log('\n⚠️  Optional environment variables not set:');
    warnings.forEach(warning => {
      console.log(`   ${warning}`);
    });
  }

  // Validate specific configurations
  validatePaymentConfiguration();
  validateEmailConfiguration();
  validateDatabaseConfiguration();

  console.log('✅ Environment variables validation completed');
  return true;
}

/**
 * Validate payment gateway configuration
 */
function validatePaymentConfiguration(): void {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripePubKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET;

  if (stripeKey || stripePubKey || stripeWebhook) {
    if (!stripeKey || !stripePubKey || !stripeWebhook) {
      console.warn('⚠️  Stripe configuration incomplete. Some payment features may not work properly.');
    } else {
      console.log('✅ Stripe payment configuration validated');
    }
  } else {
    console.log('ℹ️  Stripe payment gateway not configured');
  }
}

/**
 * Validate email configuration
 */
function validateEmailConfiguration(): void {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  if (smtpHost && smtpUser && smtpPass) {
    console.log('✅ SMTP email configuration validated');
  } else if (sendgridKey) {
    console.log('✅ SendGrid email configuration validated');
  } else {
    console.warn('⚠️  Email service not configured. Email features will be disabled.');
  }
}

/**
 * Validate database configuration
 */
function validateDatabaseConfiguration(): void {
  const mongoUri = process.env.MONGODB_URI;
  
  if (mongoUri) {
    if (mongoUri.includes('mongodb+srv://')) {
      console.log('✅ MongoDB Atlas connection string validated');
    } else if (mongoUri.includes('mongodb://')) {
      console.log('✅ MongoDB local connection string validated');
    } else {
      console.warn('⚠️  MongoDB URI format may be incorrect');
    }
  }
}

/**
 * Get environment variable with fallback
 * @param key Environment variable key
 * @param fallback Fallback value if not set
 * @returns Environment variable value or fallback
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback !== undefined) {
    return fallback;
  }
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

/**
 * Get boolean environment variable
 * @param key Environment variable key
 * @param fallback Fallback value if not set
 * @returns Boolean value
 */
export function getBoolEnvVar(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (!value) {
    return fallback;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get number environment variable
 * @param key Environment variable key
 * @param fallback Fallback value if not set
 * @returns Number value
 */
export function getNumberEnvVar(key: string, fallback?: number): number {
  const value = process.env[key];
  if (!value && fallback !== undefined) {
    return fallback;
  }
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return num;
}

/**
 * Check if environment is production
 * @returns True if NODE_ENV is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if environment is development
 * @returns True if NODE_ENV is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if environment is test
 * @returns True if NODE_ENV is test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get current environment
 * @returns Current NODE_ENV value
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}
