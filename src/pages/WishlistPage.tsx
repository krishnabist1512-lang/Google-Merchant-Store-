import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlistIds } = useStore();

  useEffect(() => {
    analytics.pageView('Wishlist – Layer', '/wishlist');
  }, []);

  const wishlistProducts = wishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS;

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#FF6B4A] flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Saved Wishlist
            </h1>
            <p className="text-xs text-slate-500">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900">Your wishlist is empty</h2>
            <p className="text-xs text-slate-500">
              Tap the heart icon on any product to save your favorite tech merch here.
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-6 py-2.5 rounded-full bg-[#2F6BFF] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Discover Merchandise
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                listName="Wishlist Page"
                index={idx}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
