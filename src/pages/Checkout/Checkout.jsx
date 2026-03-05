import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getCart, updateCartItem } from '../../data/cart';
import { getProductById } from '../../data/products';
import './Checkout.css';

function formatCurrency(value) {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString('en-IN')}.00`;
}

function OrderItem({ item }) {
  const product = getProductById(item.productId);
  const image = product?.images?.[0] ?? '/image.png';
  const name = product?.name ?? 'Product';
  const price = product?.price ?? 0;
  const qty = item.quantity ?? 1;

  return (
    <div className="checkout__order-item">
      <img className="checkout__order-thumb" src={image} alt="" />
      <div className="checkout__order-meta">
        <div className="checkout__order-name">{name}</div>
        <div className="checkout__order-sub">Color: {item.color ? item.color : 'Black'}</div>
        <div className="checkout__order-qty">
          <button
            type="button"
            className="checkout__order-qty-btn"
            onClick={() => updateCartItem({ productId: item.productId, color: item.color ?? null, quantity: Math.max(0, qty - 1) })}
            aria-label="Decrease"
          >
            –
          </button>
          <div className="checkout__order-qty-value">{qty}</div>
          <button
            type="button"
            className="checkout__order-qty-btn"
            onClick={() => updateCartItem({ productId: item.productId, color: item.color ?? null, quantity: qty + 1 })}
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </div>
      <div className="checkout__order-price">{formatCurrency(price * qty)}</div>
    </div>
  );
}

export default function Checkout() {
  const [items, setItems] = useState(() => getCart());
  const [coupon, setCoupon] = useState('');
  const [payment, setPayment] = useState('card');

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

  const discount = useMemo(() => {
    if (!coupon.trim()) return 0;
    return Math.min(25, subtotal);
  }, [coupon, subtotal]);

  const shipping = 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="checkout">
      <Header />
      <main className="checkout__main">
        <div className="checkout__container">
          <h1 className="checkout__title">Check Out</h1>

          <div className="checkout__steps" aria-label="Checkout steps">
            <div className="checkout__step is-done">
              <span className="checkout__step-dot">✓</span>
              <span className="checkout__step-label">Shopping cart</span>
            </div>
            <div className="checkout__step is-active">
              <span className="checkout__step-dot">2</span>
              <span className="checkout__step-label">Checkout details</span>
            </div>
            <div className="checkout__step">
              <span className="checkout__step-dot">3</span>
              <span className="checkout__step-label">Order complete</span>
            </div>
          </div>

          <div className="checkout__layout">
            <section className="checkout__forms" aria-label="Checkout forms">
              <div className="checkout__card">
                <div className="checkout__card-title">Contact Information</div>
                <div className="checkout__grid2">
                  <label className="checkout__field">
                    <span className="checkout__label">First name</span>
                    <input className="checkout__input" type="text" placeholder="First name" />
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">Last name</span>
                    <input className="checkout__input" type="text" placeholder="Last name" />
                  </label>
                </div>
                <label className="checkout__field">
                  <span className="checkout__label">Phone number</span>
                  <input className="checkout__input" type="tel" placeholder="Phone number" />
                </label>
                <label className="checkout__field">
                  <span className="checkout__label">Email address</span>
                  <input className="checkout__input" type="email" placeholder="Your Email" />
                </label>
              </div>

              <div className="checkout__card">
                <div className="checkout__card-title">Shipping Address</div>
                <label className="checkout__field">
                  <span className="checkout__label">Street address</span>
                  <input className="checkout__input" type="text" placeholder="Street Address" />
                </label>

                <label className="checkout__field">
                  <span className="checkout__label">Country</span>
                  <select className="checkout__select" defaultValue="">
                    <option value="" disabled>
                      Country
                    </option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                  </select>
                </label>

                <label className="checkout__field">
                  <span className="checkout__label">Town / City</span>
                  <input className="checkout__input" type="text" placeholder="Town / City" />
                </label>

                <div className="checkout__grid2">
                  <label className="checkout__field">
                    <span className="checkout__label">State</span>
                    <input className="checkout__input" type="text" placeholder="State" />
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">Zip code</span>
                    <input className="checkout__input" type="text" placeholder="Zip Code" />
                  </label>
                </div>

                <label className="checkout__checkbox">
                  <input type="checkbox" />
                  <span>Use a different billing address (optional)</span>
                </label>
              </div>

              <div className="checkout__card">
                <div className="checkout__card-title">Payment method</div>

                <label className={`checkout__radio ${payment === 'card' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} />
                  <span>Debit or Credit Card</span>
                </label>

                <label className={`checkout__radio ${payment === 'upi' ? 'is-active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'upi'} onChange={() => setPayment('upi')} />
                  <span>UPI</span>
                </label>

                {payment === 'card' ? (
                  <>
                    <label className="checkout__field">
                      <span className="checkout__label">Card number</span>
                      <input className="checkout__input" type="text" placeholder="1234 1234 1234 1234" />
                    </label>
                    <div className="checkout__grid2">
                      <label className="checkout__field">
                        <span className="checkout__label">Expiration date</span>
                        <input className="checkout__input" type="text" placeholder="MM/YY" />
                      </label>
                      <label className="checkout__field">
                        <span className="checkout__label">CVC</span>
                        <input className="checkout__input" type="text" placeholder="CVC code" />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="checkout__field">
                    <span className="checkout__label">UPI ID</span>
                    <input className="checkout__input" type="text" placeholder="name@bank" />
                  </label>
                )}

                <button
                  type="button"
                  className="checkout__place"
                  onClick={() => {
                    if (items.length === 0) return;
                    alert('Order complete page will be added next.');
                  }}
                >
                  Place Order
                </button>
              </div>
            </section>

            <aside className="checkout__summary" aria-label="Order summary">
              <div className="checkout__summary-card">
                <div className="checkout__summary-title">Order summary</div>

                <div className="checkout__order-list">
                  {items.length === 0 ? (
                    <div className="checkout__empty">
                      <div className="checkout__empty-title">No items in cart</div>
                      <a className="checkout__empty-link" href="#/collections">Continue shopping</a>
                    </div>
                  ) : (
                    items.map((item) => <OrderItem key={`${item.productId}-${item.color ?? ''}`} item={item} />)
                  )}
                </div>

                <div className="checkout__coupon">
                  <input
                    className="checkout__coupon-input"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Input"
                    aria-label="Coupon"
                  />
                  <button type="button" className="checkout__coupon-btn">Apply</button>
                </div>

                {coupon.trim() && (
                  <div className="checkout__discount">
                    <span className="checkout__discount-code">{coupon}</span>
                    <span className="checkout__discount-amount">-{formatCurrency(discount)} (Remove)</span>
                  </div>
                )}

                <div className="checkout__totals">
                  <div className="checkout__total-row">
                    <span className="checkout__total-label">Shipping</span>
                    <span className="checkout__total-value">Free</span>
                  </div>
                  <div className="checkout__total-row">
                    <span className="checkout__total-label">Subtotal</span>
                    <span className="checkout__total-value">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="checkout__total-row checkout__total-row--grand">
                    <span className="checkout__total-label">Total</span>
                    <span className="checkout__total-value">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
