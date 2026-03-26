import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Star, MessageSquare, User, Send, Heart } from 'lucide-react';
import { doc, getDoc, collection, query, where, limit, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Product, Review } from '../types';
import { toast } from 'sonner';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const isSaved = isInWishlist(id || '');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          
          // Fetch related products
          const q = query(
            collection(db, 'products'), 
            where('category', '==', productData.category),
            limit(5)
          );
          const relatedSnap = await getDocs(q);
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', id),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !product) return;
    if (!newReview.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous Collector',
        userPhoto: user.photoURL,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp()
      });

      // Update product rating (simple average)
      const newReviewCount = (product.reviewCount || 0) + 1;
      const currentRating = product.rating || 0;
      const newRating = ((currentRating * (product.reviewCount || 0)) + newReview.rating) / newReviewCount;

      await updateDoc(doc(db, 'products', id), {
        rating: Number(newRating.toFixed(1)),
        reviewCount: newReviewCount
      });

      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-4 w-32 bg-gray-100 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-gray-100" />
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-100" />
              <div className="h-12 w-3/4 bg-gray-100" />
              <div className="h-6 w-32 bg-gray-100" />
            </div>
            <div className="h-32 w-full bg-gray-100" />
            <div className="h-16 w-full bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center space-y-6">
        <h1 className="text-4xl font-display font-black tracking-tight">Model Not Found</h1>
        <Link to="/shop" className="btn-primary inline-block">Return to Collection</Link>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/shop" className="inline-flex items-center space-x-3 text-xs font-bold text-zinc-400 hover:text-primary transition-all uppercase tracking-widest mb-12 group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
        {/* Images */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-zinc-50 overflow-hidden relative rounded-3xl shadow-2xl shadow-zinc-200/50"
          >
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => toggleWishlist(product)}
              className={`absolute top-6 right-6 p-4 rounded-2xl transition-all duration-300 shadow-xl ${
                isSaved ? 'bg-primary text-white' : 'bg-white/90 text-zinc-900 hover:bg-white'
              }`}
            >
              <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </motion.div>
          <div className="grid grid-cols-4 gap-6">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                className={`aspect-square bg-zinc-50 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${selectedImage === idx ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-zinc-900 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-md">{product.brand || product.category}</span>
              <span className="px-3 py-1 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">{product.scale || '1:18'} Scale</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-none">{product.name}</h1>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} className="mr-1" />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {averageRating} / 5.0 Rating ({reviews.length} Verified Reviews)
              </span>
            </div>

            <div className="flex items-baseline space-x-4">
              <p className="text-5xl font-black text-red-600 tracking-tighter">৳{product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-2xl font-bold text-zinc-400 line-through tracking-tighter">
                  ৳{product.originalPrice.toLocaleString()}
                </p>
              )}
              <span className="text-zinc-400 text-sm font-light uppercase tracking-widest">VAT Included</span>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100" />

          <p className="text-zinc-600 text-lg font-light leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock: ${product.stock} Units Available` : 'Currently Out of Stock'}
              </span>
            </div>
            
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500 flex items-center justify-center space-x-4 shadow-2xl shadow-zinc-900/20 disabled:bg-zinc-200 disabled:shadow-none"
            >
              <ShoppingCart size={20} />
              <span>Add to Collection</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-zinc-100">
            <div className="flex flex-col items-center text-center space-y-3 group">
              <div className="p-3 bg-zinc-50 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 group">
              <div className="p-3 bg-zinc-50 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Truck size={24} />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Priority Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 group">
              <div className="p-3 bg-zinc-50 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <RotateCcw size={24} />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Collector Reviews</h2>
              <p className="text-zinc-500 font-light leading-relaxed">Insights and experiences shared by our community of dedicated collectors.</p>
            </div>

            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-6 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Share Your Experience</h4>
                <div className="flex items-center space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className="text-primary hover:scale-125 transition-transform duration-300"
                    >
                      <Star size={24} fill={star <= newReview.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe the detail and quality..."
                  className="w-full bg-white border-none p-5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px] transition-all placeholder:text-zinc-300"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl shadow-zinc-900/10"
                >
                  <Send size={18} />
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            ) : (
              <div className="bg-zinc-50 p-10 rounded-3xl text-center space-y-6 border border-zinc-100">
                <p className="text-zinc-500 font-light">Please sign in to share your collector's perspective.</p>
                <Link to="/login" className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all">Sign In</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            {reviews.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                <p className="text-zinc-400 font-light italic">No reviews have been shared for this model yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={review.id} 
                    className="bg-white border border-zinc-100 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-zinc-900/20">
                          {review.userPhoto ? (
                            <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} className="text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-zinc-900 uppercase tracking-tight">{review.userName}</h4>
                          <div className="flex items-center text-primary mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className="mr-0.5" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {review.createdAt?.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-lg font-light leading-relaxed italic">"{review.comment}"</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">You May Also Like</h2>
            <div className="h-px flex-grow mx-8 bg-zinc-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
