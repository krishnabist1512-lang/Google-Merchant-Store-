import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import { CheckCircle2, Truck, PackageCheck, ArrowRight, ShieldCheck, Download, Mail } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId?: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const { orders, formatPrice } = useStore();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  useEffect(() => {
    analytics.pageView('Order Confirmed – Layer', '/order-confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const recommendedItems = PRODUCTS.filter((p) => p.flags?.bestSeller || p.flags?.trending).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Animated Success Badge */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#2DBE8C] flex items-center justify-center mx-auto shadow-inner animate-scale-up">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <span>Payment Approved (Simulated Demo)</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Order Confirmed!
          </h1>

          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Thank you, {currentOrder?.shippingAddress.fullName || 'Shopper'}. We've dispatched your order details to{' '}
            <strong className="text-slate-900">{currentOrder?.shippingAddress.email || 'your email'}</strong>.
          </p>
        </div>

        {/* Order Details Card */}
        {currentOrder && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-10 space-y-6">
            {/* Top Meta Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Reference</span>
                <p className="font-mono font-extrabold text-lg text-slate-900">{currentOrder.id}</p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Delivery</span>
                <p className="font-heading font-bold text-base text-[#2DBE8C] flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>{currentOrder.estimatedDelivery}</span>
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Status</span>
                <p className="text-xs font-bold uppercase text-slate-700 bg-slate-100 px-3 py-1 rounded-full inline-block mt-0.5">
                  {currentOrder.paymentMethod.toUpperCase()} · Confirmed
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-slate-900">Purchased Items</h3>
              <div className="divide-y divide-slate-100">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Total Breakdown */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Shipping Destination
                </span>
                <p className="font-semibold text-slate-900">{currentOrder.shippingAddress.fullName}</p>
                <p>{currentOrder.shippingAddress.street}</p>
                <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}</p>
                <p>Phone: {currentOrder.shippingAddress.phone}</p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <div className="flex justify-between sm:justify-end gap-6">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(currentOrder.subtotal)}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between sm:justify-end gap-6 text-emerald-600">
                    <span>Discount</span>
                    <span className="tabular-nums font-semibold">-{formatPrice(currentOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between sm:justify-end gap-6">
                  <span>Shipping</span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {currentOrder.shipping === 0 ? <span className="text-[#2DBE8C]">FREE</span> : formatPrice(currentOrder.shipping)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between sm:justify-end gap-6 font-heading font-extrabold text-base text-slate-900">
                  <span>Total Paid</span>
                  <span className="tabular-nums">{formatPrice(currentOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/account')}
            className="w-full sm:w-auto h-12 px-7 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>View Order History</span>
          </button>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="font-heading font-bold text-xl text-slate-900 tracking-tight mb-6 text-center">
            You May Also Enjoy Exploring
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedItems.map((p, idx) => (
              <ProductCard
                key={p.id}
                product={p}
                listName="Post-Purchase Recommended"
                index={idx}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
