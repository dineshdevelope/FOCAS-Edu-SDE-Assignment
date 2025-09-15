import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post( createCategory);

router.route('/:id')
  .get(getCategory)
  .put( updateCategory)
  .delete( deleteCategory);

export default router;