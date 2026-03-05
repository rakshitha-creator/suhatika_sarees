import { useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutPages.css';

const craftedCollectionProducts = [
  { id: 1, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 2, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 3, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 4, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 5, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 6, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
];

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

function CraftedCollectionCard({ product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = Array.isArray(product.images) && product.images.length ? product.images : ['/image.png'];
  const currentImage = images[imageIndex % images.length];

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
    <article className="about-pages__crafted-collections-card">
      <div className="about-pages__crafted-collections-card-image-wrap">
        <img src={currentImage} alt={product.name} className="about-pages__crafted-collections-card-image" />
        <button type="button" className="about-pages__crafted-collections-card-wishlist" aria-label="Add to wishlist">
          <HeartIcon />
        </button>
        <button
          type="button"
          className="about-pages__crafted-collections-card-arrow about-pages__crafted-collections-card-arrow--left"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          className="about-pages__crafted-collections-card-arrow about-pages__crafted-collections-card-arrow--right"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="about-pages__crafted-collections-card-details">
        <h3 className="about-pages__crafted-collections-card-name">{product.name}</h3>
        <div className="about-pages__crafted-collections-card-colors">
          {product.colors.map((color, i) => (
            <span
              key={`${product.id}-color-${i}`}
              className="about-pages__crafted-collections-card-swatch"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="about-pages__crafted-collections-card-price">
          <span className="about-pages__crafted-collections-card-price-current">₹ {product.price}/-</span>
          <span className="about-pages__crafted-collections-card-price-original">₹ {product.originalPrice}</span>
        </div>
        <button type="button" className="about-pages__crafted-collections-card-cart" aria-label="Add to cart">
          <img className="about-pages__crafted-collections-card-cart-icon" src="/shopping bag-add.svg" alt="" />
        </button>
      </div>
    </article>
  );
}

export default function AboutPages() {
  const craftedScrollRef = useRef(null);

  const scrollCraftedCollections = (direction) => {
    if (!craftedScrollRef?.current) return;
    const amount = 340;
    craftedScrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="about-pages">
      <Header />
      <main className="about-pages__main">
        <section className="about-pages__hero">
          <div className="about-pages__hero-inner">
            <h1 className="about-pages__hero-title">
              From Thread to Timeless
              <br />
              Elegance
            </h1>
            <p className="about-pages__hero-subtitle">A journey woven with tradition and perfected with passion.</p>
          </div>
        </section>

        <section className="about-pages__banner" aria-label="About banner">
          <img className="about-pages__banner-image" src="/Bridal-Kanchi-Silk-Sarees.webp" alt="" />
        </section>

        <section className="about-pages__story" aria-label="About story">
          <div className="about-pages__story-inner">
            <div className="about-pages__story-text">
              <p>
                Every Suhatika saree begins its journey with carefully selected silk threads and the skilled hands of experienced artisans.
                Through meticulous weaving, intricate detailing, and refined finishing, each saree slowly transforms into a masterpiece of
                tradition and beauty.
              </p>
              <p>
                Our artisans bring generations of craftsmanship into every weave, ensuring that each piece reflects authenticity, elegance,
                and exceptional quality.
              </p>
              <p>
                From the loom to the final showcase, every Suhatika saree is designed to celebrate the grace of the woman who wears it.
              </p>
            </div>

            <a href="#/collections" className="about-pages__story-cta">Explore Collections</a>
          </div>
        </section>

        <section className="about-pages__crafted" aria-label="Crafted for you">
          <div className="about-pages__crafted-inner">
            <h2 className="about-pages__crafted-title">
              Crafted for You. Delivered
              <br />
              with Trust
            </h2>

            <p className="about-pages__crafted-text">
              Every Suhatika saree is carefully inspected, folded, and packed with precision to preserve its elegance and quality. We ensure
              that each product is securely packaged and sealed directly from our production process so that the first time it is opened is by
              you — our valued customer.
            </p>

            <a href="#/about" className="about-pages__crafted-cta">Know Our Story</a>
          </div>
        </section>

        <section className="about-pages__crafted-collections" aria-label="Crafted collections">
          <div className="about-pages__crafted-collections-inner">
            <h2 className="about-pages__crafted-collections-title">Crafted Collections</h2>

            <div className="about-pages__crafted-collections-carousel-wrap">
              <button
                type="button"
                className="about-pages__crafted-collections-nav about-pages__crafted-collections-nav--left"
                onClick={() => scrollCraftedCollections('left')}
                aria-label="Previous"
              >
                <ChevronLeftIcon />
              </button>

              <div className="about-pages__crafted-collections-carousel" ref={craftedScrollRef}>
                {craftedCollectionProducts.map((product) => (
                  <CraftedCollectionCard key={product.id} product={product} />
                ))}
              </div>

              <button
                type="button"
                className="about-pages__crafted-collections-nav about-pages__crafted-collections-nav--right"
                onClick={() => scrollCraftedCollections('right')}
                aria-label="Next"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
