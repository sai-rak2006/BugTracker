const express = require('express');
const router = express.Router();
const {
    submitSupportRequest,
    getAllSupportRequests
} = require('../controllers/supportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(authorize('Admin'), getAllSupportRequests)
    .post(submitSupportRequest);

module.exports = router;
