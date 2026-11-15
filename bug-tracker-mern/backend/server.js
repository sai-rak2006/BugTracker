require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

// Route files
const authRoutes        = require('./routes/auth');
const workPackageRoutes = require('./routes/workPackages');
const userRoutes        = require('./routes/users');
const projectRoutes     = require('./routes/projects');
const timeLogRoutes     = require('./routes/timeLogs');
const bugRoutes         = require('./routes/bugs');
const activityRoutes    = require('./routes/activity');
const commentRoutes     = require('./routes/comments');
const supportRoutes     = require('./routes/support');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth',          authRoutes);
app.use('/api/work-packages', workPackageRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/timelog',       timeLogRoutes);
app.use('/api/time-logs',     timeLogRoutes); // Backward compatibility
app.use('/api/bugs',          bugRoutes);
app.use('/api/activity',      activityRoutes);
app.use('/api/comments',      commentRoutes);
app.use('/api/support',       supportRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();

    // Auto-seed in development with in-memory DB data
    if (process.env.NODE_ENV !== 'production') {
        try {
            const seedFn = require('./seedDev');
            await seedFn();
            console.log('🌱 Dev data seeded successfully');
        } catch (err) {
            console.warn('⚠️  Seed skipped:', err.message);
        }
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
})();
