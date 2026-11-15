const User = require('../models/User');

exports.getAllUsers = async () => {
    return await User.find({}).select('-password').sort('name');
};

exports.getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

exports.updateUser = async (id, updateData) => {
    // Prevent password change through this route
    delete updateData.password;

    const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).select('-password');

    if (!user) throw new Error('User not found');
    return user;
};

exports.deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('User not found');
    return true;
};
