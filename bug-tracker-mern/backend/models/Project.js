const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            default: 'Firedesk NextGen'
        },
        description: {
            type: String,
            default: 'Enterprise-grade bug and task tracking system for modern engineering teams.'
        },
        status: {
            type: String,
            enum: ['On track', 'Off track', 'At risk', 'Completed'],
            default: 'On track'
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User'
                },
                role: {
                    type: String,
                    enum: ['Admin', 'Developer', 'Tester', 'Manager'],
                    default: 'Developer'
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Project', projectSchema);
