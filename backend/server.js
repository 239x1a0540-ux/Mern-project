const express=require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const bcrypt=require('bcryptjs');


const jwt = require("jsonwebtoken");
require("dotenv").config();

const User=require('./models/User');
const Service=require('./models/Service');

const app=express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB cloud connected successful")
})
.catch((error)=>{
    console.log("MongoDB connection Failed! ",error)
});

/* ── JWT Auth Middleware ─────────────────────────────────────── */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

/* ── Admin-Only Middleware ───────────────────────────────────── */
function adminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
}

app.get("/",(req,res)=>{
    res.send("Backend Running Successful")
});

/* ── User Registration (role = "user" by default) ───────────── */
app.post("/api/register",async (req,res)=>{
    try{
        const {fullname,email,password,phone} = req.body;
        const existingUser=await User.findOne({email:email});

        if(existingUser){
            return res.status(400).json({
                message:"Email already Registered"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser =new User({
            fullname:fullname,
            email:email,
            password:hashedPassword,
            phone:phone || "",
            role:"user"
        });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message:"Registration Successful",
            name: newUser.fullname,
            token: token,
            role: newUser.role
        });
    }
    catch(error){
        res.status(500).json({
            message:"Registration Failed..!",
            error:error.message
        });
    }
});

/* ── Admin Secret Registration ──────────────────────────────── */
app.post("/api/register-admin",async (req,res)=>{
    try{
        const {fullname,email,password,phone,secretKey} = req.body;

        // Secret key that only you know — change this to your own secret
        if(secretKey !== process.env.ADMIN_SECRET){
            return res.status(403).json({
                message:"Invalid secret key. Admin registration denied."
            });
        }

        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                message:"Email already Registered"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newAdmin =new User({
            fullname:fullname,
            email:email,
            password:hashedPassword,
            phone:phone || "",
            role:"admin"
        });
        await newAdmin.save();

        const token = jwt.sign(
            { userId: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message:"Admin Registration Successful",
            name: newAdmin.fullname,
            token: token,
            role: newAdmin.role
        });
    }
    catch(error){
        res.status(500).json({
            message:"Admin Registration Failed..!",
            error:error.message
        });
    }
});

/* ── Login (returns role in response) ───────────────────────── */
app.post("/api/login",async (req,res)=>{
    try{
        const {email,password} =req.body;
        const user=await User.findOne({email:email});
        console.log(email,password);
        if(!user){
            return res.status(400).json({
                message:"Invalid email or password",
            });
        }
        const hashedPassword=user.password;
        bcrypt.compare(password,hashedPassword,(err,isMatch)=>{
            if(err){
                return res.status(404).json({
                    message:"Invlid username or password"
                });
            }
            if(isMatch){
                const token = jwt.sign(
                    { userId: user._id, email: user.email, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );
                return res.status(200).json({
                    message:"success",
                    name:user.fullname,
                    token: token,
                    role: user.role
                });
            }
            else{
                return res.status(200).json({
                    message:"Failed"
                });
            }
        });
    }catch(error){
        res.status(500).json({
            message:"Failed"
        });
    }
});

/* ── Forgot Password (Reset Password) ───────────────────────── */
app.post("/api/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        res.status(500).json({ message: "Failed to reset password", error: error.message });
    }
});

/* ── Verify Token (returns role) ────────────────────────────── */
app.get("/api/verify-token", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.user });
});

/* ── Get User Profile ───────────────────────────────────────── */
app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
});

/* ── Update User Profile (allows password change) ────────────── */
app.put("/api/profile", authMiddleware, async (req, res) => {
    try {
        const { fullname, phone, newPassword } = req.body;
        const updates = { fullname, phone };
        if (newPassword && newPassword.trim()) {
            updates.password = await bcrypt.hash(newPassword, 10);
        }
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true }
        ).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
});

/* ── Add Service (both admin and user can add) ──────────────── */
app.post("/api/services", authMiddleware, async (req, res) => {
    try {
        const { vehicle, owner, type, date, cost, status, notes } = req.body;
        const newService = new Service({
            vehicle,
            owner,
            type,
            date,
            cost,
            status: status || "pending",
            notes,
            createdBy: req.user.userId
        });
        await newService.save();
        res.status(201).json({
            message: "Service added successfully",
            service: newService
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add service",
            error: error.message
        });
    }
});

/* ── Get Services (admin = ALL, user = own only) ────────────── */
app.get("/api/services", authMiddleware, async (req, res) => {
    try {
        let services;
        if (req.user.role === "admin") {
            // Admin sees ALL services
            services = await Service.find().sort({ createdAt: -1 });
        } else {
            // User sees only their own services
            services = await Service.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
        }
        res.status(200).json({ services });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch services",
            error: error.message
        });
    }
});

/* ── Update Service Status (admin only) ───────────────────────── */
app.put("/api/services/:id/status", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "progress", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Fetch current service first to check existing status
        const existing = await Service.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: "Service not found" });
        }

        // ── Lock Rule: once completed, cannot be changed ────────────
        if (existing.status === "completed") {
            return res.status(400).json({
                message: "This service is already completed and cannot be edited."
            });
        }

        // Use save() so Mongoose timestamps (updatedAt) are always refreshed
        existing.status = status;
        await existing.save();

        res.status(200).json({ message: "Service status updated successfully", service: existing });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update service status",
            error: error.message
        });
    }
});


/* ── Get Wallet (user — derived from own services) ──────────── */
app.get("/api/wallet", authMiddleware, async (req, res) => {
    try {
        const services = await Service.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
        const transactions = services.map(s => ({
            id: s._id,
            label: `${s.type} — ${s.vehicle}`,
            date: s.date || new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            amount: -(s.cost || 0),
            type: "debit",
            status: s.status
        }));
        const spent = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        res.status(200).json({
            balance: 0,
            spent,
            earned: 0,
            transactions
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch wallet data", error: error.message });
    }
});

/* ── Recent Activity (admin — latest 20 service events) ─────── */
app.get("/api/activity", authMiddleware, adminOnly, async (req, res) => {
    try {
        const services = await Service.find().sort({ updatedAt: -1 }).limit(20);
        const activity = services.map(s => ({
            id: s._id,
            label: `${s.type} for ${s.vehicle} (${s.owner})`,
            status: s.status,
            time: new Date(s.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
            color: s.status === "completed" ? "#22c55e" : s.status === "progress" ? "#6366f1" : s.status === "cancelled" ? "#ef4444" : "#f59e0b"
        }));
        res.status(200).json({ activity });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activity", error: error.message });
    }
});

/* ── Monthly Revenue (admin) ────────────────────────────────── */
app.get("/api/revenue", authMiddleware, adminOnly, async (req, res) => {
    try {
        const services = await Service.find({ status: "completed" });
        // Group by month
        const monthMap = {};
        services.forEach(s => {
            const d = new Date(s.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
            const label = d.toLocaleString("en-IN", { month: "short", year: "numeric" });
            if (!monthMap[key]) monthMap[key] = { key, label, total: 0, count: 0 };
            monthMap[key].total += s.cost || 0;
            monthMap[key].count += 1;
        });
        const monthly = Object.values(monthMap).sort((a,b) => a.key.localeCompare(b.key)).slice(-6);
        const totalRevenue = services.reduce((sum, s) => sum + (s.cost || 0), 0);
        res.status(200).json({ totalRevenue, monthly });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch revenue", error: error.message });
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})