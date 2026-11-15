const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('Admin', 'Developer', 'Tester'), addComment);
router.get('/:bugId', getComments);
router.delete('/:id', authorize('Admin'), deleteComment);

module.exports = router;
