const express = require('express');
const router = express.Router();
const {
    getWorkPackages,
    getWorkPackage,
    createWorkPackage,
    updateWorkPackage,
    deleteWorkPackage,
    getAnalytics
} = require('../controllers/workPackageController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import nested routers
const commentRouter = require('./comments');
const timeLogRouter = require('./timeLogs');

router.use(protect);

// Analytics — must be before /:id
router.get('/analytics', getAnalytics);

// Main resource routes
router.route('/')
    .get(getWorkPackages)
    .post(authorize('Admin', 'Tester'), createWorkPackage);

router.route('/:id')
    .get(getWorkPackage)
    .put(authorize('Admin', 'Developer'), updateWorkPackage)
    .delete(authorize('Admin', 'Developer'), deleteWorkPackage);

// Re-route into nested resource routers
router.use('/:workPackageId/comments', commentRouter);
router.use('/:workPackageId/timelogs', timeLogRouter);

module.exports = router;
