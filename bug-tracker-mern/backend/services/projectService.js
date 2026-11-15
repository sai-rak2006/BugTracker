const Project = require('../models/Project');
const User = require('../models/User');

exports.getOrCreateProject = async () => {
    let project = await Project.findOne().populate('members.user', 'name avatar role email');
    if (!project) {
        project = await Project.create({ name: 'Firedesk NextGen' });
    }
    return project;
};

exports.updateProject = async (id, updateData) => {
    const project = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate('members.user', 'name avatar role email');
    if (!project) throw new Error('Project not found');
    return project;
};

exports.addMember = async (projectId, userId, role) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Check if already a member
    const existingMember = project.members.find(
        m => m.user.toString() === userId.toString()
    );
    if (existingMember) {
        existingMember.role = role || existingMember.role;
    } else {
        project.members.push({ user: userId, role: role || user.role });
    }

    await project.save();
    return await project.populate('members.user', 'name avatar role email');
};

exports.removeMember = async (projectId, userId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');
    project.members = project.members.filter(m => m.user.toString() !== userId.toString());
    await project.save();
    return await project.populate('members.user', 'name avatar role email');
};

exports.getAllMembers = async () => {
    const project = await Project.findOne().populate('members.user', 'name avatar role email createdAt');
    if (!project) return [];
    return project.members;
};
