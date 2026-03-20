const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
    .connect("mongodb://localhost:27017/mern-ecommerce")
    .then(async () => {
        try {
            await Product.updateMany(
                { image: { $regex: 'loremflickr' } },
                { $set: { image: 'https://dummyimage.com/600x400/555555/ffffff.png&text=Product+Image' } }
            );
            console.log('Images updated!');
            process.exit();
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })
    .catch((error) => console.log(error));
