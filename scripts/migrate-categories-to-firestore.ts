import { db } from '../src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const sampleCategories = [
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel for all ages',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Books',
        slug: 'books',
        description: 'Books, magazines and educational materials',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and gardening supplies',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Health & Beauty',
        slug: 'health-beauty',
        description: 'Health, wellness and beauty products',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Toys, games and entertainment for kids',
        createdAt: new Date().toISOString(),
    },
    {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Car parts, tools and automotive accessories',
        createdAt: new Date().toISOString(),
    },
];

async function migrate() {
  console.log('Starting category data migration...');
  const categoriesCollection = collection(db, 'categories');

  for (const category of sampleCategories) {
    try {
      const docRef = await addDoc(categoriesCollection, category);
      console.log(`Category "${category.name}" added with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`Error adding category "${category.name}":`, error);
    }
  }

  console.log('Category data migration completed.');
}

migrate();
