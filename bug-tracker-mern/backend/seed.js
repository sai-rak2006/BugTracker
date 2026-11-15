require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const WorkPackage = require('./models/WorkPackage');
const Comment = require('./models/Comment');
const TimeLog = require('./models/TimeLog');
const Project = require('./models/Project');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');

    // Clear all collections
    await Promise.all([
        User.deleteMany(),
        WorkPackage.deleteMany(),
        Comment.deleteMany(),
        TimeLog.deleteMany(),
        Project.deleteMany()
    ]);
    console.log('🧹 Cleared existing data');

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
        { name: 'Alex Johnson', email: 'admin@demo.com', password: hashedPw, role: 'Admin', avatar: '' },
        { name: 'Sarah Chen', email: 'developer@demo.com', password: hashedPw, role: 'Developer', avatar: '' },
        { name: 'Marcus Williams', email: 'tester@demo.com', password: hashedPw, role: 'Tester', avatar: '' },
        { name: 'Priya Patel', email: 'manager@demo.com', password: hashedPw, role: 'Manager', avatar: '' },
        { name: 'Ryan O\'Brien', email: 'dev2@demo.com', password: hashedPw, role: 'Developer', avatar: '' },
    ]);
    console.log(`👤 Created ${users.length} users`);

    const [admin, dev1, tester, manager, dev2] = users;

    // Create Project
    const project = await Project.create({
        name: 'Firedesk NextGen',
        description: 'Enterprise-grade fire desk management and bug tracking platform for modern engineering teams. Version 2.0 milestone.',
        status: 'On track',
        members: [
            { user: admin._id, role: 'Admin' },
            { user: dev1._id, role: 'Developer' },
            { user: tester._id, role: 'Tester' },
            { user: manager._id, role: 'Manager' },
            { user: dev2._id, role: 'Developer' }
        ]
    });
    console.log('📁 Created project');

    // Create Epic Work Packages
    const epic1 = await WorkPackage.create({
        subject: 'Authentication & User Management Epic',
        description: 'Complete overhaul of the authentication system including SSO, 2FA, and role-based access control.',
        type: 'EPIC',
        status: 'In Progress',
        priority: 'High',
        reporter: admin._id,
        assignee: dev1._id,
        project: project._id,
        category: 'Security',
        version: 'v2.0',
        percentComplete: 45,
        work: 80,
        remainingWork: 44
    });

    const epic2 = await WorkPackage.create({
        subject: 'Dashboard Analytics & Reporting',
        description: 'Build comprehensive analytics dashboard with real-time charts, KPI metrics, and exportable reports.',
        type: 'EPIC',
        status: 'New',
        priority: 'Normal',
        reporter: admin._id,
        assignee: dev2._id,
        project: project._id,
        category: 'Analytics',
        version: 'v2.1',
        percentComplete: 0,
        work: 120,
        remainingWork: 120
    });

    // Create Features
    const features = await WorkPackage.insertMany([
        {
            subject: 'Implement JWT refresh token rotation',
            description: 'Add sliding expiration JWT tokens with secure refresh mechanism for enhanced security.',
            type: 'FEATURE',
            status: 'In Progress',
            priority: 'High',
            reporter: admin._id,
            assignee: dev1._id,
            parent: epic1._id,
            project: project._id,
            category: 'Security',
            version: 'v2.0',
            percentComplete: 70,
            work: 16,
            remainingWork: 5
        },
        {
            subject: 'OAuth2 Google SSO Integration',
            description: 'Allow users to sign in via Google OAuth2 for simplified authentication experience.',
            type: 'FEATURE',
            status: 'New',
            priority: 'Normal',
            reporter: admin._id,
            assignee: dev2._id,
            parent: epic1._id,
            project: project._id,
            category: 'Security',
            version: 'v2.0',
            percentComplete: 0,
            work: 24,
            remainingWork: 24
        },
        {
            subject: 'Real-time KPI Dashboard',
            description: 'Live-updating dashboard cards with websocket-powered metrics.',
            type: 'FEATURE',
            status: 'New',
            priority: 'High',
            reporter: manager._id,
            assignee: dev2._id,
            parent: epic2._id,
            project: project._id,
            category: 'Analytics',
            version: 'v2.1',
            percentComplete: 0,
            work: 40,
            remainingWork: 40
        }
    ]);

    // Create Bug Work Packages
    const bugs = await WorkPackage.insertMany([
        {
            subject: 'Login page crashes on Safari iOS 16+',
            description: 'Users on Safari iOS 16 and above experience an app crash when attempting to login. The issue is reproducible 100% on iPhone 14 Pro. Error: Unhandled Promise Rejection.',
            type: 'BUG',
            status: 'New',
            priority: 'Urgent',
            reporter: tester._id,
            assignee: dev1._id,
            project: project._id,
            category: 'Authentication',
            version: 'v1.9',
            percentComplete: 0,
            work: 8,
            remainingWork: 8,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
            subject: 'Work package filters not persisting on page refresh',
            description: 'Applied filters reset to default state when the user refreshes the browser. Filter state should be preserved in URL query parameters.',
            type: 'BUG',
            status: 'In Progress',
            priority: 'High',
            reporter: tester._id,
            assignee: dev2._id,
            project: project._id,
            category: 'Work Packages',
            version: 'v1.9',
            percentComplete: 30,
            work: 4,
            remainingWork: 3
        },
        {
            subject: 'Analytics chart shows NaN for empty data sets',
            description: 'When there are no work packages in a particular status, the Recharts bar chart renders NaN instead of 0 on the Y-axis.',
            type: 'BUG',
            status: 'Closed',
            priority: 'Normal',
            reporter: dev1._id,
            assignee: dev1._id,
            project: project._id,
            category: 'Analytics',
            version: 'v1.8',
            percentComplete: 100,
            work: 2,
            remainingWork: 0
        },
        {
            subject: 'PDF export fails for reports with >500 rows',
            description: 'Generating PDF reports for large datasets (>500 rows) causes a timeout error. Need to implement streaming/chunked export.',
            type: 'BUG',
            status: 'On Hold',
            priority: 'Normal',
            reporter: manager._id,
            assignee: null,
            project: project._id,
            category: 'Reporting',
            version: 'v1.9',
            percentComplete: 0,
            work: 16,
            remainingWork: 16
        },
        {
            subject: 'Member avatar initials display incorrectly for names with special characters',
            description: 'Names like "Björn Müller" produce corrupted initials. Unicode normalization needed before extracting initials.',
            type: 'BUG',
            status: 'New',
            priority: 'Low',
            reporter: tester._id,
            assignee: dev2._id,
            project: project._id,
            category: 'UI',
            version: 'v1.9',
            percentComplete: 0,
            work: 2,
            remainingWork: 2
        },
        {
            subject: 'Email notifications not sent when priority changes to Urgent',
            description: 'The notification service triggers for status changes but misses priority escalations to Urgent level.',
            type: 'BUG',
            status: 'Rejected',
            priority: 'Normal',
            reporter: admin._id,
            assignee: dev1._id,
            project: project._id,
            category: 'Notifications',
            version: 'v1.8',
            percentComplete: 0,
            work: 6,
            remainingWork: 6
        },
        {
            subject: 'Database connection pool exhausted under load',
            description: 'Under sustained load (>200 concurrent users), MongoDB connection pool gets exhausted causing 503 errors. Needs connection pool tuning and circuit breaker.',
            type: 'BUG',
            status: 'In Progress',
            priority: 'Urgent',
            reporter: admin._id,
            assignee: dev1._id,
            project: project._id,
            category: 'Performance',
            version: 'v2.0',
            percentComplete: 55,
            work: 12,
            remainingWork: 5
        },
        {
            subject: 'Time log entry allows negative hours',
            description: 'The time log API does not validate negative hour values. Users can submit -5 hours which corrupts the total time tracking.',
            type: 'BUG',
            status: 'Closed',
            priority: 'High',
            reporter: tester._id,
            assignee: dev2._id,
            project: project._id,
            category: 'Time Tracking',
            version: 'v1.9',
            percentComplete: 100,
            work: 1,
            remainingWork: 0
        }
    ]);

    console.log(`📦 Created ${features.length} features + ${bugs.length} bugs + 2 epics`);

    // Create Comments
    await Comment.insertMany([
        {
            workPackage: bugs[0]._id,
            user: dev1._id,
            text: 'I can reproduce this on my test device. The issue appears to be related to the async/await polyfill not behaving correctly on WebKit.'
        },
        {
            workPackage: bugs[0]._id,
            user: tester._id,
            text: 'Confirmed. Also happening on Safari 16.4 on macOS Ventura. Attaching crash logs in the next comment.'
        },
        {
            workPackage: bugs[0]._id,
            user: admin._id,
            text: 'This is a P0 issue. Needs to be resolved before the v2.0 release. @dev1 please prioritize.'
        },
        {
            workPackage: bugs[1]._id,
            user: dev2._id,
            text: 'Investigating the URL state management approach. Will implement using URLSearchParams to persist filters across page loads.'
        },
        {
            workPackage: bugs[2]._id,
            user: dev1._id,
            text: 'Fixed in PR #142. Added null coalescing to ensure 0 is returned instead of NaN for empty data points.'
        }
    ]);
    console.log('💬 Created comments');

    // Create Time Logs
    await TimeLog.insertMany([
        {
            workPackage: bugs[0]._id,
            user: dev1._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            hours: 3,
            activity: 'Research',
            comment: 'Investigating Safari WebKit issue, reading MDN docs and CanIUse'
        },
        {
            workPackage: bugs[0]._id,
            user: dev1._id,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            hours: 2.5,
            activity: 'Development',
            comment: 'Attempted fix with different async pattern, needs more testing'
        },
        {
            workPackage: features[0]._id,
            user: dev1._id,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            hours: 8,
            activity: 'Development',
            comment: 'Implemented refresh token rotation with Redis storage'
        },
        {
            workPackage: bugs[6]._id,
            user: dev1._id,
            date: new Date(),
            hours: 4,
            activity: 'Development',
            comment: 'Connection pool analysis and tuning for high-load scenarios'
        }
    ]);
    console.log('⏱️ Created time logs');

    console.log('\n🎉 Seed complete! Login credentials:');
    console.log('  Admin:     admin@demo.com / password123');
    console.log('  Developer: developer@demo.com / password123');
    console.log('  Tester:    tester@demo.com / password123');
    console.log('  Manager:   manager@demo.com / password123');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
