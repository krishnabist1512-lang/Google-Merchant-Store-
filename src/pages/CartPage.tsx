import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, FREE_SHIPPING_THRESHOLD_INR } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    cartSubtotal,
    freeShippingRemaining,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    shippingFee,
    cartTotal,
    formatPrice,
    currency,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    analytics.pageView('Shopping Bag – Layer', '/cart');
    const mapped = cart
      .map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        return prod ? { product: prod, quantity: item.quantity } : null;
      })
      .filter(Boolean) as { product: any; quantity: number }[];

    analytics.viewCart(mapped, cartTotal, currency);
  }, []);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleBeginCheckout = () => {
    const mapped = cart
      .map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        return prod ? { product: prod, quantity: item.quantity } : null;
      })
      .filter(Boolean) as { product: any; quantity: number }[];

    analytics.beginCheckout(mapped, cartTotal, currency);
    onNavigate('/checkout');
  };

  const freeShippingPct = Math.min(
    100,
    Math.round(((FREE_SHIPPING_THRESHOLD_INR - freeShippingRemaining) / FREE_SHIPPING_THRESHOLD_INR) * 100)
  );

  // Recommendations for empty or upsell
  const cartIds = new Set(cart.map((c) => c.productId));
  const suggestedProducts = PRODUCTS.filter((p) => !cartIds.has(p.id) && (p.flags?.bestSeller || p.flags?.trending)).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-8">
          Your Shopping Bag
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-xl mx-auto space-y-4 my-8">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-slate-900">Your bag is currently empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explore our engineered hoodies, vacuum insulated drinkware, and daily desk gear to get started.
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-8 py-3 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs transition-all shadow-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Meter */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  {freeShippingRemaining > 0 ? (
                    <span className="text-slate-700">
                      Add <strong className="text-[#2F6BFF]">{formatPrice(freeShippingRemaining)}</strong> more to unlock Free Standard Shipping!
                    </span>
                  ) : (
                    <span className="text-[#2DBE8C] flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4" /> You have qualified for Free Express Delivery!
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">{freeShippingPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      freeShippingRemaining === 0 ? 'bg-[#2DBE8C]' : 'bg-[#2F6BFF]'
                    }`}
                    style={{ width: `${freeShippingPct}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
                {cart.map((item, idx) => {
                  const product = PRODUCTS.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="p-5 sm:p-6 flex gap-4 sm:gap-6">
                      {/* Image */}
                      <div
                        onClick={() => onNavigate(`/product/${product.slug}`)}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 cursor-pointer"
                      >
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                {product.subcategory || product.category}
                              </span>
                              <h3
                                onClick={() => onNavigate(`/product/${product.slug}`)}
                                className="font-heading font-bold text-sm sm:text-base text-slate-900 hover:text-[#2F6BFF] cursor-pointer"
                              >
                                {product.name}
                              </h3>
                            </div>
                            <span className="font-heading font-bold text-sm sm:text-base text-slate-900 tabular-nums shrink-0">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 mt-1 space-x-2">
                            {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                            {item.selectedColor && item.selectedSize && <span>·</span>}
                            {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                          <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold tabular-nums text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              className="text-xs text-slate-400 hover:text-[#FF6B4A] flex items-center gap-1 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                              <span className="hidden sm:inline">Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.percent}% off)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter code (e.g. LAYER10)"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#2F6BFF] text-white text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[11px] text-red-500">{promoError}</p>}
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums font-semibold text-slate-900">
                    {shippingFee === 0 ? <span className="text-[#2DBE8C]">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between font-heading font-extrabold text-base sm:text-lg text-slate-900">
                  <span>Total</span>
                  <span className="tabular-nums text-slate-900">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                type="button"
                onClick={handleBeginCheckout}
                className="w-full h-13 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-2 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2DBE8C]" />
                  <span>Secure 256-bit encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2F6BFF]" />
                  <span>Doorstep delivery with real-time tracking</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Upsells */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200/80">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#2F6BFF]" />
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Recommended Additions
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {suggestedProducts.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  listName="Cart Suggestions"
                  index={idx}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
