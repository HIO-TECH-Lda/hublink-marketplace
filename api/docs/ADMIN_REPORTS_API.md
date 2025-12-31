# Admin Reports and Analytics API

Complete API reference for reports and analytics.

## Base URL

```
/api/v1/admin/reports
```

**Authentication:** All endpoints require admin authentication via `Authorization: Bearer <token>`

---

## Get Comprehensive Reports

**GET** `/`

**Query Parameters:**
- `period` (string, optional): Predefined period (`7`, `30`, `90`, `365`, `custom`). Default: `30`
- `startDate` (string, optional): Start date (ISO 8601) - required if `period` is `custom`
- `endDate` (string, optional): End date (ISO 8601) - required if `period` is `custom`

**Response:**

```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-12-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.999Z",
      "days": 30
    },
    "metrics": {
      "totalSales": {
        "count": 1005,
        "revenue": 50250.00
      },
      "orders": {
        "count": 426,
        "avgItemsPerOrder": 2.0
      },
      "customers": {
        "new": 319
      },
      "averageTicket": 117.96
    },
    "salesByDay": [
      {
        "date": "2024-12-25",
        "sales": 15,
        "revenue": 1500.00
      },
      {
        "date": "2024-12-26",
        "sales": 28,
        "revenue": 2800.00
      },
      {
        "date": "2024-12-27",
        "sales": 56,
        "revenue": 5600.00
      }
    ],
    "topProducts": [
      {
        "rank": 1,
        "productId": "507f1f77bcf86cd799439011",
        "name": "Tomates Orgânicos",
        "units": 150,
        "revenue": 2250.00,
        "sales": 45
      },
      {
        "rank": 2,
        "productId": "507f1f77bcf86cd799439012",
        "name": "Maçãs Orgânicas",
        "units": 95,
        "revenue": 1900.00,
        "sales": 38
      },
      {
        "rank": 3,
        "productId": "507f1f77bcf86cd799439013",
        "name": "Bananas Orgânicas",
        "units": 160,
        "revenue": 1280.00,
        "sales": 32
      },
      {
        "rank": 4,
        "productId": "507f1f77bcf86cd799439014",
        "name": "Alface Orgânica",
        "units": 70,
        "revenue": 840.00,
        "sales": 28
      },
      {
        "rank": 5,
        "productId": "507f1f77bcf86cd799439015",
        "name": "Cenouras Orgânicas",
        "units": 75,
        "revenue": 750.00,
        "sales": 25
      }
    ],
    "topSellers": [
      {
        "rank": 1,
        "sellerId": "507f1f77bcf86cd799439021",
        "name": "Fazenda Verde",
        "products": 15,
        "revenue": 6000.00,
        "sales": 120
      },
      {
        "rank": 2,
        "sellerId": "507f1f77bcf86cd799439022",
        "name": "Horta Orgânica",
        "products": 12,
        "revenue": 4750.00,
        "sales": 95
      },
      {
        "rank": 3,
        "sellerId": "507f1f77bcf86cd799439023",
        "name": "Produtos Naturais",
        "products": 8,
        "revenue": 3900.00,
        "sales": 78
      },
      {
        "rank": 4,
        "sellerId": "507f1f77bcf86cd799439024",
        "name": "Campo Limpo",
        "products": 10,
        "revenue": 3250.00,
        "sales": 65
      },
      {
        "rank": 5,
        "sellerId": "507f1f77bcf86cd799439025",
        "name": "Verduras Frescas",
        "products": 6,
        "revenue": 2600.00,
        "sales": 52
      }
    ],
    "performanceMetrics": {
      "conversionRate": "3.2",
      "avgSessionTime": "4m 32s",
      "abandonmentRate": "68.5",
      "averageRating": "4.5",
      "avgDeliveryTime": "2.3"
    }
  }
}
```

---

## Export Sales Data

**GET** `/export/sales`

**Query Parameters:**
- `startDate` (string, required): Start date (ISO 8601)
- `endDate` (string, required): End date (ISO 8601)

**Response:**

```json
{
  "success": true,
  "message": "Sales data exported successfully",
  "data": [
    {
      "orderNumber": "ORD-001",
      "date": "2024-12-25T10:00:00.000Z",
      "customer": "João Silva",
      "email": "joao@email.com",
      "total": 150.00,
      "status": "delivered",
      "items": 2
    }
  ]
}
```

---

## Export Products Data

**GET** `/export/products`

**Query Parameters:**
- `startDate` (string, required): Start date (ISO 8601)
- `endDate` (string, required): End date (ISO 8601)

**Response:**

```json
{
  "success": true,
  "message": "Products data exported successfully",
  "data": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Tomates Orgânicos",
      "unitsSold": 150,
      "revenue": 2250.00,
      "salesCount": 45
    }
  ]
}
```

---

## TypeScript Interfaces

```typescript
interface ReportsData {
  period: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  metrics: {
    totalSales: {
      count: number;
      revenue: number;
    };
    orders: {
      count: number;
      avgItemsPerOrder: number;
    };
    customers: {
      new: number;
    };
    averageTicket: number;
  };
  salesByDay: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    rank: number;
    productId: string;
    name: string;
    units: number;
    revenue: number;
    sales: number;
  }>;
  topSellers: Array<{
    rank: number;
    sellerId: string;
    name: string;
    products: number;
    revenue: number;
    sales: number;
  }>;
  performanceMetrics: {
    conversionRate: string;
    avgSessionTime: string;
    abandonmentRate: string;
    averageRating: string;
    avgDeliveryTime: string;
  };
}

interface ExportSalesData {
  orderNumber: string;
  date: Date;
  customer: string;
  email: string;
  total: number;
  status: string;
  items: number;
}

interface ExportProductsData {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  salesCount: number;
}
```

---

## Metrics Explanation

### Key Metrics

- **Total Sales**: Count of completed payments and total revenue
- **Orders**: Total order count and average items per order
- **Customers**: New customers registered in the period
- **Average Ticket**: Average revenue per order

### Sales by Day

Time series data showing daily sales count and revenue for the selected period.

### Top Products

Ranked by total revenue, showing:
- Product name
- Total units sold
- Total revenue
- Number of sales

### Top Sellers

Ranked by total revenue, showing:
- Seller name
- Number of products sold
- Total revenue
- Number of sales

### Performance Metrics

- **Conversion Rate**: Percentage of visitors who make a purchase (simplified calculation)
- **Average Session Time**: Average time users spend on the platform (placeholder - requires analytics integration)
- **Abandonment Rate**: Percentage of abandoned carts (placeholder - requires cart data)
- **Average Rating**: Average product rating from approved reviews
- **Average Delivery Time**: Average days from shipment to delivery

---

## Nice to Have Features

1. **Advanced Analytics Dashboard**: Visual charts and graphs
2. **Custom Date Ranges**: Flexible date range selection
3. **Export Formats**: CSV, Excel, PDF export options
4. **Real-time Updates**: Live data updates
5. **Comparative Analysis**: Compare periods (month-over-month, year-over-year)
6. **Revenue Forecasting**: Predictive analytics
7. **Customer Segmentation**: Analyze by customer segments
8. **Product Performance**: Detailed product analytics
9. **Seller Performance**: Detailed seller analytics
10. **Geographic Analytics**: Sales by location
11. **Payment Method Analysis**: Breakdown by payment methods
12. **Category Performance**: Sales by product category
13. **Time-based Trends**: Identify trends and patterns
14. **Automated Reports**: Scheduled report generation
15. **Report Templates**: Pre-built report templates
16. **Data Visualization**: Interactive charts and graphs
17. **Export Scheduling**: Automated report exports
18. **Report Sharing**: Share reports with team members
19. **Historical Data**: Long-term historical analysis
20. **Performance Alerts**: Notifications for significant changes

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

**Common Status Codes:**
- `400`: Bad Request (validation errors, missing parameters)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `500`: Internal Server Error

---

## Notes

- All dates are in ISO 8601 format (UTC)
- Revenue is calculated from completed payments only
- Sales by day includes all days in the period (even with 0 sales)
- Top products and sellers are limited to top 5 by default
- Performance metrics may include placeholders that require additional integrations
- Export endpoints return JSON data (frontend can convert to CSV/Excel)
- Period defaults to last 30 days if not specified
- All monetary values are in the platform's base currency (MZN)

