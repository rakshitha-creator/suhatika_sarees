import { useRef } from 'react';
import './Collections.css';

const products = [
  { id: 1, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 2, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 3, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 4, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 5, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
  { id: 6, name: 'Silk Saree', price: '2,699', originalPrice: '3,470', colors: ['#e53935', '#43a047', '#1e88e5', '#fdd835'] },
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

const CarouselRow = ({ scrollRef, rowId, onScroll }) => (
  <div className="collections__carousel-wrap">
    <div className="collections__carousel" ref={scrollRef}>
      {products.map((product) => (
        <article key={`${rowId}-${product.id}`} className="collections__card">
          <div className="collections__card-image-wrap">
            <img src="/image.png" alt={product.name} className="collections__card-image" />
            <button type="button" className="collections__card-wishlist" aria-label="Add to wishlist">
              <HeartIcon />
            </button>
            <button type="button" className="collections__card-arrow collections__card-arrow--left" onClick={() => onScroll(scrollRef, 'left')} aria-label="Previous">
              <ChevronLeftIcon />
            </button>
            <button type="button" className="collections__card-arrow collections__card-arrow--right" onClick={() => onScroll(scrollRef, 'right')} aria-label="Next">
              <ChevronRightIcon />
            </button>
          </div>
            <div className="collections__card-details">
              <h3 className="collections__card-name">{product.name}</h3>
              <div className="collections__card-colors">
                {product.colors.map((color, i) => (
                  <span key={i} className="collections__card-swatch" style={{ backgroundColor: color }} aria-hidden="true" />
                ))}
              </div>
              <div className="collections__card-price">
                <span className="collections__card-price-current">₹ {product.price}/-</span>
                <span className="collections__card-price-original">₹ {product.originalPrice}</span>
              </div>
              <button type="button" className="collections__card-cart" aria-label="Add to cart">
                <img className="collections__card-cart-icon" src="/shopping bag-add.svg" alt="" />
              </button>
            </div>
          </article>
        ))}
    </div>
  </div>
);

export default function Collections() {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  const scroll = (ref, direction) => {
    if (!ref?.current) return;
    const amount = 320;
    ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="collections">
      <div className="collections__inner">
        <div className="collections__header">
          <h2 className="collections__title">Our Signature Collections</h2>
          <a href="#/collections" className="collections__view-all">View All</a>
        </div>
        <CarouselRow scrollRef={scrollRef1} rowId={1} onScroll={scroll} />
        <CarouselRow scrollRef={scrollRef2} rowId={2} onScroll={scroll} />
      </div>
    </section>
  );
}
