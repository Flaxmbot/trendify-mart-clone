import { db } from '../src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sampleProducts } from '../src/db/seeds/products';

async function migrate() {
  console.log('Starting data migration...');
  const productsCollection = collection(db, 'products');

  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(productsCollection, product);
      console.log(`Product "${product.name}" added with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`Error adding product "${product.name}":`, error);
    }
  }

  console.log('Data migration completed.');
}

migrate();
