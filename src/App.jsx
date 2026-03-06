import Home from './pages/Home/Home';

import { useEffect, useState } from 'react';
import CollectionPages from './pages/CollectionPages/CollectionPages';
import ContactPages from './pages/ContactPages/ContactPages';
import AboutPages from './pages/AboutPages/AboutPages';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderComplete from './pages/OrderComplete/OrderComplete';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const onHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [hash]);

  const path = hash.replace(/^#/, '');

  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    return <ProductDetail productId={productMatch[1]} />;
  }

  if (path === '/cart') {
    return <Cart />;
  }

  if (path.startsWith('/login')) {
    return <Login />;
  }

  if (path.startsWith('/signup')) {
    return <Signup />;
  }

  if (path === '/checkout') {
    return <Checkout />;
  }

  if (path === '/order-complete') {
    return <OrderComplete />;
  }

  if (path === '/collections') {
    return <CollectionPages />;
  }

  if (path === '/contact') {
    return <ContactPages />;
  }

  if (path === '/about') {
    return <AboutPages />;
  }

  return <Home />;
}

export default App;
