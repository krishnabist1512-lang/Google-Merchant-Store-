import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { analytics } from '../lib/analytics';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
  AlertCircle
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee: baseShippingFee,
    cartTotal,
    formatPrice,
    createOrder,
    currency,
  } = useStore();

  // If cart is empty, redirect back
  useEffect(() => {
    if (cart.length === 0) {
      onNavigate('/cart');
    }
  }, [cart]);

  // Steps: 1 = Shipping, 2 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '9820198201',
    street: 'Flat 402, Sea View Apartments, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const selectedShippingFee =
    deliveryMethod === 'express' ? 199 : baseShippingFee;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + selectedShippingFee);

  // Validate Step 1
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = '10-digit mobile number required';
    if (!formData.street.trim()) errs.street = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = 'Valid 6-digit PIN code required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    analytics.addShippingInfo(
      deliveryMethod === 'express' ? 'Express Air Delivery' : 'Standard Surface Delivery',
      finalTotal,
      currency
    );
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    analytics.addPaymentInfo(paymentMethod.toUpperCase(), finalTotal, currency);

    // Simulate order placement delay for high-converting UX feel
    setTimeout(() => {
      const orderItems = cart.map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId)!;
        return {
          productId: item.productId,
          productName: prod.name,
          productImage: prod.images[0],
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        };
      });

      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + (deliveryMethod === 'express' ? 2 : 4));
      const deliveryDateStr = estimatedDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const newOrder = createOrder({
        items: orderItems,
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: selectedShippingFee,
        total: finalTotal,
        shippingAddress: formData,
        deliveryMethod,
        paymentMethod,
        estimatedDelivery: deliveryDateStr,
      });

      // GA4 Purchase event
      analytics.purchase(
        newOrder.id,
        cart.map((item) => ({
          product: PRODUCTS.find((p) => p.id === item.productId)!,
          quantity: item.quantity,
        })),
        finalTotal,
        0,
        selectedShippingFee,
        currency
      );

      setIsSubmitting(false);
      onNavigate(`/order-confirmed?id=${newOrder.id}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      {/* Distraction-Free Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#1B1D21] flex flex-col items-center justify-center p-1.5 shadow-sm group-hover:bg-[#2F6BFF] transition-colors">
            <div className="w-4 h-1 bg-white rounded-full mb-0.5"></div>
            <div className="w-4 h-1 bg-[#2DBE8C] rounded-full mb-0.5"></div>
            <div className="w-2.5 self-start ml-0.5 h-1 bg-[#FF6B4A] rounded-full"></div>
          </div>
          <span className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
            Layer
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-[#2DBE8C]" />
          <span>Encrypted Checkout</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Progress Stepper Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 mb-6 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2DBE8C] text-white flex items-center justify-center font-bold text-[11px]">
              ✓
            </span>
            <span className="text-slate-900">Cart</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                currentStep >= 1 ? 'bg-[#2F6BFF] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}>Shipping</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                currentStep === 2 ? 'bg-[#2F6BFF] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={currentStep === 2 ? 'text-slate-900' : 'text-slate-400'}>Payment</span>
          </div>
        </div>

        {/* Demo Notice Banner (PRD Section 7.6 Requirement) */}
        <div className="mb-6 bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
          <AlertCircle className="w-4 h-4 text-[#2F6BFF] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Simulated Demonstration Store:</strong> No actual monetary transactions are processed. You can enter sample addresses and simulate instant UPI or card approvals to experience the full checkout conversion funnel.
          </div>
        </div>

        {/* Mobile Collapsible Order Summary */}
        <div className="lg:hidden mb-6 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="w-full p-4 flex items-center justify-between text-xs font-semibold text-slate-800"
          >
            <div className="flex items-center gap-2">
              <span>Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              {isSummaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            <span className="font-heading font-bold text-sm text-[#2F6BFF] tabular-nums">
              {formatPrice(finalTotal)}
            </span>
          </button>

          {isSummaryExpanded && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-3 text-xs">
              {cart.map((item, i) => {
                const prod = PRODUCTS.find((p) => p.id === item.productId);
                if (!prod) return null;
                return (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span className="truncate max-w-[200px] text-slate-700">
                      {prod.name} x {item.quantity}
                    </span>
                    <span className="font-semibold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            {currentStep === 1 ? (
              /* Step 1: Customer & Shipping Address */
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 mb-1">
                    1. Contact & Delivery Address
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fast guest checkout. We will email tracking notifications here.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aarav Mehta"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Mobile Number (for Courier SMS) *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Street Address & Apartment *
                    </label>
                    <input
                      type="text"
                      name="street-address"
                      autoComplete="street-address"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="House / Flat no, Building name, Street"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.street && <p className="text-[11px] text-red-500 mt-1">{errors.street}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address-level2"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="address-level1"
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.state && <p className="text-[11px] text-red-500 mt-1">{errors.state}</p>}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="postal-code"
                      autoComplete="postal-code"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6-digit PIN code"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                    />
                    {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Delivery Method Options */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                    Select Delivery Speed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliveryMethod('standard')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliveryMethod === 'standard'
                          ? 'border-[#2F6BFF] bg-blue-50/50 ring-2 ring-[#2F6BFF]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-xs text-slate-900">Standard Surface</span>
                        <span className="text-xs font-bold text-[#2DBE8C]">
                          {baseShippingFee === 0 ? 'FREE' : formatPrice(99)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Delivered in 3 to 5 business days</p>
                    </div>

                    <div
                      onClick={() => setDeliveryMethod('express')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliveryMethod === 'express'
                          ? 'border-[#2F6BFF] bg-blue-50/50 ring-2 ring-[#2F6BFF]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-xs text-slate-900">Express Air Priority</span>
                        <span className="text-xs font-bold text-slate-900">{formatPrice(199)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Delivered in 1 to 2 business days</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: Payment Simulation */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-xl text-slate-900 mb-1">
                      2. Choose Payment Option
                    </h2>
                    <p className="text-xs text-slate-500">
                      Simulated payment methods with instant confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#2F6BFF] hover:underline"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#2F6BFF] bg-blue-50/60 text-[#2F6BFF] ring-2 ring-[#2F6BFF]/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#2F6BFF]" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#2F6BFF] bg-blue-50/60 text-[#2F6BFF] ring-2 ring-[#2F6BFF]/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#2F6BFF]" />
                    <span>Credit / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#2F6BFF] bg-blue-50/60 text-[#2F6BFF] ring-2 ring-[#2F6BFF]/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#2DBE8C]" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#2F6BFF] bg-blue-50/60 text-[#2F6BFF] ring-2 ring-[#2F6BFF]/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#FFC83D]" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Payment Detail Section */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-slate-500">
                          UPI Virtual Payment Address
                        </span>
                        <span className="text-[11px] font-semibold text-[#2DBE8C]">Zero gateway fee</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          Verify
                        </button>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                        <span>Supports: Google Pay · PhonePe · Paytm · BHIM</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            defaultValue="11/28"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            defaultValue="882"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900">
                        Cash on Delivery Available for PIN {formData.pincode}
                      </p>
                      <p>
                        Please keep exact cash or UPI QR scan ready when our delivery courier arrives at {formData.street}.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-slate-500 block">
                        Popular Indian Banks
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                          <div
                            key={bank}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#2F6BFF] cursor-pointer font-medium text-slate-800"
                          >
                            {bank}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Place Order CTA */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Place Order • {formatPrice(finalTotal)}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Items in Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-slate-100">
              {cart.map((item, idx) => {
                const prod = PRODUCTS.find((p) => p.id === item.productId);
                if (!prod) return null;
                return (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center gap-3">
                    <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{prod.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
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
                <span>Shipping ({deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span className="tabular-nums font-semibold text-slate-900">
                  {selectedShippingFee === 0 ? <span className="text-[#2DBE8C]">FREE</span> : formatPrice(selectedShippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-heading font-extrabold text-base text-slate-900">
                <span>Total Due</span>
                <span className="tabular-nums">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
