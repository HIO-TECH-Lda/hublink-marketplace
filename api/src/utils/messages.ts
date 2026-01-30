/**
 * Centralized API messages (English)
 * Use these for consistent responses; extend per project
 */

export const Messages = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    REGISTER_FAILED: 'Registration failed',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    TOKEN_MISSING: 'Token not provided',
    TOKEN_REQUIRED: 'Token not provided',
    UNAUTHORIZED: 'Unauthorized. Please log in.',
    AUTHENTICATION_REQUIRED: 'Authentication required',
    ACCESS_DENIED: 'Access denied',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    ADMIN_ONLY: 'Admin access only',
    EMAIL_ALREADY_EXISTS: 'This email is already registered',
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    PASSWORD_CHANGED: 'Password changed successfully',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    PASSWORD_RESET_EMAIL_SENT: 'If the email exists, a reset link will be sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    INVALID_RESET_TOKEN: 'Invalid or expired reset token',
    ADMIN_ACCESS: 'Admin access granted'
  },

  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    NOT_FOUND: 'User not found',
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_RETRIEVED: 'Profile retrieved successfully',
    PASSWORD_UPDATED: 'Password updated successfully',
    FETCH_FAILED: 'Failed to fetch user'
  },

  ERROR: {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    ROUTE_NOT_FOUND: 'Route not found',
    VALIDATION_FAILED: 'Validation failed'
  },

  API: {
    TOO_MANY_REQUESTS: 'Too many requests from this IP. Please try again later.',
    RUNNING: 'API is running',
    WELCOME: 'Welcome to the API'
  }
};

export function getMessage(path: string, defaultMessage = 'Operation completed'): string {
  const keys = path.split('.');
  let message: unknown = Messages;
  for (const key of keys) {
    message = (message as Record<string, unknown>)?.[key];
  }
  return typeof message === 'string' ? message : defaultMessage;
}

export function formatMessage(message: string, variables: Record<string, unknown>): string {
  let formatted = message;
  Object.keys(variables).forEach(key => {
    formatted = formatted.replace(`{${key}}`, String(variables[key]));
  });
  return formatted;
}

export default Messages;
