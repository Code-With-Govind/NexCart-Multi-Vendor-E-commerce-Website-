const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Seller = require("./models/Seller");

mongoose
    .connect("mongodb://localhost:27017/mern-ecommerce")
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));

async function seedData() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        console.log("Generating 15 Dummy Users...");
        const dummyUsers = Array.from({ length: 15 }).map((_, i) => ({
            userName: `DummyUser-${i + 1}-${Date.now()}`,
            email: `user${i + 1}_${Date.now()}@example.com`,
            password: hashedPassword,
            role: "user",
        }));

        await User.insertMany(dummyUsers);
        console.log("15 Dummy Users Added!");

        console.log("Generating 15 Dummy Sellers...");
        const dummySellerUsers = Array.from({ length: 15 }).map((_, i) => ({
            userName: `DummySeller-${i + 1}-${Date.now()}`,
            email: `seller${i + 1}_${Date.now()}@example.com`,
            password: hashedPassword,
            role: "seller",
        }));

        const insertedSellers = await User.insertMany(dummySellerUsers);

        const dummySellerProfiles = insertedSellers.map((user, i) => ({
            userId: user._id,
            shopName: `Awesome Shop ${i + 1}`,
            ownerName: user.userName,
            email: user.email,
            phone: `+1-555-010${i.toString().padStart(2, "0")}`,
            shopDescription: `This is a dummy shop created for testing purposes. We sell awesome products!`,
            businessLicense: `LIC-${Date.now()}-${i}`,
            shopAddress: {
                address: `${Math.floor(Math.random() * 9999) + 1} Main St`,
                city: "Metropolis",
                state: "NY",
                pincode: "10001",
            },
            status: "approved", // Automatically approve them for testing
        }));

        await Seller.insertMany(dummySellerProfiles);
        console.log("15 Dummy Seller Profiles Added!");

        console.log("Database seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Error inserting data:", err);
        process.exit(1);
    }
}

seedData();
