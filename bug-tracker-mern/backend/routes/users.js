const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/').get(getUsers);
router.route('/:id')
    .get(getUser)
    .put(authorize('Admin'), updateUser)
    .delete(authorize('Admin'), deleteUser);

module.exports = router;
