const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        action: {
            type: String,
            required: true,
            // e.g. 'created', 'updated', 'status_changed', 'assigned', 'commented', 'deleted'
        },
        entity: {
            type: String,
            default: 'work_package'
        },
        workPackage: {
            type: mongoose.Schema.ObjectId,
            ref: 'WorkPackage',
            default: null
        },
        detail: {
            type: String,
            default: ''
        },
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    { timestamps: true }
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ workPackage: 1 });
activitySchema.index({ actor: 1 });

module.exports = mongoose.model('Activity', activitySchema);
