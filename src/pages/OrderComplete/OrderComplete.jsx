import { useMemo } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getCart } from '../../data/cart';
import { getProductById } from '../../data/products';
import './OrderComplete.css';

function formatCurrency(value) {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString('en-IN')}.00`;
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function generateOrderCode() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${now}-${rand}`;
}

function OrderThumb({ item }) {
  const product = getProductById(item.productId);
  const image = product?.images?.[0] ?? '/image.png';
  const qty = item.quantity ?? 1;

  return (
    <div className="order-complete__thumb">
      <img className="order-complete__thumb-img" src={image} alt="" />
      <span className="order-complete__thumb-badge">{qty}</span>
    </div>
  );
}

export default function OrderComplete() {
  const orderData = useMemo(() => {
    try {
      const raw = window.sessionStorage.getItem('order:last');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const items = orderData?.items ?? getCart();

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = getProductById(item.productId);
      const price = product?.price ?? 0;
      return sum + price * (item.quantity ?? 1);
    }, 0);
  }, [items]);

  const total = orderData?.total ?? subtotal;
  const orderCode = orderData?.orderCode ?? generateOrderCode();
  const date = orderData?.date ? formatDate(orderData.date) : formatDate(new Date());
  const paymentMethod = orderData?.paymentMethod ?? 'Debit Card';

  return (
    <div className="order-complete">
      <Header />
      <main className="order-complete__main">
        <div className="order-complete__container">
          <h1 className="order-complete__title">Complete!</h1>

          <div className="order-complete__steps" aria-label="Checkout steps">
            <div className="order-complete__step is-done">
              <span className="order-complete__step-dot">✓</span>
              <span className="order-complete__step-label">Shopping cart</span>
            </div>
            <div className="order-complete__step is-done">
              <span className="order-complete__step-dot">✓</span>
              <span className="order-complete__step-label">Checkout details</span>
            </div>
            <div className="order-complete__step is-active">
              <span className="order-complete__step-dot">3</span>
              <span className="order-complete__step-label">Order complete</span>
            </div>
          </div>

          <section className="order-complete__card" aria-label="Order received">
            <div className="order-complete__card-inner">
              <div className="order-complete__thank">Thank you!</div>
              <div className="order-complete__headline">Your order has been received</div>

              <div className="order-complete__thumbs" aria-label="Ordered items">
                {items.slice(0, 3).map((item) => (
                  <OrderThumb key={`${item.productId}-${item.color ?? ''}`} item={item} />
                ))}
              </div>

              <div className="order-complete__meta">
                <div className="order-complete__meta-row">
                  <div className="order-complete__meta-label">Order code:</div>
                  <div className="order-complete__meta-value">{orderCode}</div>
                </div>
                <div className="order-complete__meta-row">
                  <div className="order-complete__meta-label">Date:</div>
                  <div className="order-complete__meta-value">{date}</div>
                </div>
                <div className="order-complete__meta-row">
                  <div className="order-complete__meta-label">Total:</div>
                  <div className="order-complete__meta-value">{formatCurrency(total)}</div>
                </div>
                <div className="order-complete__meta-row">
                  <div className="order-complete__meta-label">Payment method:</div>
                  <div className="order-complete__meta-value">{paymentMethod}</div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
