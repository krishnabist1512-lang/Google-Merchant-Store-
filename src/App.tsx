import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { QuickAddModal } from './components/QuickAddModal';
import { ToastContainer, GA4Inspector } from './components/ToastContainer';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { SearchPage } from './pages/SearchPage';
import { AccountPage } from './pages/AccountPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { AboutPage } from './pages/AboutPage';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [currentSearch, setCurrentSearch] = useState<string>(() => {
    return window.location.search || '';
  });

  // Handle browser popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearch(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation helper with browser history push
  const navigate = (to: string) => {
    const [path, search] = to.split('?');
    const newSearch = search ? `?${search}` : '';

    if (window.location.pathname !== path || window.location.search !== newSearch) {
      window.history.pushState({}, '', to);
    }
    setCurrentPath(path);
    setCurrentSearch(newSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to extract query parameter
  const getQueryParam = (name: string): string | null => {
    const params = new URLSearchParams(currentSearch);
    return params.get(name);
  };

  // Route Dispatcher
  const renderRoute = () => {
    // Product Detail Page: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').split('/')[0];
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Category Page: /category/:catId
    if (currentPath.startsWith('/category/')) {
      const catId = currentPath.replace('/category/', '').split('/')[0];
      return <ShopPage initialCategory={catId} onNavigate={navigate} />;
    }

    // Shop Page: /shop
    if (currentPath === '/shop') {
      const filter = getQueryParam('filter') || undefined;
      return <ShopPage initialFilter={filter} onNavigate={navigate} />;
    }

    // Cart Page: /cart
    if (currentPath === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    // Checkout: /checkout
    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    // Order Confirmation: /order-confirmed
    if (currentPath === '/order-confirmed') {
      const id = getQueryParam('id') || undefined;
      return <OrderConfirmationPage orderId={id} onNavigate={navigate} />;
    }

    // Wishlist: /wishlist
    if (currentPath === '/wishlist') {
      return <WishlistPage onNavigate={navigate} />;
    }

    // Search Page: /search
    if (currentPath === '/search') {
      const q = getQueryParam('q') || '';
      return <SearchPage initialQuery={q} onNavigate={navigate} />;
    }

    // Account: /account
    if (currentPath === '/account') {
      return <AccountPage onNavigate={navigate} />;
    }

    // Shipping & Returns: /shipping-returns
    if (currentPath === '/shipping-returns') {
      return <ShippingReturnsPage onNavigate={navigate} />;
    }

    // About: /about
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // Default: Home Page
    return <HomePage onNavigate={navigate} />;
  };

  const isCheckout = currentPath === '/checkout';

  return (
    <div className="flex flex-col min-h-screen text-[#1B1D21] bg-[#FAFAF8]">
      {/* Skip to Content accessible link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2F6BFF] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header: hidden during distraction-free checkout */}
      {!isCheckout && <Header currentPath={currentPath} onNavigate={navigate} />}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {renderRoute()}
      </main>

      {/* Footer: hidden during checkout */}
      {!isCheckout && <Footer onNavigate={navigate} />}

      {/* Mobile Bottom Navigation: hidden during checkout */}
      {!isCheckout && <BottomNav currentPath={currentPath} onNavigate={navigate} />}

      {/* Slide-out Cart Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* Fast Quick Add Modal */}
      <QuickAddModal onNavigate={navigate} />

      {/* Toasts Feedback */}
      <ToastContainer />

      {/* GA4 Realtime Live Inspector (Viva Tool) */}
      <GA4Inspector />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
