const mongoose = require('mongoose');

async function test() {
    const uri = "mongodb+srv://krishna:krishna@cluster0.6nxelrj.mongodb.net/vehiclehub?retryWrites=true&w=majority";
    try {
        await mongoose.connect(uri);
        console.log("SRV Connected");
        process.exit(0);
    } catch (err) {
        console.error("SRV Error:", err);
        process.exit(1);
    }
}
test();
