/**
 * bugService.js — Business logic for Bug-type work packages.
 * Bugs are WorkPackages with type='BUG'. This service wraps the WorkPackage model
 * and always scopes queries to type:'BUG', maintaining a clean domain boundary.
 */
const WorkPackage = require('../models/WorkPackage');
const activityService = require('./activityService');

const BUG_POPULATE = [
    { path: 'assignee', select: 'name avatar role' },
    { path: 'reporter', select: 'name avatar role' },
];

exports.getAllBugs = async (query = {}) => {
    const page  = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip  = (page - 1) * limit;

    const filter = { type: 'BUG' };
    if (query.status)   filter.status   = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.assignee) filter.assignee = query.assignee;

    const [bugs, total] = await Promise.all([
        WorkPackage.find(filter)
            .populate(BUG_POPULATE)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        WorkPackage.countDocuments(filter)
    ]);

    return {
        data: bugs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
};

exports.getBugById = async (id) => {
    const bug = await WorkPackage.findOne({ _id: id, type: 'BUG' })
        .populate(BUG_POPULATE);
    if (!bug) throw Object.assign(new Error('Bug not found'), { statusCode: 404 });
    return bug;
};

exports.createBug = async (data, reporterId) => {
    const bug = await WorkPackage.create({
        ...data,
        type: 'BUG',
        reporter: reporterId
    });
    const populated = await WorkPackage.findById(bug._id).populate(BUG_POPULATE);

    await activityService.logActivity(
        reporterId,
        'created',
        bug._id,
        `created bug "${bug.subject}"`
    );

    return populated;
};

exports.updateBug = async (id, data, actorId) => {
    const bug = await WorkPackage.findOneAndUpdate(
        { _id: id, type: 'BUG' },
        data,
        { new: true, runValidators: true }
    ).populate(BUG_POPULATE);

    if (!bug) throw Object.assign(new Error('Bug not found'), { statusCode: 404 });

    const detail = data.status
        ? `changed status to "${data.status}"`
        : `updated bug "${bug.subject}"`;

    await activityService.logActivity(actorId, data.status ? 'status_changed' : 'updated', id, detail);

    return bug;
};

exports.deleteBug = async (id) => {
    const bug = await WorkPackage.findOneAndDelete({ _id: id, type: 'BUG' });
    if (!bug) throw Object.assign(new Error('Bug not found'), { statusCode: 404 });
    return bug;
};
