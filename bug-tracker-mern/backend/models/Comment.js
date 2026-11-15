const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        workPackage: {
            type: mongoose.Schema.ObjectId,
            ref: 'WorkPackage',
            required: [true, 'Comment must belong to a work package']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Comment must belong to a user']
        },
        text: {
            type: String,
            required: [true, 'Comment text cannot be empty'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Comment', commentSchema);
