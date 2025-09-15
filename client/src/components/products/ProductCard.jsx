import { Link } from 'react-router-dom';
import { calculateDynamicPrice } from '../../utils/dynamicPricing';

const ProductCard = ({ product }) => {
  // Apply dynamic pricing if needed
  const displayPrice = product.basePrice 
    ? calculateDynamicPrice(product.basePrice) 
    : product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              ${displayPrice?.toFixed(2)}
            </span>
            {product.basePrice && displayPrice < product.basePrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <span className={`px-2 py-1 text-xs rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <Link
          to={`/products/${product._id}`}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors block text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;