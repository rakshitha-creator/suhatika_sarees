import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { clearCart, getCart, updateCartItem } from '../../data/cart';
import { getWebsiteProductById } from '../../data/websiteProducts';
import { getAuthUser } from '../../data/auth';
import { auth } from '../../lib/firebaseClient';
import { ref, set } from 'firebase/database';
import { db } from '../../lib/firebaseClient';
import './Checkout.css';

function formatCurrency(value) {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString('en-IN')}.00`;
}

function OrderItem({ item }) {
  const product = getWebsiteProductById(item.productId);
  const image = product?.images?.[0] ?? '/image.png';
  const name = product?.name ?? 'Product';
  const price = Number(String(product?.price ?? 0).replace(/,/g, '')) || 0;
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [country, setCountry] = useState('IN');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
      const product = getWebsiteProductById(item.productId);
      const price = Number(String(product?.price ?? 0).replace(/,/g, '')) || 0;
      return sum + price * (item.quantity ?? 1);
    }, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!coupon.trim()) return 0;
    return Math.min(25, subtotal);
  }, [coupon, subtotal]);

  const shipping = 0;
  const total = subtotal - discount + shipping;

  const missingFields = useMemo(() => {
    const missing = {};
    if (!String(firstName || '').trim()) missing.firstName = true;
    if (!String(lastName || '').trim()) missing.lastName = true;
    if (!String(phone || '').trim()) missing.phone = true;
    if (!String(email || '').trim()) missing.email = true;
    if (!String(street || '').trim()) missing.street = true;
    if (!String(city || '').trim()) missing.city = true;
    if (!String(stateName || '').trim()) missing.stateName = true;
    if (!String(zip || '').trim()) missing.zip = true;
    if (!String(country || '').trim()) missing.country = true;
    return missing;
  }, [firstName, lastName, phone, email, street, city, stateName, zip, country]);

  const canPlaceOrder = useMemo(() => {
    return Object.keys(missingFields).length === 0 && items.length > 0 && !isPlacing;
  }, [missingFields, items.length, isPlacing]);

  const fieldStyle = (isMissing) => {
    if (!attemptedSubmit || !isMissing) return undefined;
    return { borderColor: '#b91c1c', boxShadow: '0 0 0 1px #b91c1c inset' };
  };

  const requiredText = (isMissing) => {
    if (!attemptedSubmit || !isMissing) return null;
    return <div style={{ marginTop: 6, color: '#b91c1c', fontWeight: 600, fontSize: 12 }}>Required</div>;
  };

  const buildAddressString = () => {
    const parts = [street, city, stateName, zip, country].map((v) => String(v || '').trim()).filter(Boolean);
    return parts.join(', ');
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    setAttemptedSubmit(true);
    if (Object.keys(missingFields).length > 0) {
      const first = ['firstName', 'lastName', 'phone', 'email', 'street', 'country', 'city', 'stateName', 'zip'].find(
        (k) => missingFields[k]
      );
      const el = first ? document.querySelector(`[data-checkout-field="${first}"]`) : null;
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setPlaceError('');
    setIsPlacing(true);

    try {
      const user = getAuthUser();
      const uid = user?.uid;
      if (!uid) {
        window.location.hash = '#/login?next=%23%2Fcheckout';
        return;
      }

      const orderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentMethod = payment === 'upi' ? 'UPI' : 'Debit Card';
      const address = buildAddressString();

      await set(ref(db, `users/${uid}/orders/${orderId}`), {
        orderId,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod,
        total,
        subtotal,
        discount,
        shipping,
        items,
        customer: {
          firstName,
          lastName,
          phone,
          email,
        },
        shippingAddress: {
          street,
          city,
          state: stateName,
          zip,
          country,
        },
      });

      let idToken = '';
      try {
        if (auth.currentUser) idToken = await auth.currentUser.getIdToken();
      } catch {
        idToken = '';
      }

      if (idToken) {
        const resp = await fetch('http://localhost:5001/api/whatsapp/order-confirmed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            orderId,
            address,
            total,
          }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => null);
          setPlaceError(data?.error || 'Unable to send WhatsApp confirmation');
        }
      }

      window.sessionStorage.setItem(
        'order:last',
        JSON.stringify({
          orderCode: `#${orderId}`,
          date: new Date().toISOString(),
          total,
          paymentMethod,
          items,
        })
      );

      clearCart();
      window.location.hash = '#/order-complete';
    } catch {
      setPlaceError('Unable to place order');
    } finally {
      setIsPlacing(false);
    }
  };

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
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      data-checkout-field="firstName"
                      style={fieldStyle(missingFields.firstName)}
                    />
                    {requiredText(missingFields.firstName)}
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">Last name</span>
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      data-checkout-field="lastName"
                      style={fieldStyle(missingFields.lastName)}
                    />
                    {requiredText(missingFields.lastName)}
                  </label>
                </div>
                <label className="checkout__field">
                  <span className="checkout__label">Phone number</span>
                  <input
                    className="checkout__input"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-checkout-field="phone"
                    style={fieldStyle(missingFields.phone)}
                  />
                  {requiredText(missingFields.phone)}
                </label>
                <label className="checkout__field">
                  <span className="checkout__label">Email address</span>
                  <input
                    className="checkout__input"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-checkout-field="email"
                    style={fieldStyle(missingFields.email)}
                  />
                  {requiredText(missingFields.email)}
                </label>
              </div>

              <div className="checkout__card">
                <div className="checkout__card-title">Shipping Address</div>
                <label className="checkout__field">
                  <span className="checkout__label">Street address</span>
                  <input
                    className="checkout__input"
                    type="text"
                    placeholder="Street Address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    data-checkout-field="street"
                    style={fieldStyle(missingFields.street)}
                  />
                  {requiredText(missingFields.street)}
                </label>

                <label className="checkout__field">
                  <span className="checkout__label">Country</span>
                  <select className="checkout__select" value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                  </select>
                  <div data-checkout-field="country" />
                  {requiredText(missingFields.country)}
                </label>

                <label className="checkout__field">
                  <span className="checkout__label">Town / City</span>
                  <input
                    className="checkout__input"
                    type="text"
                    placeholder="Town / City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    data-checkout-field="city"
                    style={fieldStyle(missingFields.city)}
                  />
                  {requiredText(missingFields.city)}
                </label>

                <div className="checkout__grid2">
                  <label className="checkout__field">
                    <span className="checkout__label">State</span>
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="State"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      data-checkout-field="stateName"
                      style={fieldStyle(missingFields.stateName)}
                    />
                    {requiredText(missingFields.stateName)}
                  </label>
                  <label className="checkout__field">
                    <span className="checkout__label">Zip code</span>
                    <input
                      className="checkout__input"
                      type="text"
                      placeholder="Zip Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      data-checkout-field="zip"
                      style={fieldStyle(missingFields.zip)}
                    />
                    {requiredText(missingFields.zip)}
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
                  disabled={items.length === 0 || isPlacing}
                  onClick={() => {
                    setAttemptedSubmit(true);
                    placeOrder();
                  }}
                >
                  {isPlacing ? 'Placing...' : 'Place Order'}
                </button>
                {placeError && <div style={{ marginTop: 10, color: '#b91c1c', fontWeight: 600 }}>{placeError}</div>}
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
