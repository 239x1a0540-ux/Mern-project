const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { fullname, password, phone } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase().trim() : "";
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already Registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            phone: phone || "",
            role: "user"
        });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "Registration Successful",
            name: newUser.fullname,
            token: token,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration Failed..!",
            error: error.message
        });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { fullname, email, password, phone, secretKey } = req.body;

        if (secretKey !== process.env.ADMIN_SECRET) {
            return res.status(403).json({
                message: "Invalid secret key. Admin registration denied."
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already Registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            phone: phone || "",
            role: "admin"
        });
        await newAdmin.save();

        const token = jwt.sign(
            { userId: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "Admin Registration Successful",
            name: newAdmin.fullname,
            token: token,
            role: newAdmin.role
        });
    } catch (error) {
        res.status(500).json({
            message: "Admin Registration Failed..!",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase().trim() : "";
        const user = await User.findOne({ email: email });
        console.log("Login attempt:", email);
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }
        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                return res.status(404).json({
                    message: "Invlid username or password"
                });
            }
            if (isMatch) {
                const token = jwt.sign(
                    { userId: user._id, email: user.email, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );
                return res.status(200).json({
                    message: "success",
                    name: user.fullname,
                    token: token,
                    role: user.role
                });
            } else {
                return res.status(401).json({
                    message: "Incorrect password"
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed"
        });
    }
};

exports.resetPassword = async (req, res) => {
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
};

exports.verifyToken = (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.user });
};
