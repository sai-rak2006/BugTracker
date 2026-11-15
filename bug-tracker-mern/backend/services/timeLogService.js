const TimeLog = require('../models/TimeLog');
const WorkPackage = require('../models/WorkPackage');

exports.logTime = async (workPackageId, userId, data) => {
    const { date, hours, activity, comment } = data;
    
    const timeLog = await TimeLog.create({
        workPackage: workPackageId,
        user: userId,
        date: date || new Date(),
        hours,
        activity: activity || 'Development',
        comment: comment || ''
    });

    return await timeLog.populate('user', 'name avatar role');
};

exports.getLogsByPackage = async (workPackageId) => {
    return await TimeLog.find({ workPackage: workPackageId })
        .populate('user', 'name avatar role')
        .sort('-date');
};

exports.getAllLogs = async () => {
    return await TimeLog.find()
        .populate('user', 'name avatar role')
        .populate('workPackage', 'subject type status')
        .sort('-date');
};

exports.getTotalHoursByPackage = async (workPackageId) => {
    const result = await TimeLog.aggregate([
        { $match: { workPackage: require('mongoose').Types.ObjectId.createFromHexString(workPackageId) } },
        { $group: { _id: null, total: { $sum: '$hours' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
};

exports.getTimeLogSummary = async () => {
    return await TimeLog.aggregate([
        {
            $group: {
                _id: '$activity',
                totalHours: { $sum: '$hours' },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalHours: -1 } }
    ]);
};
