const ProductList = ({ products, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Get started by adding your first product</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
            <img
              src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-indigo-600">
                ${product.price?.toFixed(2)}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            
            {product.category && (
              <div className="text-sm text-gray-500">
                Category: {product.category.name || 'Uncategorized'}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              disabled={!product.isActive}
            >
              Delete
            </button>
          </div>

          {!product.isActive && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Cannot delete inactive product
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;