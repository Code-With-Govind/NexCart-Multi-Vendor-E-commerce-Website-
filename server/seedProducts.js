const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
    .connect("mongodb://localhost:27017/mern-ecommerce")
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));

const categories = ["men", "women", "kids", "accessories", "footwear"];
const brands = ["nike", "adidas", "puma", "levi", "zara", "h&m"];
const unsplashImages = {
    men: [
        "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&auto=format",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format",
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format",
    ],
    women: [
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format",
    ],
    kids: [
        "https://images.unsplash.com/photo-1519704943920-18447d21799b?w=600&auto=format",
        "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&auto=format",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format",
    ],
    accessories: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format",
        "https://images.unsplash.com/photo-1526170315873-3a9d3fc6b0d1?w=600&auto=format",
    ],
    footwear: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format",
        "https://images.unsplash.com/photo-1549298916-b41d501d377b?w=600&auto=format",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format",
    ],
};

const dummyProducts = Array.from({ length: 30 }).map((_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const price = Math.floor(Math.random() * 500) + 10;
    const isSale = Math.random() > 0.5;
    const salePrice = isSale ? price - Math.floor(Math.random() * price * 0.3) : 0;

    const images = unsplashImages[category] || unsplashImages.accessories;
    const image = images[Math.floor(Math.random() * images.length)];

    return {
        image,
        title: `Dummy Product ${i + 1} - ${brand.toUpperCase()}`,
        description: `This is a randomly generated dummy product for testing purposes. It belongs to the ${category} category and is manufactured by ${brand}.`,
        category,
        brand,
        price,
        salePrice,
        totalStock: Math.floor(Math.random() * 200) + 1,
        averageReview: (Math.random() * 5).toFixed(1),
    };
});

async function seedData() {
    try {
        await Product.insertMany(dummyProducts);
        console.log("30 dummy products have been added to the database!");
        process.exit();
    } catch (err) {
        console.error("Error inserting data:", err);
        process.exit(1);
    }
}

seedData();
