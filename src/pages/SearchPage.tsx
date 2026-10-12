import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { analytics } from '../lib/analytics';
import { Search, Sparkles, TrendingUp, Clock, X, ArrowRight } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate }) => {
  const { recentSearches, recordSearch, clearRecentSearches } = useStore();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    analytics.pageView(`Search: ${query || 'Discover'} – Layer`, `/search`);
  }, [query]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory?.toLowerCase().includes(q) ?? false;
      const matchDesc = p.description?.toLowerCase().includes(q) ?? false;
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      return matchName || matchCat || matchSub || matchDesc || matchTags;
    });
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      recordSearch(query.trim());
      analytics.search(query.trim(), searchResults.length);
    }
  };

  const handleTermClick = (term: string) => {
    setQuery(term);
    recordSearch(term);
    analytics.search(term, 1);
  };

  const alternativeProducts = PRODUCTS.filter((p) => p.flags?.bestSeller || p.flags?.trending).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar Input */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, tech term, category..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm sm:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Quick Trends & Recents when empty or below */}
          {!query && (
            <div className="mt-8 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button onClick={clearRecentSearches} className="text-slate-400 hover:text-slate-600 font-normal lowercase">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTermClick(term)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#2F6BFF] text-xs font-semibold text-slate-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#2F6BFF]" />
                  <span>Trending Right Now</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Debug Mode Hoodie', 'Dark Mode Mug', 'Canvas Chore Jacket', 'Merino Desk Mat', 'Vinyl Sticker Pack', 'X-Pac Backpack'].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => handleTermClick(term)}
                        className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC83D]" />
                  <span>Popular Departments</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onNavigate(`/category/${cat.id}`)}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#2F6BFF] text-left transition-colors flex items-center gap-2.5 shadow-2xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-heading font-semibold text-xs text-slate-900">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        {query.trim() && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                Results for "{query}" ({searchResults.length})
              </h2>
            </div>

            {searchResults.length === 0 ? (
              /* No Results State (PRD 7.4) */
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-6 max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    No exact matches found for "{query}"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Check your spelling or explore our popular categories below.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onNavigate(`/category/${cat.id}`)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#2F6BFF]"
                    >
                      Browse {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {searchResults.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    listName={`Search: ${query}`}
                    index={idx}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alternative Product Suggestions */}
        {query.trim() && searchResults.length === 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200/80">
            <h3 className="font-heading font-bold text-xl text-slate-900 mb-6">
              You Might Be Interested In
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {alternativeProducts.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  listName="Search Fallback Alternative"
                  index={idx}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
