const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Feature = require('./models/Feature');
    const features = await Feature.find({});
    const fs = require('fs');
    fs.writeFileSync('features.json', JSON.stringify(features, null, 2));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
