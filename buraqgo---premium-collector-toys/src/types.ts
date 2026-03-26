export interface Product {
  id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'cars' | 'guns' | 'collector';
  type: string;
  ageGroup: string;
  images: string[];
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  scale?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod' | 'card';
  transactionId?: string | null;
  shippingInfo: {
    address: string;
    phone: string;
    city: string;
    fullName?: string;
    address1?: string;
    postalCode?: string;
  };
  createdAt: any;
}

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: any;
}
