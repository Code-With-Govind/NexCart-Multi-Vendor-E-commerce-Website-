const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Feature = require('./models/Feature');
    const result = await Feature.deleteMany({ image: "" });
    console.log(`Deleted ${result.deletedCount} empty feature images.`);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
