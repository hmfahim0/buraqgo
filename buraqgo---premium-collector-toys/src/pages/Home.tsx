import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../constants';

export const Home = () => {
  const featuredProducts = PRODUCTS.filter(p => p.featured);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Buraqgo_bg.png" 
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Premium <span className="text-primary">Collector</span> Toys
              </h1>
              <p className="text-gray-300 text-lg max-w-lg">
                Discover Bangladesh's most exclusive collection of precision models and high-end toys.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">
                Shop Collection
              </Link>
              <Link to="/about" className="px-8 py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-all">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Releases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black">Featured Releases</h2>
            <p className="text-gray-500 mt-2">The latest additions to our collection.</p>
          </div>
          <Link to="/shop" className="text-primary font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/shop?category=cars" className="group relative h-[250px] overflow-hidden rounded-3xl bg-zinc-100">
            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Explore</span>
                <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Precision Cars</h3>
              </div>
              <div className="flex items-center space-x-2 text-zinc-900 font-black text-xs uppercase tracking-widest group-hover:text-primary transition-colors">
                <span>View Collection</span>
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity">
              <img 
                src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1200" 
                alt="Cars Category"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </Link>

          <Link to="/shop?category=guns" className="group relative h-[250px] overflow-hidden rounded-3xl bg-zinc-100">
            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Explore</span>
                <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">Tactical Gear</h3>
              </div>
              <div className="flex items-center space-x-2 text-zinc-900 font-black text-xs uppercase tracking-widest group-hover:text-primary transition-colors">
                <span>View Collection</span>
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity">
              <img 
                src="https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1200" 
                alt="Tactical Category"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-black">Join the Community</h2>
          <p className="text-gray-600 text-lg">
            Subscribe to get notified about limited edition drops and exclusive events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white border border-gray-200 px-6 py-4 w-full focus:ring-2 focus:ring-primary outline-none rounded-lg"
            />
            <button className="bg-black text-white px-10 py-4 font-bold hover:bg-primary transition-all rounded-lg whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
