require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/mern-ecommerce";

// Models
const User = require("./models/User");
const Product = require("./models/Product");
const Feature = require("./models/Feature");

const sampleProducts = [
    {
        title: "Classic White Sneakers",
        description: "Comfortable everyday sneakers perfect for any outfit.",
        category: "footwear",
        brand: "nike",
        price: 89.99,
        salePrice: 69.99,
        totalStock: 50,
        averageReview: 4.5,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format",
    },
    {
        title: "Men's Casual T-Shirt",
        description: "Soft cotton t-shirt for everyday casual wear.",
        category: "men",
        brand: "zara",
        price: 29.99,
        salePrice: 19.99,
        totalStock: 100,
        averageReview: 4.2,
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format",
    },
    {
        title: "Women's Floral Dress",
        description: "Elegant floral dress for summer occasions.",
        category: "women",
        brand: "zara",
        price: 59.99,
        salePrice: 44.99,
        totalStock: 75,
        averageReview: 4.7,
        image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format",
    },
    {
        title: "Kids Denim Jacket",
        description: "Stylish denim jacket for kids, durable and comfortable.",
        category: "kids",
        brand: "h&m",
        price: 39.99,
        salePrice: 29.99,
        totalStock: 60,
        averageReview: 4.3,
        image:
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format",
    },
    {
        title: "Running Shoes - Black",
        description: "High-performance running shoes with extra cushioning.",
        category: "footwear",
        brand: "adidas",
        price: 119.99,
        salePrice: 99.99,
        totalStock: 40,
        averageReview: 4.8,
        image:
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format",
    },
    {
        title: "Women's Leather Handbag",
        description: "Premium leather handbag with multiple compartments.",
        category: "accessories",
        brand: "levi",
        price: 149.99,
        salePrice: 119.99,
        totalStock: 30,
        averageReview: 4.6,
        image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format",
    },
    {
        title: "Men's Slim Fit Jeans",
        description: "Modern slim fit jeans in classic blue denim.",
        category: "men",
        brand: "levi",
        price: 69.99,
        salePrice: 54.99,
        totalStock: 80,
        averageReview: 4.4,
        image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format",
    },
    {
        title: "Sport Cap",
        description: "Lightweight adjustable sports cap for outdoor activities.",
        category: "accessories",
        brand: "nike",
        price: 24.99,
        salePrice: 0,
        totalStock: 120,
        averageReview: 4.1,
        image:
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format",
    },
];

const featureImages = [
    {
        image:
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format",
    },
    {
        image:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format",
    },
    {
        image:
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format",
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB connected");

        // --- Promote first user to admin ---
        const users = await User.find({});
        if (users.length === 0) {
            console.log(
                "⚠️  No users found. Please register an account first at http://localhost:5173/auth/register, then run this script again."
            );
        } else {
            for (const u of users) {
                u.role = "admin";
                await u.save();
                console.log(`✅ User "${u.userName}" (${u.email}) promoted to admin`);
            }
        }

        // --- Seed Feature Images ---
        const existingFeatures = await Feature.countDocuments();
        if (existingFeatures === 0) {
            await Feature.insertMany(featureImages);
            console.log(`✅ Inserted ${featureImages.length} homepage banner images`);
        } else {
            console.log(
                `ℹ️  Skipped banner images (${existingFeatures} already exist)`
            );
        }

        // --- Seed Products ---
        const existingProducts = await Product.countDocuments();
        if (existingProducts === 0) {
            await Product.insertMany(sampleProducts);
            console.log(`✅ Inserted ${sampleProducts.length} sample products`);
        } else {
            console.log(
                `ℹ️  Skipped products (${existingProducts} already exist)`
            );
        }

        console.log("\n🎉 Seeding complete! Refresh http://localhost:5173");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
}

seed();
