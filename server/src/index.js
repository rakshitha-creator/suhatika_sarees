import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath, override: true });

// eslint-disable-next-line no-console
console.log('Loaded env file:', envPath);
// eslint-disable-next-line no-console
console.log('Loaded env FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL);

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function sanitizeDatabaseUrl(value) {
  const raw = String(value || '').trim().replace(/^['"]|['"]$/g, '');
  if (!raw) return '';
  try {
    const u = new URL(raw);
    u.pathname = '/';
    u.search = '';
    u.hash = '';
    return u.toString();
  } catch {
    return raw;
  }
}

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin env vars. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in server/.env'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: sanitizeDatabaseUrl(process.env.FIREBASE_DATABASE_URL),
  });
}

async function verifyFirebaseIdToken(req) {
  const authHeader = req.headers.authorization || '';
  const m = authHeader.match(/^Bearer (.+)$/);
  if (!m) {
    const err = new Error('Missing Authorization Bearer token');
    err.statusCode = 401;
    throw err;
  }

  initFirebaseAdmin();
  const decoded = await admin.auth().verifyIdToken(m[1]);
  return decoded;
}

async function sendWhatsappTemplate({ to, templateName, languageCode, parameters }) {
  const accessToken = requireEnv('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = requireEnv('WHATSAPP_PHONE_NUMBER_ID');

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: 'body',
          parameters: parameters.map((text) => ({ type: 'text', text: String(text ?? '') })),
        },
      ],
    },
  };

  const controller = new AbortController();
  const timeoutMs = Number(process.env.WHATSAPP_TIMEOUT_MS || 15000);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') {
      const err = new Error(`WhatsApp API timeout after ${timeoutMs}ms`);
      err.statusCode = 504;
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const err = new Error(`WhatsApp API error: ${resp.status}`);
    err.statusCode = 502;
    err.details = data;
    throw err;
  }
  return data;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Sends WhatsApp order confirmation to the authenticated user
// Body: { orderId: string, address: string, total: number|string, phone?: string, name?: string }
app.post('/api/whatsapp/order-confirmed', async (req, res) => {
  try {
    const decoded = await verifyFirebaseIdToken(req);
    const uid = decoded.uid;

    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'order_confirmed';
    const languageCode = process.env.WHATSAPP_TEMPLATE_LANG || 'en_US';

    const { orderId, address, total, phone: requestPhone, name: requestName } = req.body || {};
    if (!orderId || !address || total == null) {
      return res.status(400).json({ error: 'Missing orderId/address/total' });
    }

    initFirebaseAdmin();
    const snap = await admin.database().ref(`users/${uid}`).get();
    const user = snap.exists() ? snap.val() : null;

    const name = String(requestName || user?.name || '').trim();
    const phone = String(requestPhone || user?.phone || '').trim();

    if (!phone) {
      return res.status(400).json({ error: 'User phone missing in database' });
    }

    const to = String(phone)
      .replace(/[\s\-()]/g, '')
      .replace(/^\+/, '');

    const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || '+918919607181';
    const adminTo = adminNumber
      ? String(adminNumber)
          .replace(/[\s\-()]/g, '')
          .replace(/^\+/, '')
      : null;

    const params = [name, phone, address, total];

    // eslint-disable-next-line no-console
    console.log('WA send: customer', { to, orderId });
    const waCustomer = await sendWhatsappTemplate({
      to,
      templateName,
      languageCode,
      parameters: params,
    });

    let waAdmin = null;
    if (adminTo) {
      // eslint-disable-next-line no-console
      console.log('WA send: admin', { to: adminTo, orderId });
      waAdmin = await sendWhatsappTemplate({
        to: adminTo,
        templateName,
        languageCode,
        parameters: params,
      });
    }

    await admin
      .database()
      .ref(`users/${uid}/orders/${orderId}`)
      .update({ whatsappSentAt: new Date().toISOString() });

    res.json({ ok: true, waCustomer, waAdmin });
  } catch (err) {
    const status = err?.statusCode || 500;
    res.status(status).json({ error: err?.message || 'Server error', details: err?.details || null });
  }
});

const port = Number(process.env.PORT || 5001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
