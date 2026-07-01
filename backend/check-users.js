const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
    const uri = "mongodb+srv://krishna:krishna@cluster0.6nxelrj.mongodb.net/vehiclehub?retryWrites=true&w=majority";
    try {
        await mongoose.connect(uri);
        const users = await User.find().limit(2);
        console.log("Users:", JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}
test();
