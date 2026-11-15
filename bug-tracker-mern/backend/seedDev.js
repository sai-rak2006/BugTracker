/**
 * seedDev.js — Auto-seed for development in-memory MongoDB.
 * Called automatically by server.js in development mode.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const WorkPackage = require('./models/WorkPackage');
const Comment = require('./models/Comment');
const TimeLog = require('./models/TimeLog');
const Project = require('./models/Project');
const Activity = require('./models/Activity');

module.exports = async function seedDev() {
    // Skip if data already exists (e.g. if nodemon triggers a restart mid-session)
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
        console.log('ℹ️  Dev data already seeded, skipping.');
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
        { name: 'Alex Johnson',    email: 'admin@demo.com',     password: hashedPw, role: 'Admin',     avatar: '' },
        { name: 'Sarah Chen',      email: 'developer@demo.com', password: hashedPw, role: 'Developer', avatar: '' },
        { name: 'Marcus Williams', email: 'tester@demo.com',    password: hashedPw, role: 'Tester',    avatar: '' },
        { name: 'Priya Patel',     email: 'manager@demo.com',   password: hashedPw, role: 'Manager',   avatar: '' },
        { name: "Ryan O'Brien",    email: 'dev2@demo.com',      password: hashedPw, role: 'Developer', avatar: '' },
    ]);

    const [admin, dev1, tester, manager, dev2] = users;

    const project = await Project.create({
        name: 'Firedesk NextGen',
        description: 'Enterprise-grade fire desk management and bug tracking platform. Version 2.0 milestone.',
        status: 'On track',
        members: [
            { user: admin._id,   role: 'Admin' },
            { user: dev1._id,    role: 'Developer' },
            { user: tester._id,  role: 'Tester' },
            { user: manager._id, role: 'Manager' },
            { user: dev2._id,    role: 'Developer' },
        ]
    });

    const epic1 = await WorkPackage.create({
        subject: 'Authentication & User Management Epic',
        description: 'Complete overhaul of authentication including SSO, 2FA, and RBAC.',
        type: 'EPIC', status: 'In Progress', priority: 'High',
        reporter: admin._id, assignee: dev1._id, project: project._id,
        category: 'Security', version: 'v2.0', percentComplete: 45, work: 80, remainingWork: 44
    });

    const epic2 = await WorkPackage.create({
        subject: 'Dashboard Analytics & Reporting',
        description: 'Build comprehensive analytics dashboard with real-time charts and KPI metrics.',
        type: 'EPIC', status: 'New', priority: 'Normal',
        reporter: admin._id, assignee: dev2._id, project: project._id,
        category: 'Analytics', version: 'v2.1', percentComplete: 0, work: 120, remainingWork: 120
    });

    const features = await WorkPackage.insertMany([
        {
            subject: 'Implement JWT refresh token rotation',
            description: 'Add sliding expiration JWT tokens with secure refresh mechanism.',
            type: 'FEATURE', status: 'In Progress', priority: 'High',
            reporter: admin._id, assignee: dev1._id, parent: epic1._id, project: project._id,
            category: 'Security', version: 'v2.0', percentComplete: 70, work: 16, remainingWork: 5
        },
        {
            subject: 'OAuth2 Google SSO Integration',
            description: 'Allow users to sign in via Google OAuth2.',
            type: 'FEATURE', status: 'New', priority: 'Normal',
            reporter: admin._id, assignee: dev2._id, parent: epic1._id, project: project._id,
            category: 'Security', version: 'v2.0', percentComplete: 0, work: 24, remainingWork: 24
        },
        {
            subject: 'Real-time KPI Dashboard',
            description: 'Live-updating dashboard cards with websocket-powered metrics.',
            type: 'FEATURE', status: 'New', priority: 'High',
            reporter: manager._id, assignee: dev2._id, parent: epic2._id, project: project._id,
            category: 'Analytics', version: 'v2.1', percentComplete: 0, work: 40, remainingWork: 40
        }
    ]);

    const bugs = await WorkPackage.insertMany([
        {
            subject: 'Login page crashes on Safari iOS 16+',
            description: 'Users on Safari iOS 16 experience crash when logging in. Error: Unhandled Promise Rejection.',
            type: 'BUG', status: 'New', priority: 'Urgent',
            reporter: tester._id, assignee: dev1._id, project: project._id,
            category: 'Authentication', version: 'v1.9', percentComplete: 0, work: 8, remainingWork: 8,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
            subject: 'Work package filters not persisting on page refresh',
            description: 'Applied filters reset to default when user refreshes the page.',
            type: 'BUG', status: 'In Progress', priority: 'High',
            reporter: tester._id, assignee: dev2._id, project: project._id,
            category: 'Work Packages', version: 'v1.9', percentComplete: 30, work: 4, remainingWork: 3
        },
        {
            subject: 'Analytics chart shows NaN for empty data sets',
            description: 'Recharts renders NaN instead of 0 on Y-axis for empty status groups.',
            type: 'BUG', status: 'Closed', priority: 'Normal',
            reporter: dev1._id, assignee: dev1._id, project: project._id,
            category: 'Analytics', version: 'v1.8', percentComplete: 100, work: 2, remainingWork: 0
        },
        {
            subject: 'PDF export fails for reports with >500 rows',
            description: 'Generating PDF for large datasets causes timeout. Needs chunked export.',
            type: 'BUG', status: 'On Hold', priority: 'Normal',
            reporter: manager._id, assignee: null, project: project._id,
            category: 'Reporting', version: 'v1.9', percentComplete: 0, work: 16, remainingWork: 16
        },
        {
            subject: 'Member avatar initials display incorrectly for special characters',
            description: 'Names like "Björn Müller" produce corrupted initials. Unicode normalization needed.',
            type: 'BUG', status: 'New', priority: 'Low',
            reporter: tester._id, assignee: dev2._id, project: project._id,
            category: 'UI', version: 'v1.9', percentComplete: 0, work: 2, remainingWork: 2
        },
        {
            subject: 'Email notifications not sent when priority changes to Urgent',
            description: 'Notification service triggers for status changes but misses priority escalations.',
            type: 'BUG', status: 'Rejected', priority: 'Normal',
            reporter: admin._id, assignee: dev1._id, project: project._id,
            category: 'Notifications', version: 'v1.8', percentComplete: 0, work: 6, remainingWork: 6
        },
        {
            subject: 'Database connection pool exhausted under load',
            description: 'Under >200 concurrent users, MongoDB pool is exhausted, causing 503 errors.',
            type: 'BUG', status: 'In Progress', priority: 'Urgent',
            reporter: admin._id, assignee: dev1._id, project: project._id,
            category: 'Performance', version: 'v2.0', percentComplete: 55, work: 12, remainingWork: 5
        },
        {
            subject: 'Time log entry allows negative hours',
            description: 'API does not validate negative hour values, corrupting total time tracking.',
            type: 'BUG', status: 'Closed', priority: 'High',
            reporter: tester._id, assignee: dev2._id, project: project._id,
            category: 'Time Tracking', version: 'v1.9', percentComplete: 100, work: 1, remainingWork: 0
        }
    ]);

    await Comment.insertMany([
        { workPackage: bugs[0]._id, user: dev1._id,   text: 'Reproducible on my test device. Linked to async/await polyfill on WebKit.' },
        { workPackage: bugs[0]._id, user: tester._id, text: 'Also on Safari 16.4 macOS Ventura. Attaching crash logs.' },
        { workPackage: bugs[0]._id, user: admin._id,  text: 'This is P0. Must resolve before v2.0 release.' },
        { workPackage: bugs[1]._id, user: dev2._id,   text: 'Will use URLSearchParams to persist filter state.' },
        { workPackage: bugs[2]._id, user: dev1._id,   text: 'Fixed in PR #142. Null coalescing for empty data points.' },
    ]);

    await TimeLog.insertMany([
        {
            workPackage: bugs[0]._id, user: dev1._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            hours: 3, activity: 'Research', comment: 'Investigating Safari WebKit issue'
        },
        {
            workPackage: bugs[0]._id, user: dev1._id,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            hours: 2.5, activity: 'Development', comment: 'Attempted fix, needs more testing'
        },
        {
            workPackage: features[0]._id, user: dev1._id,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            hours: 8, activity: 'Development', comment: 'Implemented refresh token with Redis'
        },
        {
            workPackage: bugs[6]._id, user: dev1._id,
            date: new Date(),
            hours: 4, activity: 'Development', comment: 'Connection pool tuning'
        }
    ]);

    await Activity.insertMany([
        { actor: admin._id, action: 'created', workPackage: epic1._id, detail: `created epic "Authentication & User Management Epic"`, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
        { actor: tester._id, action: 'created', workPackage: bugs[0]._id, detail: `created bug "Login page crashes on Safari iOS 16+"`, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { actor: dev1._id, action: 'status_changed', workPackage: features[0]._id, detail: `changed status to "In Progress"`, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { actor: dev1._id, action: 'commented', workPackage: bugs[0]._id, detail: `added a comment`, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { actor: dev1._id, action: 'status_changed', workPackage: bugs[2]._id, detail: `changed status to "Closed"`, createdAt: new Date() }
    ]);

    console.log(`✅ Seeded: ${users.length} users, 1 project, ${2 + features.length + bugs.length} work packages`);
    console.log('   Login: admin@demo.com / password123');
};
