const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        vehicle: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            required: true
        },
        date: {
            type: String,
            default: ""
        },
        cost: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: "pending"
        },
        notes: {
            type: String,
            default: ""
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Service", serviceSchema);
