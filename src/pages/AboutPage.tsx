import React, { useEffect } from 'react';
import { analytics } from '../lib/analytics';
import { ShieldCheck, BarChart3, Layers, Compass, ArrowRight, Activity } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    analytics.pageView('About & Data Hypotheses – Layer', '/about');
  }, []);

  const hypotheses = [
    {
      num: '01',
      decision: 'Target: New mobile visitors in India (growth), returning US desktop users (core)',
      evidence: 'GA4 Country by users & conversion rate; device split; new vs returning conversion gap',
      consequence: 'Mobile-first UX, native INR pricing, UPI & COD simulation, 6-digit PIN code field, and persistent recently-viewed & wishlist state for returning buyers.',
    },
    {
      num: '02',
      decision: 'Channels: Invest in Organic Search and Email; investigate Paid Search and Referral',
      evidence: 'Revenue per session by Default Channel Group in GA4 demo property',
      consequence: 'Semantic SEO tags, OpenGraph cards, rich JSON-LD Schema, email capture lead generation, and persistent UTM parameter architecture.',
    },
    {
      num: '03',
      decision: 'Promote: Heavyweight apparel bundled with desk hydration drinkware',
      evidence: 'Item revenue by category; high item views vs low purchase count per item in demo data',
      consequence: 'Hero campaign on apparel, "Frequently Bought Together" bundles with 1-click cart addition, and "Picked For You" contextual rows.',
    },
    {
      num: '04',
      decision: 'Fix: Mobile checkout and cart drop-off friction',
      evidence: 'GA4 Funnel exploration: view_item → add_to_cart → begin_checkout → purchase leakage',
      consequence: 'Sticky Add-to-Bag bar, slide-over mini-cart drawer, free shipping threshold meter, and a 3-step distraction-free checkout.',
    },
    {
      num: '05',
      decision: 'Campaign: "Layer Up, Everyday"',
      evidence: 'Seasonal apparel velocity + cross-category merchandise basket affinity',
      consequence: 'Dedicated campaign landing section, promo codes (LAYER10, WELCOME15), and unified design language.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#2DBE8C]" />
            <span>Product Requirements Document (PRD) v1.0</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight text-balance">
            Layer: Wear your tech.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            An original tech-lifestyle merchandise store inspired by real conversion patterns and funnel leakage in the Google Merchandise Store GA4 demo account.
          </p>
        </div>

        {/* Brand Mission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-12 space-y-4">
          <h2 className="font-heading font-bold text-xl text-slate-900">
            Brand Identity & Aesthetic Philosophy
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Most tech merchandise stores suffer from uninspired clip-art prints on lightweight promotional tees. Layer was conceived as a premium, modern, conversion-optimized apparel and artifact label:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 block mb-1">
                Tactile Comfort
              </span>
              <p className="text-xs text-slate-500">
                480 GSM organic french terry and combed jersey cotton designed for long focus sessions.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 block mb-1">
                Zero-Pill Discipline
              </span>
              <p className="text-xs text-slate-500">
                Clean unboxed typography, thoughtful contrast, and subtle micro-interactions.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 block mb-1">
                Mobile-First Focus
              </span>
              <p className="text-xs text-slate-500">
                Thumb navigation, 44px hitboxes, sticky purchase module, and lightning-fast checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Data Hypotheses Defense Matrix (Viva Ready) */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2F6BFF]" />
            <h2 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
              Data-Backed Decisions (Viva Defense Table)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Every design decision in Layer maps directly to measurable data anomalies discovered in Google Analytics 4:
          </p>

          <div className="space-y-4">
            {hypotheses.map((item) => (
              <div
                key={item.num}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-[#2F6BFF]/10 text-[#2F6BFF]">
                      {item.num}
                    </span>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      {item.decision}
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                  <strong className="text-slate-700">GA4 Evidence: </strong>
                  {item.evidence}
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-semibold">Product Consequence: </strong>
                  {item.consequence}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#1B1D21] text-white rounded-3xl p-8 text-center space-y-4">
          <h3 className="font-heading font-bold text-2xl text-white">Experience Layer in Action</h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
            Interact with the catalog, test the sticky mobile buy bar, inspect live GA4 events, and run through the simulated checkout.
          </p>
          <button
            onClick={() => onNavigate('/shop')}
            className="px-8 py-3 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
