const userService = require('../services/userService');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
