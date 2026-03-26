import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, Truck, ShieldCheck, ArrowRight, CheckCircle2, Lock, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'nagad' | 'rocket' | 'cod'>('card');
  const [transactionId, setTransactionId] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: 'Dhaka',
    postalCode: '',
    phone: '',
    email: user?.email || ''
  });

  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (paymentMethod !== 'cod' && paymentMethod !== 'card' && !transactionId) {
      toast.error('Please enter the Transaction ID for verification.');
      return;
    }

    if (!shippingInfo.fullName || !shippingInfo.address1 || !shippingInfo.city || !shippingInfo.phone) {
      toast.error('Please fill in all required shipping information.');
      return;
    }

    setIsProcessing(true);
    try {
      const tax = cartTotal * 0.05;
      const finalTotal = cartTotal + tax;

      const orderData = {
        userId: user.uid,
        customerName: shippingInfo.fullName || profile?.displayName || user.displayName || 'Anonymous',
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0]
        })),
        total: finalTotal,
        status: 'pending',
        paymentMethod,
        transactionId: paymentMethod === 'cod' ? null : (paymentMethod === 'card' ? 'CARD_PAYMENT_PENDING' : transactionId),
        shippingInfo,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);

      // Batch update stock
      const stockUpdates = cart.map(async (item) => {
        const productRef = doc(db, 'products', item.id);
        return updateDoc(productRef, {
          stock: increment(-item.quantity)
        });
      });

      await Promise.all(stockUpdates);

      toast.success('Order placed successfully!');
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please check your connection and try again.');
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-48 px-4 text-center space-y-8 max-w-lg mx-auto">
        <div className="flex justify-center">
          <CheckCircle2 size={80} className="text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-black tracking-tight uppercase">Order Confirmed</h1>
          <p className="text-gray-500">
            Your collection is being prepared. We will contact you at <span className="font-bold text-black">{shippingInfo.phone}</span> for delivery confirmation.
          </p>
        </div>
        <div className="pt-8">
          <Link to="/shop" className="btn-primary inline-block w-full">Continue Collecting</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-48 pb-24 max-w-7xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-black tracking-tight">Your Collection is Empty</h1>
          <p className="text-gray-500">You haven't added any precision models to your collection yet.</p>
        </div>
        <Link to="/shop" className="btn-primary inline-block">Explore Collection</Link>
      </div>
    );
  }

  // Shopping Cart View
  if (!showCheckout) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-900">Quantity</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <button className="text-xs text-primary hover:underline">Save for Later</button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <span className="text-sm font-medium">৳{item.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-8">
                        <div className="space-y-2">
                          <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 py-1 text-sm font-bold border-x border-gray-300 min-w-[40px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-gray-500 hover:text-red-600 block w-full text-center"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <span className="text-sm font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4">
              <h3 className="text-sm font-bold">Apply Promo Code</h3>
              <div className="flex flex-grow max-w-md">
                <input 
                  type="text" 
                  placeholder="Apply Promo Code" 
                  className="flex-grow bg-white border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
                <button className="bg-red-50 text-primary px-6 py-2 text-sm font-bold rounded-r-md border border-red-100 hover:bg-red-100 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-4 border-b border-gray-200 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Tax:</span>
                  <span className="font-bold">৳{(cartTotal * 0.05).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold">৳{(cartTotal + (cartTotal * 0.05)).toLocaleString()}</span>
              </div>

              <button 
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    setShowCheckout(true);
                    window.scrollTo(0, 0);
                  }
                }}
                className="w-full btn-primary py-4 text-base"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Secure Checkout View
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => setShowCheckout(false)}
            className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
          >
            <ChevronRight className="rotate-180" size={16} />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-8">
              <h2 className="text-xl font-bold">Shipping & Payment</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">1. Shipping Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="col-span-1 md:col-span-2 border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Address Line 1" 
                    className="col-span-1 md:col-span-2 border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.address1}
                    onChange={(e) => setShippingInfo({...shippingInfo, address1: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Address Line 2" 
                    className="col-span-1 md:col-span-2 border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.address2}
                    onChange={(e) => setShippingInfo({...shippingInfo, address2: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Postal Code" 
                    className="border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => {
                      const paymentSection = document.getElementById('payment-method');
                      paymentSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-primary text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-red-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div id="payment-method" className="space-y-6 pt-8">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">2. Payment Method</span>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-4 h-4 text-primary" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="text-sm font-medium">Credit/Debit Card</span>
                    <div className="flex space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                    </div>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="ml-7 p-4 bg-gray-50 rounded-md space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Card Number" 
                          className="w-full border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Lock className="absolute right-3 top-3 text-gray-400" size={16} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Expiry Date" 
                          className="border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input 
                          type="text" 
                          placeholder="CVV" 
                          className="border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-4 h-4 text-primary" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="text-sm font-medium">Cash on Delivery</span>
                    <Truck size={16} className="text-gray-400" />
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-4 h-4 text-primary" 
                      checked={['bkash', 'nagad', 'rocket'].includes(paymentMethod)}
                      onChange={() => setPaymentMethod('bkash')}
                    />
                    <span className="text-sm font-medium">Mobile Banking</span>
                    <div className="flex space-x-2">
                      <span className="text-[10px] font-bold text-pink-600">bKash</span>
                      <span className="text-[10px] font-bold text-orange-600">Nagad</span>
                    </div>
                  </label>

                  {['bkash', 'nagad', 'rocket'].includes(paymentMethod) && (
                    <div className="ml-7 p-4 bg-gray-50 rounded-md space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex space-x-4">
                        {['bkash', 'nagad', 'rocket'].map(m => (
                          <button 
                            key={m}
                            type="button"
                            onClick={() => setPaymentMethod(m as any)}
                            className={`px-4 py-2 rounded-md text-xs font-bold border-2 transition-all ${paymentMethod === m ? 'border-primary bg-white' : 'border-transparent bg-gray-200'}`}
                          >
                            {m.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                          Please send <span className="font-bold text-black">৳{(cartTotal + (cartTotal * 0.05)).toLocaleString()}</span> to <span className="font-bold text-primary">01312322447</span>.
                        </p>
                        <input 
                          type="text" 
                          placeholder="Transaction ID" 
                          className="w-full border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-bold">Order Summary</h2>
              
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity}x</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-bold">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping:</span>
                  <span className="font-bold">৳0.00</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                  <span className="font-bold">Total (Incl. Tax):</span>
                  <span className="font-bold">৳{(cartTotal + (cartTotal * 0.05)).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full btn-primary py-4 text-base disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
                {!isProcessing && <ArrowRight size={18} />}
              </button>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-2 grayscale opacity-50">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase">Norton Secured</span>
                </div>
                <div className="flex items-center space-x-2 grayscale opacity-50">
                  <Lock size={16} />
                  <span className="text-[10px] font-bold uppercase">Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
