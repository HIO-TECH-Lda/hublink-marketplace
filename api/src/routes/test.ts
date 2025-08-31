import { Router } from 'express';
import { TestController } from '../controllers/testController';

const router = Router();

// Test database connection
router.get('/db-test', TestController.testDatabase);

// Test user creation
router.post('/create-test-user', TestController.createTestUser);

// Test category creation
router.post('/create-test-category', TestController.createTestCategory);

// Test product creation
router.post('/create-test-product', TestController.createTestProduct);

export default router;
