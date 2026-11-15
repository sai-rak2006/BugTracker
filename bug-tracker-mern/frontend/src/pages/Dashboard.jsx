import React, { useEffect, useState } from 'react';
import { workPackageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [recentWPs, setRecentWPs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            workPackageAPI.getAnalytics(),
            workPackageAPI.getAll({ sort: '-createdAt', limit: 5 })
        ]).then(([anRes, wpRes]) => {
            setAnalytics(anRes.data.data);
            setRecentWPs(wpRes.data.data || []);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>;
    }

    const { summary = {}, byStatus = [] } = analytics || {};
    
    // Custom mapping for chart colors
    const STATUS_COLORS = {
        'New': '#3b82f6', 
        'In Progress': '#eab308', 
        'Closed': '#22c55e',
        'On Hold': '#64748b', 
        'Rejected': '#ef4444'
    };

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">
                <span>Overview</span>
            </h1>

            {/* 4 STAT CARDS (TOP ROW) */}
            <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--spacing-3)' }}>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="metric-label">Total Issues</div>
                    <div className="metric-value">{summary.total || 0}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="metric-label">In Progress</div>
                    <div className="metric-value" style={{ color: 'var(--status-in-progress)' }}>{summary.inProgress || 0}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="metric-label">Closed</div>
                    <div className="metric-value" style={{ color: 'var(--status-closed)' }}>{summary.closed || 0}</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="metric-label">Open Issues</div>
                    <div className="metric-value" style={{ color: 'var(--status-new)' }}>{summary.open || 0}</div>
                </div>
            </div>

            {/* BAR CHART BELOW (FULL WIDTH) */}
            <div className="card" style={{ marginBottom: 'var(--spacing-3)' }}>
                <h2 className="card-title" style={{ marginBottom: 'var(--spacing-3)' }}>Issues by Status</h2>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={byStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip 
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} 
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                {byStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RECENT ACTIVITY & OTHERS */}
            <div className="form-grid-2">
                <div className="card">
                    <div className="card-header" style={{ padding: '0 0 16px 0' }}>
                        <span className="card-title">Recent Work Packages</span>
                        <Link to="/work-packages" className="btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>View All</Link>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        {recentWPs.map(wp => (
                            <Link 
                                to={`/work-packages/${wp._id}`} 
                                key={wp._id}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 0', borderBottom: '1px solid var(--border-color)',
                                    color: 'var(--text-main)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <TypeBadge type={wp.type} />
                                    <span style={{ fontWeight: '500', fontSize: '13px' }}>{wp.subject}</span>
                                </div>
                                <StatusBadge status={wp.status} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" style={{ padding: '0 0 16px 0' }}>
                        <span className="card-title">Project Details</span>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>ABOUT</strong>
                            <p style={{ fontSize: '13px' }}>
                                This is the BugTracker Pro system. Track all your issues, bugs, and epics with granular status details, 
                                time logging, and member collaboration tools.
                            </p>
                        </div>
                        <div>
                            <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>TEAM LEAD</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Avatar name={user?.name} size="sm" />
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name} (You)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
