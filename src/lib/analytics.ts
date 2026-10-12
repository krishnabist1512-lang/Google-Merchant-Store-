import { Product, GAEventLog } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Measurement ID from env or fallback demo ID
export const GA_MEASUREMENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_ID) || 'G-LAYERDEMO01';

// Event log store for viva demonstration
const eventLogs: GAEventLog[] = [];
type Listener = (logs: GAEventLog[]) => void;
const listeners: Set<Listener> = new Set();

export const subscribeToEvents = (listener: Listener) => {
  listeners.add(listener);
  listener([...eventLogs]);
  return () => {
    listeners.delete(listener);
  };
};

export const clearEventLogs = () => {
  eventLogs.length = 0;
  listeners.forEach((l) => l([]));
};

const recordEvent = (eventName: string, params: Record<string, any>) => {
  const newLog: GAEventLog = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    eventName,
    params,
  };
  eventLogs.unshift(newLog);
  if (eventLogs.length > 50) eventLogs.pop();
  listeners.forEach((l) => l([...eventLogs]));

  // Dispatch to window.gtag if present
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
      console.log(`[GA4 Event Dispatched] ${eventName}`, params);
    } catch (err) {
      console.warn('GA4 dispatch error:', err);
    }
  }
};

/**
 * Standard GA4 item mapper
 */
export const formatGA4Item = (product: Product, quantity = 1, variant?: { color?: string; size?: string }) => {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    item_category2: product.subcategory,
    price: product.price,
    quantity,
    item_variant: variant ? [variant.color, variant.size].filter(Boolean).join(' / ') : undefined,
  };
};

/**
 * GA4 Events Helper
 */
export const analytics = {
  pageView: (pageTitle: string, path: string) => {
    recordEvent('page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: path,
    });
  },

  viewItemList: (listName: string, products: Product[]) => {
    recordEvent('view_item_list', {
      item_list_name: listName,
      items: products.slice(0, 12).map((p, idx) => ({
        ...formatGA4Item(p),
        index: idx + 1,
      })),
    });
  },

  selectItem: (listName: string, product: Product, index?: number) => {
    recordEvent('select_item', {
      item_list_name: listName,
      items: [
        {
          ...formatGA4Item(product),
          index: index !== undefined ? index + 1 : undefined,
        },
      ],
    });
  },

  viewItem: (product: Product, currency: string = 'INR') => {
    recordEvent('view_item', {
      currency,
      value: product.price,
      items: [formatGA4Item(product)],
    });
  },

  addToWishlist: (product: Product) => {
    recordEvent('add_to_wishlist', {
      items: [formatGA4Item(product)],
    });
  },

  addToCart: (product: Product, quantity = 1, variant?: { color?: string; size?: string }, currency: string = 'INR') => {
    recordEvent('add_to_cart', {
      currency,
      value: product.price * quantity,
      items: [formatGA4Item(product, quantity, variant)],
    });
  },

  viewCart: (items: { product: Product; quantity: number }[], total: number, currency: string = 'INR') => {
    recordEvent('view_cart', {
      currency,
      value: total,
      items: items.map((i) => formatGA4Item(i.product, i.quantity)),
    });
  },

  beginCheckout: (items: { product: Product; quantity: number }[], total: number, currency: string = 'INR') => {
    recordEvent('begin_checkout', {
      currency,
      value: total,
      items: items.map((i) => formatGA4Item(i.product, i.quantity)),
    });
  },

  addShippingInfo: (shippingTier: string, value: number, currency: string = 'INR') => {
    recordEvent('add_shipping_info', {
      currency,
      value,
      shipping_tier: shippingTier,
    });
  },

  addPaymentInfo: (paymentType: string, value: number, currency: string = 'INR') => {
    recordEvent('add_payment_info', {
      currency,
      value,
      payment_type: paymentType,
    });
  },

  purchase: (
    transactionId: string,
    items: { product: Product; quantity: number }[],
    value: number,
    tax: number = 0,
    shipping: number = 0,
    currency: string = 'INR'
  ) => {
    recordEvent('purchase', {
      transaction_id: transactionId,
      value,
      tax,
      shipping,
      currency,
      items: items.map((i) => formatGA4Item(i.product, i.quantity)),
    });
  },

  search: (searchTerm: string, resultsCount: number) => {
    recordEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  },

  generateLead: (method: string = 'newsletter_footer', emailDomain?: string) => {
    recordEvent('generate_lead', {
      method,
      lead_type: 'newsletter_subscription',
      domain: emailDomain || 'direct',
    });
  },
};
