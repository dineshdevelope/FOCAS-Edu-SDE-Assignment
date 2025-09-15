import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setProduct(productData.product);
        setError('');
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found or failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Product Not Found</h2>
          <p className="text-red-600">{error || 'The product you are looking for does not exist.'}</p>
        </div>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  // Create image array (main image + any additional images)
  const images = [product.image, ...(product.images || [])].filter(img => img);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={images[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-contain max-h-96"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-gray-100 rounded-md overflow-hidden aspect-square border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  product.stock > 0 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              {/* Category */}
              {product.category && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{product.category.name}</span>
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-600">
                    ${product.price?.toFixed(2)}
                  </span>
                  {product.basePrice && product.basePrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.basePrice && product.basePrice > product.price && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium inline-block">
                    Save ${(product.basePrice - product.price).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                {product.stock > 0 ? (
                  <>
                    <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-semibold"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Details Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Authentic Product Guarantee</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Free Shipping on orders over $50</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>30-Day Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;