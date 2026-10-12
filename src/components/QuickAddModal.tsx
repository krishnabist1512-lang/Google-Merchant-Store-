import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';

interface QuickAddModalProps {
  onNavigate: (path: string) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ onNavigate }) => {
  const { quickAddProduct, setQuickAddProduct, addToCart, formatPrice } = useStore();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickAddProduct) {
      setSelectedColor(quickAddProduct.colors?.[0]?.name || '');
      setSelectedSize(quickAddProduct.sizes?.[0] || '');
      setQuantity(1);
    }
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const handleAdd = () => {
    addToCart(quickAddProduct.id, quantity, selectedColor, selectedSize, true);
    setQuickAddProduct(null);
  };

  const handleViewFullDetails = () => {
    setQuickAddProduct(null);
    onNavigate(`/product/${quickAddProduct.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={() => setQuickAddProduct(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              <img
                src={quickAddProduct.images[0]}
                alt={quickAddProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                Quick Selection
              </span>
              <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                {quickAddProduct.name}
              </h3>
              <span className="font-semibold text-sm text-[#2F6BFF] tabular-nums">
                {formatPrice(quickAddProduct.price)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setQuickAddProduct(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Colors */}
          {quickAddProduct.colors && quickAddProduct.colors.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Color: <span className="font-normal text-slate-500">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {quickAddProduct.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-[#2F6BFF] bg-blue-50/60 text-[#2F6BFF] ring-2 ring-[#2F6BFF]/20'
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

          {/* Sizes */}
          {quickAddProduct.sizes && quickAddProduct.sizes.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Size: <span className="font-normal text-slate-500">{selectedSize}</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {quickAddProduct.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center ${
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

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-700">Quantity</span>
            <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-semibold tabular-nums text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full h-12 rounded-full bg-[#2F6BFF] hover:bg-blue-600 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag • {formatPrice(quickAddProduct.price * quantity)}</span>
          </button>
          <button
            type="button"
            onClick={handleViewFullDetails}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-1"
          >
            <span>View Full Product Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
