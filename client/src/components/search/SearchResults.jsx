import ProductCard from '../products/ProductCard';

const SearchResults = ({ results, isLoading, query, pagination, onPageChange }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Searching...</span>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {query ? `No results found for "${query}"` : 'Start searching for products'}
        </h3>
        <p className="text-gray-500">
          {query ? 'Try adjusting your search terms or filters' : 'Use the search bar above to find products'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {results.length} of {pagination.totalProducts} results
          {query && ` for "${query}"`}
        </p>
        
        {pagination.totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border rounded ${
                  page === pagination.currentPage 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;