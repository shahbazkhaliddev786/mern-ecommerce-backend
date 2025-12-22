import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/index.js';

import {
  createCategoryValidation,
  updateCategoryValidation,
} from '../validations/category.validations.js';
import { validate } from '../middlewares/validation.middleware.js';
import { param } from 'express-validator';

export const categoryRouter = Router();

// POST /api/categories - Create a new category
categoryRouter.post('/', createCategoryValidation, validate, createCategory);

// GET /api/categories - Get all categories
categoryRouter.get('/', getAllCategories);

// GET /api/categories/:id - Get category by ID
// PUT /api/categories/:id - Update category
// DELETE /api/categories/:id - Delete category
categoryRouter
  .route('/:id')
  .get(
    param('id').isMongoId().withMessage('Invalid category ID format'),
    validate,
    getCategoryById
  )
  .patch(
    param('id').isMongoId().withMessage('Invalid category ID format'),
    updateCategoryValidation,
    validate,
    updateCategory
  )
  .delete(
    param('id').isMongoId().withMessage('Invalid category ID format'),
    validate,
    deleteCategory
  );
