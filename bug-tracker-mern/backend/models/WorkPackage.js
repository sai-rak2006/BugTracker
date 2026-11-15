const mongoose = require('mongoose');

const workPackageSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: [true, 'Please add a subject'],
            trim: true,
            maxlength: [200, 'Subject cannot be more than 200 characters']
        },
        description: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            enum: ['BUG', 'FEATURE', 'EPIC', 'TASK'],
            default: 'BUG'
        },
        status: {
            type: String,
            enum: ['New', 'In Progress', 'Closed', 'On Hold', 'Rejected'],
            default: 'New'
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Urgent'],
            default: 'Normal'
        },
        assignee: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            default: null
        },
        reporter: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        parent: {
            type: mongoose.Schema.ObjectId,
            ref: 'WorkPackage',
            default: null
        },
        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            default: null
        },
        category: {
            type: String,
            default: ''
        },
        version: {
            type: String,
            default: ''
        },
        startDate: {
            type: Date,
            default: null
        },
        dueDate: {
            type: Date,
            default: null
        },
        work: {
            type: Number,
            default: 0,
            min: 0
        },
        remainingWork: {
            type: Number,
            default: 0,
            min: 0
        },
        percentComplete: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for child items (sub-tasks of an EPIC)
workPackageSchema.virtual('children', {
    ref: 'WorkPackage',
    localField: '_id',
    foreignField: 'parent',
    justOne: false
});

// Pre-save hook for automated Progress calculation
workPackageSchema.pre('save', function(next) {
    if (this.work > 0) {
        // Progress = ((Total - Remaining) / Total) * 100
        const calc = ((this.work - this.remainingWork) / this.work) * 100;
        this.percentComplete = Math.max(0, Math.min(100, Math.round(calc)));
    } else {
        this.percentComplete = 0;
    }
    next();
});

// Index for common queries
workPackageSchema.index({ status: 1, type: 1, priority: 1 });
workPackageSchema.index({ assignee: 1 });
workPackageSchema.index({ reporter: 1 });

module.exports = mongoose.model('WorkPackage', workPackageSchema);
