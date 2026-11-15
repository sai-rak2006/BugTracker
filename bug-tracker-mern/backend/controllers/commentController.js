const commentService = require('../services/commentService');

exports.addComment = async (req, res, next) => {
    try {
        const { bugId, text } = req.body;
        const comment = await commentService.addComment(bugId, req.user._id, text);
        res.status(201).json({ success: true, data: comment });
    } catch (err) {
        next(err);
    }
};

exports.getComments = async (req, res, next) => {
    try {
        const { bugId } = req.params;
        const comments = await commentService.getCommentsByPackage(bugId);
        res.status(200).json({ success: true, count: comments.length, data: comments });
    } catch (err) {
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        await commentService.deleteComment(req.params.id, req.user._id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
