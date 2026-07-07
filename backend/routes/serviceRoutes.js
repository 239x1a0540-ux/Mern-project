const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, serviceController.addService);
router.get('/', authMiddleware, serviceController.getServices);
router.put('/:id/status', authMiddleware, adminMiddleware, serviceController.updateServiceStatus);
router.put('/:id/cancel', authMiddleware, serviceController.cancelService);

module.exports = router;
