const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected");
        const count = await User.countDocuments();
        console.log("User count:", count);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}
test();
