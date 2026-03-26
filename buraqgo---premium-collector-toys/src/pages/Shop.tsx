import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { Search, SlidersHorizontal, Database } from 'lucide-react';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const { isAdmin } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedScale, setSelectedScale] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const scales = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { if (p.scale) s.add(p.scale); });
    return Array.from(s).sort();
  }, [products]);

  const brands = useMemo(() => {
    const b = new Set<string>();
    products.forEach(p => { if (p.brand) b.add(p.brand); });
    return Array.from(b).sort();
  }, [products]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  const seedDatabase = async () => {
    try {
      for (const product of PRODUCTS) {
        await setDoc(doc(db, 'products', product.id), product);
      }
      alert('Database seeded successfully!');
    } catch (error) {
      console.error('Seeding error:', error);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.brand?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesScale = selectedScale === 'all' || product.scale === selectedScale;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesScale && matchesBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // newest/default
    });
  }, [products, searchQuery, selectedCategory, sortBy, selectedScale, selectedBrand]);

  const SkeletonCard = () => (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-[4/5] bg-gray-100" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 w-3/4" />
        <div className="h-3 bg-gray-100 w-1/2" />
        <div className="h-4 bg-gray-100 w-1/4" />
      </div>
    </div>
  );

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="space-y-16">
          {isAdmin && products.length === 0 && (
            <div className="flex justify-end">
              <button 
                onClick={seedDatabase}
                className="px-6 py-2 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all rounded-md flex items-center space-x-2"
              >
                <Database size={14} />
                <span>Seed Database</span>
              </button>
            </div>
          )}

        {/* Filters */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Search */}
            <div className="relative w-full lg:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search the collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border-none pl-12 pr-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-300 font-light"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCategory(val);
                    setSearchParams(val === 'all' ? {} : { category: val });
                  }}
                  className="w-full bg-zinc-50 border-none px-6 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-bold text-sm text-zinc-900 appearance-none min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  <option value="cars">Precision Cars</option>
                  <option value="guns">Tactical Gear</option>
                  <option value="collector">Collector Items</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Scale</label>
                <select 
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  className="w-full bg-zinc-50 border-none px-6 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-bold text-sm text-zinc-900 appearance-none min-w-[140px]"
                >
                  <option value="all">All Scales</option>
                  {scales.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-zinc-50 border-none px-6 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-bold text-sm text-zinc-900 appearance-none min-w-[160px]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || selectedScale !== 'all' || searchQuery !== '') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedScale('all');
                    setSearchParams({});
                  }}
                  className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center space-x-4">
          <div className="h-px flex-grow bg-zinc-100" />
          <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase whitespace-nowrap">
            Displaying {filteredProducts.length} {filteredProducts.length === 1 ? 'Masterpiece' : 'Masterpieces'}
          </p>
          <div className="h-px flex-grow bg-zinc-100" />
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="text-zinc-200 flex justify-center">
              <Search size={64} strokeWidth={1} />
            </div>
            <p className="text-zinc-400 font-light italic text-xl">No models found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs font-black tracking-widest uppercase border-b-2 border-primary pb-2 hover:text-primary transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
