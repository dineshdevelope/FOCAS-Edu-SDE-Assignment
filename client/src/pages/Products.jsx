import { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import { API_BASE_URL } from '../config';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || []);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      fetchProducts();
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please try again.');
    }
  };

  const handleUpdate = async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      fetchProducts();
      setEditingProduct(null);
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      fetchProducts();
      setError('');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <ProductList
        products={products}
        onEdit={(product) => {
          setEditingProduct(product);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Products;