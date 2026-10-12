import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { Product } from '../types';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import { analytics } from '../lib/analytics';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    recentSearches,
    recordSearch,
    clearRecentSearches,
    currency,
    setCurrency,
    formatPrice,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside listener for category menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for autocomplete preview
  const searchResults: Product[] = searchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory?.toLowerCase().includes(q) ?? false) ||
          (p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
        );
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    recordSearch(searchQuery.trim());
    analytics.search(searchQuery.trim(), searchResults.length);
    setIsSearchOpen(false);
    onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(searchResults.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(-1, prev - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        e.preventDefault();
        const selected = searchResults[selectedIndex];
        recordSearch(selected.name);
        setIsSearchOpen(false);
        onNavigate(`/product/${selected.slug}`);
      } else {
        handleSearchSubmit();
      }
    }
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    recordSearch(term);
    setIsSearchOpen(false);
    onNavigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* Top Banner (Free delivery threshold banner - dismissible or quiet) */}
      <div className="bg-[#1B1D21] text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>⚡ Free Express Delivery on orders over ₹1,499</span>
        <span className="text-white/40 hidden sm:inline">|</span>
        <span className="text-white/80 hidden sm:inline">Use code <strong className="text-[#FFC83D]">LAYER10</strong> for 10% off</span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark with stacked layer 'L' icon */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden -ml-1 p-2 rounded-lg text-slate-700 hover:text-slate-900"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 text-left group"
              aria-label="Layer Home"
            >
              {/* Stack of three rounded layers forming an L */}
              <div className="w-8 h-8 rounded-xl bg-[#1B1D21] flex flex-col items-center justify-center p-1.5 shadow-sm group-hover:bg-[#2F6BFF] transition-colors">
                <div className="w-4 h-1 bg-white rounded-full mb-0.5"></div>
                <div className="w-4 h-1 bg-[#2DBE8C] rounded-full mb-0.5"></div>
                <div className="w-2.5 self-start ml-0.5 h-1 bg-[#FF6B4A] rounded-full"></div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#1B1D21]">
                  Layer
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  Wear your tech
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              onClick={() => onNavigate('/shop')}
              className={`hover:text-[#2F6BFF] transition-colors py-1 ${
                currentPath === '/shop' ? 'text-[#2F6BFF] font-bold' : ''
              }`}
            >
              Shop All
            </button>

            {/* Categories Dropdown / Mega Menu */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1 hover:text-[#2F6BFF] transition-colors py-1"
                aria-expanded={isCategoryMenuOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-scale-up">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Featured Departments
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setIsCategoryMenuOpen(false);
                          onNavigate(`/category/${cat.id}`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <div>
                            <span className="font-heading font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#2F6BFF]">
                              {cat.name}
                            </span>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{cat.shortDesc}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          {cat.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('/shop?filter=new')}
              className="hover:text-[#2F6BFF] transition-colors py-1"
            >
              New Arrivals
            </button>
            <button
              onClick={() => onNavigate('/shop?filter=bestseller')}
              className="hover:text-[#2F6BFF] transition-colors py-1"
            >
              Best Sellers
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Currency, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search merchandise"
              className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline text-slate-400">Search products...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
                /
              </kbd>
            </button>

            {/* Currency Toggle (P2 feature from PRD) */}
            <div className="relative hidden sm:flex items-center">
              <button
                type="button"
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                title="Switch Currency (INR / USD)"
              >
                <Globe className="w-3 h-3 text-slate-500" />
                <span>{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => onNavigate('/wishlist')}
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-[#FF6B4A] hover:bg-slate-100 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B4A] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Bump */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping bag (${cartCount} items)`}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 text-white hover:bg-[#2F6BFF] active:scale-95 transition-all shadow-sm font-semibold text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[11px] font-mono tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Search Modal Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            ref={searchContainerRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mt-4 sm:mt-12 animate-scale-up"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search by product, category, tech tag..."
                className="w-full text-base sm:text-lg text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md"
              >
                ESC
              </button>
            </form>

            {/* Results or Trending state */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {searchQuery.trim() ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    <span>Products ({searchResults.length})</span>
                    <span className="text-[11px] font-normal lowercase text-slate-400">Use arrow keys to navigate</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-semibold text-slate-800">No matching products found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try searching for "hoodie", "tumbler", "stickers", or "backpack".
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map((product, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              recordSearch(product.name);
                              setIsSearchOpen(false);
                              onNavigate(`/product/${product.slug}`);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50/80 border border-[#2F6BFF]/30' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  {product.subcategory || product.category}
                                </span>
                                <p className="font-heading font-semibold text-sm text-slate-900 truncate">
                                  {product.name}
                                </p>
                              </div>
                            </div>
                            <span className="font-heading font-bold text-sm text-slate-900 tabular-nums shrink-0 ml-3">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Recent Searches
                        </span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-normal lowercase"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleTrendingClick(term)}
                            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#2F6BFF]" />
                      <span>Trending Right Now</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Debug Mode Hoodie', 'Dark Mode Mug', 'Canvas Chore Jacket', 'Merino Desk Mat', 'Vinyl Sticker Pack'].map(
                        (term) => (
                          <button
                            key={term}
                            onClick={() => handleTrendingClick(term)}
                            className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#2F6BFF] hover:text-[#2F6BFF] text-slate-700 text-xs font-medium transition-colors"
                          >
                            {term}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Suggested Departments */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC83D]" />
                      <span>Browse by Category</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            onNavigate(`/category/${cat.id}`);
                          }}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors flex items-center gap-2.5"
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="font-heading font-semibold text-xs text-slate-800">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-fade-in md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-slide-left"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1B1D21] flex flex-col items-center justify-center p-1">
                    <div className="w-3.5 h-0.5 bg-white rounded-full mb-0.5"></div>
                    <div className="w-3.5 h-0.5 bg-[#2DBE8C] rounded-full mb-0.5"></div>
                    <div className="w-2 self-start ml-0.5 h-0.5 bg-[#FF6B4A] rounded-full"></div>
                  </div>
                  <span className="font-heading font-bold text-lg text-slate-900">Layer</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="py-6 space-y-4 text-base font-semibold text-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="block w-full text-left py-2 hover:text-[#2F6BFF]"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/shop');
                  }}
                  className="block w-full text-left py-2 hover:text-[#2F6BFF]"
                >
                  Shop Collection
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/shop?filter=bestseller');
                  }}
                  className="block w-full text-left py-2 hover:text-[#2F6BFF]"
                >
                  Best Sellers
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/shop?filter=new');
                  }}
                  className="block w-full text-left py-2 hover:text-[#2F6BFF]"
                >
                  New Drops
                </button>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Categories
                  </div>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onNavigate(`/category/${cat.id}`);
                        }}
                        className="flex items-center gap-2.5 w-full text-left py-1.5 text-sm font-medium text-slate-600 hover:text-[#2F6BFF]"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Currency & Info in Mobile Drawer */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Currency</span>
                <button
                  onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                  className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800"
                >
                  {currency === 'INR' ? '₹ INR (India)' : '$ USD (United States)'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Layer Merchandise Store · GA4 Demo Architecture
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
