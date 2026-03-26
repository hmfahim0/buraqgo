import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter italic">Buraq<span className="text-primary">GO</span></span>
            </Link>
            <p className="text-gray-500 text-sm">
              Bangladesh's premier destination for high-end collector toys and precision models.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/BuraqGo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/shop" className="text-sm text-gray-500 hover:text-primary transition-colors">All Toys</Link>
              <Link to="/shop?category=cars" className="text-sm text-gray-500 hover:text-primary transition-colors">Cars</Link>
              <Link to="/shop?category=guns" className="text-sm text-gray-500 hover:text-primary transition-colors">Guns</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/shipping" className="text-sm text-gray-500 hover:text-primary transition-colors">Shipping Info</Link>
              <Link to="/returns" className="text-sm text-gray-500 hover:text-primary transition-colors">Returns</Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold">Stay Updated</h4>
            <p className="text-gray-500 text-sm">Subscribe for new arrivals and exclusive offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white border border-gray-200 px-4 py-2 w-full focus:ring-1 focus:ring-primary outline-none rounded-l-md"
              />
              <button className="bg-primary text-white px-4 py-2 font-bold hover:bg-red-800 transition-colors rounded-r-md">Join</button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400">
            © 2024 BuraqGO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
