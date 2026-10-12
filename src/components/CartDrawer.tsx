import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, FREE_SHIPPING_THRESHOLD_INR } from '../data/products';
import { X, Trash2, Heart, ShoppingBag, ArrowRight, Check, Tag, Sparkles } from 'lucide-react';
import { analytics } from '../lib/analytics';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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
    addToCart,
    currency,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    const mapped = cart
      .map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        return prod ? { product: prod, quantity: item.quantity } : null;
      })
      .filter(Boolean) as { product: any; quantity: number }[];

    analytics.beginCheckout(mapped, cartTotal, currency);
    onNavigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    const mapped = cart
      .map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        return prod ? { product: prod, quantity: item.quantity } : null;
      })
      .filter(Boolean) as { product: any; quantity: number }[];

    analytics.viewCart(mapped, cartTotal, currency);
    onNavigate('/cart');
  };

  // Up-sell suggestion: Pick a cheap accessory or sticker pack not currently in cart
  const cartIds = new Set(cart.map((c) => c.productId));
  const upsellProduct = PRODUCTS.find(
    (p) => !cartIds.has(p.id) && (p.category === 'stationery' || p.category === 'drinkware' || p.category === 'accessories') && p.price < 1200
  );

  const freeShippingPct = Math.min(100, Math.round(((FREE_SHIPPING_THRESHOLD_INR - freeShippingRemaining) / FREE_SHIPPING_THRESHOLD_INR) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2F6BFF]" />
            <h2 className="font-heading font-bold text-lg text-slate-900">Your Bag</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            {freeShippingRemaining > 0 ? (
              <span className="text-slate-700">
                Add <strong className="text-[#2F6BFF] font-bold">{formatPrice(freeShippingRemaining)}</strong> more for free delivery
              </span>
            ) : (
              <span className="text-[#2DBE8C] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> You unlocked Free Shipping!
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-mono">{freeShippingPct}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                freeShippingRemaining === 0 ? 'bg-[#2DBE8C]' : 'bg-[#2F6BFF]'
              }`}
              style={{ width: `${freeShippingPct}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">Your bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Discover our engineered tech apparel, insulated drinkware, and daily desk essentials.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('/shop');
                }}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-[#2F6BFF] text-xs font-semibold transition-all shadow-sm"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setIsCartOpen(false);
                      onNavigate(`/product/${product.slug}`);
                    }}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            onNavigate(`/product/${product.slug}`);
                          }}
                          className="font-heading font-semibold text-xs sm:text-sm text-slate-900 truncate hover:text-[#2F6BFF] cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 tabular-nums shrink-0">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Variant metadata */}
                      <div className="text-[11px] text-slate-500 mt-0.5 space-x-1.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span>·</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    {/* Stepper & Actions */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold tabular-nums text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="text-xs text-slate-400 hover:text-[#FF6B4A] flex items-center gap-1 transition-colors"
                          title="Save to wishlist"
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Upsell Widget */}
          {cart.length > 0 && upsellProduct && (
            <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span>Frequently Added Together</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200">
                    <img src={upsellProduct.images[0]} alt={upsellProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{upsellProduct.name}</p>
                    <p className="text-[11px] font-bold text-[#2F6BFF] tabular-nums">{formatPrice(upsellProduct.price)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(upsellProduct.id, 1, undefined, undefined, false)}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-[#2F6BFF] text-white text-[11px] font-semibold shrink-0 transition-colors shadow-xs"
                >
                  + Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-3">
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Promo <strong>{appliedPromo.code}</strong> applied ({appliedPromo.percent}% off)
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. LAYER10)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-red-500 mt-1">{promoError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {shippingFee === 0 ? <span className="text-[#2DBE8C]">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-bold text-slate-900 font-heading">
                <span>Total</span>
                <span className="tabular-nums text-slate-900">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full h-12 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleViewCart}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
