import { useState } from 'react';

const SearchBar = ({ query, onQueryChange, suggestions, onSuggestionSelect }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <div className="flex rounded-lg shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search products by name..."
          className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
          Search
        </button>
      </div>

      {suggestions.length > 0 && isFocused && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => onSuggestionSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;