const mongoose = require("mongoose");
const Product = require("./models/Product");

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

mongoose
    .connect("mongodb://localhost:27017/mern-ecommerce")
    .then(async () => {
        try {
            const products = await Product.find({});
            console.log(`Checking ${products.length} products...`);

            let updatedCount = 0;
            for (const product of products) {
                // Update if it's a dummy image, loremflickr, or empty
                if (!product.image || product.image.includes('dummyimage') || product.image.includes('loremflickr')) {
                    const category = product.category || 'accessories';
                    const images = unsplashImages[category] || unsplashImages.accessories;
                    product.image = images[Math.floor(Math.random() * images.length)];
                    await product.save();
                    updatedCount++;
                }
            }

            console.log(`Successfully updated ${updatedCount} products with high-quality images!`);
            process.exit();
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })
    .catch((error) => console.log(error));
