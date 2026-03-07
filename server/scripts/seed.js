import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });

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
  const webProductsModulePath = path.resolve(__dirname, '..', '..', 'src', 'data', 'websiteProducts.js');
  const modUrl = new URL(`file://${webProductsModulePath.replace(/\\/g, '/')}`);
  const mod = await import(modUrl.href);

  const products = mod.websiteProducts || mod.default;
  if (!Array.isArray(products)) {
    throw new Error('websiteProducts.js must export `websiteProducts` array');
  }

  return products.map((p, idx) => {
    const id = p?.id ? String(p.id) : String(idx + 1);
    return {
      id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      images: p.images,
      colors: p.colors,
    };
  });
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
