import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem, Order, Currency, CategoryId } from '../types';
import { PRODUCTS, PROMO_CODES, FREE_SHIPPING_THRESHOLD_INR, INR_TO_USD_RATE } from '../data/products';
import { analytics } from '../lib/analytics';

interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'cart';
}

interface PickedForYouResult {
  reason: string;
  products: Product[];
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, color?: string, size?: string, openDrawer?: boolean) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedPromo: { code: string; percent: number } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Personalisation
  viewedProductIds: string[];
  recordProductView: (productId: string) => void;
  recentSearches: string[];
  recordSearch: (query: string) => void;
  clearRecentSearches: () => void;
  getRecentlyViewed: () => Product[];
  getPickedForYou: () => PickedForYouResult;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInINR: number) => string;

  // Toast
  toasts: ToastItem[];
  showToast: (message: string, type?: 'info' | 'success' | 'cart') => void;

  // Quick Add
  quickAddProduct: Product | null;
  setQuickAddProduct: (p: Product | null) => void;

  // GA Inspector
  showGAInspector: boolean;
  setShowGAInspector: (val: boolean | ((prev: boolean) => boolean)) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  CART: 'layer_cart_v1',
  WISHLIST: 'layer_wishlist_v1',
  VIEWED: 'layer_viewed_v1',
  VIEWED_CATS: 'layer_viewed_cats_v1',
  SEARCHES: 'layer_searches_v1',
  ORDERS: 'layer_orders_v1',
  CURRENCY: 'layer_currency_v1',
  PROMO: 'layer_promo_v1',
};

const safeGetItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return defaultValue;
  }
};

const safeSetItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => safeGetItem(STORAGE_KEYS.CART, []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(() =>
    safeGetItem(STORAGE_KEYS.PROMO, null)
  );

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => safeGetItem(STORAGE_KEYS.WISHLIST, []));

  // Browsing History
  const [viewedProductIds, setViewedProductIds] = useState<string[]>(() => safeGetItem(STORAGE_KEYS.VIEWED, []));
  const [viewedCats, setViewedCats] = useState<Record<string, number>>(() =>
    safeGetItem(STORAGE_KEYS.VIEWED_CATS, {})
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() => safeGetItem(STORAGE_KEYS.SEARCHES, [
    'hoodie',
    'desk mat',
    'insulated bottle',
    'sticker pack'
  ]));

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => safeGetItem(STORAGE_KEYS.ORDERS, []));

  // Currency
  const [currency, setCurrencyState] = useState<Currency>(() => safeGetItem(STORAGE_KEYS.CURRENCY, 'USD'));

  // Modals & Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [showGAInspector, setShowGAInspector] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.WISHLIST, wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.VIEWED, viewedProductIds);
  }, [viewedProductIds]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.VIEWED_CATS, viewedCats);
  }, [viewedCats]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SEARCHES, recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.PROMO, appliedPromo);
  }, [appliedPromo]);

  // Toast Helper
  const showToast = (message: string, type: 'info' | 'success' | 'cart' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Currency Formatter
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const formatPrice = (amount: number): string => {
    if (currency === 'INR') {
      const inrVal = Math.round(amount * 83);
      return `₹${inrVal.toLocaleString('en-IN')}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - cartSubtotal);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((cartSubtotal * appliedPromo.percent) / 100);
  }, [cartSubtotal, appliedPromo]);

  const shippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD_INR || cartSubtotal === 0 ? 0 : 5;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Cart Operations
  const addToCart = (
    productId: string,
    quantity = 1,
    color?: string,
    size?: string,
    openDrawer = true
  ) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === productId &&
          (item.selectedColor || '') === (color || '') &&
          (item.selectedSize || '') === (size || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId,
            quantity,
            selectedColor: color || (product.colors ? product.colors[0]?.name : undefined),
            selectedSize: size || (product.sizes ? product.sizes[0] : undefined),
            unitPrice: product.price,
            addedAt: Date.now(),
          },
        ];
      }
    });

    // GA4 Tracking
    analytics.addToCart(product, quantity, { color, size }, currency);

    // Toast & UI
    showToast(`Added ${product.name} to cart`, 'cart');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          (item.selectedColor || '') === (color || '') &&
          (item.selectedSize || '') === (size || '')
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const matches =
          item.productId === productId &&
          (item.selectedColor || '') === (color || '') &&
          (item.selectedSize || '') === (size || '');
        return !matches;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const promo = PROMO_CODES[normalized];
    if (promo) {
      setAppliedPromo(promo);
      showToast(`Promo ${promo.code} applied (${promo.percent}% off)!`, 'success');
      return { success: true, message: `Applied ${promo.percent}% discount!` };
    }
    return { success: false, message: 'Invalid promo code. Try LAYER10 or WELCOME15.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        analytics.addToWishlist(product);
        showToast(`Saved to wishlist`, 'success');
        return [productId, ...prev];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);
  const wishlistCount = wishlistIds.length;

  // Personalisation & Browsing Record
  const recordProductView = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setViewedProductIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 16);
    });

    setViewedCats((prev) => ({
      ...prev,
      [product.category]: (prev[product.category] || 0) + 1,
    }));
  };

  const recordSearch = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed);
      return [trimmed, ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const getRecentlyViewed = (): Product[] => {
    return viewedProductIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  };

  /**
   * Explainable recommendations engine (PRD Section 7.9)
   * Scores products by category match with viewed items, tag overlap, and popularity.
   * Excludes items currently in cart.
   */
  const getPickedForYou = (): PickedForYouResult => {
    const cartProductIds = new Set(cart.map((c) => c.productId));
    const available = PRODUCTS.filter((p) => !cartProductIds.has(p.id));

    // Find top viewed category
    const catEntries = Object.entries(viewedCats).sort((a, b) => b[1] - a[1]);
    const topCat = catEntries.length > 0 ? (catEntries[0][0] as CategoryId) : null;

    if (topCat) {
      const catProducts = available.filter((p) => p.category === topCat);
      if (catProducts.length >= 3) {
        const catLabels: Record<string, string> = {
          apparel: 'hoodies & apparel',
          accessories: 'everyday carry & bags',
          drinkware: 'desk hydration & drinkware',
          stationery: 'notebooks & stationery',
          tech: 'workspace tech essentials',
          collectibles: 'pins & collectibles',
        };
        return {
          reason: `Because you viewed ${catLabels[topCat] || topCat}`,
          products: catProducts.slice(0, 8),
        };
      }
    }

    // Fallback: If user viewed specific items, look for cross-selling bundles
    if (viewedProductIds.length > 0) {
      const firstViewed = PRODUCTS.find((p) => p.id === viewedProductIds[0]);
      if (firstViewed) {
        // Recommend items from complementary categories
        const complementary = available
          .filter((p) => p.category !== firstViewed.category)
          .slice(0, 8);
        if (complementary.length > 0) {
          return {
            reason: `Pairs well with items you recently explored`,
            products: complementary,
          };
        }
      }
    }

    // Cold start
    const popular = available.filter((p) => p.flags?.bestSeller || p.flags?.trending);
    return {
      reason: `Featured Google Merchandise Store Essentials`,
      products: popular.length >= 4 ? popular.slice(0, 8) : available.slice(0, 8),
    };
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `LYR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        freeShippingRemaining,
        isCartOpen,
        setIsCartOpen,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        shippingFee,
        cartTotal,

        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount,

        viewedProductIds,
        recordProductView,
        recentSearches,
        recordSearch,
        clearRecentSearches,
        getRecentlyViewed,
        getPickedForYou,

        orders,
        createOrder,

        currency,
        setCurrency,
        formatPrice,

        toasts,
        showToast,

        quickAddProduct,
        setQuickAddProduct,

        showGAInspector,
        setShowGAInspector,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
