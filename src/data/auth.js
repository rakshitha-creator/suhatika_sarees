const AUTH_STORAGE_KEY = 'suhatika:auth';
const PENDING_ACTION_KEY = 'suhatika:pending_action';

export function setAuthUser(user) {
  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new CustomEvent('auth:change'));
}

export function getAuthUser() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getAuthUser());
}

export function requireAuthOrRedirect(action) {
  if (isLoggedIn()) return true;

  if (action) {
    window.localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
  } else {
    window.localStorage.removeItem(PENDING_ACTION_KEY);
  }

  const current = window.location.hash || '#/';
  const next = encodeURIComponent(current);
  window.location.hash = `#/login?next=${next}`;
  return false;
}

export function consumePendingAction() {
  try {
    const raw = window.localStorage.getItem(PENDING_ACTION_KEY);
    window.localStorage.removeItem(PENDING_ACTION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    window.localStorage.removeItem(PENDING_ACTION_KEY);
    return null;
  }
}
