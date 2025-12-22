import { Router } from 'express';
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../controllers/index.js';

import {
  createBrandValidation,
  updateBrandValidation,
} from '../validations/brand.validations.js';
import { validate } from '../middlewares/validation.middleware.js';
import { param } from 'express-validator';

export const brandRouter = Router();

// POST /api/brands - Create a new brand
brandRouter.post('/', createBrandValidation, validate, createBrand);

// GET /api/brands - Get all brands
brandRouter.get('/', getAllBrands);

// GET /api/brands/:id - Get brand by ID
// PUT /api/brands/:id - Update brand
// DELETE /api/brands/:id - Delete brand
brandRouter
  .route('/:id')
  .get(
    param('id').isMongoId().withMessage('Invalid brand ID format'),
    validate,
    getBrandById
  )
  .patch(
    param('id').isMongoId().withMessage('Invalid brand ID format'),
    updateBrandValidation,
    validate,
    updateBrand
  )
  .delete(
    param('id').isMongoId().withMessage('Invalid brand ID format'),
    validate,
    deleteBrand
  );
