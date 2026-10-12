import React, { useEffect } from 'react';
import { analytics } from '../lib/analytics';
import { Truck, RotateCcw, ShieldCheck, HelpCircle } from 'lucide-react';

interface ShippingReturnsPageProps {
  onNavigate: (path: string) => void;
}

export const ShippingReturnsPage: React.FC<ShippingReturnsPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    analytics.pageView('Shipping & Returns – Layer', '/shipping-returns');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Shipping & Return Policies
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Transparent domestic delivery timelines, free returns, and packaging details.
          </p>
        </div>

        <div className="space-y-8">
          {/* Shipping Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <Truck className="w-5 h-5 text-[#2F6BFF]" />
              <h2 className="font-heading font-bold text-xl">Domestic & Global Shipping</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We process and dispatch all orders from our fulfillment center within 24 to 48 hours of confirmation (excluding public holidays).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-heading font-bold text-sm text-slate-900 block mb-1">
                  Standard Surface Delivery
                </span>
                <p className="text-xs text-slate-600 mb-2">
                  <strong>FREE</strong> on orders over ₹1,499 (otherwise ₹99 flat rate).
                </p>
                <p className="text-[11px] text-slate-500">
                  Estimated delivery in 3 to 5 business days across India.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-heading font-bold text-sm text-slate-900 block mb-1">
                  Express Air Priority
                </span>
                <p className="text-xs text-slate-600 mb-2">
                  <strong>₹199 flat rate</strong> for expedited air freight.
                </p>
                <p className="text-[11px] text-slate-500">
                  Estimated delivery in 1 to 2 business days for Tier-1 Metro cities.
                </p>
              </div>
            </div>
          </div>

          {/* Returns Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <RotateCcw className="w-5 h-5 text-[#2DBE8C]" />
              <h2 className="font-heading font-bold text-xl">14-Day Free Returns & Exchanges</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Not completely satisfied with the drape or size? We offer hassle-free doorstep return pickups within 14 days of delivery.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
              <li className="flex items-start gap-2">
                <span className="text-[#2DBE8C] font-bold">✓</span>
                <span>Items must be unwashed, unworn, with original hangtags attached.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2DBE8C] font-bold">✓</span>
                <span>Reverse courier pickup is scheduled directly from your doorstep.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2DBE8C] font-bold">✓</span>
                <span>Instant store credit or bank account reversal within 48 hours of inspection.</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900">
              <HelpCircle className="w-5 h-5 text-[#FFC83D]" />
              <h2 className="font-heading font-bold text-xl">Frequently Asked Questions</h2>
            </div>

            <div className="divide-y divide-slate-100 space-y-4 pt-2">
              <div className="pt-3 first:pt-0">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 mb-1">
                  How should I wash my 480 GSM Debug Mode Hoodie?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Machine wash cold inside-out with like colors. Hang dry naturally or tumble dry low. Do not iron directly on the tonal reflective print.
                </p>
              </div>

              <div className="pt-4">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 mb-1">
                  Are the drinkware items microwave and dishwasher safe?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our Dark Mode Ceramic Mugs are 100% microwave and dishwasher safe. For stainless steel vacuum bottles, hand-washing preserves thermal insulation coatings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
