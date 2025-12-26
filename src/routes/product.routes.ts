import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/index.js'; 

import {uploadMultipleFiles} from '../middlewares/multer.middleware.js';

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
  uploadMultipleFiles,
  createProductValidation,
  validate,
  createProduct
);

// GET ALL - GET /api/v1/products
productRouter.get('/', getProducts);

// GET, UPDATE, DELETE by ID
productRouter
  .route('/:id')
  .get(productIdParamValidation, validate, getProduct)
  .patch(
    uploadMultipleFiles,
    productIdParamValidation,
    updateProductValidation,
    validate,
    updateProduct
  )
  .delete(productIdParamValidation, validate, deleteProduct);
