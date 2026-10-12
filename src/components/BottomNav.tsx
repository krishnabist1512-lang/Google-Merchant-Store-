import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPath, onNavigate }) => {
  const { cartCount, wishlistCount, setIsCartOpen } = useStore();

  const isHome = currentPath === '/';
  const isShop = currentPath.startsWith('/shop') || currentPath.startsWith('/category');
  const isWishlist = currentPath === '/wishlist';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            isHome ? 'text-[#2F6BFF]' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Home</span>
        </button>

        {/* Shop */}
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            isShop ? 'text-[#2F6BFF]' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Shop"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Shop</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => onNavigate('/search')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Search</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => onNavigate('/wishlist')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            isWishlist ? 'text-[#FF6B4A]' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label={`Wishlist (${wishlistCount})`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#FF6B4A] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-1">Wishlist</span>
        </button>

        {/* Bag */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-slate-500 hover:text-[#2F6BFF] transition-colors"
          aria-label={`Shopping Bag (${cartCount})`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#2F6BFF] text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-1">Bag</span>
        </button>
      </div>
    </nav>
  );
};
