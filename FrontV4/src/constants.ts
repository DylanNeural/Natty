import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bowl Protéiné',
    brand: 'Natty Kitchen',
    price: 6.90,
    calories: 520,
    protein: 38,
    carbs: 42,
    fat: 18,
    image: 'https://picsum.photos/seed/bowl/400/300',
    category: 'repas'
  },
  {
    id: '2',
    name: 'Shake Récup.',
    brand: 'Natty Boost',
    price: 4.50,
    calories: 280,
    protein: 25,
    carbs: 30,
    fat: 5,
    image: 'https://picsum.photos/seed/shake/400/300',
    category: 'boisson'
  },
  {
    id: '3',
    name: 'Energy Bar Amande',
    brand: 'MyProtein',
    price: 1.80,
    calories: 210,
    protein: 8,
    carbs: 25,
    fat: 10,
    image: 'https://picsum.photos/seed/bar/400/300',
    category: 'snack'
  },
  {
    id: '4',
    name: 'Salade César',
    brand: 'Natty Kitchen',
    price: 5.20,
    calories: 320,
    protein: 22,
    carbs: 15,
    fat: 20,
    image: 'https://picsum.photos/seed/salad/400/300',
    category: 'repas'
  }
];

export const FRIDGES = [
  {
    id: 'f1',
    name: 'Natty · Capitole',
    address: '12 Place du Capitole, Toulouse',
    distance: '180m',
    walkTime: '2 min',
    isOpen: true,
    stockCount: 12,
    products: PRODUCTS,
    lat: 43.6045,
    lng: 1.4442
  },
  {
    id: 'f2',
    name: 'Natty · Saint-Sernin',
    address: 'Place Saint-Sernin, Toulouse',
    distance: '430m',
    walkTime: '5 min',
    isOpen: false,
    stockCount: 8,
    products: PRODUCTS.slice(0, 2),
    lat: 43.6085,
    lng: 1.4412
  }
];
