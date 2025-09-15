import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments({ isActive: true });
    
    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category does not exist' });
    }
    
    const product = new Product({
      name,
      description,
      basePrice: price,
      price, // Initial price same as base price
      category,
      image,
      stock
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, isActive } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If category is being updated, check if it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category does not exist' });
      }
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    
    // When admin updates price, update both basePrice and price
    if (price !== undefined) {
      product.basePrice = price;
      product.price = price; // Reset to base price, dynamic pricing will apply on next request
    }
    
    product.category = category || product.category;
    product.image = image || product.image;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };