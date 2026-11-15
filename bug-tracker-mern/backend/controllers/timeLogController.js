const timeLogService = require('../services/timeLogService');

exports.logTime = async (req, res, next) => {
    try {
        const bugId = req.body.bugId || req.params.workPackageId;
        const timeLog = await timeLogService.logTime(bugId, req.user._id, req.body);
        res.status(201).json({ success: true, data: timeLog });
    } catch (err) {
        next(err);
    }
};

exports.getTimeLogs = async (req, res, next) => {
    try {
        const { workPackageId } = req.params;
        if (workPackageId) {
            const logs = await timeLogService.getLogsByPackage(workPackageId);
            const total = await timeLogService.getTotalHoursByPackage(workPackageId);
            res.status(200).json({ success: true, count: logs.length, totalHours: total, data: logs });
        } else {
            const logs = await timeLogService.getAllLogs();
            const summary = await timeLogService.getTimeLogSummary();
            res.status(200).json({ success: true, count: logs.length, summary, data: logs });
        }
    } catch (err) {
        next(err);
    }
};

exports.getSummary = async (req, res, next) => {
    try {
        const summary = await timeLogService.getTimeLogSummary();
        res.status(200).json({ success: true, data: summary });
    } catch (err) {
        next(err);
    }
};
