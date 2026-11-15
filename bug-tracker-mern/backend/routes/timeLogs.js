const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows access to :workPackageId
const { logTime, getTimeLogs, getSummary } = require('../controllers/timeLogController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/').get(getTimeLogs).post(logTime);
router.route('/summary').get(getSummary);

module.exports = router;
