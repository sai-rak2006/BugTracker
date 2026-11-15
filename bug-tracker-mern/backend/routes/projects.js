const express = require('express');
const router = express.Router();
const { getProject, updateProject, addMember, removeMember, getMembers } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/').get(getProject);
router.route('/members').get(getMembers);
router.route('/:id').put(updateProject);
router.route('/:id/members').post(addMember);
router.route('/:id/members/:userId').delete(removeMember);

module.exports = router;
