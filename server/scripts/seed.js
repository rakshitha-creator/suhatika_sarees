import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getServiceAccountPath() {
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (fromEnv) return fromEnv;

  // repoRoot/server/scripts -> repoRoot
  const repoRoot = path.resolve(__dirname, '..', '..');
  return path.join(repoRoot, 'suhatika-88625-firebase-adminsdk-fbsvc-7aab7dcf51.json');
}

const serviceAccountPath = getServiceAccountPath();
const databaseURL = process.env.FIREBASE_DATABASE_URL || 'https://suhatika-88625-default-rtdb.firebaseio.com/';

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account JSON not found at:', serviceAccountPath);
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the correct path, or place the JSON at the repo root.');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    databaseURL,
  });
}

const db = admin.database();

async function loadProducts() {
  const repoRoot = path.resolve(__dirname, '..', '..');

  const sources = [
    {
      keyPrefix: 'newarrivals',
      file: path.join(repoRoot, 'src', 'components', 'NewArrival', 'NewArrival.jsx'),
    },
    {
      keyPrefix: 'collections',
      file: path.join(repoRoot, 'src', 'components', 'Collections', 'Collections.jsx'),
    },
  ];

  const all = [];
  for (const src of sources) {
    const text = fs.readFileSync(src.file, 'utf8');
    const match = text.match(/const\s+products\s*=\s*\[((?:.|\n|\r)*?)\];/);
    if (!match) continue;

    const arrayLiteral = `[${match[1]}]`;
    // eslint-disable-next-line no-new-func
    const parsed = Function(`"use strict"; return (${arrayLiteral});`)();
    if (Array.isArray(parsed)) {
      parsed.forEach((p, idx) => {
        all.push({
          ...p,
          __sourceKey: `${src.keyPrefix}_${idx + 1}`,
        });
      });
    }
  }

  const byKey = new Map();
  for (const p of all) {
    const key = `${p?.name ?? ''}__${p?.price ?? ''}__${(p?.images?.[0] ?? '')}`;
    if (!byKey.has(key)) byKey.set(key, p);
  }

  return Array.from(byKey.values()).map((p, idx) => {
    const id = p.__sourceKey || String(idx + 1);
    return {
      id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      images: p.images,
    };
  });
}

function pathToFileUrl(p) {
  const url = new URL('file:///');
  const normalized = path.resolve(p).replaceAll('\\', '/');
  url.pathname = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return url.href;
}

async function main() {
  const products = await loadProducts();

  const productsPayload = products.reduce((acc, p, idx) => {
    const key = p.id ? String(p.id) : String(idx + 1);
    acc[key] = p;
    return acc;
  }, {});

  await db.ref('/products').set(productsPayload);

  console.log(`Seeded ${products.length} products to ${databaseURL}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
