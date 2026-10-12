import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Star, ShoppingBag, ExternalLink, Zap } from 'lucide-react';
import { analytics } from '../lib/analytics';

interface ProductCardProps {
  product: Product;
  listName?: string;
  index?: number;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  listName = 'Product Grid',
  index,
  onNavigate,
}) => {
  const { isInWishlist, toggleWishlist, addToCart, setQuickAddProduct, formatPrice } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const hasVariants = Boolean(
    (product.sizes && product.sizes.length > 1) || (product.colors && product.colors.length > 1)
  );

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    analytics.selectItem(listName, product, index);
    onNavigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariants) {
      setQuickAddProduct(product);
    } else {
      addToCart(product.id, 1, product.colors?.[0]?.name, product.sizes?.[0]);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#FFFFFF] overflow-hidden flex items-center justify-center border-b border-slate-100">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-50 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-300">Loading...</span>
          </div>
        )}

        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-700 hover:text-[#FF6B4A] hover:bg-white transition-all transform active:scale-90 border border-slate-100"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#FF6B4A] text-[#FF6B4A]' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Google Store External Link Reference */}
        {product.productUrl && (
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="View on Google Merchandise Store"
            aria-label={`View ${product.name} on Google Merchandise Store`}
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-500 hover:text-[#2F6BFF] hover:bg-white transition-all transform active:scale-90 border border-slate-100"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-12 left-3 flex flex-col gap-1 items-start pointer-events-none">
          {product.flags?.bestSeller && (
            <span className="bg-[#1B1D21] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              Best Seller
            </span>
          )}
          {product.flags?.limited && (
            <span className="bg-[#FF6B4A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              Limited Run
            </span>
          )}
          {product.flags?.new && !product.flags?.bestSeller && (
            <span className="bg-[#2F6BFF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              New Drop
            </span>
          )}
          {product.flags?.trending && !product.flags?.bestSeller && !product.flags?.new && (
            <span className="bg-[#2DBE8C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              Trending
            </span>
          )}
        </div>

        {/* Stock Alert indicator if low stock */}
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 z-10 bg-amber-500/90 text-white backdrop-blur-xs text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Zap className="w-2.5 h-2.5" />
            <span>Only {product.stock} left</span>
          </div>
        )}
      </div>

      {/* Content Box */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Subcategory Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-400">
              {product.subcategory || product.category}
            </span>
            {product.rating !== undefined && (
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" />
                <span className="tabular-nums font-semibold">{product.rating.toFixed(1)}</span>
                {product.reviewCount !== undefined && (
                  <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-heading font-semibold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-[#2F6BFF] transition-colors" title={product.name}>
            {product.name}
          </h3>

          {/* Color swatch previews if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Quick Add Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-heading font-bold text-base sm:text-lg text-slate-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to bag`}
            className="h-9 px-3 rounded-full bg-slate-900 text-white hover:bg-[#2F6BFF] active:scale-95 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
