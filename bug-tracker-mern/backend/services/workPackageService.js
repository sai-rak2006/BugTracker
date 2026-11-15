const WorkPackage = require('../models/WorkPackage');
const activityService = require('./activityService');

exports.getWorkPackages = async (query) => {
    // 1. Build filter object
    const queryObj = { ...query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    let filter = {};
    
    // Handle status filter (can be comma-separated)
    if (queryObj.status) {
        filter.status = queryObj.status.includes(',') 
            ? { $in: queryObj.status.split(',') } 
            : queryObj.status;
    }
    if (queryObj.type) {
        filter.type = queryObj.type.includes(',') 
            ? { $in: queryObj.type.split(',') } 
            : queryObj.type;
    }
    if (queryObj.priority) {
        filter.priority = queryObj.priority.includes(',') 
            ? { $in: queryObj.priority.split(',') } 
            : queryObj.priority;
    }
    if (queryObj.assignee) {
        filter.assignee = queryObj.assignee === 'unassigned' ? null : queryObj.assignee;
    }
    if (queryObj.reporter) {
        filter.reporter = queryObj.reporter;
    }
    if (queryObj.parent) {
        filter.parent = queryObj.parent === 'null' ? null : queryObj.parent;
    }

    let dbQuery = WorkPackage.find(filter)
        .populate('assignee', 'name avatar role')
        .populate('reporter', 'name avatar role')
        .populate('parent', 'subject type status');

    // 2. Search
    if (query.search) {
        const searchRegex = { $regex: query.search, $options: 'i' };
        dbQuery = WorkPackage.find({
            ...filter,
            $or: [
                { subject: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ]
        })
            .populate('assignee', 'name avatar role')
            .populate('reporter', 'name avatar role')
            .populate('parent', 'subject type status');
    }

    // 3. Sorting
    if (query.sort) {
        const sortBy = query.sort.split(',').join(' ');
        dbQuery = dbQuery.sort(sortBy);
    } else {
        dbQuery = dbQuery.sort('-createdAt');
    }

    // 4. Pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    dbQuery = dbQuery.skip(startIndex).limit(limit);

    const [workPackages, total] = await Promise.all([
        dbQuery.exec(),
        WorkPackage.countDocuments(filter)
    ]);

    return {
        data: workPackages,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

exports.createWorkPackage = async (data, reporterId) => {
    data.reporter = reporterId;
    const wp = await WorkPackage.create(data);
    const populated = await WorkPackage.findById(wp._id)
        .populate('assignee', 'name avatar role')
        .populate('reporter', 'name avatar role');
    await activityService.logActivity(
        reporterId, 'created', wp._id,
        `created ${wp.type.toLowerCase()} "${wp.subject}"`
    );
    return populated;
};

exports.getWorkPackageById = async (id) => {
    const wp = await WorkPackage.findById(id)
        .populate('assignee', 'name avatar role')
        .populate('reporter', 'name avatar role')
        .populate('parent', 'subject type status')
        .populate({
            path: 'children',
            populate: { path: 'assignee', select: 'name avatar role' }
        });
    if (!wp) throw new Error('Work Package not found');
    return wp;
};

exports.updateWorkPackage = async (id, updateData, actorId) => {
    const wp = await WorkPackage.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })
        .populate('assignee', 'name avatar role')
        .populate('reporter', 'name avatar role');
    if (!wp) throw new Error('Work Package not found');
    if (actorId) {
        const detail = updateData.status
            ? `changed status to "${updateData.status}" on "${wp.subject}"`
            : `updated "${wp.subject}"`;
        await activityService.logActivity(
            actorId, updateData.status ? 'status_changed' : 'updated', id, detail
        );
    }
    return wp;
};

exports.deleteWorkPackage = async (id, actorId) => {
    const wp = await WorkPackage.findByIdAndDelete(id);
    if (!wp) throw new Error('Work Package not found');
    
    // Cascade-delete children
    await WorkPackage.deleteMany({ parent: id });

    // Log deletion activity
    if (actorId) {
        await activityService.logActivity(
            actorId, 
            'deleted', 
            id, 
            `deleted ${wp.type.toLowerCase()} "${wp.subject}"`
        );
    }

    return wp;
};

exports.getAnalytics = async () => {
    const [byStatus, byType, byPriority, byAssignee, total] = await Promise.all([
        WorkPackage.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        WorkPackage.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        WorkPackage.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        WorkPackage.aggregate([
            { $group: { _id: '$assignee', count: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $project: { name: { $ifNull: ['$user.name', 'Unassigned'] }, count: 1 } },
            { $sort: { count: -1 } }
        ]),
        WorkPackage.countDocuments()
    ]);

    const closedCount = byStatus.find(s => s._id === 'Closed')?.count || 0;
    const newCount = byStatus.find(s => s._id === 'New')?.count || 0;
    const inProgressCount = byStatus.find(s => s._id === 'In Progress')?.count || 0;

    return {
        byStatus: byStatus.map(s => ({ name: s._id, count: s.count })),
        byType: byType.map(t => ({ name: t._id, count: t.count })),
        byPriority: byPriority.map(p => ({ name: p._id, count: p.count })),
        byAssignee: byAssignee.map(a => ({ name: a.name, count: a.count })),
        summary: {
            total,
            closed: closedCount,
            open: newCount + inProgressCount,
            pending: byStatus.filter(s => s._id !== 'Closed' && s._id !== 'Rejected')
                .reduce((sum, s) => sum + s.count, 0)
        }
    };
};
