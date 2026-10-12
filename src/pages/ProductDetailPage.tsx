import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, FREE_SHIPPING_THRESHOLD_INR } from '../data/products';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Zap,
  ChevronRight,
  Sparkles,
  Ruler,
  X,
  Share2
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordProductView,
    getRecentlyViewed,
    formatPrice,
    currency,
    showToast,
  } = useStore();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainCtaRef = useRef<HTMLButtonElement>(null);

  // Sync state when slug changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor(product.colors?.[0]?.name || '');
    setSelectedSize(product.sizes?.[0] || '');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Record view in store & GA4
    recordProductView(product.id);
    analytics.pageView(`${product.name} – Layer`, `/product/${product.slug}`);
    analytics.viewItem(product, currency);
  }, [slug]);

  // Observer to toggle mobile sticky Add to Cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaRef.current) return;
      const rect = mainCtaRef.current.getBoundingClientRect();
      // Show sticky bar when main CTA scrolls past viewport top
      setShowStickyBar(rect.bottom < 64);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor, selectedSize, true);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedColor, selectedSize, false);
    onNavigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Layer!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  // Frequently Bought Together Bundle
  // If product is apparel, bundle with drinkware or stickers
  const bundleCompanion = PRODUCTS.find(
    (p) =>
      p.id !== product.id &&
      (product.category === 'apparel'
        ? p.category === 'drinkware' || p.category === 'accessories'
        : p.category === 'apparel' || p.category === 'stationery')
  ) || PRODUCTS[1];

  const bundleDiscount = 300;
  const bundleTotal = product.price + bundleCompanion.price - bundleDiscount;

  const handleAddBundle = () => {
    addToCart(product.id, 1, selectedColor, selectedSize, false);
    addToCart(
      bundleCompanion.id,
      1,
      bundleCompanion.colors?.[0]?.name,
      bundleCompanion.sizes?.[0],
      true
    );
    showToast('Bundle added to bag with ₹300 discount!', 'success');
  };

  // Related products in same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const recentlyViewed = getRecentlyViewed().filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <button onClick={() => onNavigate('/')} className="hover:text-slate-900">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('/shop')} className="hover:text-slate-900">
            Shop
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate(`/category/${product.category}`)}
            className="hover:text-slate-900 capitalize"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left: Sticky Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] rounded-3xl bg-slate-100 border border-slate-200/80 overflow-hidden shadow-sm">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} - Angle ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Wishlist Heart */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Save to wishlist"
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 hover:text-[#FF6B4A] hover:bg-white transition-all transform active:scale-90"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorited ? 'fill-[#FF6B4A] text-[#FF6B4A]' : 'text-slate-600'
                  }`}
                />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                {product.flags?.bestSeller && (
                  <span className="bg-[#1B1D21] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Best Seller
                  </span>
                )}
                {product.flags?.limited && (
                  <span className="bg-[#FF6B4A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Limited Run
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-slate-100 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              {/* Category & Department Kicker */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-400">
                  {product.subcategory || product.category}
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-slate-900 font-semibold text-sm">
                  <Star className="w-4 h-4 fill-[#FFC83D] text-[#FFC83D]" />
                  <span className="tabular-nums">{(product.rating ?? 4.8).toFixed(1)}</span>
                </div>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-slate-500 hover:text-[#2F6BFF] underline"
                >
                  {product.reviewCount ?? 128} customer reviews
                </button>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2.5">
                <span className="font-heading font-extrabold text-3xl text-slate-900 tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-slate-400 line-through tabular-nums">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-xs font-bold text-[#FF6B4A] bg-orange-50 px-2.5 py-0.5 rounded-full">
                    Save {formatPrice(product.compareAtPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Availability Notice */}
              <div className="mt-3">
                {(product.stock ?? 25) <= 5 && (product.stock ?? 25) > 0 ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hurry, only {product.stock} left in stock!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2DBE8C]">
                    <Check className="w-4 h-4" />
                    <span>In Stock · Ready to dispatch</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>
                    Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'border-[#2F6BFF] bg-blue-50/70 text-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 font-semibold'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>
                    Size: <span className="font-normal text-slate-500">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#2F6BFF] hover:underline text-xs"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center ${
                          isSelected
                            ? 'border-[#2F6BFF] bg-[#2F6BFF] text-white shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Bag CTAs */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  ref={mainCtaRef}
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-12 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 rounded-full bg-slate-900 hover:bg-black active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Instant Checkout (Buy Now)</span>
              </button>
            </div>

            {/* Delivery & Assurance Guarantees */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2F6BFF] shrink-0" />
                <span>Estimated dispatch: Tomorrow</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#2DBE8C] shrink-0" />
                <span>14-day hassle free returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle (PRD 7.3) */}
        {bundleCompanion && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 mb-16 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#2F6BFF]" />
              <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight">
                Frequently Bought Together
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Items in bundle */}
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Current Item</span>
                    <p className="font-heading font-semibold text-xs sm:text-sm text-slate-900 truncate max-w-xs">{product.name}</p>
                    <span className="font-bold text-xs text-slate-900 tabular-nums">{formatPrice(product.price)}</span>
                  </div>
                </div>

                <span className="text-xl font-bold text-slate-400">+</span>

                <div
                  onClick={() => onNavigate(`/product/${bundleCompanion.slug}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 group-hover:border-[#2F6BFF]">
                    <img src={bundleCompanion.images[0]} alt={bundleCompanion.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#2F6BFF]">Recommended Companion</span>
                    <p className="font-heading font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#2F6BFF] truncate max-w-xs">
                      {bundleCompanion.name}
                    </p>
                    <span className="font-bold text-xs text-slate-900 tabular-nums">{formatPrice(bundleCompanion.price)}</span>
                  </div>
                </div>
              </div>

              {/* Bundle Action */}
              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto justify-end">
                <div className="text-center sm:text-right">
                  <div className="text-xs text-slate-500 font-medium">Bundle Price:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-extrabold text-xl text-slate-900 tabular-nums">
                      {formatPrice(bundleTotal)}
                    </span>
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      {formatPrice(product.price + bundleCompanion.price)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundle}
                  className="h-11 px-6 rounded-full bg-slate-900 hover:bg-[#2F6BFF] text-white font-semibold text-xs transition-all shadow-sm active:scale-95 shrink-0"
                >
                  Add Both to Bag (Save ₹300)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabbed Specifications, Shipping, Reviews (PRD 7.3) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden mb-16 shadow-xs">
          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/60 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors shrink-0 ${
                activeTab === 'desc'
                  ? 'border-[#2F6BFF] text-[#2F6BFF]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Description & Details
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors shrink-0 ${
                activeTab === 'specs'
                  ? 'border-[#2F6BFF] text-[#2F6BFF]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors shrink-0 ${
                activeTab === 'shipping'
                  ? 'border-[#2F6BFF] text-[#2F6BFF]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Shipping & Returns
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-[#2F6BFF] text-[#2F6BFF]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-600 leading-relaxed">
                <p className="text-base text-slate-900 font-medium">
                  {product.description}
                </p>
                <p>
                  Every Layer garment and artifact is designed from ground-zero for tactile everyday focus. We source custom ring-spun yarns and dense fleece terry that hold up through high-heat commercial cycles while maintaining an uncompromised architectural drape.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 mb-1">
                      Material Integrity
                    </h4>
                    <p className="text-xs text-slate-500">
                      Zero cheap synthetic fillers. Heavyweight cotton and aerospace titanium billets only.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 mb-1">
                      Ethical Manufacturing
                    </h4>
                    <p className="text-xs text-slate-500">
                      Produced in certified low-impact facilities with OEKO-TEX non-toxic waterborne inks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3 max-w-2xl">
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-3">
                  Bullet Specifications
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {(product.specs || [
                    '100% premium quality construction',
                    'Designed for developer comfort and durability',
                    'Officially crafted for Layer tech merch'
                  ]).map((spec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF] mt-1.5 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#2F6BFF]" />
                    <div>
                      <span className="font-bold text-slate-900 block">Domestic Free Delivery</span>
                      <span className="text-slate-600">Free standard courier dispatch on orders over ₹1,499.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-900">Delivery Timelines:</h4>
                  <p>• Metro Cities (Mumbai, Delhi, Bengaluru, Hyderabad): 2 to 3 business days.</p>
                  <p>• Tier 2 & 3 Cities across India: 4 to 6 business days.</p>
                  <p>• International Orders: 7 to 10 business days via DHL Express.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-extrabold font-heading text-slate-900 tabular-nums">
                      {(product.rating ?? 4.8).toFixed(1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[#FFC83D]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        Based on {product.reviewCount ?? 128} verified customer ratings
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {(product.reviews ?? []).map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-xs text-slate-900">{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#FFC83D]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading font-bold text-2xl text-slate-900 tracking-tight mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  listName="Related Products"
                  index={idx}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-2xl text-slate-900 tracking-tight mb-6">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  listName="Recently Viewed PDP"
                  index={idx}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add-To-Cart Bar (PRD Section 10 & 7.3) */}
      {showStickyBar && (
        <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 shadow-xl flex items-center justify-between gap-4 md:hidden animate-slide-up">
          <div className="min-w-0">
            <p className="font-heading font-bold text-xs text-slate-900 truncate">{product.name}</p>
            <p className="font-heading font-bold text-sm text-[#2F6BFF] tabular-nums">
              {formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="h-11 px-5 rounded-full bg-[#2F6BFF] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#2F6BFF]" />
                <h3 className="font-heading font-bold text-lg text-slate-900">Apparel Size Guide</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Measurements in inches. Boxy relaxed silhouette. For a standard tailored look, we recommend ordering your true size.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2">Size</th>
                    <th className="py-2">Chest (in)</th>
                    <th className="py-2">Length (in)</th>
                    <th className="py-2">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">S</td>
                    <td className="py-2.5">38 - 40"</td>
                    <td className="py-2.5">27.5"</td>
                    <td className="py-2.5">18.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">M</td>
                    <td className="py-2.5">41 - 43"</td>
                    <td className="py-2.5">28.5"</td>
                    <td className="py-2.5">19.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">L</td>
                    <td className="py-2.5">44 - 46"</td>
                    <td className="py-2.5">29.5"</td>
                    <td className="py-2.5">20.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">XL</td>
                    <td className="py-2.5">47 - 49"</td>
                    <td className="py-2.5">30.5"</td>
                    <td className="py-2.5">21.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">XXL</td>
                    <td className="py-2.5">50 - 52"</td>
                    <td className="py-2.5">31.5"</td>
                    <td className="py-2.5">22.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
