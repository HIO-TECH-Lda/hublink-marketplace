import * as Joi from 'joi';

// User registration validation schema
export const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+258[0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid Mozambican phone number (+258XXXXXXXXX)',
      'any.required': 'Phone number is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    }),
  
  role: Joi.string()
    .valid('buyer', 'seller')
    .default('buyer')
    .messages({
      'any.only': 'Role must be either buyer or seller'
    })
});

// User login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Password change validation schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    }),

  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'New passwords do not match',
      'any.required': 'Please confirm your new password'
    })
});

// Payment validation schemas
export const createPaymentIntentSchema = Joi.object({
  orderId: Joi.string()
    .required()
    .messages({
      'any.required': 'Order ID is required'
    }),
  
  amount: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.min': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),
  
  currency: Joi.string()
    .length(3)
    .uppercase()
    .default('USD')
    .messages({
      'string.length': 'Currency must be 3 characters (e.g., USD, EUR)',
      'string.uppercase': 'Currency must be uppercase'
    }),
  
  paymentMethod: Joi.string()
    .valid('card', 'bank_transfer', 'cash_on_delivery')
    .default('card')
    .messages({
      'any.only': 'Payment method must be card, bank_transfer, or cash_on_delivery'
    })
});

export const confirmPaymentSchema = Joi.object({
  paymentIntentId: Joi.string()
    .required()
    .messages({
      'any.required': 'Payment intent ID is required'
    })
});

export const refundPaymentSchema = Joi.object({
  paymentId: Joi.string()
    .required()
    .messages({
      'any.required': 'Payment ID is required'
    }),
  
  amount: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.min': 'Refund amount must be greater than 0',
      'any.required': 'Refund amount is required'
    }),
  
  reason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Refund reason must be at least 10 characters',
      'string.max': 'Refund reason cannot exceed 500 characters',
      'any.required': 'Refund reason is required'
    })
});

export const createManualPaymentSchema = Joi.object({
  orderId: Joi.string()
    .required()
    .messages({
      'any.required': 'Order ID is required'
    }),
  
  amount: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.min': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),
  
  currency: Joi.string()
    .length(3)
    .uppercase()
    .default('USD')
    .messages({
      'string.length': 'Currency must be 3 characters (e.g., USD, EUR)',
      'string.uppercase': 'Currency must be uppercase'
    }),
  
  method: Joi.string()
    .valid('bank_transfer', 'cash_on_delivery', 'm_pesa', 'e_mola')
    .required()
    .messages({
      'any.only': 'Method must be bank_transfer, cash_on_delivery, m_pesa, or e_mola',
      'any.required': 'Payment method is required'
    })
});

// User profile update validation schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  phone: Joi.string()
    .pattern(/^\+258[0-9]{9}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid Mozambican phone number (+258XXXXXXXXX)'
    }),
  
  billingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().default('Mozambique'),
    isDefault: Joi.boolean().default(false)
  }),
  
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().default('Mozambique'),
    isDefault: Joi.boolean().default(false)
  }),
  
  preferences: Joi.object({
    language: Joi.string().valid('pt', 'en').default('pt'),
    currency: Joi.string().default('MZN'),
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(true),
      push: Joi.boolean().default(true)
    })
  })
});

// Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

// Product validation schemas
export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Product name must be at least 3 characters',
      'string.max': 'Product name cannot exceed 200 characters',
      'any.required': 'Product name is required'
    }),

  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Product description must be at least 10 characters',
      'string.max': 'Product description cannot exceed 2000 characters',
      'any.required': 'Product description is required'
    }),

  shortDescription: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Short description cannot exceed 500 characters'
    }),

  categoryId: Joi.string()
    .required()
    .messages({
      'any.required': 'Category is required'
    }),

  subcategoryId: Joi.string()
    .optional(),

  brand: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Brand name cannot exceed 100 characters'
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),

  originalPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Original price cannot be negative'
    }),

  discountPercentage: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      'number.min': 'Discount percentage cannot be negative',
      'number.max': 'Discount percentage cannot exceed 100%'
    }),

  stock: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock is required'
    }),

  sku: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'SKU cannot exceed 50 characters'
    }),

  barcode: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Barcode cannot exceed 50 characters'
    }),

  images: Joi.array().items(
    Joi.object({
      url: Joi.string()
        .uri()
        .required()
        .messages({
          'string.uri': 'Please provide a valid image URL',
          'any.required': 'Image URL is required'
        }),
      alt: Joi.string()
        .max(100)
        .optional()
        .messages({
          'string.max': 'Alt text cannot exceed 100 characters'
        }),
      isPrimary: Joi.boolean()
        .optional(),
      order: Joi.number()
        .min(0)
        .optional()
        .messages({
          'number.min': 'Order cannot be negative'
        })
    })
  ).min(1)
    .required()
    .messages({
      'array.min': 'At least one image is required',
      'any.required': 'Product images are required'
    }),

  variants: Joi.array().items(
    Joi.object({
      name: Joi.string()
        .required()
        .messages({
          'any.required': 'Variant name is required'
        }),
      value: Joi.string()
        .required()
        .messages({
          'any.required': 'Variant value is required'
        }),
      price: Joi.number()
        .min(0)
        .required()
        .messages({
          'number.min': 'Variant price cannot be negative',
          'any.required': 'Variant price is required'
        }),
      stock: Joi.number()
        .min(0)
        .required()
        .messages({
          'number.min': 'Variant stock cannot be negative',
          'any.required': 'Variant stock is required'
        }),
      sku: Joi.string()
        .max(50)
        .optional()
        .messages({
          'string.max': 'Variant SKU cannot exceed 50 characters'
        })
    })
  ).optional(),

  specifications: Joi.array().items(
    Joi.object({
      name: Joi.string()
        .required()
        .messages({
          'any.required': 'Specification name is required'
        }),
      value: Joi.string()
        .required()
        .messages({
          'any.required': 'Specification value is required'
        })
    })
  ).optional(),

  weight: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Weight cannot be negative'
    }),

  dimensions: Joi.object({
    length: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Length cannot be negative'
      }),
    width: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Width cannot be negative'
      }),
    height: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Height cannot be negative'
      })
  }).optional(),

  metaTitle: Joi.string()
    .max(60)
    .optional()
    .messages({
      'string.max': 'Meta title cannot exceed 60 characters'
    }),

  metaDescription: Joi.string()
    .max(160)
    .optional()
    .messages({
      'string.max': 'Meta description cannot exceed 160 characters'
    }),

  keywords: Joi.array()
    .items(Joi.string().max(50))
    .optional()
    .messages({
      'array.max': 'Keywords cannot exceed 50 characters each'
    }),

  shippingWeight: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Shipping weight cannot be negative'
    }),

  shippingClass: Joi.string()
    .valid('light', 'standard', 'heavy', 'fragile')
    .optional()
    .messages({
      'any.only': 'Shipping class must be light, standard, heavy, or fragile'
    }),

  returnPolicy: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Return policy cannot exceed 500 characters'
    }),

  warranty: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Warranty cannot exceed 200 characters'
    }),

  location: Joi.object({
    city: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'City cannot exceed 100 characters'
      }),
    state: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'State cannot exceed 100 characters'
      }),
    country: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': 'Country cannot exceed 100 characters'
      })
  }).optional(),

  isLocalPickup: Joi.boolean()
    .optional(),

  isDelivery: Joi.boolean()
    .optional(),

  tags: Joi.array()
    .items(Joi.string().max(50))
    .optional()
    .messages({
      'array.max': 'Tags cannot exceed 50 characters each'
    }),

  labels: Joi.array()
    .items(Joi.string().valid('organic', 'eco-friendly', 'handmade', 'local', 'premium', 'budget'))
    .optional()
    .messages({
      'any.only': 'Labels must be organic, eco-friendly, handmade, local, premium, or budget'
    })
});

// Update product schema (all fields optional)
export const updateProductSchema = createProductSchema.fork(
  Object.keys(createProductSchema.describe().keys),
  (schema) => schema.optional()
);

// Category validation schemas
export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name cannot exceed 100 characters',
      'any.required': 'Category name is required'
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Category description cannot exceed 500 characters'
    }),

  parentId: Joi.string()
    .optional(),

  image: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Please provide a valid image URL'
    }),

  icon: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Icon cannot exceed 50 characters'
    }),

  isActive: Joi.boolean()
    .optional(),

  isFeatured: Joi.boolean()
    .optional(),

  sortOrder: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Sort order cannot be negative'
    }),

  metaTitle: Joi.string()
    .max(60)
    .optional()
    .messages({
      'string.max': 'Meta title cannot exceed 60 characters'
    }),

  metaDescription: Joi.string()
    .max(160)
    .optional()
    .messages({
      'string.max': 'Meta description cannot exceed 160 characters'
    }),

  keywords: Joi.array()
    .items(Joi.string().max(50))
    .optional()
    .messages({
      'array.max': 'Keywords cannot exceed 50 characters each'
    })
});

// Update category schema (all fields optional)
export const updateCategorySchema = createCategorySchema.fork(
  Object.keys(createCategorySchema.describe().keys),
  (schema) => schema.optional()
);

// Cart validation schemas
export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).max(100).required(),
  variantId: Joi.string().optional()
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().min(1).max(100).required()
});

export const removeFromCartSchema = Joi.object({
  productId: Joi.string().required(),
  variantId: Joi.string().optional()
});

// Order validation schemas
export const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      variantId: Joi.string().optional()
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    address: Joi.string().min(10).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    zipCode: Joi.string().min(3).max(20).required(),
    isDefault: Joi.boolean().optional()
  }).required(),
  billingAddress: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    address: Joi.string().min(10).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    zipCode: Joi.string().min(3).max(20).required(),
    isDefault: Joi.boolean().optional()
  }).required(),
  payment: Joi.object({
    method: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery').required(),
    paymentDetails: Joi.object({
      cardLast4: Joi.string().length(4).optional(),
      cardBrand: Joi.string().optional(),
      paypalEmail: Joi.string().email().optional()
    }).optional()
  }).required(),
  notes: Joi.string().max(500).optional()
});

export const createOrderFromCartSchema = Joi.object({
  shippingAddress: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    address: Joi.string().min(10).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    zipCode: Joi.string().min(3).max(20).required(),
    isDefault: Joi.boolean().optional()
  }).required(),
  billingAddress: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    address: Joi.string().min(10).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
    zipCode: Joi.string().min(3).max(20).required(),
    isDefault: Joi.boolean().optional()
  }).required(),
  payment: Joi.object({
    method: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery').required(),
    paymentDetails: Joi.object({
      cardLast4: Joi.string().length(4).optional(),
      cardBrand: Joi.string().optional(),
      paypalEmail: Joi.string().email().optional()
    }).optional()
  }).required(),
  notes: Joi.string().max(500).optional()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').required(),
  trackingNumber: Joi.string().optional(),
  cancelReason: Joi.string().max(500).optional(),
  refundAmount: Joi.number().min(0).optional()
});

export const cancelOrderSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required()
});

export const refundOrderSchema = Joi.object({
  refundAmount: Joi.number().min(0).required(),
  reason: Joi.string().min(10).max(500).required()
});

// Review validation schemas
export const createReviewSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  }),
  orderId: Joi.string().required().messages({
    'any.required': 'Order ID is required'
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required'
  }),
  title: Joi.string().min(5).max(100).required().messages({
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Review title is required'
  }),
  content: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Content must be at least 10 characters',
    'string.max': 'Content cannot exceed 1000 characters',
    'any.required': 'Review content is required'
  }),
  images: Joi.array().items(Joi.string().uri()).optional().messages({
    'string.uri': 'Image URL must be a valid URI'
  })
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional().messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5'
  }),
  title: Joi.string().min(5).max(100).optional().messages({
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot exceed 100 characters'
  }),
  content: Joi.string().min(10).max(1000).optional().messages({
    'string.min': 'Content must be at least 10 characters',
    'string.max': 'Content cannot exceed 1000 characters'
  }),
  images: Joi.array().items(Joi.string().uri()).optional().messages({
    'string.uri': 'Image URL must be a valid URI'
  })
});

export const moderateReviewSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required().messages({
    'any.only': 'Status must be approved or rejected',
    'any.required': 'Status is required'
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Moderator notes cannot exceed 500 characters'
  })
});

// Wishlist validation schemas
export const validateWishlistAdd = Joi.object({
  productId: Joi.string()
    .required()
    .messages({
      'any.required': 'Product ID is required'
    }),
  
  notes: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

export const validateWishlistUpdate = Joi.object({
  notes: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

// Validation middleware factory
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map((detail: any) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    req.body = value;
    next();
  };
};
