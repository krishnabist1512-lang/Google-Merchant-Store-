import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { AI_IMAGES } from '../data/productImages';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Shield,
  Clock,
  Flame,
  Zap,
  ShoppingBag,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { getPickedForYou, getRecentlyViewed, addToCart, formatPrice } = useStore();

  const bestSellers = PRODUCTS.filter((p) => p.flags?.bestSeller).slice(0, 8);
  const trendingItems = PRODUCTS.filter((p) => p.flags?.trending).slice(0, 6);
  const newArrivals = PRODUCTS.filter((p) => p.flags?.new || p.flags?.limited).slice(0, 6);
  const limitedItems = PRODUCTS.filter((p) => p.flags?.limited);
  const pickedForYou = getPickedForYou();
  const recentlyViewed = getRecentlyViewed();

  // Track page view and item lists
  useEffect(() => {
    analytics.pageView('Layer – Wear your tech', '/');
    analytics.viewItemList('Best Sellers Grid', bestSellers);
  }, []);

  // Campaign Bundle Add to Cart: Hoodie + Mug combo
  const hoodieItem = PRODUCTS.find((p) => p.id === 'prod-app-01');
  const mugItem = PRODUCTS.find((p) => p.id === 'prod-drk-01');

  const handleBundleAdd = () => {
    if (hoodieItem && mugItem) {
      addToCart(hoodieItem.id, 1, hoodieItem.colors?.[0]?.name, 'L', false);
      addToCart(mugItem.id, 1, mugItem.colors?.[0]?.name, undefined, true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Lead In */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2DBE8C] animate-pulse"></span>
                <span>Layer Drop 04 · Winter Heavyweights</span>
              </div>

              {/* Refined Display Heading */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.08] text-balance">
                Wear your tech.
                <span className="block text-slate-500 font-medium text-3xl sm:text-4xl lg:text-5xl mt-2">
                  Engineered for focus and tactile comfort.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Premium 480 GSM french terry cotton, magnetic Fidlock hardware, and vacuum-insulated desk hydration. Built for developers, designers, and daily builders.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className="h-13 px-8 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/category/apparel')}
                  className="h-13 px-7 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
                >
                  <span>Explore Hoodies & Tees</span>
                </button>
              </div>

              {/* Trust Metric Chips */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tabular-nums">480 GSM</span>
                  <p className="text-xs text-slate-500 mt-0.5">Heavyweight Terry</p>
                </div>
                <div>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tabular-nums">100%</span>
                  <p className="text-xs text-slate-500 mt-0.5">Organic Cotton</p>
                </div>
                <div>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-[#2DBE8C] tabular-nums">Free</span>
                  <p className="text-xs text-slate-500 mt-0.5">Over ₹1,499</p>
                </div>
              </div>
            </div>

            {/* Right Large Product Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 group">
                <img
                  src={AI_IMAGES.heroApparel}
                  alt="Layer Streetwear and Tech Merchandise Hero"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                    Signature Drop
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">Debug Mode Heavyweight Hoodie</h3>
                  <p className="text-xs text-white/80 mt-1">480 GSM Double-Fleece · Internal Media Routing</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold font-heading tabular-nums">{formatPrice(3299)}</span>
                    <button
                      onClick={() => onNavigate('/product/debug-mode-heavyweight-hoodie')}
                      className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-[#2F6BFF] hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Campaign Section "Layer Up, Everyday" */}
      <section className="py-14 sm:py-20 bg-[#F1F3F4] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-inner">
              <img
                src={AI_IMAGES.campaignLayerUp}
                alt="Layer Up Everyday Flatlay Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#FF6B4A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Save 15% Bundle
              </div>
            </div>

            {/* Campaign Message */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2F6BFF]">
                Core Campaign · Season 2026
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight text-balance">
                Layer Up, Everyday.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Merchandise data from the Google Store showed high interest in apparel when bundled with desk hydration. We paired the <strong>Debug Mode Heavyweight Hoodie</strong> with our <strong>Dark Mode Ceramic Mug</strong> for an instant desk upgrade.
              </p>

              {/* Bundle Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-900">Desk Focus Bundle</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Free Shipping Included
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-base text-slate-900 tabular-nums">
                      {formatPrice(3299 + 799 - 500)}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-1.5 tabular-nums">
                      {formatPrice(3299 + 799)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Includes 1x Debug Mode Hoodie (Black) + 1x Dark Mode Ceramic Mug (14oz)
                </div>

                <button
                  type="button"
                  onClick={handleBundleAdd}
                  className="w-full h-11 rounded-full bg-slate-900 hover:bg-[#2F6BFF] active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Bundle to Bag (Save ₹500)</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2DBE8C]" /> In Stock
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2DBE8C]" /> Dispatches in 24 Hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Cards (Apparel, Accessories, Drinkware, Stationery, Tech, Collectibles) */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shop By Department</span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Explore Categories
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/shop')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#2F6BFF] hover:text-blue-700 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.id}`)}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden text-center"
              >
                <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#2F6BFF] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                  {cat.productCount} Items
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Grid */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1B1D21]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Proven Customer Favorites</span>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Best Sellers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/shop?filter=bestseller')}
              className="flex items-center gap-1 text-xs font-bold text-[#2F6BFF] hover:text-blue-700 transition-colors"
            >
              <span>View All Best Sellers ({bestSellers.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                listName="Best Sellers"
                index={idx}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Now (Horizontal Swipe Carousel on mobile) */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2DBE8C]" />
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Trending This Week
              </h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">Swipe or scroll horizontally</span>
          </div>

          {/* Carousel container with scroll-snap */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingItems.map((product, idx) => (
              <div
                key={product.id}
                className="w-[260px] sm:w-[280px] shrink-0 snap-start"
              >
                <ProductCard
                  product={product}
                  listName="Trending Carousel"
                  index={idx}
                  onNavigate={onNavigate}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. New Arrivals (Distinctive card styling with larger visuals) */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F6BFF]">Fresh Releases</span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/shop?filter=new')}
              className="flex items-center gap-1 text-xs font-bold text-[#2F6BFF] hover:text-blue-700 transition-colors"
            >
              <span>Explore All New Drops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.slice(0, 3).map((product, idx) => (
              <div
                key={product.id}
                onClick={() => {
                  analytics.selectItem('New Arrivals Highlight', product, idx);
                  onNavigate(`/product/${product.slug}`);
                }}
                className="group relative bg-[#F8F9FA] rounded-3xl border border-slate-200/80 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#2F6BFF] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    New Drop
                  </div>
                </div>
                <div className="p-6 bg-white flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-400">
                      {product.subcategory}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#2F6BFF] transition-colors mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-heading font-bold text-lg text-slate-900 tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-bold text-[#2F6BFF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Drop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Picked For You (Personalized row driven by browsing history - PRD 7.1 & 7.9) */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2F6BFF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2F6BFF]">
                  Personalised Discovery
                </span>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Picked For You
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {pickedForYou.reason}
              </p>
            </div>
            <button
              onClick={() => onNavigate('/shop')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>More Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {pickedForYou.products.slice(0, 4).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                listName="Picked For You"
                index={idx}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Limited Edition Block (with real stock-left countdown urgency) */}
      {limitedItems.length > 0 && (
        <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-[#1B1D21] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] text-xs font-bold uppercase tracking-wider mb-2 border border-[#FF6B4A]/30">
                  <Flame className="w-3.5 h-3.5" />
                  Small-Batch Artifacts
                </span>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Limited Edition Vault
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-lg">
                  Boutique runs and CNC-machined titanium artifacts. Numbered editions that will not be restocked once claimed.
                </p>
              </div>
              <span className="text-xs text-white/50 font-mono">Real-time inventory verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {limitedItems.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onNavigate(`/product/${product.slug}`)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 mb-4 relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#FF6B4A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Only {product.stock} Units Left
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-[#2F6BFF] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase block">Price</span>
                      <span className="font-heading font-bold text-lg text-white tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/product/${product.slug}`);
                      }}
                      className="px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-[#2F6BFF] hover:text-white transition-colors"
                    >
                      Inspect Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Recently Viewed (PRD 7.1: Appears once user views at least 1 item) */}
      {recentlyViewed.length > 0 && (
        <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Recently Viewed
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.slice(0, 4).map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  listName="Recently Viewed"
                  index={idx}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
