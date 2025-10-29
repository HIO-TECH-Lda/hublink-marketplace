import { v4 as uuidv4 } from 'uuid';
const QRCode = require('qrcode');
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

// Create axios instance
const imaliAxios = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'X-localization': 'en',
    'X-Client-ID': process.env.IMALI_CLIENT_ID_DEV,
    Authorization: `Bearer ${process.env.IMALI_PRIVATE_KEY_DEV}`,
    Accept: 'application/json',
  },
});

// Interface for request body types
interface GenerateTransactionBody {
  orderId: string;
  accountNumber?: string;
  transactionID?: string;
  terminalCompanyName?: string;
  amount?: number;
}

interface GeneratePaymentPushBody {
  orderId: string;
  transactionID?: string;
  storeAccountNumber?: string;
  terminalCompanyName?: string;
  amount?: number;
  description?: string;
}

interface CreatePayByLinkBody {
  orderId: string;
  short_description?: string;
  title?: string;
  send_to_phone?: string;
  type?: 'RECURRING' | 'DIRECT' | 'DONATION';
  payment_frequence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  expiration_datetime?: string;
  customer_link_id?: string;
  partner_transaction_id?: string;
  thumbnail_image?: string;
  transaction_type?: 'C2B' | 'B2C' | 'B2B' | 'C2C';
}

export class ImaliController {
  // this generates a transaction
  static generateTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as GenerateTransactionBody;

    if (!body.orderId) {
      return next(new ApiError(400, 'Please provide orderId'));
    }

    let order = await Order.findById(body.orderId);

    if (!order) {
      return next(new ApiError(404, 'No order found with that ID'));
    }

    if (order.payment.status === 'completed') {
      return next(new ApiError(400, 'Order found with that ID is already paid'));
    }
    
    //what's inside body?
    body.accountNumber = process.env.IMALI_STORE_ACCOUNT_NUMBER_DEV;
    body.transactionID = uuidv4();
    body.terminalCompanyName = process.env.COMPANY_NAME;
    body.amount = order.total;
    
    try {
      const response = await imaliAxios.post(
        `${process.env.IMALI_API_URL_DEV}/generate-transaction`,
        body
      );

      response.data.qrcode = await QRCode.toDataURL(response.data.transaction);

      //update order
      order = await Order.findByIdAndUpdate(
        body.orderId,
        {
          'payment.transactionId': response.data.transaction,
          'payment.method': 'm_pesa',
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json({
        status: 'success',
        data: {
          data: response.data,
          order,
        },
      });
    } catch (err: any) {
      return next(new ApiError(err.response?.status || 500, err.response?.data?.message || 'Transaction generation failed'));
    }
  });

  // THIS get the static QR code for a specific store
  static getStaticQRCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await imaliAxios.get(
        `${process.env.IMALI_API_URL_DEV}/get-qrcode/${req.params.storeAccountNumber}`
      );

      res.status(200).json({
        status: 'success',
        data: {
          data: response.data,
        },
      });
    } catch (err: any) {
      return next(new ApiError(err.response?.status || 500, err.response?.data?.message || 'Failed to get static QR code'));
    }
  });

  // THIS creates a push on client imali app
  static generatePaymentPush = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as GeneratePaymentPushBody;

    if (!body.orderId) {
      return next(new ApiError(400, 'Please provide orderId'));
    }

    let order = await Order.findById(body.orderId);

    if (!order) {
      return next(new ApiError(404, 'No order found with that ID'));
    }

    if (order.payment.status === 'completed') {
      return next(new ApiError(400, 'Order found with that ID is already paid'));
    }

    //what's inside body?
    body.transactionID = uuidv4();
    body.storeAccountNumber = process.env.IMALI_STORE_ACCOUNT_NUMBER_DEV;
    body.terminalCompanyName = process.env.COMPANY_NAME;
    body.amount = order.total;
    body.description = process.env.IMALI_PUSHPAYMENT_DESCRIPTION_DEV;
    console.log(body.description);
    
    try {
      const response = await imaliAxios.post(
        `${process.env.IMALI_API_URL_DEV}/generate-payment-push`,
        body
      );

      //update order
      order = await Order.findByIdAndUpdate(
        body.orderId,
        {
          'payment.transactionId': response.data.partnerTransactionID,
          'payment.status': 'completed',
          'payment.paidAt': new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json({
        status: 'success',
        data: {
          data: response.data,
          order,
        },
      });
    } catch (err: any) {
      return next(new ApiError(err.response?.status || 500, err.response?.data?.message || 'Payment push generation failed'));
    }
  });

  // THIS checks the imali transaction status for a payment
  static checkTransactionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await imaliAxios.get(
        `${process.env.IMALI_API_URL_DEV}/check-transaction/${req.params.transactionId}`
      );
      let order = await Order.findOne({
        'payment.transactionId': req.params.transactionId,
      });

      if (response.data.status === 'success') {
        //update order payment status to PAID
        if (!order) {
          return next(
            new ApiError(404, 'No order found with that transaction ID')
          );
        }

        order = await Order.findByIdAndUpdate(
          order._id,
          { 
            $set: { 
              'payment.status': 'completed',
              'payment.paidAt': new Date()
            } 
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: response.data,
          order,
        },
      });
    } catch (err: any) {
      return next(new ApiError(err.response?.status || 500, err.response?.data?.message || 'Failed to check transaction status'));
    }
  });

  // THIS creates a pay-by-link payment
  static createPayByLink = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as CreatePayByLinkBody;

    const normalizeImaliPhone = (phone?: string): string | undefined => {
      if (!phone) return undefined;
      const digits = String(phone).replace(/\D/g, '');
      if (digits.startsWith('00258')) return digits.slice(5);
      if (digits.startsWith('258')) return digits.slice(3);
      if (digits.startsWith('0') && digits.length > 9) return digits.replace(/^0+/, '');
      return digits.length > 9 ? digits.slice(-9) : digits;
    };

    if (!body.orderId) {
      return next(new ApiError(400, 'Please provide orderId'));
    }

    let order = await Order.findById(body.orderId);

    if (!order) {
      return next(new ApiError(404, 'No order found with that ID'));
    }

    if (order.payment.status === 'completed') {
      return next(new ApiError(400, 'Order found with that ID is already paid'));
    }

    // Set default values and prepare request body for iMali API
      const payByLinkData = {
      short_description: `Pedido #${order.orderNumber || order._id.toString().slice(-8)}`.slice(0, 255),
      title:  order.items.map((item: any) => `${item.quantity}x ${item.productName || 'Item'}`).join(', '),
      amount: order.total.toFixed(2),
      type: body.type || 'DIRECT',
      payment_frequence: body.payment_frequence,
      store_account_number: process.env.IMALI_STORE_ACCOUNT_NUMBER_DEV,
      expiration_datetime: body.expiration_datetime,
      customer_link_id: body.customer_link_id || `ORDER_${order._id}_${Date.now()}`,
      send_to_phone: normalizeImaliPhone(body.send_to_phone),
      partner_transaction_id: body.partner_transaction_id || uuidv4(),
      thumbnail_image: body.thumbnail_image,
      payment_method: 'imali',
      payment_type: 'link',
      transaction_type: body.transaction_type || 'C2B'
    };

    try {
      const response = await imaliAxios.post(
        `${process.env.IMALI_API_URL_DEV}/partners/imaliway/v2/payments`,
        payByLinkData
      );

      // Update order with payment link information
      order = await Order.findByIdAndUpdate(
        body.orderId,
        {
          'payment.transactionId': response.data.data.link_id,
          'payment.method': 'pay_by_link',
          'payment.linkId': response.data.data.link_id,
          'payment.customerLinkId': response.data.data.customer_link_id,
          'payment.status': 'pending'
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json({
        status: 'success',
        data: {
          paymentLink: response.data.data,
          order,
        },
      });
    } catch (err: any) {
      return next(new ApiError(err.response?.status || 500, err.response?.data?.message || 'Pay-by-link creation failed'));
    }
  });
}