const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false // Exclude from query results by default
        },
        role: {
            type: String,
            enum: ['Admin', 'Developer', 'Tester', 'Manager'],
            default: 'Tester'
        },
        avatar: {
            type: String,
            default: '' // Can store URL or generate initials on frontend
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
