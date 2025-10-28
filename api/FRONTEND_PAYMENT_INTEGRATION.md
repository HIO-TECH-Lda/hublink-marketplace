# Payment Integration Guide for Frontend Team

## Overview

This document provides comprehensive guidance for integrating payment functionality into the frontend application. The API now supports a **unified payment endpoint** that automatically handles different payment methods based on the order's payment method.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Payment Methods Supported](#payment-methods-supported)
3. [Unified Payment Endpoint](#unified-payment-endpoint)
4. [Payment Flow Examples](#payment-flow-examples)
5. [Response Handling](#response-handling)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Environment Configuration](#environment-configuration)

## Quick Start

### Basic Payment Integration

```javascript
// Single endpoint for all payment methods
const processPayment = async (orderId, paymentDetails = {}) => {
  try {
    const response = await fetch('/api/v1/payments/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderId,
        paymentDetails: paymentDetails
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return handlePaymentResponse(result.data);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw error;
  }
};
```

## Payment Methods Supported

| Payment Method | Gateway | User Experience |
|----------------|---------|-----------------|
| `credit_card` | Stripe | Card form → Payment intent → Confirmation |
| `debit_card` | Stripe | Card form → Payment intent → Confirmation |
| `imali` | Imali | Pay-by-link → User clicks → Complete |
| `mpesa` | Imali | QR code → User scans → Complete |
| `emola` | Imali | QR code → User scans → Complete |
| `bank_transfer` | Manual | Instructions → Admin confirmation |
| `cash_on_delivery` | Manual | Order confirmation → Admin confirmation |

## Unified Payment Endpoint

### Endpoint
```
POST /api/v1/payments/process
```

### Request Format
```javascript
{
  "orderId": "string",           // Required: Order ID
  "paymentDetails": {            // Optional: Method-specific details
    // For Imali pay-by-link
    "title": "string",
    "short_description": "string",
    "send_to_phone": "string",
    "type": "DIRECT" | "RECURRING" | "DONATION",
    "payment_frequence": "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
    "expiration_datetime": "ISO_DATE_STRING",
    "customer_link_id": "string",
    "partner_transaction_id": "string",
    "thumbnail_image": "URL_STRING",
    "transaction_type": "C2B" | "B2C" | "B2B" | "C2C",
    
    // For Stripe confirmation
    "paymentIntentId": "string",
    
    // For manual payments
    "mPesaPhoneNumber": "string",
    "eMolaPhoneNumber": "string",
    "imaliLinkId": "string"
  }
}
```

### Response Format
```javascript
{
  "success": boolean,
  "message": "string",
  "data": {
    // Response varies by payment method (see examples below)
  }
}
```

## Payment Flow Examples

### 1. Credit/Debit Card Payment (Stripe)

```javascript
// Step 1: Process payment to get payment intent
const paymentResult = await processPayment(orderId);

if (paymentResult.type === 'stripe') {
  // Step 2: Use Stripe.js to handle card payment
  const stripe = Stripe('your_publishable_key');
  const { error } = await stripe.confirmCardPayment(
    paymentResult.clientSecret,
    {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerName,
          email: customerEmail
        }
      }
    }
  );

  if (error) {
    console.error('Payment failed:', error);
  } else {
    // Step 3: Confirm payment with backend
    await processPayment(orderId, {
      paymentIntentId: paymentResult.paymentIntentId
    });
    console.log('Payment successful!');
  }
}
```

### 2. Imali Pay-by-Link Payment

```javascript
// Process Imali payment (creates pay-by-link)
const paymentResult = await processPayment(orderId, {
  title: "Payment for Order #12345",
  short_description: "Order payment",
  send_to_phone: "+258123456789", // Optional: send link via SMS
  type: "DIRECT"
});

if (paymentResult.status === 'success') {
  const paymentLink = paymentResult.data.paymentLink;
  
  // Display payment link to user
  showPaymentLink(paymentLink.link_url, paymentLink.link_id);
  
  // Optional: Poll for payment status
  pollPaymentStatus(paymentLink.link_id);
}
```

### 3. M-Pesa/eMola QR Code Payment

```javascript
// Process M-Pesa/eMola payment (generates QR code)
const paymentResult = await processPayment(orderId);

if (paymentResult.status === 'success') {
  const qrCodeData = paymentResult.data.data.qrcode;
  
  // Display QR code to user
  showQRCode(qrCodeData);
  
  // Poll for payment status
  pollTransactionStatus(paymentResult.data.data.transaction);
}
```

### 4. Manual Payment (Bank Transfer/Cash on Delivery)

```javascript
// Process manual payment
const paymentResult = await processPayment(orderId);

if (paymentResult.type === 'manual') {
  // Show payment instructions to user
  showPaymentInstructions({
    method: paymentResult.method,
    amount: paymentResult.amount,
    currency: paymentResult.currency,
    message: paymentResult.message
  });
}
```

## Response Handling

### Stripe Response
```javascript
{
  "type": "stripe",
  "clientSecret": "pi_xxxxx_secret_xxxxx",
  "paymentIntentId": "pi_xxxxx",
  "amount": 100.00,
  "currency": "MZM"
}
```

### Imali Pay-by-Link Response
```javascript
{
  "status": "success",
  "data": {
    "paymentLink": {
      "link_id": "link_xxxxx",
      "link_url": "https://pay.imali.co.mz/link/xxxxx",
      "customer_link_id": "ORDER_12345_1234567890",
      "amount": "100.00",
      "currency": "MZM",
      "status": "PENDING",
      "expiration_datetime": "2024-01-01T23:59:59Z"
    },
    "order": { /* updated order object */ }
  }
}
```

### Imali QR Code Response
```javascript
{
  "status": "success",
  "data": {
    "data": {
      "transaction": "transaction_id",
      "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "account_number": "1234567890"
    },
    "order": { /* updated order object */ }
  }
}
```

### Manual Payment Response
```javascript
{
  "type": "manual",
  "paymentId": "payment_id",
  "method": "cash_on_delivery",
  "amount": 100.00,
  "currency": "MZM",
  "status": "pending",
  "message": "Payment created for cash_on_delivery. Admin will mark as completed when payment is received."
}
```

## Error Handling

### Common Error Responses
```javascript
{
  "success": false,
  "message": "Error description"
}
```

### Error Handling Example
```javascript
const processPaymentWithErrorHandling = async (orderId, paymentDetails = {}) => {
  try {
    const response = await fetch('/api/v1/payments/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderId,
        paymentDetails: paymentDetails
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data;
  } catch (error) {
    // Handle different error types
    if (error.message.includes('Order not found')) {
      showError('Order not found. Please try again.');
    } else if (error.message.includes('already paid')) {
      showError('This order has already been paid.');
    } else if (error.message.includes('Order does not belong to user')) {
      showError('You are not authorized to pay for this order.');
    } else {
      showError('Payment processing failed. Please try again.');
    }
    
    throw error;
  }
};
```

## Testing

### Test Payment Flows

1. **Stripe Test Cards**
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - Requires 3D Secure: `4000002500003155`

2. **Imali Test Environment**
   - Use test phone numbers: `+258123456789`
   - Test amounts: Any amount > 0

3. **Manual Payments**
   - Test with small amounts
   - Verify admin can mark as completed

### Testing Checklist

- [ ] Credit card payment flow
- [ ] Imali pay-by-link flow
- [ ] M-Pesa QR code flow
- [ ] Manual payment creation
- [ ] Error handling for invalid orders
- [ ] Error handling for already paid orders
- [ ] Authentication error handling
- [ ] Network error handling

## Environment Configuration

### Required Environment Variables

```env
# Stripe (for card payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# API Base URL
REACT_APP_API_BASE_URL=http://localhost:3002/api/v1

# Optional: Imali configuration (if needed on frontend)
REACT_APP_IMALI_CLIENT_ID=your_client_id
```

### Frontend Configuration Example

```javascript
// config/payment.js
export const PAYMENT_CONFIG = {
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    currency: 'MZM',
    locale: 'en'
  },
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    timeout: 30000
  },
  imali: {
    clientId: process.env.REACT_APP_IMALI_CLIENT_ID
  }
};
```

## Complete Integration Example

```javascript
// components/PaymentProcessor.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const PaymentProcessor = ({ orderId, order, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const processPayment = async (paymentDetails = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/payments/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentDetails: paymentDetails
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setPaymentResult(result.data);
      await handlePaymentResponse(result.data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentResponse = async (data) => {
    switch (data.type) {
      case 'stripe':
        await handleStripePayment(data);
        break;
      case 'manual':
        handleManualPayment(data);
        break;
      default:
        // Imali payment
        handleImaliPayment(data);
    }
  };

  const handleStripePayment = async (data) => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    
    const { error } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: order.billingAddress.firstName + ' ' + order.billingAddress.lastName,
          email: order.billingAddress.email
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      // Confirm payment with backend
      await processPayment({ paymentIntentId: data.paymentIntentId });
      onPaymentSuccess();
    }
  };

  const handleImaliPayment = (data) => {
    if (data.status === 'success' && data.data.paymentLink) {
      // Show pay-by-link
      window.open(data.data.paymentLink.link_url, '_blank');
    } else if (data.status === 'success' && data.data.data.qrcode) {
      // Show QR code
      setPaymentResult({ qrCode: data.data.data.qrcode });
    }
  };

  const handleManualPayment = (data) => {
    // Show payment instructions
    setPaymentResult({ 
      instructions: data.message,
      method: data.method,
      amount: data.amount,
      currency: data.currency
    });
  };

  return (
    <div className="payment-processor">
      {loading && <div>Processing payment...</div>}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {paymentResult?.qrCode && (
        <div className="qr-code">
          <img src={paymentResult.qrCode} alt="Payment QR Code" />
          <p>Scan this QR code with your mobile payment app</p>
        </div>
      )}

      {paymentResult?.instructions && (
        <div className="manual-payment">
          <h3>Payment Instructions</h3>
          <p>{paymentResult.instructions}</p>
          <p>Amount: {paymentResult.amount} {paymentResult.currency}</p>
        </div>
      )}

      <button 
        onClick={() => processPayment()} 
        disabled={loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentProcessor;
```

## Support

For technical support or questions about payment integration:

1. Check the API documentation at `/api/v1` endpoint
2. Review error logs in browser console
3. Test with different payment methods
4. Contact backend team for gateway-specific issues

---

**Last Updated:** January 2024  
**API Version:** v1  
**Payment Gateway:** Stripe + Imali + Manual
