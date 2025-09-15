import express from 'express';
import {
  searchProducts,
  getSearchSuggestions
} from '../controllers/searchController.js';
import trackVisit from '../middleware/visitTracker.js';
import applyDynamicPricing from '../middleware/dynamicPricing.js';

const router = express.Router();

router.get('/', trackVisit, applyDynamicPricing, searchProducts);
router.get('/suggestions', getSearchSuggestions);

export default router;