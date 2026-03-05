const CART_STORAGE_KEY = 'suhatika_cart_v1';

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

export function addToCart({ productId, quantity = 1, color = null }) {
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
