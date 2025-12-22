import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async.handler.js';
import { apiResponse } from '../utils/api.response.js';
import { Category } from '../models/category.model.js';
import logger from '../utils/logger.js';
import { Types } from 'mongoose';

// Create a new category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return apiResponse(res, 400, 'error', 'Category name is required and cannot be empty');
  }

  const trimmedName = name.trim();

  const existingCategory = await Category.findOne({
    name: { $regex: `^${trimmedName}$`, $options: 'i' },
  });

  if (existingCategory) {
    return apiResponse(res, 409, 'error', 'Category with this name already exists');
  }

  const category = await Category.create({ name: trimmedName });

  logger.info('Category created successfully', {
    categoryId: category._id,
    name: trimmedName,
  });

  return apiResponse(res, 201, 'success', 'Category created successfully', category);
});

// Get all categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 }).select('-__v');

  return apiResponse(res, 200, 'success', 'Categories retrieved successfully', categories);
});

// Get a single category
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return apiResponse(res, 400, 'error', 'Category ID is required');
  }

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid category ID format');
  }

  const category = await Category.findById(id).select('-__v');
  if (!category) {
    return apiResponse(res, 404, 'error', 'Category not found');
  }

  return apiResponse(res, 200, 'success', 'Category retrieved successfully', category);
});

// Update a category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    return apiResponse(res, 400, 'error', 'Category ID is required');
  }

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid category ID format');
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return apiResponse(res, 400, 'error', 'Category name is required and cannot be empty');
  }

  const trimmedName = name.trim();

  const category = await Category.findById(id);
  if (!category) {
    return apiResponse(res, 404, 'error', 'Category not found');
  }

  const existingCategory = await Category.findOne({
    name: { $regex: `^${trimmedName}$`, $options: 'i' },
    _id: { $ne: new Types.ObjectId(id) },
  });

  if (existingCategory) {
    return apiResponse(res, 409, 'error', 'Another category with this name already exists');
  }

  category.name = trimmedName;
  await category.save();

  logger.info('Category updated successfully', {
    categoryId: id,
    newName: trimmedName,
  });

  return apiResponse(res, 200, 'success', 'Category updated successfully', category);
});

// Delete a category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return apiResponse(res, 400, 'error', 'Category ID is required');
  }

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(res, 400, 'error', 'Invalid category ID format');
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return apiResponse(res, 404, 'error', 'Category not found');
  }

  logger.info('Category deleted successfully', {
    categoryId: id,
    name: category.name,
  });

  return apiResponse(res, 200, 'success', 'Category deleted successfully');
});