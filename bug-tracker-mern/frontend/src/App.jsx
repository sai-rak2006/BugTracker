import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import WorkPackages from './pages/WorkPackages';
import WorkPackageDetail from './pages/WorkPackageDetail';
import Analytics from './pages/Analytics';
import Members from './pages/Members';
import Profile from './pages/Profile';
import Boards from './pages/Boards';
import Backlogs from './pages/Backlogs';
import GanttCharts from './pages/GanttCharts';
import TimeCosts from './pages/TimeCosts';
import Activity from './pages/Activity';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

// Placeholder page for routes under development
const PlaceholderPage = ({ title }) => (
    <div className="page-container">
        <div className="card empty-state" style={{ minHeight: '300px' }}>
            <div className="empty-state">
                <div className="text-4xl mb-3">🚧</div>
                <h2 className="text-base font-semibold mb-2">{title}</h2>
                <p className="text-sm" style={{ color: 'var(--op-text-muted)' }}>
                    This page is coming soon.
                </p>
            </div>
        </div>
    </div>
);

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes inside MainLayout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="work-packages" element={<WorkPackages />} />
                    <Route path="work-packages/:id" element={<WorkPackageDetail />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="members" element={user?.role === 'Admin' ? <Members /> : <Navigate to="/dashboard" replace />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="boards" element={<Boards />} />
                    <Route path="backlogs" element={<Backlogs />} />
                    <Route path="gantt" element={<GanttCharts />} />
                    <Route path="time-costs" element={<TimeCosts />} />

                    {/* Placeholder routes — sidebar items not yet built */}
                    <Route path="activity" element={<Activity />} />
                    <Route path="meetings" element={<PlaceholderPage title="Meetings" />} />
                    <Route path="wiki" element={<PlaceholderPage title="Wiki" />} />
                    <Route path="news" element={<PlaceholderPage title="News" />} />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
