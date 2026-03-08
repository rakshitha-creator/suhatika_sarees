import { useMemo, useState } from 'react';
import './Collections.css';
import { addToCart } from '../../data/cart';
import { websiteProducts } from '../../data/websiteProducts';

const products = websiteProducts.filter((p) => String(p.id).startsWith('collections_'));

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

function ProductCard({ product, rowId, hideDetails = false }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = Array.isArray(product.images) && product.images.length ? product.images : ['/image.png'];
  const currentImage = images[imageIndex % images.length];

  const openProduct = () => {
    window.location.hash = `#/product/${product.id}`;
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((idx) => (idx - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((idx) => (idx + 1) % images.length);
  };

  return (
    <article className="collections__card" role="link" tabIndex={0} onClick={openProduct}>
      <div className="collections__card-image-wrap">
        <img src={currentImage} alt={product.name} className="collections__card-image" />
        <button
          type="button"
          className="collections__card-wishlist"
          aria-label="Add to wishlist"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon />
        </button>
        <button type="button" className="collections__card-arrow collections__card-arrow--left" onClick={prevImage} aria-label="Previous image">
          <ChevronLeftIcon />
        </button>
        <button type="button" className="collections__card-arrow collections__card-arrow--right" onClick={nextImage} aria-label="Next image">
          <ChevronRightIcon />
        </button>
      </div>
      {!hideDetails && (
        <div className="collections__card-details">
          <h3 className="collections__card-name">{product.name}</h3>
          <div className="collections__card-price">
            <span className="collections__card-price-current">₹ {product.price}/-</span>
            <span className="collections__card-price-original">₹ {product.originalPrice}</span>
          </div>
          <button
            type="button"
            className="collections__card-cart"
            aria-label="Add to cart"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ productId: product.id, quantity: 1, color: product.colors?.[0] ?? null });
            }}
          >
            <img className="collections__card-cart-icon" src="/shopping bag-add.svg" alt="" />
          </button>
        </div>
      )}
    </article>
  );
}

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState('tissue');

  const tissueProducts = useMemo(() => products.filter((p) => String(p?.name ?? '').toLowerCase().includes('tissue')), []);
  const vintageProducts = useMemo(
    () => websiteProducts.filter((p) => String(p.id).startsWith('newarrivals_')).slice(0, 5),
    []
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'tissue') return tissueProducts;
    if (activeCategory === 'vintage') return vintageProducts;
    return products;
  }, [activeCategory, tissueProducts, vintageProducts]);

  return (
    <section className="collections">
      <div className="collections__inner">
        <div className="collections__header">
          <h2 className="collections__title">Our Signature Collections</h2>
          <a href="#/collections" className="collections__view-all">View All</a>
        </div>

        <div className="collections__split">
          <aside className="collections__left">
            <div className="collections__types">
              <div className="collections__types-title">Types</div>
              <div className="collections__types-buttons">
                <button
                  type="button"
                  className={`collections__type-btn${activeCategory === 'tissue' ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory('tissue')}
                >
                  Tissue
                </button>
                <button
                  type="button"
                  className={`collections__type-btn${activeCategory === 'vintage' ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory('vintage')}
                >
                  Vintage
                </button>
              </div>
            </div>
          </aside>

          <div className="collections__right">
            <div className="collections__scroll" aria-label="Collection items">
              <div className="collections__scroll-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={`${activeCategory}-${product.id}`}
                    product={product}
                    rowId={activeCategory}
                    hideDetails={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
