import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ShippingInfo } from './pages/ShippingInfo';
import { Returns } from './pages/Returns';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Heritage } from './pages/Heritage';
import { Profile } from './pages/Profile';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

const Login = () => {
  const { login, user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen pt-48 px-4 text-center">Loading...</div>;
  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen pt-48 px-4 text-center space-y-8">
      <h1 className="text-4xl font-display font-black tracking-tight">Access Your Collection</h1>
      <p className="text-gray-500">Sign in to manage your orders and collection.</p>
      <button onClick={login} className="btn-primary">Sign In with Google</button>
    </div>
  );
};

const ProtectedAdmin = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading, user } = useAuth();
  
  if (loading) return <div className="min-h-screen pt-48 px-4 text-center">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shipping" element={<ShippingInfo />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/heritage" element={<Heritage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={
                    <ProtectedAdmin>
                      <Admin />
                    </ProtectedAdmin>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="bottom-right" richColors />
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
