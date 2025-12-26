import { Router } from 'express';
import {
  createOrder,
  updateOrder,
  deleteOrderCtrl,
  getOrders,
  getOrder,
} from '../controllers/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
// import { adminMiddleware } from '../middlewares/admin.js';

const orderRouter = Router();

// Create checkout session (user must be logged in for cart merge)
orderRouter.post('/checkout', authMiddleware, createOrder);

// User orders
orderRouter.get('/', authMiddleware, getOrders);
orderRouter.get('/:orderId', authMiddleware, getOrder);

// Admin only
orderRouter.patch('/:orderId/status', authMiddleware, updateOrder);
orderRouter.delete('/:orderId', authMiddleware, deleteOrderCtrl);

export default orderRouter;