import './Header.css';

import { useEffect, useRef, useState } from 'react';
import { getCart } from '../../data/cart';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const collectionsPreview = [
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
  { title: 'Product Label', image: '/image.png', href: '#/collections' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const collectionsStripRef = useRef(null);
  const [canScrollCollectionsLeft, setCanScrollCollectionsLeft] = useState(false);
  const [canScrollCollectionsRight, setCanScrollCollectionsRight] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const openCart = () => {
    setIsMenuOpen(false);
    window.location.hash = '#/cart';
  };

  useEffect(() => {
    const compute = () => {
      const items = getCart();
      const count = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
      setCartCount(count);
    };

    compute();
    window.addEventListener('cart:change', compute);
    window.addEventListener('storage', compute);
    return () => {
      window.removeEventListener('cart:change', compute);
      window.removeEventListener('storage', compute);
    };
  }, []);

  const updateCollectionsScrollState = () => {
    const el = collectionsStripRef.current;
    if (!el) return;

    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const epsilon = 5;
    setCanScrollCollectionsLeft(el.scrollLeft > epsilon);
    setCanScrollCollectionsRight(el.scrollLeft < maxScrollLeft - epsilon);
  };

  useEffect(() => {
    const el = collectionsStripRef.current;
    if (!el) return;

    const onScroll = () => updateCollectionsScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateCollectionsScrollState);

    const raf = window.requestAnimationFrame(() => updateCollectionsScrollState());

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateCollectionsScrollState);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const scrollCollectionsStrip = (direction) => {
    const el = collectionsStripRef.current;
    if (!el) return;

    const amount = Math.max(260, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });

    window.requestAnimationFrame(() => updateCollectionsScrollState());
    window.setTimeout(() => updateCollectionsScrollState(), 220);
    window.setTimeout(() => updateCollectionsScrollState(), 520);
    window.setTimeout(() => updateCollectionsScrollState(), 920);
  };

  const menuLeftLinks = [
    { label: 'Home', href: '#/' },
    { label: 'Collections', href: '#/collections' },
    { label: 'About Us', href: '#/about' },
    { label: 'Contact Us', href: '#/contact' },
  ];

  const menuGroups = [
    { title: 'Top', items: ['T-Shirts', 'Polos', 'Shirts', 'Sweatshirts', 'Hoodies', 'Jackets'] },
    { title: 'Bottom', items: ['Cargos', 'Jeans', 'Pants', 'Shorts'] },
    { title: 'Accessories', items: ['Bags', 'Caps'] },
  ];

  return (
    <header className="header">
      <div className="header__inner">
        <button
          type="button"
          className="header__icon-btn header__icon-btn--menu"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <img src="/menu-line-horizontal.svg" alt="" aria-hidden="true" width="22" height="22" />
        </button>
        <a href="#/" className="header__brand">
          Suhatika Sarees
        </a>
        <nav className="header__nav">
          <a href="#/" className="header__link">Home</a>
          <div
            className="header__dropdown"
            onMouseEnter={() => {
              window.requestAnimationFrame(() => updateCollectionsScrollState());
            }}
          >
            <a href="#/collections" className="header__link">Collections</a>
            <div className="header__dropdown-panel" role="menu" aria-label="Collections menu">
              <div className="header__dropdown-carousel">
                {canScrollCollectionsLeft && (
                  <button
                    type="button"
                    className="header__dropdown-arrow header__dropdown-arrow--left"
                    aria-label="Scroll left"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      scrollCollectionsStrip(-1);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                )}

                <div className="header__dropdown-strip" ref={collectionsStripRef}>
                  {collectionsPreview.map((item, idx) => (
                    <a key={`${item.title}-${idx}`} href={item.href} className="header__dropdown-card" role="menuitem">
                      <span className="header__dropdown-thumb" aria-hidden="true">
                        <img src={item.image} alt="" loading="lazy" />
                      </span>
                      <span className="header__dropdown-title">{item.title}</span>
                    </a>
                  ))}
                </div>

                {canScrollCollectionsRight && (
                  <button
                    type="button"
                    className="header__dropdown-arrow header__dropdown-arrow--right"
                    aria-label="Scroll right"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      scrollCollectionsStrip(1);
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <a href="#/about" className="header__link">About Us</a>
          <a href="#/contact" className="header__link">Contact Us</a>
        </nav>
        <div className="header__actions">
          <div className="header__search-wrap">
            <input type="search" className="header__search" placeholder="Search" aria-label="Search" />
            <span className="header__search-icon">
              <SearchIcon />
            </span>
          </div>
          <button type="button" className="header__icon-btn" aria-label="Wishlist">
            <img src="/love.svg" alt="" aria-hidden="true" width="22" height="22" />
          </button>
          <button type="button" className="header__icon-btn" aria-label="Account">
            <img src="/user.svg" alt="" aria-hidden="true" width="22" height="22" />
          </button>
          <button type="button" className="header__icon-btn header__icon-btn--cart" aria-label="Cart" onClick={openCart}>
            <img src="/shopping bag.svg" alt="" aria-hidden="true" width="22" height="22" />
            {cartCount > 0 && <span className="header__cart-badge" aria-hidden="true">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div
        className={`header__menu-layer ${isMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="header__menu-panel" role="dialog" onClick={(e) => e.stopPropagation()}>
          <div className="header__menu-inner">
            <div className="header__menu-left" aria-label="Menu links">
              {menuLeftLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="header__menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="header__menu-groups" aria-label="Menu categories">
              {menuGroups.map((group) => (
                <div key={group.title} className="header__menu-group">
                  <div className="header__menu-group-title">{group.title}</div>
                  <div className="header__menu-pills">
                    {group.items.map((pill) => (
                      <a
                        key={pill}
                        href="#/collections"
                        className="header__menu-pill"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {pill}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
