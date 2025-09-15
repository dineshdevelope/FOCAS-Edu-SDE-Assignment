import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category || !category.isActive) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const categoryExists = await Category.findOne({ name });
    
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name,
      description
    });
    
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if name is being changed to one that already exists
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }
    
    category.name = name || category.name;
    category.description = description || category.description;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category is used by any products
    const productsCount = await Product.countDocuments({ 
      category: req.params.id, 
      isActive: true 
    });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with associated products' 
      });
    }
    
    // Soft delete by setting isActive to false
    category.isActive = false;
    await category.save();
    
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getCategories, getCategory, createCategory, updateCategory, deleteCategory };