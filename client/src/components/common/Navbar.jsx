import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

const Navbar = () => {
  const { currentUser, setCurrentUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            E-Commerce Store
          </Link>
          
          <div className="flex space-x-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            
            {isAuthenticated() && (
              <>
                <Link to="/products" className="text-gray-700 hover:text-indigo-600">
                  Products
                </Link>
                <Link to="/categories" className="text-gray-700 hover:text-indigo-600">
                  Categories
                </Link>
                <Link to="/users" className="text-gray-700 hover:text-indigo-600">
                  Users
                </Link>
              </>
            )}
            
            <Link to="/search" className="text-gray-700 hover:text-indigo-600">
              Search
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;