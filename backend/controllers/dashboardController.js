const Service = require('../models/Service');

exports.getWallet = async (req, res) => {
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
};

exports.getActivity = async (req, res) => {
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
};

exports.getRevenue = async (req, res) => {
    try {
        const services = await Service.find({ status: "completed" });
        const monthMap = {};
        services.forEach(s => {
            const d = new Date(s.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const label = d.toLocaleString("en-IN", { month: "short", year: "numeric" });
            if (!monthMap[key]) monthMap[key] = { key, label, total: 0, count: 0 };
            monthMap[key].total += s.cost || 0;
            monthMap[key].count += 1;
        });
        const monthly = Object.values(monthMap).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
        const totalRevenue = services.reduce((sum, s) => sum + (s.cost || 0), 0);
        res.status(200).json({ totalRevenue, monthly });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch revenue", error: error.message });
    }
};
