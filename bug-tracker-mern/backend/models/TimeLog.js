const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
    {
        workPackage: {
            type: mongoose.Schema.ObjectId,
            ref: 'WorkPackage',
            required: [true, 'Time log must belong to a work package']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Time log must belong to a user']
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now
        },
        hours: {
            type: Number,
            required: [true, 'Hours are required'],
            min: [0.25, 'Minimum 0.25 hours'],
            max: [24, 'Cannot log more than 24 hours per entry']
        },
        activity: {
            type: String,
            enum: ['Development', 'Design', 'Testing', 'Management', 'Research', 'Documentation', 'Other'],
            default: 'Development'
        },
        comment: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TimeLog', timeLogSchema);
