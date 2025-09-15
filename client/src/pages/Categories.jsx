import { useState, useEffect } from 'react';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import { API_BASE_URL } from '../config';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreate = async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (response.ok) {
        fetchCategories();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdate = async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (response.ok) {
        fetchCategories();
        setEditingCategory(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New Category
        </button>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      <CategoryList
        categories={categories}
        onEdit={(category) => {
          setEditingCategory(category);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Categories;