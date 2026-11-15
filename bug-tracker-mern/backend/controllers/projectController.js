const projectService = require('../services/projectService');

exports.getProject = async (req, res, next) => {
    try {
        const project = await projectService.getOrCreateProject();
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.addMember = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const project = await projectService.addMember(req.params.id, userId, role);
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.removeMember = async (req, res, next) => {
    try {
        const project = await projectService.removeMember(req.params.id, req.params.userId);
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.getMembers = async (req, res, next) => {
    try {
        const members = await projectService.getAllMembers();
        res.status(200).json({ success: true, count: members.length, data: members });
    } catch (err) {
        next(err);
    }
};
