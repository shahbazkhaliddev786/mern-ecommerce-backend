import { body, param } from 'express-validator';

export const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

export const updateCartItemValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

export const removeFromCartValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
];