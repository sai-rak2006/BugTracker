const Support = require('../models/Support');
const activityService = require('../services/activityService');

// @desc      Create a support request
// @route     POST /api/support
// @access    Private
exports.submitSupportRequest = async (req, res, next) => {
    try {
        const support = await Support.create({
            user: req.user.id,
            subject: req.body.subject,
            message: req.body.message,
            type: req.body.type || 'help'
        });

        // Log this action to activity
        await activityService.logActivity(
            req.user.id,
            'support_request',
            support._id,
            `submitted a "${support.type}" support request: "${support.subject}"`
        );

        res.status(201).json({
            success: true,
            message: "Your support request has been submitted successfully. A member of our team will review it shortly.",
            data: support
        });
    } catch (err) {
        next(err);
    }
};

// @desc      Get all support requests (Admin only)
// @route     GET /api/support
// @access    Private/Admin
exports.getAllSupportRequests = async (req, res, next) => {
    try {
        const supportRequests = await Support.find().populate('user', 'name email').sort('-createdAt');
        res.status(200).json({
            success: true,
            count: supportRequests.length,
            data: supportRequests
        });
    } catch (err) {
        next(err);
    }
};
