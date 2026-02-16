import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seeding...\n");

    // ============================================
    // CREATE USERS WITH DIFFERENT ROLES
    // ============================================
    console.log("👥 Creating users with different roles...");

    // Admin users
    const adminPassword = await hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@velora.com" },
        update: {},
        create: {
            email: "admin@velora.com",
            name: "Super Admin",
            password: adminPassword,
            role: Role.ADMIN,
        },
    });
    console.log("  ✓ Super Admin: admin@velora.com / admin123");

    // Store Managers
    const managerPassword = await hash("manager123", 12);
    const storeManager = await prisma.user.upsert({
        where: { email: "manager@velora.com" },
        update: {},
        create: {
            email: "manager@velora.com",
            name: "Store Manager",
            password: managerPassword,
            role: Role.STORE_MANAGER,
        },
    });
    console.log("  ✓ Store Manager: manager@velora.com / manager123");

    // Moderators
    const moderatorPassword = await hash("moderator123", 12);
    const moderator = await prisma.user.upsert({
        where: { email: "moderator@velora.com" },
        update: {},
        create: {
            email: "moderator@velora.com",
            name: "Content Moderator",
            password: moderatorPassword,
            role: Role.MODERATOR,
        },
    });
    console.log("  ✓ Moderator: moderator@velora.com / moderator123");

    // Regular customers
    const customerPassword = await hash("customer123", 12);
    const customers = await Promise.all([
        prisma.user.upsert({
            where: { email: "john@example.com" },
            update: {},
            create: {
                email: "john@example.com",
                name: "John Smith",
                password: customerPassword,
                role: Role.CUSTOMER,
            },
        }),
        prisma.user.upsert({
            where: { email: "sarah@example.com" },
            update: {},
            create: {
                email: "sarah@example.com",
                name: "Sarah Johnson",
                password: customerPassword,
                role: Role.CUSTOMER,
            },
        }),
        prisma.user.upsert({
            where: { email: "mike@example.com" },
            update: {},
            create: {
                email: "mike@example.com",
                name: "Mike Wilson",
                password: customerPassword,
                role: Role.CUSTOMER,
            },
        }),
        prisma.user.upsert({
            where: { email: "emma@example.com" },
            update: {},
            create: {
                email: "emma@example.com",
                name: "Emma Davis",
                password: customerPassword,
                role: Role.CUSTOMER,
            },
        }),
    ]);
    console.log("  ✓ 4 Customer accounts created");
    console.log();

    // ============================================
    // CREATE CATEGORIES
    // ============================================
    console.log("📂 Creating categories...");

    const categoriesData = [
        {
            name: "Electronics",
            slug: "electronics",
            description: "Latest gadgets, devices, and technology",
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
        },
        {
            name: "Clothing",
            slug: "clothing",
            description: "Fashion for men, women, and kids",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
        },
        {
            name: "Home & Living",
            slug: "home-living",
            description: "Furniture, decor, and home essentials",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
        },
        {
            name: "Sports & Outdoors",
            slug: "sports-outdoors",
            description: "Gear for fitness and outdoor adventures",
            image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
        },
        {
            name: "Books & Media",
            slug: "books-media",
            description: "Books, movies, music, and games",
            image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
        },
        {
            name: "Beauty & Personal Care",
            slug: "beauty-care",
            description: "Skincare, makeup, and personal care products",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
        },
    ];

    const categories = await Promise.all(
        categoriesData.map((cat) =>
            prisma.category.upsert({
                where: { slug: cat.slug },
                update: cat,
                create: cat,
            })
        )
    );
    console.log(`  ✓ ${categories.length} categories created`);
    console.log();

    // ============================================
    // CREATE PRODUCTS
    // ============================================
    console.log("📦 Creating products...");

    const productsData = [
        // Electronics
        {
            name: "Premium Wireless Headphones",
            slug: "premium-wireless-headphones",
            description: "Experience high-fidelity sound with active noise cancelling. Features 30-hour battery life, comfortable over-ear design, and premium materials.",
            price: 299.99,
            comparePrice: 349.99,
            stock: 50,
            categoryId: categories[0].id,
            images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
            isFeatured: true,
        },
        {
            name: "Smart Watch Pro",
            slug: "smart-watch-pro",
            description: "Stay connected and track your fitness goals. Water-resistant, heart rate monitor, GPS, and 7-day battery life.",
            price: 399.99,
            comparePrice: 449.99,
            stock: 30,
            categoryId: categories[0].id,
            images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"],
            isFeatured: true,
        },
        {
            name: "4K Ultra HD Camera",
            slug: "4k-ultra-hd-camera",
            description: "Professional-grade camera with 4K video recording, 24MP sensor, and advanced autofocus system.",
            price: 1299.99,
            stock: 15,
            categoryId: categories[0].id,
            images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Wireless Earbuds",
            slug: "wireless-earbuds",
            description: "True wireless earbuds with crystal clear sound, touch controls, and charging case.",
            price: 149.99,
            comparePrice: 199.99,
            stock: 100,
            categoryId: categories[0].id,
            images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Portable Bluetooth Speaker",
            slug: "portable-bluetooth-speaker",
            description: "360-degree sound, waterproof design, 12-hour battery life.",
            price: 79.99,
            stock: 75,
            categoryId: categories[0].id,
            images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"],
        },
        // Clothing
        {
            name: "Classic Denim Jacket",
            slug: "classic-denim-jacket",
            description: "Timeless style for any occasion. Premium quality denim with comfortable fit.",
            price: 89.99,
            stock: 100,
            categoryId: categories[1].id,
            images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Premium Cotton T-Shirt",
            slug: "premium-cotton-t-shirt",
            description: "100% organic cotton, breathable and comfortable for everyday wear.",
            price: 34.99,
            stock: 200,
            categoryId: categories[1].id,
            images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
            isFeatured: true,
        },
        {
            name: "Athletic Running Shoes",
            slug: "athletic-running-shoes",
            description: "Lightweight, cushioned sole, breathable mesh upper. Perfect for running and training.",
            price: 129.99,
            comparePrice: 159.99,
            stock: 60,
            categoryId: categories[1].id,
            images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
            isFeatured: true,
        },
        {
            name: "Leather Crossbody Bag",
            slug: "leather-crossbody-bag",
            description: "Genuine leather, multiple compartments, adjustable strap.",
            price: 159.99,
            stock: 40,
            categoryId: categories[1].id,
            images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"],
        },
        // Home & Living
        {
            name: "Minimalist Table Lamp",
            slug: "minimalist-table-lamp",
            description: "Modern design with adjustable brightness, perfect for any room.",
            price: 59.99,
            stock: 80,
            categoryId: categories[2].id,
            images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Ceramic Coffee Mug Set",
            slug: "ceramic-coffee-mug-set",
            description: "Set of 4 handcrafted ceramic mugs, dishwasher and microwave safe.",
            price: 39.99,
            stock: 120,
            categoryId: categories[2].id,
            images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Cozy Throw Blanket",
            slug: "cozy-throw-blanket",
            description: "Soft, warm, and stylish. Perfect for chilly evenings.",
            price: 49.99,
            comparePrice: 69.99,
            stock: 90,
            categoryId: categories[2].id,
            images: ["https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=800&q=80"],
            isFeatured: true,
        },
        // Sports & Outdoors
        {
            name: "Yoga Mat Premium",
            slug: "yoga-mat-premium",
            description: "Extra thick, non-slip surface, eco-friendly materials.",
            price: 45.99,
            stock: 150,
            categoryId: categories[3].id,
            images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Fitness Resistance Bands",
            slug: "fitness-resistance-bands",
            description: "Set of 5 bands with different resistance levels, includes carrying bag.",
            price: 24.99,
            stock: 200,
            categoryId: categories[3].id,
            images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Insulated Water Bottle",
            slug: "insulated-water-bottle",
            description: "Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.",
            price: 34.99,
            stock: 180,
            categoryId: categories[3].id,
            images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"],
        },
        // Books & Media
        {
            name: "Bestseller Novel Collection",
            slug: "bestseller-novel-collection",
            description: "Collection of 5 award-winning novels. Perfect for book lovers.",
            price: 79.99,
            comparePrice: 99.99,
            stock: 50,
            categoryId: categories[4].id,
            images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"],
        },
        {
            name: "Vinyl Record Player",
            slug: "vinyl-record-player",
            description: "Retro design with modern features, built-in speakers, Bluetooth connectivity.",
            price: 189.99,
            stock: 25,
            categoryId: categories[4].id,
            images: ["https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80"],
        },
        // Beauty & Personal Care
        {
            name: "Luxury Skincare Set",
            slug: "luxury-skincare-set",
            description: "Complete skincare routine with cleanser, toner, serum, and moisturizer.",
            price: 129.99,
            stock: 40,
            categoryId: categories[5].id,
            images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"],
            isFeatured: true,
        },
        {
            name: "Professional Hair Dryer",
            slug: "professional-hair-dryer",
            description: "Ionic technology, multiple heat settings, lightweight design.",
            price: 89.99,
            comparePrice: 119.99,
            stock: 60,
            categoryId: categories[5].id,
            images: ["https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=800&q=80"],
        },
    ];

    // Create products one by one to handle duplicates
    for (const product of productsData) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product as any,
        });
    }
    console.log(`  ✓ ${productsData.length} products created`);
    console.log();

    // ============================================
    // CREATE SAMPLE ORDERS
    // ============================================
    console.log("🛒 Creating sample orders...");

    const electronics = categories[0];
    const clothing = categories[1];

    // Get some products for orders
    const headphones = await prisma.product.findUnique({ where: { slug: "premium-wireless-headphones" } });
    const watch = await prisma.product.findUnique({ where: { slug: "smart-watch-pro" } });
    const jacket = await prisma.product.findUnique({ where: { slug: "classic-denim-jacket" } });
    const shoes = await prisma.product.findUnique({ where: { slug: "athletic-running-shoes" } });

    if (headphones && watch && jacket && shoes) {
        // Create sample orders for customers
        const sampleOrders = [
            {
                userId: customers[0].id,
                status: OrderStatus.DELIVERED,
                total: 699.98,
                items: [
                    { productId: headphones.id, quantity: 1, price: 299.99 },
                    { productId: watch.id, quantity: 1, price: 399.99 },
                ],
            },
            {
                userId: customers[1].id,
                status: OrderStatus.SHIPPED,
                total: 219.98,
                items: [
                    { productId: jacket.id, quantity: 1, price: 89.99 },
                    { productId: shoes.id, quantity: 1, price: 129.99 },
                ],
            },
            {
                userId: customers[2].id,
                status: OrderStatus.PROCESSING,
                total: 299.99,
                items: [
                    { productId: headphones.id, quantity: 1, price: 299.99 },
                ],
            },
        ];

        for (const orderData of sampleOrders) {
            const { items, ...orderInfo } = orderData;
            const order = await prisma.order.create({
                data: {
                    ...orderInfo,
                    items: {
                        create: items,
                    },
                },
            });
        }
        console.log(`  ✓ ${sampleOrders.length} sample orders created`);
    }
    console.log();

    // ============================================
    // CREATE REVIEWS
    // ============================================
    console.log("⭐ Creating product reviews...");

    if (headphones) {
        await prisma.review.createMany({
            skipDuplicates: true,
            data: [
                {
                    userId: customers[0].id,
                    productId: headphones.id,
                    rating: 5,
                    comment: "Amazing sound quality! The noise cancellation is top-notch.",
                },
                {
                    userId: customers[1].id,
                    productId: headphones.id,
                    rating: 4,
                    comment: "Great headphones, very comfortable for long listening sessions.",
                },
            ],
        });
        console.log("  ✓ 2 product reviews created");
    }
    console.log();

    // ============================================
    // SEEDING SUMMARY
    // ============================================
    console.log("✅ Seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`  • Users: 1 Admin, 1 Store Manager, 1 Moderator, 4 Customers`);
    console.log(`  • Categories: ${categories.length}`);
    console.log(`  • Products: ${productsData.length}`);
    console.log(`  • Sample Orders: 3`);
    console.log();
    console.log("🔑 Login Credentials:");
    console.log("  Admin:        admin@velora.com / admin123");
    console.log("  Store Manager: manager@velora.com / manager123");
    console.log("  Moderator:    moderator@velora.com / moderator123");
    console.log("  Customer:     john@example.com / customer123");
    console.log();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
