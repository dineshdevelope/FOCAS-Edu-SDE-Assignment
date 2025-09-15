import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import SearchFilters from '../components/search/SearchFilters';
import { API_BASE_URL } from '../config';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    availability: 'all'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  useEffect(() => {
    const getSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const params = new URLSearchParams({ q: query, limit: '5' });
        const response = await fetch(`${API_BASE_URL}/search/suggestions?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = useCallback(async (page = 1) => {
    if (!query && !filters.category && !filters.minPrice && !filters.maxPrice) {
      setResults([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0
      });
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.availability !== 'all') {
        params.append('inStock', filters.availability === 'inStock');
      }
      params.append('page', page);
      params.append('limit', 12);

      const response = await fetch(`${API_BASE_URL}/search?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }
      
      setResults(data.products || []);
      setPagination({
        currentPage: data.currentPage || page,
        totalPages: data.totalPages || 1,
        totalProducts: data.totalProducts || 0
      });
    } catch (error) {
      console.error('Error searching:', error);
      setError(error.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters]);

  useEffect(() => {
    // Reset to page 1 when query or filters change
    const timeoutId = setTimeout(() => performSearch(1), 500);
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const handlePageChange = (newPage) => {
    performSearch(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Search</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        
        <div className="lg:col-span-3">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
            onSuggestionSelect={(suggestion) => setQuery(suggestion)}
          />
          
          <SearchResults 
            results={results} 
            isLoading={isSearching}
            query={query}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;