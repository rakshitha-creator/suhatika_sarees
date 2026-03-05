export const products = [
  {
    id: 1,
    name: 'Silk Saree',
    price: 1899,
    originalPrice: 2500,
    description:
      'Buy one or buy a few and make every space where you sit more convenient. Light and easy to move around with removable tray top, handy for serving snacks.',
    images: ['/image.png', '/image.png', '/image.png', '/image.png'],
    colors: ['#111827', '#9CA3AF', '#EF4444', '#F3F4F6'],
    measurements: '6 Mts – 5/8 "',
    sku: '1117',
    category: 'Living Room, Bedroom',
  },
  {
    id: 2,
    name: 'Silk Saree',
    price: 2699,
    originalPrice: 3470,
    description:
      'A classic silk saree crafted with heritage-inspired motifs and a contemporary finish, designed to elevate every occasion.',
    images: ['/image.png', '/image.png', '/image.png', '/image.png'],
    colors: ['#5D157E', '#111827', '#1E88E5', '#FDD835'],
    measurements: '6 Mts – 5/8 "',
    sku: '1118',
    category: 'Festive, Wedding',
  },
  {
    id: 3,
    name: 'Silk Saree',
    price: 2699,
    originalPrice: 3470,
    description:
      'Designed with intricate weaving and a luxurious drape, this saree blends traditional artistry with modern styling.',
    images: ['/image.png', '/image.png', '/image.png', '/image.png'],
    colors: ['#43A047', '#E53935', '#1E88E5', '#FDD835'],
    measurements: '6 Mts – 5/8 "',
    sku: '1119',
    category: 'Traditional, Casual',
  },
  {
    id: 4,
    name: 'Silk Saree',
    price: 2699,
    originalPrice: 3470,
    description:
      'Soft sheen, rich borders, and a timeless look—perfect for celebrations and special moments.',
    images: ['/image.png', '/image.png', '/image.png', '/image.png'],
    colors: ['#E53935', '#43A047', '#1E88E5', '#FDD835'],
    measurements: '6 Mts – 5/8 "',
    sku: '1120',
    category: 'Festive',
  },
  {
    id: 5,
    name: 'Silk Saree',
    price: 2699,
    originalPrice: 3470,
    description:
      'A refined silk saree featuring an elegant weave and graceful finish for an effortlessly premium look.',
    images: ['/image.png', '/image.png', '/image.png', '/image.png'],
    colors: ['#111827', '#9CA3AF', '#5D157E', '#F3F4F6'],
    measurements: '6 Mts – 5/8 "',
    sku: '1121',
    category: 'Premium',
  },
  {
    id: 6,
    name: 'Silk Saree',
    price: 2699,
    originalPrice: 3470,
    description:
      'Inspired by heritage weaves, this saree brings together craftsmanship, comfort, and timeless elegance.',
    images: ['/image.png', '/image.png', '/image.png', '/image.png'],
    colors: ['#FDD835', '#1E88E5', '#E53935', '#43A047'],
    measurements: '6 Mts – 5/8 "',
    sku: '1122',
    category: 'Wedding, Traditional',
  },
];

export function getProductById(id) {
  return products.find((p) => String(p.id) === String(id));
}
