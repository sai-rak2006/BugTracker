import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BugForm from './BugForm';
import BugList from './BugList';

const Dashboard = () => {
    const [bugs, setBugs] = useState([]);
    const { user, logout } = useAuth();

    const fetchBugs = async () => {
        const res = await axios.get('/api/bugs');
        setBugs(res.data);
    };

    useEffect(() => {
        fetchBugs();
    }, []);

    const totalBugs = bugs.length;
    const openBugs = bugs.filter(b => b.status === 'Open').length;
    const progressBugs = bugs.filter(b => b.status === 'In Progress').length;
    const resolvedBugs = bugs.filter(b => b.status === 'Resolved').length;

    return (
        <div className="dashboard">
            <header className="header">
                <div className="header-info">
                    <h1>BugTracker Pro</h1>
                    <p className="welcome-text">Connected as <strong>{user.name}</strong> • <span className="role-tag">{user.role}</span></p>
                </div>
                <button onClick={logout} className="logout-btn">Log Out ➔</button>
            </header>

            <div className="stats">
                <div className="stat-card total">
                    <h3>Total Backlog</h3>
                    <p>{totalBugs}</p>
                </div>
                <div className="stat-card open">
                    <h3>Open Tickets</h3>
                    <p>{openBugs}</p>
                </div>
                <div className="stat-card progress">
                    <h3>Active Work</h3>
                    <p>{progressBugs}</p>
                </div>
                <div className="stat-card resolved">
                    <h3>Resolved</h3>
                    <p>{resolvedBugs}</p>
                </div>
            </div>

            <main className="main-content">
                <section className="list-section">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Ticket Backlog</h2>
                    <BugList bugs={bugs} onRefresh={fetchBugs} />
                </section>
                <aside className="form-section">
                    <BugForm onBugAdded={fetchBugs} />
                </aside>
            </main>
        </div>
    );
};

export default Dashboard;
