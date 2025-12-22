import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/index.js'; 

import uploadFiles from '../middlewares/multer.middleware.js';

import {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
} from '../validations/product.validations.js';

import { validate } from '../middlewares/validation.middleware.js';

export const productRouter = Router();

// CREATE - POST /api/v1/products
// Multipart form-data with field "files" for images (up to 10)
productRouter.post(
  '/',
  uploadFiles,
  createProductValidation,
  validate,
  createProduct
);

// GET ALL - GET /api/v1/products
productRouter.get('/', getAllProducts);

// GET, UPDATE, DELETE by ID
productRouter
  .route('/:id')
  .get(productIdParamValidation, validate, getProductById)
  .patch(
    uploadFiles,
    productIdParamValidation,
    updateProductValidation,
    validate,
    updateProduct
  )
  .delete(productIdParamValidation, validate, deleteProduct);
