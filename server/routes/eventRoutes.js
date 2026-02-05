const express = require('express');
const router = express.Router();
const { createEvent, getVehicleEvents } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('insurance', 'admin'), createEvent);
router.get('/vehicle/:identifier', getVehicleEvents);

module.exports = router;
