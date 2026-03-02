import Home from './pages/Home/Home';

import { useEffect, useState } from 'react';
import CollectionPages from './pages/CollectionPages/CollectionPages';

function App() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const path = hash.replace(/^#/, '');

  if (path === '/collections') {
    return <CollectionPages />;
  }

  return <Home />;
}

export default App;
