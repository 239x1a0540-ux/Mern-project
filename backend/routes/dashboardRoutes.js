const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/wallet', authMiddleware, dashboardController.getWallet);
router.get('/activity', authMiddleware, adminMiddleware, dashboardController.getActivity);
router.get('/revenue', authMiddleware, adminMiddleware, dashboardController.getRevenue);

module.exports = router;
