const Activity = require('../models/Activity');

/**
 * Log an activity event.
 * @param {string} actorId  - User ID who performed the action
 * @param {string} action   - e.g. 'created', 'updated', 'status_changed', 'commented'
 * @param {string|null} workPackageId
 * @param {string} detail   - Human readable description
 * @param {object} meta     - Optional extra data
 */
exports.logActivity = async (actorId, action, workPackageId, detail, meta = {}) => {
    try {
        await Activity.create({
            actor: actorId,
            action,
            workPackage: workPackageId || null,
            detail,
            meta
        });
    } catch (err) {
        // Activity logging should never break the main operation
        console.warn('⚠️  Activity log failed:', err.message);
    }
};

/**
 * Get a paginated activity feed.
 */
exports.getActivities = async (query = {}) => {
    const page  = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 30;
    const skip  = (page - 1) * limit;

    const filter = {};
    if (query.workPackage) filter.workPackage = query.workPackage;
    if (query.actor)       filter.actor       = query.actor;

    const [activities, total] = await Promise.all([
        Activity.find(filter)
            .populate('actor', 'name avatar role')
            .populate('workPackage', 'subject type status _id')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        Activity.countDocuments(filter)
    ]);

    return {
        data: activities,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
};
