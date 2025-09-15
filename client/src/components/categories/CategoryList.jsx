const CategoryList = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📂</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
        <p className="text-gray-500">Get started by adding your first category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                <p className={`text-sm ${
                  category.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {category.description || 'No description provided'}
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              disabled={!category.isActive}
            >
              Delete
            </button>
          </div>

          {!category.isActive && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Cannot delete inactive category
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;