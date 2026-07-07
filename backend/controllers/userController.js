const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
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
};
