import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ShoppingBag, MapPin, Phone, Mail, ChevronRight, Clock, CheckCircle, XCircle, Truck, User as UserIcon, Heart } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Order, Product, WishlistItem } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

const SkeletonOrder = () => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/50">
      <div className="space-y-2">
        <div className="h-2 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right space-y-2">
          <div className="h-2 w-16 bg-gray-200 rounded ml-auto" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="flex -space-x-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-16 h-16 rounded-lg border-2 border-white bg-gray-200" />
        ))}
      </div>
      <div className="pt-4 flex justify-between items-center">
        <div className="h-2 w-32 bg-gray-200 rounded" />
        <div className="h-2 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const SkeletonGarage = () => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-2 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export const Profile = () => {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'garage' | 'settings'>('orders');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'garage') setActiveTab('garage');
    else if (tab === 'settings') setActiveTab('settings');
    else setActiveTab('orders');
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setWishlistLoading(true);

    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WishlistItem));
      const products: Product[] = [];
      
      for (const item of items) {
        try {
          const productSnap = await getDoc(doc(db, 'products', item.productId));
          if (productSnap.exists()) {
            products.push({ id: productSnap.id, ...productSnap.data() } as Product);
          }
        } catch (error) {
          console.error('Error fetching wishlist product:', error);
        }
      }
      setWishlistProducts(products);
      setWishlistLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-48 text-center space-y-8">
        <h1 className="text-4xl font-display font-black tracking-tight">Access Restricted</h1>
        <p className="text-gray-500">Please sign in to view your collection and order history.</p>
        <Link to="/login" className="btn-primary inline-block">Sign In</Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={14} />;
      case 'cancelled': return <XCircle className="text-red-600" size={14} />;
      case 'shipped': return <Truck className="text-blue-600" size={14} />;
      default: return <Clock className="text-yellow-600" size={14} />;
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar / Profile Info */}
        <div className="w-full lg:w-80 space-y-12">
          <div className="space-y-6">
            <div className="relative w-32 h-32 mx-auto lg:mx-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-xl">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt={user.displayName || ''} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                <UserIcon size={16} />
              </div>
            </div>
            
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-2xl font-display font-black tracking-tight uppercase italic">
                {profile?.displayName || user.displayName}
              </h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center lg:justify-start space-x-2">
                <Mail size={12} />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}
            >
              <div className="flex items-center space-x-4">
                <ShoppingBag size={16} />
                <span>My Collection</span>
              </div>
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => setActiveTab('garage')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'garage' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}
            >
              <div className="flex items-center space-x-4">
                <Heart size={16} />
                <span>My Garage</span>
              </div>
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}
            >
              <div className="flex items-center space-x-4">
                <MapPin size={16} />
                <span>Shipping Details</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <h2 className="text-3xl font-display font-black tracking-tight uppercase italic">Order History</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{orders.length} Acquisitions</span>
                </div>

                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => <SkeletonOrder key={i} />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-24 text-center space-y-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <Package className="mx-auto text-gray-300" size={48} />
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-widest">No models found</p>
                      <p className="text-xs text-gray-400">Start your precision collection today.</p>
                    </div>
                    <Link to="/shop" className="btn-primary inline-block">Explore Shop</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all group">
                        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/50">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: #{order.id?.slice(-8).toUpperCase()}</p>
                            <p className="text-xs font-bold">{new Date(order.createdAt?.toDate()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Value</p>
                              <p className="text-lg font-display font-black tracking-tight">৳{order.total.toLocaleString()}</p>
                            </div>
                            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {getStatusIcon(order.status)}
                              <span>{order.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex -space-x-4 overflow-hidden">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-lg border-2 border-white overflow-hidden bg-gray-100 shadow-sm group-hover:translate-x-2 transition-transform duration-500" style={{ zIndex: 10 - idx }}>
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            ))}
                            {order.items.length > 4 && (
                              <div className="w-16 h-16 rounded-lg border-2 border-white bg-black text-white flex items-center justify-center text-[10px] font-bold z-0">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                          <div className="pt-4 flex justify-between items-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {order.items.length} {order.items.length === 1 ? 'Model' : 'Models'} in this acquisition
                            </p>
                            <Link to={`/shop`} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View Details</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'garage' ? (
              <motion.div 
                key="garage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <h2 className="text-3xl font-display font-black tracking-tight uppercase italic">My Garage</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{wishlistProducts.length} Saved Models</span>
                </div>

                {wishlistLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => <SkeletonGarage key={i} />)}
                  </div>
                ) : wishlistProducts.length === 0 ? (
                  <div className="py-24 text-center space-y-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <Heart className="mx-auto text-gray-300" size={48} />
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-widest">Garage is empty</p>
                      <p className="text-xs text-gray-400">Save your favorite models here for later.</p>
                    </div>
                    <Link to="/shop" className="btn-primary inline-block">Explore Shop</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {wishlistProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <h2 className="text-3xl font-display font-black tracking-tight uppercase italic">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-8 space-y-6 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-4 text-primary">
                      <MapPin size={24} />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Primary Address</h3>
                    </div>
                    {orders.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-bold">{orders[0].shippingInfo.fullName}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {orders[0].shippingInfo.address1}<br />
                          {orders[0].shippingInfo.city}, {orders[0].shippingInfo.postalCode}
                        </p>
                        <div className="pt-4 flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <Phone size={12} />
                          <span>{orders[0].shippingInfo.phone}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic uppercase tracking-widest">No shipping history found. Your details will be saved after your first acquisition.</p>
                    )}
                  </div>

                  <div className="bg-black text-white p-8 space-y-6 rounded-xl shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Collector Status</h3>
                      <div className="space-y-1">
                        <p className="text-3xl font-display font-black tracking-tight italic">PRO COLLECTOR</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member since {new Date(user.metadata.creationTime || '').getFullYear()}</p>
                      </div>
                      <div className="pt-4">
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/3" />
                        </div>
                        <p className="text-[8px] font-bold uppercase tracking-widest mt-2 text-gray-500">3 acquisitions away from Elite status</p>
                      </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12">
                      <Package size={160} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
