const wpService = require('../services/workPackageService');

exports.getWorkPackages = async (req, res, next) => {
    try {
        const result = await wpService.getWorkPackages(req.query);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

exports.getWorkPackage = async (req, res, next) => {
    try {
        const wp = await wpService.getWorkPackageById(req.params.id);
        res.status(200).json({ success: true, data: wp });
    } catch (err) {
        next(err);
    }
};

exports.createWorkPackage = async (req, res, next) => {
    try {
        const wp = await wpService.createWorkPackage(req.body, req.user.id);
        res.status(201).json({ success: true, message: 'Work package created successfully', data: wp });
    } catch (err) {
        next(err);
    }
};

exports.updateWorkPackage = async (req, res, next) => {
    try {
        const wp = await wpService.updateWorkPackage(req.params.id, req.body, req.user._id);
        res.status(200).json({ success: true, message: 'Work package updated successfully', data: wp });
    } catch (err) {
        next(err);
    }
};

exports.deleteWorkPackage = async (req, res, next) => {
    try {
        const wp = await wpService.getWorkPackageById(req.params.id);
        
        // Ownership / Role Check
        const isAdmin = req.user?.role === 'Admin';
        const reporterId = wp.reporter?._id?.toString() || wp.reporter?.toString();
        const userId = req.user?._id?.toString();
        
        const isCreator = reporterId && userId && reporterId === userId;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ 
                success: false, 
                message: 'You are not authorized to delete this work package. Only the creator or an admin can delete it.' 
            });
        }

        await wpService.deleteWorkPackage(req.params.id, req.user._id);
        res.status(200).json({ success: true, message: 'Work package deleted successfully', data: {} });
    } catch (err) {
        next(err);
    }
};

exports.getAnalytics = async (req, res, next) => {
    try {
        const stats = await wpService.getAnalytics();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};
