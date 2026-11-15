const bugService = require('../services/bugService');

exports.getAllBugs = async (req, res, next) => {
    try {
        const result = await bugService.getAllBugs(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

exports.getBugById = async (req, res, next) => {
    try {
        const bug = await bugService.getBugById(req.params.id);
        res.status(200).json({ success: true, data: bug });
    } catch (err) {
        next(err);
    }
};

exports.createBug = async (req, res, next) => {
    try {
        const bug = await bugService.createBug(req.body, req.user._id);
        res.status(201).json({ success: true, data: bug });
    } catch (err) {
        next(err);
    }
};

exports.updateBug = async (req, res, next) => {
    try {
        const bug = await bugService.updateBug(req.params.id, req.body, req.user._id);
        res.status(200).json({ success: true, message: 'Work package updated successfully', data: bug });
    } catch (err) {
        next(err);
    }
};

exports.deleteBug = async (req, res, next) => {
    try {
        const bug = await bugService.getBugById(req.params.id);
        
        // Ownership / Role Check
        const isAdmin = req.user?.role === 'Admin';
        const creatorId = bug.createdBy?._id?.toString() || bug.createdBy?.toString();
        const userId = req.user?._id?.toString();
        
        const isCreator = creatorId && userId && creatorId === userId;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ 
                success: false, 
                message: 'You are not authorized to delete this bug. Only the creator or an admin can delete it.' 
            });
        }

        await bugService.deleteBug(req.params.id);
        res.status(200).json({ success: true, message: 'Bug deleted successfully', data: {} });
    } catch (err) {
        next(err);
    }
};
