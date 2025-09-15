import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import trackVisit from '../middleware/visitTracker.js';
import applyDynamicPricing from '../middleware/dynamicPricing.js';

const router = express.Router();

router.route('/')
  .get(trackVisit, applyDynamicPricing, getProducts)
  .post(createProduct);

router.route('/:id')
  .get(trackVisit, applyDynamicPricing, getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;