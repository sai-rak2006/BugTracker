import React, { useEffect, useState } from 'react';
import { workPackageAPI } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/Badge';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend
} from 'recharts';
import { Target, Bug, CheckCircle, Clock } from 'lucide-react';

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workPackageAPI.getAnalytics()
            .then(r => setAnalytics(r.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>;

    const { byStatus = [], byType = [], byPriority = [], byAssignee = [], summary = {} } = analytics || {};

    const STATUS_COLORS = { 'New': '#3b82f6', 'In Progress': '#eab308', 'Closed': '#22c55e', 'On Hold': '#64748b', 'Rejected': '#ef4444' };
    const TYPE_COLORS = { 'BUG': '#ef4444', 'FEATURE': '#3b82f6', 'EPIC': '#a855f7', 'TASK': '#f59e0b' };
    const PRIORITY_COLORS = { 'Low': '#22c55e', 'Normal': '#3b82f6', 'High': '#f59e0b', 'Urgent': '#ef4444' };

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Analytics Dashboard</h1>

            {/* KPI Cards */}
            <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--spacing-3)' }}>
                {[
                    { label: 'Total Issues', value: summary.total || 0, icon: Target, bg: '#dbeafe', color: '#1e40af' },
                    { label: 'Closed', value: summary.closed || 0, icon: CheckCircle, bg: '#dcfce7', color: '#166534' },
                    { label: 'Open', value: summary.open || 0, icon: Clock, bg: '#fef08a', color: '#854d0e' },
                    { label: 'Pending', value: summary.pending || 0, icon: Bug, bg: '#fee2e2', color: '#991b1b' },
                ].map((m, i) => (
                    <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <m.icon size={24} />
                        </div>
                        <div>
                            <div className="metric-label">{m.label}</div>
                            <div className="metric-value">{m.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-grid-2">
                {/* Status Bar Chart */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: '16px' }}>Issues by Status</h2>
                    <div style={{ height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byStatus} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                    {byStatus.map(e => <Cell key={e.name} fill={STATUS_COLORS[e.name] || '#94a3b8'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Type Pie Chart */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: '16px' }}>Issues by Type</h2>
                    <div style={{ height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={byType} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                                    {byType.map(e => <Cell key={e.name} fill={TYPE_COLORS[e.name] || '#94a3b8'} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Horizontal Bar */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: '16px' }}>Issues by Priority</h2>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byPriority} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={60} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                                    {byPriority.map(e => <Cell key={e.name} fill={PRIORITY_COLORS[e.name] || '#94a3b8'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bugs per User Horizontal Bar */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: '16px' }}>Bugs per User</h2>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byAssignee} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Summary Table */}
                <div className="card" style={{ padding: 0 }}>
                    <div className="card-header"><h2 className="card-title">Status Summary</h2></div>
                    <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
                        <table className="data-table">
                            <thead><tr><th>Status</th><th>Count</th><th>Share</th><th>Distribution</th></tr></thead>
                            <tbody>
                                {byStatus.map(s => {
                                    const pct = summary.total > 0 ? Math.round((s.count / summary.total) * 100) : 0;
                                    return (
                                        <tr key={s.name}>
                                            <td><StatusBadge status={s.name} /></td>
                                            <td style={{ fontWeight: 600 }}>{s.count}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{pct}%</td>
                                            <td style={{ minWidth: '100px' }}>
                                                <div className="progress-container" style={{ height: '6px' }}>
                                                    <div className="progress-fill" style={{ width: `${pct}%`, background: STATUS_COLORS[s.name] || '#94a3b8' }} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
