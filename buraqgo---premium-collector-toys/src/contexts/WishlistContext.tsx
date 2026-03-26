import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Product } from '../types';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistDocs, setWishlistDocs] = useState<{ [productId: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setWishlistDocs({});
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids: string[] = [];
      const docs: { [productId: string]: string } = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        ids.push(data.productId);
        docs[data.productId] = doc.id;
      });
      setWishlist(ids);
      setWishlistDocs(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'wishlist');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to save models to your garage.');
      return;
    }

    const productId = product.id;
    const docId = wishlistDocs[productId];

    try {
      if (docId) {
        await deleteDoc(doc(db, 'wishlist', docId));
        toast.success(`${product.name} removed from your garage.`);
      } else {
        await addDoc(collection(db, 'wishlist'), {
          userId: user.uid,
          productId: productId,
          addedAt: serverTimestamp()
        });
        toast.success(`${product.name} added to your garage.`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'wishlist');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
