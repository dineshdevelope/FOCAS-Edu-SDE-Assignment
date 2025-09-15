import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${API_BASE_URL}/products?limit=4`);
        const productsData = await productsResponse.json();
        setFeaturedProducts(productsData.products || []);

        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.slice(0, 6) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <Link
            to="/products"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Add your product
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-indigo-600 font-bold text-xl">${product.price?.toFixed(2)}</p>
              <Link
                to={`/products/${product._id}`}
                className="block mt-4 bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/search?category=${category._id}`}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;