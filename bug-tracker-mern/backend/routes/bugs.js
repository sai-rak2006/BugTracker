const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All bug routes require authentication
router.use(protect);

router.route('/')
    .get(bugController.getAllBugs)
    .post(authorize('Admin', 'Tester'), bugController.createBug);

router.route('/:id')
    .get(bugController.getBugById)
    .put(authorize('Admin', 'Developer'), bugController.updateBug)
    .delete(bugController.deleteBug);

module.exports = router;
