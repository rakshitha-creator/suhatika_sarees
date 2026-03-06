const CART_STORAGE_KEY = 'suhatika:cart';
const CART_PENDING_KEY = 'suhatika:pending_cart';

function isLoggedIn() {
  try {
    return Boolean(window.localStorage.getItem('suhatika:auth'));
  } catch {
    return false;
  }
}

function setPendingCartAction(action) {
  if (!action) {
    window.localStorage.removeItem(CART_PENDING_KEY);
    return;
  }
  window.localStorage.setItem(CART_PENDING_KEY, JSON.stringify(action));
}

function consumePendingCartAction() {
  try {
    const raw = window.localStorage.getItem(CART_PENDING_KEY);
    window.localStorage.removeItem(CART_PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    window.localStorage.removeItem(CART_PENDING_KEY);
    return null;
  }
}

function ensureLoginForCart(action) {
  if (isLoggedIn()) return true;
  setPendingCartAction(action);
  const current = window.location.hash || '#/';
  window.location.hash = `#/login?next=${encodeURIComponent(current)}`;
  return false;
}

if (typeof window !== 'undefined') {
  window.addEventListener('auth:post_login_action', (e) => {
    const pending = e?.detail || consumePendingCartAction();
    if (!pending) return;
    if (pending.type === 'add_to_cart') {
      addToCart({ productId: pending.productId, quantity: pending.quantity ?? 1, color: pending.color ?? null, _skipAuth: true });
    }
    if (pending.type === 'buy_now') {
      addToCart({ productId: pending.productId, quantity: pending.quantity ?? 1, color: pending.color ?? null, _skipAuth: true });
      window.location.hash = '#/checkout';
    }
  });
}

function safeParse(json, fallback) {
  try {
    const value = JSON.parse(json);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function getCart() {
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  const items = safeParse(raw, []);
  return Array.isArray(items) ? items : [];
}

export function setCart(items) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export function addToCart({ productId, quantity = 1, color = null, _skipAuth = false, _action = 'add_to_cart' }) {
  if (!_skipAuth) {
    const ok = ensureLoginForCart({ type: _action, productId, quantity, color });
    if (!ok) return;
  }

  const items = getCart();
  const idx = items.findIndex((i) => String(i.productId) === String(productId) && String(i.color ?? '') === String(color ?? ''));

  if (idx >= 0) {
    const next = [...items];
    next[idx] = { ...next[idx], quantity: (next[idx].quantity ?? 0) + quantity };
    setCart(next);
    return;
  }

  setCart([...items, { productId, quantity, color }]);
}

export function updateCartItem({ productId, color = null, quantity }) {
  const items = getCart();
  const next = items
    .map((i) => {
      if (String(i.productId) !== String(productId)) return i;
      if (String(i.color ?? '') !== String(color ?? '')) return i;
      return { ...i, quantity };
    })
    .filter((i) => (i.quantity ?? 0) > 0);
  setCart(next);
}

export function removeFromCart({ productId, color = null }) {
  const items = getCart();
  setCart(items.filter((i) => String(i.productId) !== String(productId) || String(i.color ?? '') !== String(color ?? '')));
}

export function clearCart() {
  setCart([]);
}
