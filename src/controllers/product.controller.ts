import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async.handler.js';
import { apiResponse } from '../utils/api.response.js';
import { Product } from '../models/product.model.js';
import cloudinary from '../utils/cloudinary.js';
import bufferGenerator from '../utils/buffer.generator.js';
import logger from '../utils/logger.js';
import { Types } from 'mongoose';

// Create a new product
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, stock, category, brand } = req.body;

  if (!name?.trim() || !description?.trim()) {
    return apiResponse(res, 400, 'error', 'Name and description are required');
  }

  const categoryDoc = await Product.db.model('Category').findById(category);
  const brandDoc = await Product.db.model('Brand').findById(brand);
  if (!categoryDoc || !brandDoc) return apiResponse(res, 400, 'error', 'Invalid category or brand ID');

  let images: string[] = [];

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
      const dataUri = bufferGenerator(file);
      if (!dataUri?.content) {
        throw new Error('Failed to generate data URI for uploaded file');
      }

      const result = await cloudinary.uploader.upload(dataUri.content, {
        folder: 'products',
        resource_type: 'image',
      });

      return result.secure_url;
    });

    images = await Promise.all(uploadPromises);
  }

  const product = new Product({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock || 0),
    category,
    brand,
    images,
  });

  await product.save();

  const populatedProduct = await Product.findById(product._id)
    .populate([
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ])
    .select('-__v')
    .lean();

  if (!populatedProduct) {
    return apiResponse(res, 500, 'error', 'Failed to retrieve created product');
  }

  logger.info('Product created successfully', {
    productId: populatedProduct._id,
    name: populatedProduct.name,
    imagesCount: images.length,
  });

  return apiResponse(res, 201, 'success', 'Product created successfully', populatedProduct);
});

// Get all products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .populate([
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ])
    .select('-__v')
    .lean();

  return apiResponse(res, 200, 'success', 'Products retrieved successfully', products);
});

// Get a single product
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid product ID format');
  }

  const product = await Product.findById(id)
    .populate([
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ])
    .select('-__v')
    .lean();

  if (!product) {
    return apiResponse(res, 404, 'error', 'Product not found');
  }

  return apiResponse(res, 200, 'success', 'Product retrieved successfully', product);
});

// Update a product
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, category, brand } = req.body;

  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid product ID format');
  }

  const product = await Product.findById(id);
  if (!product) {
    return apiResponse(res, 404, 'error', 'Product not found');
  }

  if (category) {
    const cat = await Product.db.model('Category').findById(category);
    if (!cat) return apiResponse(res, 400, 'error', 'Invalid category ID');
    product.category = category;
  }

  if (brand) {
    const br = await Product.db.model('Brand').findById(brand);
    if (!br) return apiResponse(res, 400, 'error', 'Invalid brand ID');
    product.brand = brand;
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    if (product.images.length > 0) {
      const deletePromises = product.images.map((url) => {
        const parts = url.split('/');
        const filenameWithExt = parts.at(-1);
        if (!filenameWithExt) {
          logger.warn('Invalid image URL format, skipping delete', { url });
          return Promise.resolve();
        }

        const publicId = 'products/' + filenameWithExt.split('.')[0];

        return cloudinary.uploader.destroy(publicId).catch((err: any) => {
          logger.warn('Failed to delete old image from Cloudinary', {
            publicId,
            error: err.message,
          });
        });
      });

      await Promise.all(deletePromises);
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
      const dataUri = bufferGenerator(file);
      if (!dataUri?.content) throw new Error('Failed to generate data URI');

      const result = await cloudinary.uploader.upload(dataUri.content, {
        folder: 'products',
      });

      return result.secure_url;
    });

    product.images = await Promise.all(uploadPromises);
  }

  if (name !== undefined) product.name = name.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  await product.save();

  const populatedProduct = await Product.findById(product._id)
    .populate([
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ])
    .select('-__v')
    .lean();

  logger.info('Product updated successfully', {
    productId: id,
    name: product.name,
  });

  return apiResponse(res, 200, 'success', 'Product updated successfully', populatedProduct);
});

// Delete a product 
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid product ID format');
  }

  const product = await Product.findById(id);
  if (!product) {
    return apiResponse(res, 404, 'error', 'Product not found');
  }

  if (product.images.length > 0) {
    const deletePromises = product.images.map((url) => {
      const parts = url.split('/');
      const filenameWithExt = parts.at(-1);
      if (!filenameWithExt) {
        logger.warn('Invalid image URL format, skipping delete', { url });
        return Promise.resolve();
      }

      const publicId = 'products/' + filenameWithExt.split('.')[0];

      return cloudinary.uploader.destroy(publicId).catch((err: any) => {
        logger.warn('Failed to delete image from Cloudinary', {
          publicId,
          error: err.message,
        });
      });
    });

    await Promise.all(deletePromises);
  }

  await Product.findByIdAndDelete(id);

  logger.info('Product permanently deleted', {
    productId: id,
    name: product.name,
    imagesDeleted: product.images.length,
  });

  return apiResponse(res, 200, 'success', 'Product deleted permanently');
});