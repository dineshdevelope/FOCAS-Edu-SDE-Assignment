import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProvider } from './hooks/useUser.jsx';
import { useVisitTracking } from './hooks/useVisitTracking';
import ProtectedRoute from './components/common/ProtectedRoute';
import ViewProduct from './pages/ViewProduct';

function AppContent() {
  useVisitTracking();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          
          {/* Protected Routes */}
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
           <Route path="/products/:id" element={
            <ProtectedRoute>
              <ViewProduct />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;