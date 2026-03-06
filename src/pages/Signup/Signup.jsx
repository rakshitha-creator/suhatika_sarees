import { useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../../lib/firebaseClient';
import { consumePendingAction, setAuthUser } from '../../data/auth';

function getNextFromHash() {
  const hash = window.location.hash || '';
  const idx = hash.indexOf('?');
  if (idx < 0) return '#/';
  const qs = new URLSearchParams(hash.slice(idx + 1));
  const next = qs.get('next');
  return next ? decodeURIComponent(next) : '#/';
}

export default function Signup() {
  const nextHash = useMemo(() => getNextFromHash(), []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      await set(ref(db, `users/${u.uid}`), {
        name,
        phone,
        email,
        createdAt: new Date().toISOString(),
      });

      setAuthUser({ uid: u.uid, email: u.email, name, phone });

      const pending = consumePendingAction();
      window.location.hash = nextHash || '#/';

      if (pending?.type === 'add_to_cart') {
        window.dispatchEvent(new CustomEvent('auth:post_login_action', { detail: pending }));
      }
      if (pending?.type === 'buy_now') {
        window.dispatchEvent(new CustomEvent('auth:post_login_action', { detail: pending }));
      }
    } catch (err) {
      setError('Unable to sign up. Try a different email or a stronger password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ maxWidth: 520, margin: '0 auto', padding: '7rem 1rem 3rem' }}>
        <h1 style={{ margin: 0 }}>Sign Up</h1>
        <p style={{ marginTop: 8, color: '#6b7280' }}>Create your account to continue.</p>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Phone"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: 12, borderRadius: 10, border: 'none', background: '#5D157E', color: '#fff', fontWeight: 600 }}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ marginTop: 14 }}>
          <a href={`#/login?next=${encodeURIComponent(nextHash)}`}>Already have an account? Login</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
