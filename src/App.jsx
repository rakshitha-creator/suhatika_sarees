import Home from './pages/Home/Home';

import { useEffect, useState } from 'react';
import CollectionPages from './pages/CollectionPages/CollectionPages';
import ContactPages from './pages/ContactPages/ContactPages';
import AboutPages from './pages/AboutPages/AboutPages';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';

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

  const productMatch = path.match(/^\/product\/(\d+)$/);
  if (productMatch) {
    return <ProductDetail productId={productMatch[1]} />;
  }

  if (path === '/cart') {
    return <Cart />;
  }

  if (path === '/checkout') {
    return <Checkout />;
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
