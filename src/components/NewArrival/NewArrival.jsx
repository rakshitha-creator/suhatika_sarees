import { useRef, useState } from 'react';
import './NewArrival.css';
import { addToCart } from '../../data/cart';

const products = [
  { id: 1, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 2, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 3, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 4, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', images: ['/image.png', '/image.png'], colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
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

function ProductCard({ product, onScroll }) {
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
    <article className="new-arrival__card" role="link" tabIndex={0} onClick={openProduct}>
      <div className="new-arrival__card-image-wrap">
        <img src={currentImage} alt={product.name} className="new-arrival__card-image" />
        <button
          type="button"
          className="new-arrival__card-wishlist"
          aria-label="Add to wishlist"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon />
        </button>
        <button type="button" className="new-arrival__card-arrow new-arrival__card-arrow--left" onClick={prevImage} aria-label="Previous image">
          <ChevronLeftIcon />
        </button>
        <button type="button" className="new-arrival__card-arrow new-arrival__card-arrow--right" onClick={nextImage} aria-label="Next image">
          <ChevronRightIcon />
        </button>
      </div>
      <div className="new-arrival__card-details">
        <h3 className="new-arrival__card-name">{product.name}</h3>
        <div className="new-arrival__card-colors">
          {product.colors.map((color, i) => (
            <span key={i} className="new-arrival__card-swatch" style={{ backgroundColor: color }} aria-hidden="true" />
          ))}
        </div>
        <div className="new-arrival__card-price">
          <span className="new-arrival__card-price-current">₹ {product.price}/-</span>
          <span className="new-arrival__card-price-original">₹ {product.originalPrice}</span>
        </div>
        <button
          type="button"
          className="new-arrival__card-cart"
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({ productId: product.id, quantity: 1, color: product.colors?.[0] ?? null });
          }}
        >
          <img className="new-arrival__card-cart-icon" src="/shopping bag-add.svg" alt="" />
        </button>
      </div>
    </article>
  );
}

export default function NewArrival() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="new-arrival">
      <div className="new-arrival__inner">
        <h2 className="new-arrival__title">New Arrived</h2>
        <div className="new-arrival__carousel-wrap">
          <button type="button" className="new-arrival__nav new-arrival__nav--left" onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeftIcon />
          </button>
          <div className="new-arrival__carousel" ref={scrollRef}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onScroll={scroll} />
            ))}
          </div>
          <button type="button" className="new-arrival__nav new-arrival__nav--right" onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
