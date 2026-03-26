import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { cartCount } = useCart();
  const { user, profile, login, logout, isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black tracking-tighter italic">Buraq<span className="text-primary">GO</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-bold hover:text-primary transition-colors">Shop All</Link>
            <div className="relative group">
              <button className="text-sm font-bold hover:text-primary transition-colors flex items-center space-x-1">
                <span>Categories</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 rounded-lg">
                <Link to="/shop?category=cars" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary rounded">Cars</Link>
                <Link to="/shop?category=guns" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary rounded">Guns</Link>
                <Link to="/shop?category=collector" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary rounded">Collector Items</Link>
              </div>
            </div>
            <Link to="/about" className="text-sm font-bold hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-bold hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="p-2 text-gray-600 hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-gray-600 hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Admin Dashboard">
                    <Shield size={18} />
                  </Link>
                )}
                <div className="flex items-center space-x-2 group relative">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary transition-colors duration-500">
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                      alt={user.displayName || ''} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 p-3 rounded-xl">
                    <p className="px-4 py-3 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 mb-2">
                      {profile?.displayName || user.displayName}
                    </p>
                    <Link 
                      to="/profile" 
                      className="w-full flex items-center space-x-3 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-primary transition-all rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={14} />
                      <span>My Collection</span>
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-red-600 hover:bg-red-50 transition-all rounded-lg"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <button 
                  onClick={login}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  <User size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Sign In</span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 p-4 rounded-xl">
                  <button 
                    onClick={login}
                    className="w-full flex items-center justify-center px-4 py-3 text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white hover:bg-primary transition-all rounded-lg"
                  >
                    Sign In
                  </button>
                  <div className="mt-3 text-center">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">New Collector?</p>
                    <button 
                      onClick={login}
                      className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline mt-1 inline-block"
                    >
                      Join the Club
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button 
              className="md:hidden p-2 text-gray-400 hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-6 animate-in slide-in-from-top duration-300">
          <Link to="/shop" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Shop All Toys</Link>
          <Link to="/shop" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Categories</Link>
          <Link to="/about" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="block text-lg font-bold text-primary" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {!user && (
            <button 
              onClick={() => {
                login();
                setIsMenuOpen(false);
              }} 
              className="block w-full text-left text-lg font-bold text-primary"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
