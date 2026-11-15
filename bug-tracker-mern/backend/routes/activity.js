const express = require('express');
const router = express.Router();
const { getActivities, createActivity } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getActivities)
    .post(createActivity);

module.exports = router;
