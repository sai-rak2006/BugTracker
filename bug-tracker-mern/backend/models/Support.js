const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    type: {
        type: String,
        enum: ['feedback', 'help', 'bug_report'],
        default: 'help'
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Support', supportSchema);
