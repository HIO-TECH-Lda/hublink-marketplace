# Review System Test Suite

This document provides comprehensive documentation for the test suite covering the entire review system API.

## Overview

The test suite is designed to provide complete coverage of the review system functionality, including:

- **Unit Tests**: Testing individual components in isolation
- **Integration Tests**: Testing the full flow from API to database
- **Model Tests**: Testing database schema and validation
- **Validation Tests**: Testing input validation and sanitization
- **Performance Tests**: Testing scalability and response times

## Test Structure

```
src/__tests__/
├── reviewController.test.ts    # Controller unit tests
├── reviewService.test.ts       # Service layer tests
├── reviewModel.test.ts         # Database model tests
├── reviewValidation.test.ts    # Validation schema tests
├── reviewIntegration.test.ts   # Full integration tests
├── setup.ts                    # Test configuration
└── jest.config.js             # Jest configuration
```

## Test Categories

### 1. Controller Tests (`reviewController.test.ts`)

Tests the HTTP layer and request/response handling:

- **Review Creation**: POST `/api/reviews`
- **Review Retrieval**: GET `/api/reviews/product/:productId`
- **Review Updates**: PUT `/api/reviews/:reviewId`
- **Review Deletion**: DELETE `/api/reviews/:reviewId`
- **Review Moderation**: PATCH `/api/reviews/:reviewId/moderate`
- **Review Analytics**: GET `/api/reviews/admin/analytics`
- **Helpful Marking**: POST `/api/reviews/:reviewId/helpful`

**Key Test Scenarios:**
- Authentication and authorization
- Input validation
- Error handling
- Response formatting
- HTTP status codes

### 2. Service Tests (`reviewService.test.ts`)

Tests the business logic layer:

- **Data Validation**: Input sanitization and validation
- **Business Rules**: Duplicate prevention, rating limits
- **Database Operations**: CRUD operations
- **Error Handling**: Graceful error management
- **Data Transformation**: Response formatting

**Key Test Scenarios:**
- Valid and invalid data handling
- User authorization checks
- Database constraint violations
- Business rule enforcement

### 3. Model Tests (`reviewModel.test.ts`)

Tests the database schema and MongoDB operations:

- **Schema Validation**: Required fields, data types, constraints
- **Database Operations**: Create, read, update, delete
- **Indexes**: Performance optimization
- **Aggregations**: Statistics and analytics queries
- **Relationships**: User and product associations

**Key Test Scenarios:**
- Field validation (rating 1-5, title length, etc.)
- Default values
- Timestamps
- Index performance
- Complex queries

### 4. Validation Tests (`reviewValidation.test.ts`)

Tests input validation and sanitization:

- **Schema Validation**: Joi schema validation
- **Data Sanitization**: Whitespace trimming, type conversion
- **Error Messages**: User-friendly error responses
- **Middleware Testing**: Request validation middleware

**Key Test Scenarios:**
- Required field validation
- Data type validation
- Length constraints
- Format validation (ObjectId, email, etc.)

### 5. Integration Tests (`reviewIntegration.test.ts`)

Tests the complete system flow:

- **End-to-End Flows**: Complete user journeys
- **Database Integration**: Real database operations
- **Authentication Flow**: JWT token handling
- **Concurrent Operations**: Race condition testing
- **Performance Testing**: Response time validation

**Key Test Scenarios:**
- Full review lifecycle
- User authentication
- Database consistency
- Error recovery
- Performance benchmarks

## Running Tests

### Prerequisites

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Test Database**:
   ```bash
   # Set test database URL
   export MONGODB_URI_TEST=mongodb://localhost:27017/review-system-test
   ```

3. **Environment Variables**:
   ```bash
   # Copy environment file
   cp .env.example .env.test
   
   # Set test environment variables
   NODE_ENV=test
   JWT_SECRET=test-secret-key
   MONGODB_URI=mongodb://localhost:27017/review-system-test
   ```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test categories
npm run test:unit
npm run test:integration

# Run specific test file
npm test -- reviewController.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="create review"
```

### Test Coverage

The test suite aims for comprehensive coverage:

- **Lines**: >95%
- **Functions**: >95%
- **Branches**: >90%
- **Statements**: >95%

## Test Data Management

### Test Fixtures

```typescript
// Sample test data
const testUser = {
  _id: 'user123',
  email: 'test@example.com',
  role: 'customer'
};

const testProduct = {
  _id: 'product123',
  name: 'Test Product',
  price: 99.99
};

const testReview = {
  _id: 'review123',
  userId: testUser._id,
  productId: testProduct._id,
  rating: 5,
  title: 'Great Product',
  comment: 'This is an excellent product!',
  status: 'approved'
};
```

### Database Cleanup

Tests automatically clean up data between runs:

```typescript
beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
```

## Mocking Strategy

### Service Layer Mocking

```typescript
// Mock external dependencies
jest.mock('../models/Review');
jest.mock('../models/User');
jest.mock('../models/Product');

const mockReview = Review as jest.Mocked<typeof Review>;
const mockUser = User as jest.Mocked<typeof User>;
const mockProduct = Product as jest.Mocked<typeof Product>;
```

### Authentication Mocking

```typescript
// Generate test tokens
const authToken = jwt.sign(
  { userId: testUser._id, role: testUser.role },
  process.env.JWT_SECRET || 'test-secret'
);

const adminToken = jwt.sign(
  { userId: 'admin123', role: 'admin' },
  process.env.JWT_SECRET || 'test-secret'
);
```

## Performance Testing

### Response Time Testing

```typescript
it('should handle large number of reviews efficiently', async () => {
  const startTime = Date.now();
  const response = await request(app)
    .get(`/api/reviews/product/${testProduct._id}`)
    .expect(200);

  const endTime = Date.now();
  const responseTime = endTime - startTime;

  expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
});
```

### Load Testing

```typescript
it('should handle concurrent review creation', async () => {
  const promises = Array(10).fill(null).map(() =>
    request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${authToken}`)
      .send(reviewData)
  );

  const responses = await Promise.all(promises);
  // Verify appropriate responses
});
```

## Error Testing

### Validation Errors

```typescript
it('should return 400 for invalid review data', async () => {
  const invalidData = {
    productId: testProduct._id,
    rating: 6, // Invalid rating
    title: '', // Empty title
    comment: 'Test comment'
  };

  const response = await request(app)
    .post('/api/reviews')
    .set('Authorization', `Bearer ${authToken}`)
    .send(invalidData)
    .expect(400);

  expect(response.body.success).toBe(false);
});
```

### Authorization Errors

```typescript
it('should return 403 for unauthorized access', async () => {
  const response = await request(app)
    .patch(`/api/reviews/${testReview._id}/moderate`)
    .set('Authorization', `Bearer ${authToken}`) // Non-admin token
    .send(moderateData)
    .expect(403);

  expect(response.body.success).toBe(false);
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Best Practices

### Test Organization

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear test descriptions
3. **Single Responsibility**: Each test focuses on one behavior
4. **Independent Tests**: Tests don't depend on each other

### Test Data

1. **Realistic Data**: Use realistic test data
2. **Edge Cases**: Test boundary conditions
3. **Invalid Data**: Test error scenarios
4. **Clean State**: Reset state between tests

### Performance

1. **Database Indexes**: Ensure proper indexing for queries
2. **Connection Pooling**: Use connection pooling for tests
3. **Async Operations**: Handle async operations properly
4. **Memory Management**: Clean up resources after tests

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure MongoDB is running
2. **Environment Variables**: Check test environment setup
3. **Port Conflicts**: Use different ports for test database
4. **Timeout Issues**: Increase Jest timeout for slow tests

### Debug Mode

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="create review" --verbose

# Debug Jest configuration
npm test -- --showConfig
```

## Coverage Reports

After running tests with coverage:

```bash
npm run test:coverage
```

This generates:
- **Console Report**: Summary in terminal
- **HTML Report**: Detailed coverage in `coverage/lcov-report/index.html`
- **LCOV Report**: Coverage data for CI tools

## Contributing

When adding new features:

1. **Write Tests First**: Follow TDD approach
2. **Maintain Coverage**: Keep coverage above 95%
3. **Update Documentation**: Document new test scenarios
4. **Follow Patterns**: Use existing test patterns and conventions

## Conclusion

This comprehensive test suite ensures:

- **Reliability**: All features work as expected
- **Maintainability**: Easy to modify and extend
- **Performance**: System performs under load
- **Security**: Proper authentication and authorization
- **Quality**: High code quality and standards

The test suite serves as living documentation and provides confidence in the review system's functionality and reliability.
