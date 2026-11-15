const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err); // Pass to errorMiddleware
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const result = await authService.loginUser(email, password);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};
