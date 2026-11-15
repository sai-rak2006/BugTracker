const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    if (user) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

exports.loginUser = async (email, password) => {
    // Check for user email via DB since select is false by default
    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        };
    } else {
        throw new Error('Invalid credentials');
    }
};

exports.getAllUsers = async () => {
    return await User.find({}).select('-password');
};

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};
