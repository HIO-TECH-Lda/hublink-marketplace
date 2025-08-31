import { Router } from 'express';
import { TestController } from '../controllers/testController';

const router = Router();

// Test database connection
router.get('/db-test', TestController.testDatabase);

// Test user creation
router.post('/create-test-user', TestController.createTestUser);

// Test seller creation
router.post('/create-test-seller', TestController.createTestSeller);

// Test category creation
router.post('/create-test-category', TestController.createTestCategory);

// Test product creation
router.post('/create-test-product', TestController.createTestProduct);

// Test cart creation
router.post('/create-test-cart', TestController.createTestCart);

// Test order creation
router.post('/create-test-order', TestController.createTestOrder);

export default router;
