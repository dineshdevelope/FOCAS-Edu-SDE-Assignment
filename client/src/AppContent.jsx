import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Search from './pages/Search';
import { UserProvider } from './hooks/useUser.jsx';
import { useVisitTracking } from './hooks/useVisitTracking';

function AppContent() {
  useVisitTracking();

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default AppContent;