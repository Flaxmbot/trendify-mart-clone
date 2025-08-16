import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
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

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});