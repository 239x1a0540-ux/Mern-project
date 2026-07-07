const express = require('express');
const cors = require('cors');
require("dotenv").config();
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Root Endpoint
app.get("/", (req, res) => {
    res.send("Backend Running Successful");
});

// Mount Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});