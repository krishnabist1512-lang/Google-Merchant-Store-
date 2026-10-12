import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { analytics } from '../lib/analytics';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Layers } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    analytics.generateLead('newsletter_footer', email.split('@')[1]);
    setSubscribed(true);
    showToast('Subscribed to Layer Drops newsletter!', 'success');
  };

  return (
    <footer className="bg-[#111215] text-white pt-16 pb-24 md:pb-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#2F6BFF] shrink-0 border border-white/10">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Free Express Delivery</h4>
              <p className="text-xs text-white/60">On all domestic orders over ₹1,499.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#2DBE8C] shrink-0 border border-white/10">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">14-Day Free Returns</h4>
              <p className="text-xs text-white/60">Hassle-free pickups & instant store credit.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#FFC83D] shrink-0 border border-white/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">100% Genuine Merch</h4>
              <p className="text-xs text-white/60">Heavyweight textiles, brass hardware, & sailcloth.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex flex-col items-center justify-center p-1.5">
                <div className="w-4 h-1 bg-[#1B1D21] rounded-full mb-0.5"></div>
                <div className="w-4 h-1 bg-[#2DBE8C] rounded-full mb-0.5"></div>
                <div className="w-2.5 self-start ml-0.5 h-1 bg-[#FF6B4A] rounded-full"></div>
              </div>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">Layer</span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-sm leading-relaxed">
              Wear your tech. High-craft merchandise engineered for software engineers, product designers, and daily digital creators. Inspired by the Google Merchandise Store GA4 patterns.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-white/80 block mb-2">
                Join Layer Drops (Early releases & 15% off first order)
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2DBE8C] bg-white/5 px-4 py-2.5 rounded-full border border-white/10">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You're in! Check your inbox for WELCOME15.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Department Links */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-white/40 mb-4">
              Departments
            </h5>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('/shop?filter=bestseller')}
                  className="hover:text-white transition-colors text-[#FFC83D]"
                >
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-white/40 mb-4">
              Support & Help
            </h5>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <button onClick={() => onNavigate('/shipping-returns')} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shipping-returns')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-white transition-colors">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  About Layer
                </button>
              </li>
            </ul>
          </div>

          {/* Academic / Viva Demo Notes */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#2F6BFF] mb-4">
              GA4 Case Study
            </h5>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-[11px] text-white/60 space-y-2 leading-relaxed">
              <p>
                Built to solve conversion leaks observed in the Google Merchandise Store GA4 demo property (mobile checkout drop-offs & low-revenue markets).
              </p>
              <div className="pt-1">
                <span className="text-[#2DBE8C] font-semibold block">Full Instrumentation:</span>
                <span>12 standard e-commerce events, real-time debug stream & sticky mobile purchase modules.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Viva Disclaimer */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Layer Merchandise Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
              Data Hypotheses
            </button>
            <button onClick={() => onNavigate('/shipping-returns')} className="hover:text-white transition-colors">
              Store Policies
            </button>
            <span className="text-white/30">|</span>
            <span className="text-white/60 font-mono">Demo Environment · No Real Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
