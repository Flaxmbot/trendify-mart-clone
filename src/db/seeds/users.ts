import { db } from '@/db';
import { users } from '@/db/schema';
import * as bcrypt from 'bcrypt';

async function main() {
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 12);
    const hashedPasswordUser = await bcrypt.hash('user123', 12);
    const hashedPasswordManager = await bcrypt.hash('manager123', 12);
    const hashedPasswordCustomer = await bcrypt.hash('customer123', 12);
    const hashedPasswordSupport = await bcrypt.hash('support123', 12);

    const now = new Date().toISOString();

    const sampleUsers = [
        {
            email: 'admin@gmail.com',
            password: hashedPasswordAdmin,
            name: 'Admin User',
            role: 'admin',
            createdAt: now,
            updatedAt: now,
        },
        {
            email: 'user@gmail.com',
            password: hashedPasswordUser,
            name: 'Regular User',
            role: 'user',
            createdAt: now,
            updatedAt: now,
        },
        {
            email: 'manager@gmail.com',
            password: hashedPasswordManager,
            name: 'Store Manager',
            role: 'manager',
            createdAt: now,
            updatedAt: now,
        },
        {
            email: 'customer@gmail.com',
            password: hashedPasswordCustomer,
            name: 'John Customer',
            role: 'user',
            createdAt: now,
            updatedAt: now,
        },
        {
            email: 'support@gmail.com',
            password: hashedPasswordSupport,
            name: 'Support Agent',
            role: 'support',
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.insert(users).values(sampleUsers);

    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});