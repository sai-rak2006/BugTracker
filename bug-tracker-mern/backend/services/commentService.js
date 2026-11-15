const Comment = require('../models/Comment');
const activityService = require('./activityService');

exports.addComment = async (workPackageId, userId, text) => {
    const comment = await Comment.create({
        workPackage: workPackageId,
        user: userId,
        text
    });
    const populated = await comment.populate('user', 'name avatar role');
    await activityService.logActivity(
        userId, 'commented', workPackageId,
        `added a comment`
    );
    return populated;
};

exports.getCommentsByPackage = async (workPackageId) => {
    return await Comment.find({ workPackage: workPackageId })
        .populate('user', 'name avatar role')
        .sort('-createdAt');
};

exports.deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error('Comment not found');
    if (comment.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this comment');
    }
    await comment.deleteOne();
    return comment;
};
