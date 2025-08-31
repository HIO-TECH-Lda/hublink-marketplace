# Txova Marketplace API

A TypeScript-based REST API for the Txova Marketplace platform, built with Express.js and MongoDB Atlas.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Redis (optional, for caching)

### Installation

1. **Clone and install dependencies**
```bash
cd api
npm install
```

2. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster (M0 Free tier is sufficient for development)
   - Create a database user with read/write permissions
   - Get your connection string

3. **Environment Configuration**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster-url/txova_marketplace?retryWrites=true&w=majority
```

### MongoDB Atlas Connection String Format

Your connection string should look like this:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

**Steps to get your connection string:**
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<database-name>` with your values

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Network Access**
   - In Atlas dashboard, go to "Network Access"
   - Add your IP address or use `0.0.0.0/0` for development (allows all IPs)

2. **Database Access**
   - Go to "Database Access"
   - Create a new database user with read/write permissions
   - Use a strong password

3. **Collections**
   The API will automatically create these collections:
   - `users` - User accounts and authentication
   - `sellers` - Seller profiles and business info
   - `products` - Product catalog
   - `orders` - Order management
   - `payments` - Payment transactions
   - `reviews` - Product reviews
   - `tickets` - Support tickets

## 🧪 Testing the Setup

Once your server is running, test the database connection:

```bash
# Test database connection
curl http://localhost:3002/api/v1/test/db-test

# Create a test user
curl -X POST http://localhost:3002/api/v1/test/create-test-user
```

## 📁 Project Structure

```
src/
├── config/          # Database and environment configuration
├── models/          # Mongoose models and schemas
├── middleware/      # Authentication, validation, etc.
├── routes/          # API route handlers
├── services/        # Business logic
├── utils/           # Helper functions
├── types/           # TypeScript type definitions
└── app.ts           # Main application file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript in production
- `npm test` - Run tests (to be implemented)

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Info
- `GET /api/v1` - API information and available endpoints

### Test Routes
- `GET /api/v1/test/db-test` - Test database connection
- `POST /api/v1/test/create-test-user` - Create a test user

## 🔐 Environment Variables

Required environment variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3002)

## 📝 Next Steps

1. **Authentication System** - Implement JWT-based authentication
2. **User Management** - Complete user CRUD operations
3. **Product Management** - Add product catalog functionality
4. **Payment Integration** - Integrate M-Pesa, E-Mola, and Stripe
5. **Admin Dashboard** - Build admin management features

## 🛠️ Development

### Adding New Models
1. Create the model in `src/models/`
2. Add TypeScript interfaces in `src/types/`
3. Create routes in `src/routes/`
4. Add middleware for validation and authentication

### Database Migrations
For production, consider using a migration tool like `migrate-mongo` for schema changes.

## 📊 Monitoring

The API includes basic logging and error handling. For production, consider:
- Application monitoring (Sentry)
- Performance monitoring (New Relic)
- Database monitoring (MongoDB Atlas built-in tools)

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting on all endpoints
- Input validation with Joi
- CORS configuration
- Helmet.js for security headers
