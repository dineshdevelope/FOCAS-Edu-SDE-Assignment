import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Search products by name only
// @route   GET /api/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, inStock } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search by product name only (using regex, no text index needed)
    if (q) {
      query.name = { $regex: q, $options: 'i' }; // Case-insensitive search
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock !== undefined) {
      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      } else {
        query.stock = 0;
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error performing search',
      error: error.message 
    });
  }
};

// @desc    Get search suggestions (product names only)
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Search in product names only
    const products = await Product.find({
      name: { $regex: q, $options: 'i' },
      isActive: true
    })
    .limit(parseInt(limit))
    .select('name');

    // Return just product names as suggestions
    const suggestions = products.map(p => p.name);

    res.json(suggestions);
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ message: error.message });
  }
};

export { searchProducts, getSearchSuggestions };