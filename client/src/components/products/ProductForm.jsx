import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    isActive: true
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.basePrice || product.price || '',
        category: product.category?._id || product.category || '',
        stock: product.stock || '',
        image: product.image || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    }

    fetchCategories();
  }, [product]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image.trim(),
        isActive: formData.isActive
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                  errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                  errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              {loading && <p className="text-gray-500 text-sm mt-1">Loading categories...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                  errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                errors.image ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-20 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Active Product
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;