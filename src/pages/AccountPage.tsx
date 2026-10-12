import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { analytics } from '../lib/analytics';
import { User, Package, Heart, Globe, Shield, MapPin, ExternalLink, Clock } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { orders, wishlistCount, currency, setCurrency, formatPrice } = useStore();

  useEffect(() => {
    analytics.pageView('Customer Account – Layer', '/account');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-8">
          Shopper Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1B1D21] text-white flex items-center justify-center font-heading font-bold text-xl">
              AM
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">Aarav Mehta</h2>
              <p className="text-xs text-slate-500">aarav.mehta@example.com</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Store Preferences
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Currency</span>
                <button
                  onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
                >
                  {currency === 'INR' ? '₹ INR (India)' : '$ USD (Global)'}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/wishlist')}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#FF6B4A] text-xs font-semibold text-slate-700 flex items-center justify-between px-3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#FF6B4A]" />
                  <span>Saved Wishlist</span>
                </div>
                <span className="font-bold tabular-nums">{wishlistCount}</span>
              </button>
            </div>
          </div>

          {/* Orders History */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2F6BFF]" />
                <h2 className="font-heading font-bold text-xl text-slate-900">Recent Orders</h2>
              </div>
              <span className="text-xs text-slate-400 tabular-nums font-mono">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} logged
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-sm text-slate-700">No past orders yet</p>
                <p className="text-xs text-slate-400">Complete checkout to view your simulated order tracking here.</p>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="mt-2 px-5 py-2 rounded-full bg-[#2F6BFF] text-white text-xs font-semibold"
                >
                  Browse Store
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900">{order.id}</span>
                        <span className="text-slate-400 text-[11px] ml-2">{order.date}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="truncate max-w-[240px] text-slate-800">
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="font-semibold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Delivery to {order.shippingAddress.city} by <strong>{order.estimatedDelivery}</strong>
                      </span>
                      <span className="font-heading font-extrabold text-sm text-slate-900 tabular-nums">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
