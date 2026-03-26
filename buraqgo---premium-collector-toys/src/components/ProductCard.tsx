import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isSaved = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.newArrival && (
              <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
                NEW
              </div>
            )}
            {product.scale && (
              <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                {product.scale}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {product.brand || product.type}
          </p>
          <h3 className="font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <p className="font-bold text-red-600">
                ৳{product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-[10px] text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            <Link to={`/product/${product.id}`} className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-tighter">
              View Details
            </Link>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-primary transition-all shadow-lg shadow-zinc-900/10 disabled:bg-gray-200 disabled:shadow-none"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
          isSaved 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-white/90 text-gray-400 hover:text-primary shadow-sm'
        }`}
      >
        <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
      </button>
    </div>
  );
};
