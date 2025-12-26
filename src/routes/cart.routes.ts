// src/routes/cart.routes.ts

import { Router } from 'express';
import {
  getUserCart,
  addItemToCart,
  updateItemInCart,
  removeItemFromCart,
  clearUserCart,
} from '../controllers/index.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

export const cartRouter = Router();

// TODO: Protect routes with authMiddleware when to test all edge cases
// Validations as well

cartRouter.get('/', authMiddleware, getUserCart);                    
cartRouter.post('/', authMiddleware, addItemToCart);                 
cartRouter.patch('/items/:productId', authMiddleware, updateItemInCart); 
cartRouter.delete('/items/:productId', authMiddleware, removeItemFromCart); 
cartRouter.delete('/', authMiddleware, clearUserCart);           
