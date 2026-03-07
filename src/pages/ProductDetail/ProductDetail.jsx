import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { addToCart } from '../../data/cart';
import { getWebsiteProductById } from '../../data/websiteProducts';
import './ProductDetail.css';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

function formatPrice(value) {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-IN');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

export default function ProductDetail({ productId }) {
  const product = useMemo(() => getWebsiteProductById(productId), [productId]);

  const images = product?.images?.length ? product.images : ['/image.png'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? '#111827');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const [offerEndsAt, setOfferEndsAt] = useState(() => {
    return Date.now() + 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 45 * 60 * 1000 + 5 * 1000;
  });
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, offerEndsAt - Date.now()));

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor(product?.colors?.[0] ?? '#111827');
    setQuantity(1);
    setAddedToCart(false);
    setOfferEndsAt(Date.now() + 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 45 * 60 * 1000 + 5 * 1000);
  }, [productId, product]);

  useEffect(() => {
    setAddedToCart(false);
  }, [selectedColor, quantity]);

  useEffect(() => {
    if (!addedToCart) return;
    const t = window.setTimeout(() => setAddedToCart(false), 1600);
    return () => window.clearTimeout(t);
  }, [addedToCart]);

  useEffect(() => {
    const t = window.setInterval(() => {
      const remaining = Math.max(0, offerEndsAt - Date.now());
      setTimeLeft(remaining);
    }, 250);
    return () => window.clearInterval(t);
  }, [offerEndsAt]);

  const countdown = useMemo(() => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }, [timeLeft]);

  const prevImage = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setActiveImageIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setActiveImageIndex((i) => (i + 1) % images.length);
  };

  if (!product) {
    return (
      <div className="product-detail">
        <Header />
        <main className="product-detail__main">
          <div className="product-detail__not-found">
            <h1 className="product-detail__not-found-title">Product not found</h1>
            <a className="product-detail__back" href="#/collections">Back to collections</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Header />
      <main className="product-detail__main">
        <div className="product-detail__container">
          <section className="product-detail__gallery" aria-label="Product gallery">
            <div className="product-detail__hero">
              <div className="product-detail__badges">
                <span className="product-detail__badge product-detail__badge--new">NEW</span>
                <span className="product-detail__badge product-detail__badge--off">-50%</span>
              </div>

              <img className="product-detail__hero-image" src={images[activeImageIndex]} alt={product.name} />

              <button type="button" className="product-detail__hero-arrow product-detail__hero-arrow--left" onClick={prevImage} aria-label="Previous image">
                <ChevronLeftIcon />
              </button>
              <button type="button" className="product-detail__hero-arrow product-detail__hero-arrow--right" onClick={nextImage} aria-label="Next image">
                <ChevronRightIcon />
              </button>
            </div>

            <div className="product-detail__thumbs" aria-label="Thumbnails">
              {images.slice(0, 4).map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  className={`product-detail__thumb ${idx === activeImageIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={src} alt="" className="product-detail__thumb-image" />
                </button>
              ))}
            </div>
          </section>

          <section className="product-detail__info" aria-label="Product details">
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__desc">{product.description}</p>

            <div className="product-detail__price-row">
              <span className="product-detail__price">₹{formatPrice(product.price)}.00</span>
              <span className="product-detail__price-old">₹{formatPrice(product.originalPrice)}.00</span>
            </div>

            <div className="product-detail__divider" />

            <div className="product-detail__offer">
              <div className="product-detail__offer-label">Offer expires in:</div>
              <div className="product-detail__timer">
                <div className="product-detail__timer-box">
                  <div className="product-detail__timer-num">{pad2(countdown.days)}</div>
                  <div className="product-detail__timer-unit">Days</div>
                </div>
                <div className="product-detail__timer-box">
                  <div className="product-detail__timer-num">{pad2(countdown.hours)}</div>
                  <div className="product-detail__timer-unit">Hours</div>
                </div>
                <div className="product-detail__timer-box">
                  <div className="product-detail__timer-num">{pad2(countdown.minutes)}</div>
                  <div className="product-detail__timer-unit">Minutes</div>
                </div>
                <div className="product-detail__timer-box">
                  <div className="product-detail__timer-num">{pad2(countdown.seconds)}</div>
                  <div className="product-detail__timer-unit">Seconds</div>
                </div>
              </div>
            </div>

            <div className="product-detail__divider" />

            <div className="product-detail__meta">
              <div className="product-detail__meta-label">Measurements</div>
              <div className="product-detail__meta-value">{product.measurements}</div>
            </div>

            <div className="product-detail__meta product-detail__meta--colors">
              <div className="product-detail__meta-label">Choose Color</div>
              <div className="product-detail__meta-value">{selectedColor === '#111827' ? 'Black' : 'Selected'}</div>
              <div className="product-detail__colors">
                {product.colors.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    className={`product-detail__color ${selectedColor === hex ? 'is-active' : ''}`}
                    onClick={() => setSelectedColor(hex)}
                    aria-label={`Choose color ${hex}`}
                  >
                    <span className="product-detail__color-swatch" style={{ backgroundColor: hex }} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-detail__actions">
              <div className="product-detail__qty">
                <button
                  type="button"
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <div className="product-detail__qty-value">{quantity}</div>
                <button
                  type="button"
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button type="button" className="product-detail__wishlist">
                <HeartIcon />
                Wishlist
              </button>

              <button
                type="button"
                className="product-detail__add"
                onClick={() => {
                  const ok = addToCart({ productId: product.id, quantity, color: selectedColor });
                  if (ok) setAddedToCart(true);
                }}
              >
                {addedToCart ? 'Added to cart' : 'Add to Cart'}
              </button>
              <button
                type="button"
                className="product-detail__buy"
                onClick={() => {
                  const ok = addToCart({ productId: product.id, quantity, color: selectedColor, _action: 'buy_now' });
                  if (ok) window.location.hash = '#/checkout';
                }}
              >
                Buy Now
              </button>
            </div>

            <div className="product-detail__divider" />

            <div className="product-detail__footer-meta">
              <div className="product-detail__footer-meta-row">
                <span className="product-detail__footer-meta-label">SKU</span>
                <span className="product-detail__footer-meta-value">{product.sku}</span>
              </div>
              <div className="product-detail__footer-meta-row">
                <span className="product-detail__footer-meta-label">CATEGORY</span>
                <span className="product-detail__footer-meta-value">{product.category}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
