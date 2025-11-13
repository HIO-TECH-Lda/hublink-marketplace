# Seller Finance Tracking Module - Design Document

**Version:** 1.0  
**Target Users:** Sellers only  
**Purpose:** Comprehensive financial tracking and reporting for sellers

---

## 🎯 Overview

The Seller Finance Tracking Module allows sellers to:
- Track sales from the marketplace (automatically synced)
- Manually record sales made outside the app
- Track and categorize expenses
- Generate detailed financial reports (daily, weekly, monthly, custom)
- Analyze profitability and financial trends
- Export reports for accounting purposes

---

## 📊 Core Features

### 1. **Income Tracking**

#### 1.1 Automatic Sales Sync
- Automatically sync sales from marketplace orders
- Real-time updates when orders are completed/paid
- Link to order details
- Show order number, customer info, product details, amount, date

#### 1.2 Manual Sales Entry
- Add sales made outside the marketplace
- Fields:
  - Date
  - Amount
  - Customer name (optional)
  - Description/Notes
  - Category (optional)
  - Payment method
  - Receipt/Invoice attachment (optional)

#### 1.3 Other Income
- Allow sellers to record other income sources
- Examples: refunds, commissions, bonuses, etc.

### 2. **Expense Tracking**

#### 2.1 Expense Categories
Pre-defined categories:
- **Shipping & Delivery** (postage, courier fees, delivery costs)
- **Marketing & Advertising** (ads, promotions, social media)
- **Product Costs** (inventory, raw materials, supplies)
- **Packaging** (boxes, labels, wrapping materials)
- **Utilities** (electricity, internet, phone)
- **Rent & Storage** (warehouse, storage fees)
- **Professional Services** (accounting, legal, consulting)
- **Equipment & Tools** (machinery, tools, maintenance)
- **Travel & Transportation** (fuel, vehicle maintenance)
- **Taxes & Fees** (business taxes, platform fees)
- **Other** (custom category option)

#### 2.2 Expense Entry
- Date
- Amount
- Category
- Vendor/Supplier name (optional)
- Description
- Payment method
- Receipt attachment (optional)
- Recurring expense flag (optional)

#### 2.3 Recurring Expenses
- Set up recurring expenses (monthly subscriptions, rent, etc.)
- Automatic reminders
- Auto-create expense entries

### 3. **Financial Dashboard**

#### 3.1 Overview Cards
- **Total Income** (current period)
- **Total Expenses** (current period)
- **Net Profit** (income - expenses)
- **Profit Margin** (percentage)
- **Active Orders** (pending revenue)
- **Top Selling Products** (quick view)

#### 3.2 Charts & Visualizations
- **Income vs Expenses** (line chart - trend over time)
- **Expense Breakdown** (pie chart - by category)
- **Income Sources** (bar chart - marketplace vs manual)
- **Monthly Comparison** (compare current vs previous month)
- **Profit Trend** (line chart showing profit over time)

#### 3.3 Recent Transactions
- Last 10 income entries
- Last 10 expense entries
- Quick actions (edit, delete, view details)

### 4. **Reports**

#### 4.1 Report Types
- **Daily Report**: Income and expenses for a specific day
- **Weekly Report**: Summary for a week (Monday-Sunday)
- **Monthly Report**: Complete month summary
- **Custom Date Range**: User-defined start and end dates
- **Yearly Report**: Annual summary

#### 4.2 Report Contents
Each report includes:
- **Summary Section**:
  - Total Income
  - Total Expenses
  - Net Profit
  - Number of transactions
  - Average daily income/expenses

- **Income Breakdown**:
  - Marketplace sales (with order details)
  - Manual sales entries
  - Other income
  - Income by category (if applicable)

- **Expense Breakdown**:
  - Expenses by category
  - Top expense categories
  - Expense trends

- **Charts**:
  - Income vs Expenses chart
  - Category breakdown
  - Daily/weekly/monthly trends

- **Transaction List**:
  - Detailed list of all transactions
  - Sortable and filterable
  - Exportable to CSV/Excel

#### 4.3 Export Options
- PDF export (formatted report)
- Excel/CSV export (raw data)
- Email report (optional)

### 5. **Transaction Management**

#### 5.1 Transaction List
- View all income and expenses
- Filter by:
  - Type (income/expense)
  - Category
  - Date range
  - Payment method
  - Amount range
- Sort by date, amount, category
- Search by description, customer, vendor

#### 5.2 Transaction Details
- View full transaction details
- Edit transaction (if not synced from marketplace)
- Delete transaction (with confirmation)
- View attachments (receipts, invoices)
- Link to related order (if marketplace sale)

#### 5.3 Bulk Actions
- Delete multiple transactions
- Export selected transactions
- Categorize multiple transactions

---

## 🗄️ Database Schema

### **seller_finances** Collection

```javascript
{
  _id: ObjectId,
  sellerId: ObjectId, // ref: users
  type: String, // 'income' | 'expense'
  source: String, // 'marketplace' | 'manual' | 'other'
  
  // Income fields
  orderId: ObjectId, // ref: orders (if marketplace sale)
  amount: Number, // required
  currency: String, // default: 'MZN'
  
  // Expense fields
  category: String, // expense category
  vendor: String, // optional
  
  // Common fields
  description: String,
  date: Date, // required
  paymentMethod: String, // 'cash', 'mpesa', 'bank_transfer', 'emola', 'other'
  attachments: [{
    _id: ObjectId,
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: Date
  }],
  
  // Manual entry fields
  customerName: String, // for manual sales
  isRecurring: Boolean, // default: false
  recurringConfig: { // if isRecurring is true
    frequency: String, // 'daily', 'weekly', 'monthly', 'yearly'
    endDate: Date, // optional
    nextDueDate: Date
  },
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date // soft delete
}
```

### **expense_categories** Collection (Optional - can be hardcoded)

```javascript
{
  _id: ObjectId,
  name: String, // 'Shipping & Delivery'
  slug: String, // 'shipping-delivery'
  icon: String, // emoji or icon name
  color: String, // hex color for UI
  isDefault: Boolean,
  sellerId: ObjectId, // null for default categories, ObjectId for custom
  createdAt: Date
}
```

### **finance_reports** Collection (Optional - for saved/cached reports)

```javascript
{
  _id: ObjectId,
  sellerId: ObjectId,
  reportType: String, // 'daily', 'weekly', 'monthly', 'custom', 'yearly'
  startDate: Date,
  endDate: Date,
  data: {
    totalIncome: Number,
    totalExpenses: Number,
    netProfit: Number,
    transactions: [ObjectId], // ref: seller_finances
    // ... other calculated fields
  },
  exportedAt: Date,
  createdAt: Date
}
```

---

## 🌐 API Endpoints

### **Base URL:** `/api/v1/seller/finances`

### 1. **Get Financial Dashboard**

**GET** `/api/v1/seller/finances/dashboard`

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `period` (optional): 'today' | 'week' | 'month' | 'year' (default: 'month')

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 50000,
      "totalExpenses": 15000,
      "netProfit": 35000,
      "profitMargin": 70,
      "activeOrders": 5,
      "pendingRevenue": 12000
    },
    "charts": {
      "incomeVsExpenses": [
        { "date": "2024-01-01", "income": 5000, "expenses": 2000 },
        { "date": "2024-01-02", "income": 3000, "expenses": 1500 }
      ],
      "expenseBreakdown": [
        { "category": "Shipping & Delivery", "amount": 5000 },
        { "category": "Marketing", "amount": 3000 }
      ],
      "incomeSources": {
        "marketplace": 40000,
        "manual": 10000
      }
    },
    "recentTransactions": {
      "income": [...],
      "expenses": [...]
    },
    "topProducts": [...]
  }
}
```

### 2. **Get Transactions**

**GET** `/api/v1/seller/finances/transactions`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `type` (optional): 'income' | 'expense'
- `category` (optional): category slug
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `search` (optional): search in description, customer, vendor
- `sortBy` (optional): 'date' | 'amount' (default: 'date')
- `sortOrder` (optional): 'asc' | 'desc' (default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### 3. **Create Manual Income Entry**

**POST** `/api/v1/seller/finances/income`

**Request Body:**
```json
{
  "amount": 5000,
  "date": "2024-01-20",
  "description": "Sale to customer X",
  "customerName": "John Doe",
  "paymentMethod": "cash",
  "category": "manual_sale"
}
```

### 4. **Create Expense Entry**

**POST** `/api/v1/seller/finances/expenses`

**Request Body:**
```json
{
  "amount": 2000,
  "date": "2024-01-20",
  "category": "shipping-delivery",
  "description": "Postage for 10 orders",
  "vendor": "Post Office",
  "paymentMethod": "mpesa",
  "isRecurring": false
}
```

### 5. **Update Transaction**

**PATCH** `/api/v1/seller/finances/transactions/:transactionId`

**Request Body:** (all fields optional)
```json
{
  "amount": 5500,
  "description": "Updated description",
  "category": "marketing"
}
```

**Note:** Cannot update marketplace-synced transactions (only manual entries)

### 6. **Delete Transaction**

**DELETE** `/api/v1/seller/finances/transactions/:transactionId`

**Note:** Only manual entries can be deleted. Marketplace transactions are read-only.

### 7. **Get Report**

**GET** `/api/v1/seller/finances/reports`

**Query Parameters:**
- `type`: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
- `date` (for daily): ISO date string
- `week` (for weekly): ISO date string (any date in the week)
- `month` (for monthly): YYYY-MM format
- `year` (for yearly): YYYY format
- `startDate` (for custom): ISO date string
- `endDate` (for custom): ISO date string
- `format` (optional): 'json' | 'pdf' | 'excel' (default: 'json')

**Response:**
```json
{
  "success": true,
  "data": {
    "reportType": "monthly",
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "summary": {
      "totalIncome": 50000,
      "totalExpenses": 15000,
      "netProfit": 35000,
      "profitMargin": 70,
      "transactionCount": 45
    },
    "incomeBreakdown": {
      "marketplace": 40000,
      "manual": 10000,
      "other": 0
    },
    "expenseBreakdown": [
      {
        "category": "Shipping & Delivery",
        "amount": 5000,
        "percentage": 33.3
      }
    ],
    "transactions": [...],
    "charts": {...}
  }
}
```

### 8. **Get Expense Categories**

**GET** `/api/v1/seller/finances/categories`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Shipping & Delivery",
        "slug": "shipping-delivery",
        "icon": "🚚",
        "color": "#3B82F6"
      }
    ]
  }
}
```

### 9. **Upload Transaction Attachment**

**POST** `/api/v1/seller/finances/transactions/:transactionId/attachments`

**Request Body:**
```json
{
  "fileName": "receipt.jpg",
  "fileSize": 245760,
  "mimeType": "image/jpeg",
  "base64": "data:image/jpeg;base64,..."
}
```

### 10. **Sync Marketplace Sales** (Background Job)

**POST** `/api/v1/seller/finances/sync-sales`

**Note:** This should be called automatically when:
- Order status changes to 'delivered' or 'completed'
- Payment is confirmed
- Or can be triggered manually by seller

---

## 🎨 UI/UX Flow

### **Page Structure**

```
/seller/financas
├── /dashboard (default - overview)
├── /receitas (income)
│   ├── /nova (add manual income)
│   └── /[id] (view/edit income entry)
├── /despesas (expenses)
│   ├── /nova (add expense)
│   └── /[id] (view/edit expense entry)
├── /transacoes (all transactions)
└── /relatorios (reports)
    ├── /diario
    ├── /semanal
    ├── /mensal
    ├── /anual
    └── /personalizado
```

### **Dashboard Page** (`/seller/financas`)

**Layout:**
- Header with period selector (Today, This Week, This Month, Custom)
- Summary cards (4 cards in a row)
- Charts section (2-3 charts)
- Recent transactions table
- Quick actions (Add Income, Add Expense)

**Components:**
- `FinanceSummaryCards` - Overview metrics
- `IncomeVsExpensesChart` - Line chart
- `ExpenseBreakdownChart` - Pie chart
- `IncomeSourcesChart` - Bar chart
- `RecentTransactionsTable` - Transaction list

### **Income Page** (`/seller/financas/receitas`)

**Features:**
- Filter by date range, source (marketplace/manual)
- List of all income entries
- Marketplace sales (read-only, linked to orders)
- Manual entries (editable, deletable)
- "Add Income" button

**Components:**
- `IncomeList` - Table/list of income entries
- `IncomeForm` - Form for manual entry
- `MarketplaceSaleCard` - Display marketplace sales

### **Expenses Page** (`/seller/financas/despesas`)

**Features:**
- Filter by category, date range
- List of all expenses
- Category breakdown
- "Add Expense" button

**Components:**
- `ExpenseList` - Table/list of expenses
- `ExpenseForm` - Form for expense entry
- `ExpenseCategoryFilter` - Category filter component

### **Transactions Page** (`/seller/financas/transacoes`)

**Features:**
- Combined view of all income and expenses
- Advanced filtering
- Bulk actions
- Export functionality

**Components:**
- `TransactionList` - Combined transaction list
- `TransactionFilters` - Advanced filter panel
- `TransactionDetailsModal` - View transaction details

### **Reports Page** (`/seller/financas/relatorios`)

**Features:**
- Report type selector
- Date/period picker
- Report preview
- Export options (PDF, Excel)
- Print option

**Components:**
- `ReportSelector` - Choose report type
- `ReportPreview` - Display report
- `ReportCharts` - Visualizations
- `ReportExport` - Export buttons

---

## 🔄 Integration Points

### **1. Order System Integration**
- Automatically create income entries when:
  - Order is marked as delivered
  - Payment is confirmed
  - Payout is processed
- Link income entries to orders
- Show order details in income entry

### **2. Payout System Integration**
- Track payouts as expenses (platform fees)
- Link to payout records
- Show payout history in expenses

### **3. Product System**
- Track product costs as expenses
- Link expenses to products
- Calculate profit per product

### **4. Seller Dashboard**
- Add finance summary widget
- Quick access to finance module
- Show recent transactions

---

## 📱 Mobile Considerations

- Responsive design for all pages
- Mobile-optimized forms
- Touch-friendly charts
- Quick add buttons (floating action button)
- Camera integration for receipt capture

---

## 🔐 Security & Permissions

- Only sellers can access their own finances
- Admins can view all seller finances (for support)
- Soft delete for transactions (audit trail)
- Cannot modify marketplace-synced transactions
- Receipt attachments stored securely

---

## 📈 Future Enhancements

1. **Budget Planning**
   - Set monthly/yearly budgets
   - Budget vs actual tracking
   - Alerts when approaching budget limits

2. **Tax Management**
   - Tax category tracking
   - Tax report generation
   - VAT calculations

3. **Multi-Currency Support**
   - Support for multiple currencies
   - Currency conversion
   - Exchange rate tracking

4. **Bank Integration**
   - Connect bank accounts
   - Automatic transaction import
   - Bank reconciliation

5. **Invoice Generation**
   - Create invoices for manual sales
   - Send invoices to customers
   - Track invoice payments

6. **Financial Goals**
   - Set revenue goals
   - Track progress
   - Achievement badges

7. **Analytics & Insights**
   - Profitability analysis
   - Trend predictions
   - Recommendations

---

## 🚀 Implementation Phases

### **Phase 1: MVP (2-3 weeks)**
- Basic income/expense tracking
- Manual entry forms
- Simple dashboard
- Basic reports (monthly)
- Transaction list

### **Phase 2: Enhanced Features (2 weeks)**
- Marketplace sales sync
- Advanced filtering
- Multiple report types
- Charts and visualizations
- Export functionality

### **Phase 3: Polish & Optimization (1 week)**
- UI/UX improvements
- Performance optimization
- Mobile responsiveness
- Documentation

---

## 📝 Notes

- All amounts should be stored in the smallest currency unit (cents) to avoid floating-point issues
- Use ISO date format for all dates
- Implement soft delete for audit purposes
- Cache dashboard data for performance
- Consider rate limiting for report generation
- Add data validation on both frontend and backend

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Design Phase

