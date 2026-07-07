const Service = require('../models/Service');

exports.addService = async (req, res) => {
    try {
        const { vehicle, owner, phone, type, date, cost, status, notes } = req.body;
        const newService = new Service({
            vehicle,
            owner,
            phone,
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
};

exports.getServices = async (req, res) => {
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
};

exports.updateServiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "progress", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const existing = await Service.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (existing.status === "completed") {
            return res.status(400).json({
                message: "This service is already completed and cannot be edited."
            });
        }

        existing.status = status;
        await existing.save();

        res.status(200).json({ message: "Service status updated successfully", service: existing });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update service status",
            error: error.message
        });
    }
};

exports.cancelService = async (req, res) => {
    try {
        const existing = await Service.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: "Service not found" });
        }
        if (existing.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to cancel this service" });
        }
        if (existing.status === "completed" || existing.status === "cancelled") {
            return res.status(400).json({ message: `Service is already ${existing.status} and cannot be cancelled.` });
        }

        existing.status = "cancelled";
        await existing.save();

        res.status(200).json({ message: "Service cancelled successfully", service: existing });
    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel service",
            error: error.message
        });
    }
};
