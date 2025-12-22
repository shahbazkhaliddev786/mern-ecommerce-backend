import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async.handler.js';
import { apiResponse } from '../utils/api.response.js';
import { Brand } from '../models/brand.model.js';
import logger from '../utils/logger.js';
import { Types } from 'mongoose';

// Create a new brand
export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return apiResponse(res, 400, 'error', 'Brand name is required and cannot be empty');
  }

  const trimmedName = name.trim();

  const existingBrand = await Brand.findOne({
    name: { $regex: `^${trimmedName}$`, $options: 'i' },
  });

  if (existingBrand) {
    return apiResponse(res, 409, 'error', 'Brand with this name already exists');
  }

  const brand = await Brand.create({ name: trimmedName });

  logger.info('Brand created successfully', {
    brandId: brand._id,
    name: trimmedName,
  });

  return apiResponse(res, 201, 'success', 'Brand created successfully', brand);
});

export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await Brand.find().sort({ name: 1 }).select('-__v');

  return apiResponse(res, 200, 'success', 'Brands retrieved successfully', brands);
});

// Get a single brand
export const getBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return apiResponse(res, 400, 'error', 'Brand ID is required');
  }

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid brand ID format');
  }

  const brand = await Brand.findById(id).select('-__v');
  if (!brand) {
    return apiResponse(res, 404, 'error', 'Brand not found');
  }

  return apiResponse(res, 200, 'success', 'Brand retrieved successfully', brand);
});

// Update a brand
export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    return apiResponse(res, 400, 'error', 'Brand ID is required');
  }

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid brand ID format');
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return apiResponse(res, 400, 'error', 'Brand name is required and cannot be empty');
  }

  const trimmedName = name.trim();

  const brand = await Brand.findById(id);
  if (!brand) {
    return apiResponse(res, 404, 'error', 'Brand not found');
  }

  const existingBrand = await Brand.findOne({
    name: { $regex: `^${trimmedName}$`, $options: 'i' },
    _id: { $ne: new Types.ObjectId(id) },
  });

  if (existingBrand) {
    return apiResponse(res, 409, 'error', 'Another brand with this name already exists');
  }

  brand.name = trimmedName;
  await brand.save();

  logger.info('Brand updated successfully', {
    brandId: id,
    newName: trimmedName,
  });

  return apiResponse(res, 200, 'success', 'Brand updated successfully', brand);
});

// Delete a brand
export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return apiResponse(res, 400, 'error', 'Brand ID is required');
  }

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid brand ID format');
  }

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return apiResponse(res, 404, 'error', 'Brand not found');
  }

  logger.info('Brand deleted successfully', {
    brandId: id,
    name: brand.name,
  });

  return apiResponse(res, 200, 'success', 'Brand deleted successfully');
});