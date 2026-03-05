import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getCart, removeFromCart, updateCartItem } from '../../data/cart';
import { getProductById } from '../../data/products';
import './Cart.css';

function formatCurrency(value) {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString('en-IN')}.00`;
}

function CartItemRow({ item }) {
  const product = getProductById(item.productId);
  const image = product?.images?.[0] ?? '/image.png';
  const name = product?.name ?? 'Product';
  const price = product?.price ?? 0;
  const qty = item.quantity ?? 1;
  const subtotal = price * qty;

  const decrement = () => {
    if (qty <= 1) {
      removeFromCart({ productId: item.productId, color: item.color ?? null });
      return;
    }
    updateCartItem({ productId: item.productId, color: item.color ?? null, quantity: qty - 1 });
  };
  const increment = () => updateCartItem({ productId: item.productId, color: item.color ?? null, quantity: qty + 1 });

  return (
    <div className="cart__row">
      <div className="cart__cell cart__cell--product">
        <img className="cart__thumb" src={image} alt="" />
        <div className="cart__product-meta">
          <div className="cart__product-name">{name}</div>
          <div className="cart__product-sub">Color: {item.color ? item.color : 'Black'}</div>
          <button
            type="button"
            className="cart__remove"
            onClick={() => removeFromCart({ productId: item.productId, color: item.color ?? null })}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="cart__cell cart__cell--qty">
        <div className="cart__qty">
          <button type="button" className="cart__qty-btn" onClick={decrement} aria-label="Decrease">
            –
          </button>
          <div className="cart__qty-value">{qty}</div>
          <button type="button" className="cart__qty-btn" onClick={increment} aria-label="Increase">
            +
          </button>
        </div>
      </div>

      <div className="cart__cell cart__cell--price">{formatCurrency(price)}</div>
      <div className="cart__cell cart__cell--subtotal">{formatCurrency(subtotal)}</div>
    </div>
  );
}

export default function Cart() {
  const [items, setItems] = useState(() => getCart());
  const [shipping, setShipping] = useState('free');

  useEffect(() => {
    const onChange = () => setItems(getCart());
    window.addEventListener('cart:change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('cart:change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = getProductById(item.productId);
      const price = product?.price ?? 0;
      return sum + price * (item.quantity ?? 1);
    }, 0);
  }, [items]);

  const shippingCost = useMemo(() => {
    if (shipping === 'free') return 0;
    if (shipping === 'express') return 15;
    if (shipping === 'pickup') return 21;
    return 0;
  }, [shipping]);

  const total = subtotal + shippingCost;

  return (
    <div className="cart">
      <Header />
      <main className="cart__main">
        <div className="cart__container">
          <h1 className="cart__title">Cart</h1>

          <div className="cart__steps" aria-label="Cart steps">
            <div className="cart__step is-active">
              <span className="cart__step-dot">1</span>
              <span className="cart__step-label">Shopping cart</span>
            </div>
            <div className="cart__step">
              <span className="cart__step-dot">2</span>
              <span className="cart__step-label">Checkout details</span>
            </div>
            <div className="cart__step">
              <span className="cart__step-dot">3</span>
              <span className="cart__step-label">Order complete</span>
            </div>
          </div>

          <div className="cart__layout">
            <section className="cart__table" aria-label="Shopping cart items">
              <div className="cart__header-row">
                <div className="cart__head cart__head--product">Product</div>
                <div className="cart__head cart__head--qty">Quantity</div>
                <div className="cart__head cart__head--price">Price</div>
                <div className="cart__head cart__head--subtotal">Subtotal</div>
              </div>

              {items.length === 0 ? (
                <div className="cart__empty">
                  <div className="cart__empty-title">Your cart is empty</div>
                  <a className="cart__empty-link" href="#/collections">Continue shopping</a>
                </div>
              ) : (
                <div className="cart__rows">
                  {items.map((item) => (
                    <CartItemRow key={`${item.productId}-${item.color ?? ''}`} item={item} />
                  ))}
                </div>
              )}

              <div className="cart__coupon">
                <div className="cart__coupon-title">Have a coupon?</div>
                <div className="cart__coupon-sub">Add your code for an instant cart discount</div>
                <div className="cart__coupon-form">
                  <input className="cart__coupon-input" type="text" placeholder="Coupon Code" aria-label="Coupon code" />
                  <button type="button" className="cart__coupon-btn">Apply</button>
                </div>
              </div>
            </section>

            <aside className="cart__summary" aria-label="Cart summary">
              <div className="cart__summary-card">
                <div className="cart__summary-title">Cart summary</div>

                <div className="cart__shipping">
                  <label className="cart__ship-option">
                    <input type="radio" name="shipping" checked={shipping === 'free'} onChange={() => setShipping('free')} />
                    <span className="cart__ship-label">Free shipping</span>
                    <span className="cart__ship-price">{formatCurrency(0)}</span>
                  </label>
                  <label className="cart__ship-option">
                    <input type="radio" name="shipping" checked={shipping === 'express'} onChange={() => setShipping('express')} />
                    <span className="cart__ship-label">Express shipping</span>
                    <span className="cart__ship-price">+{formatCurrency(15)}</span>
                  </label>
                  <label className="cart__ship-option">
                    <input type="radio" name="shipping" checked={shipping === 'pickup'} onChange={() => setShipping('pickup')} />
                    <span className="cart__ship-label">Pick Up</span>
                    <span className="cart__ship-price">+{formatCurrency(21)}</span>
                  </label>
                </div>

                <div className="cart__summary-row">
                  <span className="cart__summary-label">Subtotal</span>
                  <span className="cart__summary-value">{formatCurrency(subtotal)}</span>
                </div>

                <div className="cart__summary-row cart__summary-row--total">
                  <span className="cart__summary-label">Total</span>
                  <span className="cart__summary-value">{formatCurrency(total)}</span>
                </div>

                <button
                  type="button"
                  className="cart__checkout"
                  onClick={() => {
                    if (items.length === 0) return;
                    window.location.hash = '#/checkout';
                  }}
                >
                  Checkout
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
