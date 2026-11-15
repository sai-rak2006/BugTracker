const activityService = require('../services/activityService');

exports.getActivities = async (req, res, next) => {
    try {
        const result = await activityService.getActivities(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

exports.createActivity = async (req, res, next) => {
    try {
        const { action, workPackageId, detail, meta } = req.body;
        await activityService.logActivity(req.user._id, action, workPackageId, detail, meta);
        res.status(201).json({ success: true, message: 'Activity logged' });
    } catch (err) {
        next(err);
    }
};
