import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, CheckCircle, Clock, TrendingUp, X, Save, BarChart3, PieChart as PieChartIcon, AlertTriangle, MessageSquare, Star } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, serverTimestamp, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Order, Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'analytics' | 'reviews'>('analytics');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'cars',
    description: '',
    type: 'Model Car',
    ageGroup: '14+',
    images: ['https://picsum.photos/seed/toy/800/600'],
    stock: 10,
    newArrival: true,
    scale: '1:18',
  });

  useEffect(() => {
    const qProducts = query(collection(db, 'products'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });

    const qCustomers = query(collection(db, 'users'));
    const unsubscribeCustomers = onSnapshot(qCustomers, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qReviews = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribeReviews = onSnapshot(qReviews, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeCustomers();
      unsubscribeReviews();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to remove this model from the collection?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...newProduct,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...newProduct,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setIsAddModalOpen(false);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: 0,
        category: 'cars',
        description: '',
        type: 'Model Car',
        ageGroup: '14+',
        images: ['https://picsum.photos/seed/toy/800/600'],
        stock: 10,
        newArrival: true,
        scale: '1:18',
      });
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsAddModalOpen(true);
  };

  const stats = [
    { label: 'Total Revenue', value: `৳${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: TrendingUp },
    { label: 'Active Orders', value: orders.filter(o => o.status === 'pending').length, icon: ShoppingBag },
    { label: 'Total Models', value: products.length, icon: Package },
    { label: 'Collectors', value: customers.length, icon: Users },
  ];

  // Analytics Data Processing
  const getRevenueData = () => {
    const dailyRevenue: { [key: string]: number } = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const date = (order.createdAt as Timestamp).toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
      }
    });
    return Object.entries(dailyRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .reverse()
      .slice(-7);
  };

  const getCategoryData = () => {
    const categories: { [key: string]: number } = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  };

  const getOrderStatusData = () => {
    const statuses: { [key: string]: number } = {};
    orders.forEach(o => {
      statuses[o.status] = (statuses[o.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  };

  const lowStockProducts = products.filter(p => p.stock < 5);
  const COLORS = ['#000000', '#FF0000', '#666666', '#999999'];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-8">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-primary" />
            <h1 className="text-2xl font-display font-black tracking-tight">Studio Admin</h1>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'products', label: 'Inventory', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Collectors', icon: Users },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-4 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-12">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-display font-black tracking-tight capitalize">{activeTab}</h2>
            {activeTab === 'products' && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center space-x-2 py-3"
              >
                <Plus size={18} />
                <span>Add New Model</span>
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 p-6 space-y-2 border-l-2 border-primary">
                <div className="flex justify-between items-start">
                  <stat.icon className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-xl font-display font-black tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 overflow-hidden">
            {activeTab === 'analytics' ? (
              <div className="p-8 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Revenue Chart */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Revenue Growth (7 Days)</h3>
                      <TrendingUp size={16} className="text-primary" />
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getRevenueData()}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '4px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#999', fontSize: '10px', marginBottom: '4px' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Order Status Distribution */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Order Status</h3>
                      <PieChartIcon size={16} className="text-primary" />
                    </div>
                    <div className="h-64 w-full flex items-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getOrderStatusData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {getOrderStatusData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 pr-8">
                        {getOrderStatusData().map((entry, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                  {/* Category Distribution */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Inventory by Category</h3>
                      <Package size={16} className="text-primary" />
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCategoryData()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <Tooltip 
                            cursor={{ fill: '#f9f9f9' }}
                            contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '4px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Low Stock Alerts */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 flex items-center space-x-2">
                        <AlertTriangle size={16} />
                        <span>Low Stock Alerts</span>
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {lowStockProducts.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 italic text-xs">All inventory levels are optimal.</div>
                      ) : (
                        lowStockProducts.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-xs font-bold">{p.name}</p>
                                <p className="text-[10px] text-red-600 font-bold uppercase">{p.stock} units remaining</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => openEditModal(p)}
                              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                            >
                              Restock
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'products' ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Model</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 overflow-hidden">
                            <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold tracking-tight">{product.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-500">{product.category}</td>
                      <td className="px-6 py-6 text-sm font-medium">৳{product.price.toLocaleString()}</td>
                      <td className="px-6 py-6">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right space-x-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-black transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'orders' ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">#{order.id?.slice(-6)}</td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-bold tracking-tight">{order.shippingInfo?.fullName || order.customerName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{order.shippingInfo?.phone}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{order.paymentMethod}</p>
                        {order.transactionId && (
                          <p className="text-[8px] font-mono font-bold text-primary uppercase mt-1">TXID: {order.transactionId}</p>
                        )}
                      </td>
                      <td className="px-6 py-6 text-sm font-medium">৳{order.total.toLocaleString()}</td>
                      <td className="px-6 py-6">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right space-x-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-black transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id!, 'completed')}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id!, 'pending')}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        >
                          <Clock size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'customers' ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Collector</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(customer => (
                    <tr key={customer.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img src={customer.photoURL || `https://ui-avatars.com/api/?name=${customer.displayName}`} alt={customer.displayName} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-sm font-bold tracking-tight">{customer.displayName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-xs font-medium text-gray-500">{customer.email}</td>
                      <td className="px-6 py-6">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 ${customer.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                          {customer.role}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><Edit size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.length === 0 ? (
                  <div className="py-24 text-center text-gray-400 italic text-xs uppercase tracking-widest">No reviews submitted yet.</div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="p-8 hover:bg-gray-50 transition-colors flex justify-between items-start gap-8">
                      <div className="space-y-4 flex-grow">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < review.rating ? "fill-primary text-primary" : "text-gray-200"} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {review.createdAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-gray-800">"{review.comment}"</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest">By {review.userName}</p>
                          <span className="text-gray-300">|</span>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product ID: {review.productId}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteReview(review.id!)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors flex-shrink-0"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-display font-black tracking-tighter uppercase italic">
                  {editingProduct ? 'Update Model Specs' : 'Register New Model'}
                </h2>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Model Name</label>
                      <input 
                        type="text" 
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Buraq Phantom GT"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Price (৳)</label>
                        <input 
                          type="number" 
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Stock</label>
                        <input 
                          type="number" 
                          required
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                      <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                        className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors uppercase font-bold tracking-widest"
                      >
                        <option value="cars">Performance Cars</option>
                        <option value="collector">Heritage Collection</option>
                        <option value="guns">Precision Gear</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                      <div className="flex space-x-2">
                        <input 
                          type="url" 
                          required
                          value={newProduct.images?.[0] || ''}
                          onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
                          className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                        <div className="w-12 h-12 border border-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={newProduct.images?.[0]} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                      <textarea 
                        required
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                        placeholder="Detailed specifications and heritage..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-bold uppercase text-gray-400 mb-1">Scale</label>
                      <input 
                        type="text" 
                        value={newProduct.scale || ''}
                        onChange={(e) => setNewProduct({...newProduct, scale: e.target.value})}
                        className="w-full bg-white border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold uppercase text-gray-400 mb-1">Type</label>
                      <input 
                        type="text" 
                        value={newProduct.type || ''}
                        onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                        className="w-full bg-white border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary px-12 py-3 flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingProduct ? 'Update Model' : 'Save Model'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg overflow-hidden rounded-xl shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-display font-black tracking-tight uppercase">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)}><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Info</p>
                  <p className="text-sm font-bold">{selectedOrder.shippingInfo?.fullName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingInfo?.phone}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingInfo?.address1}, {selectedOrder.shippingInfo?.city}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium">{item.name} x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold uppercase">Total</span>
                  <span className="text-xl font-display font-black tracking-tight">৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-4">
                <button 
                  onClick={() => { updateOrderStatus(selectedOrder.id!, 'completed'); setSelectedOrder(null); }}
                  className="flex-1 bg-green-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors"
                >
                  Mark Completed
                </button>
                <button 
                  onClick={() => { updateOrderStatus(selectedOrder.id!, 'cancelled'); setSelectedOrder(null); }}
                  className="flex-1 bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
