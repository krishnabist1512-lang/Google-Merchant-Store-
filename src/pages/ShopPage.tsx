import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { Product, CategoryId } from '../types';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ShopPageProps {
  initialCategory?: string;
  initialFilter?: string;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialFilter,
  onNavigate,
}) => {
  const { formatPrice } = useStore();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(9000);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'popular' | 'newest' | 'price-asc' | 'price-desc'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync initialCategory or initialFilter when props change
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialFilter === 'bestseller') {
      setSortBy('popular');
    } else if (initialFilter === 'new') {
      setSortBy('newest');
    }
  }, [initialFilter]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSub = product.subcategory?.toLowerCase().includes(q) ?? false;
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        if (!matchesName && !matchesSub && !matchesTags) return false;
      }
      // Price
      if (product.price > maxPrice) {
        return false;
      }
      // Rating
      if (selectedRating !== null && (product.rating ?? 4.8) < selectedRating) {
        return false;
      }
      // In Stock
      if (inStockOnly && (product.stock ?? 25) <= 0) {
        return false;
      }
      // Tag
      if (selectedTag && !(product.tags?.includes(selectedTag) ?? false)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
     if (sortBy === 'popular') {
  const scoreA = (a.flags?.bestSeller ? 50 : 0) + (a.rating || 4.5) * 10 + (a.price > 25 ? 20 : 0);
  const scoreB = (b.flags?.bestSeller ? 50 : 0) + (b.rating || 4.5) * 10 + (b.price > 25 ? 20 : 0);
  return scoreB - scoreA;
}
if (sortBy === 'newest') {
  const isNewA = a.flags?.new || a.flags?.limited ? 100 : 0;
  const isNewB = b.flags?.new || b.flags?.limited ? 100 : 0;
  return (isNewB - isNewA) || (b.name.localeCompare(a.name));
}
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Recommended: score bestSeller and rating
      const scoreA = (a.flags?.bestSeller ? 2 : 0) + (a.rating ?? 4.8);
      const scoreB = (b.flags?.bestSeller ? 2 : 0) + (b.rating ?? 4.8);
      return scoreB - scoreA;
    });
  }, [selectedCategory, searchFilter, maxPrice, selectedRating, inStockOnly, selectedTag, sortBy]);

  // GA4 Track on listing load
  useEffect(() => {
    analytics.pageView('Shop All Merchandise – Layer', '/shop');
    analytics.viewItemList(`Shop - ${selectedCategory}`, filteredProducts);
  }, [selectedCategory, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchFilter ? 1 : 0) +
    (selectedRating !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (maxPrice < 9000 ? 1 : 0) +
    (selectedTag ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchFilter('');
    setSelectedRating(null);
    setInStockOnly(false);
    setMaxPrice(9000);
    setSelectedTag(null);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <button onClick={() => onNavigate('/')} className="hover:text-slate-900">
              Home
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Shop Collection</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="capitalize text-[#2F6BFF] font-semibold">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {selectedCategory === 'all'
                  ? 'All Merchandise'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {selectedCategory === 'all'
                  ? 'High-craft tech lifestyle merchandise engineered for daily comfort and focus.'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.shortDesc}
              </p>
            </div>

            {/* Mobile Filter Toggle & Controls */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 h-10 px-4 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#2F6BFF]" />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Filter Bar & Controls */}
        <div className="hidden sm:flex items-center justify-between pb-6 mb-6 border-b border-slate-200/80 gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="tabular-nums font-bold text-slate-900">{filteredProducts.length}</span>
            <span>products available</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="ml-3 text-[#2F6BFF] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-xs font-semibold rounded-full px-3.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Grid / List toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-slate-400 font-medium">Active:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {searchFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                "{searchFilter}"
                <button onClick={() => setSearchFilter('')}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {selectedRating !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                {selectedRating}+ Stars
                <button onClick={() => setSelectedRating(null)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                Tag: #{selectedTag}
                <button onClick={() => setSelectedTag(null)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {maxPrice < 9000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                Under {formatPrice(maxPrice)}
                <button onClick={() => setMaxPrice(9000)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Content Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            {/* Search Input */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Search Listing
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Category
              </label>
              <div className="space-y-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Products</span>
                  <span className="tabular-nums font-mono text-[11px]">{PRODUCTS.length}</span>
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="tabular-nums font-mono text-[11px]">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Max Price
                </label>
                <span className="text-xs font-bold font-heading tabular-nums text-slate-900">
                  {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="349"
                max="9000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2F6BFF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹349</span>
                <span>₹9,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1">
                {[4.8, 4.5, 4.0].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                      selectedRating === star
                        ? 'bg-blue-50 text-[#2F6BFF] font-semibold border border-[#2F6BFF]/30'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" />
                      <span>{star} stars & above</span>
                    </div>
                    {selectedRating === star && <Check className="w-3.5 h-3.5 text-[#2F6BFF]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">In Stock Only</span>
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  inStockOnly ? 'bg-[#2DBE8C]' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    inStockOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Popular Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900">No matching items found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  We couldn't find any products matching your active filter criteria. Try resetting your price or search query.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#2F6BFF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    listName={`Shop Listing - ${selectedCategory}`}
                    index={idx}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-4">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => onNavigate(`/product/${product.slug}`)}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {product.subcategory}
                        </span>
                        <h3 className="font-heading font-bold text-base text-slate-900 hover:text-[#2F6BFF]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-md mt-0.5">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                          <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" />
                          <span className="font-semibold">{(product.rating ?? 4.8).toFixed(1)}</span>
                          <span className="text-slate-400">({product.reviewCount ?? 128} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="font-heading font-bold text-lg text-slate-900 tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/product/${product.slug}`);
                        }}
                        className="px-4 py-2 rounded-full bg-slate-900 hover:bg-[#2F6BFF] text-white text-xs font-semibold transition-colors"
                      >
                        View Options
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet (PRD Section 10 & 7.2) */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end flex-col animate-fade-in lg:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
          >
            {/* Grab handle */}
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto my-3 shrink-0" />

            <div className="px-5 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-heading font-bold text-base text-slate-900">Filter Products</h3>
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#2F6BFF] font-semibold"
              >
                Reset All
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border ${
                      selectedCategory === 'all'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    All Items
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border ${
                        selectedCategory === c.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400 uppercase tracking-wider">Max Price</span>
                  <span className="text-slate-900 font-heading tabular-nums">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="349"
                  max="9000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#2F6BFF]"
                />
              </div>

              {/* In Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-5 h-5 accent-[#2DBE8C] rounded"
                />
              </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full h-12 rounded-full bg-[#2F6BFF] text-white font-semibold text-sm flex items-center justify-center shadow-md active:scale-95"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
