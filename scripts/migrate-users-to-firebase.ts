import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { adminAuth } from '../src/lib/firebase-admin';
import { sampleUsers } from '../src/db/seeds/users';

async function migrate() {
  console.log('Starting user data migration...');

  for (const user of sampleUsers) {
    try {
      const userRecord = await adminAuth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.name,
      });
      await adminAuth.setCustomUserClaims(userRecord.uid, { role: user.role });
      console.log(`User "${user.name}" added with UID: ${userRecord.uid}`);
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            console.log(`User with email ${user.email} already exists. Skipping.`);
        } else {
            console.error(`Error adding user "${user.name}":`, error);
        }
    }
  }

  console.log('User data migration completed.');
}

migrate();
