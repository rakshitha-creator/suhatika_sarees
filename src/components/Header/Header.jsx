import './Header.css';

import { useState } from 'react';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const collectionsPreview = [
  { title: 'Valentine Special', image: '/image.png', href: '#/collections' },
  { title: 'Cops', image: '/image.png', href: '#/collections' },
  { title: 'Winter Collection', image: '/image.png', href: '#/collections' },
  { title: 'Blooming Racing Club', image: '/image.png', href: '#/collections' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuLeftLinks = [
    { label: 'New Arrivals', href: '#/collections' },
    { label: 'Winter collection 2025', href: '#/collections' },
    { label: 'Basics', href: '#/collections' },
    { label: 'Blooming Racing Club', href: '#/collections' },
    { label: 'Iconics', href: '#/collections' },
  ];

  const menuGroups = [
    { title: 'Top', items: ['T-Shirts', 'Polos', 'Shirts', 'Sweatshirts', 'Hoodies', 'Jackets'] },
    { title: 'Bottom', items: ['Cargos', 'Jeans', 'Pants', 'Shorts'] },
    { title: 'Accessories', items: ['Bags', 'Caps'] },
  ];

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#/" className="header__brand">
          Suhatika Sarees
        </a>
        <nav className="header__nav">
          <a href="#/" className="header__link">Home</a>
          <div className="header__dropdown">
            <a href="#/collections" className="header__link">Collections</a>
            <div className="header__dropdown-panel" role="menu" aria-label="Collections menu">
              <div className="header__dropdown-strip">
                {collectionsPreview.map((item) => (
                  <a key={item.title} href={item.href} className="header__dropdown-card" role="menuitem">
                    <span className="header__dropdown-thumb" aria-hidden="true">
                      <img src={item.image} alt="" loading="lazy" />
                    </span>
                    <span className="header__dropdown-title">{item.title}</span>
                  </a>
                ))}
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
            <HeartIcon />
          </button>
          <button type="button" className="header__icon-btn" aria-label="Account">
            <UserIcon />
          </button>
          <button type="button" className="header__icon-btn header__icon-btn--cart" aria-label="Cart">
            <BagIcon />
          </button>
          <button
            type="button"
            className="header__icon-btn header__icon-btn--menu"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <MenuIcon />
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
