import React, { useEffect, useState } from 'react';
import { timeLogAPI } from '../services/api';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import { Link } from 'react-router-dom';

export default function TimeCosts() {
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            timeLogAPI.getAll(),
            timeLogAPI.getGlobalSummary()
        ])
        .then(([logsRes, sumRes]) => {
            setLogs(logsRes.data.data || []);
            setSummary(sumRes.data.data || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>;

    const totalHours = summary.reduce((acc, curr) => acc + curr.totalHours, 0);

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Time & Costs</h1>

            <div className="form-grid-2" style={{ marginBottom: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div className="metric-label">Total Time Logged</div>
                    <div className="metric-value">{totalHours} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>hours</span></div>
                </div>
                
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-header"><h2 className="card-title">Activity Breakdown</h2></div>
                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Hours</th>
                                    <th>Entries</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.map(s => (
                                    <tr key={s._id}>
                                        <td style={{ fontWeight: 500 }}>{s._id}</td>
                                        <td>{s.totalHours} h</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{s.count} logs</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="card-header"><h2 className="card-title">Detailed Time Logs</h2></div>
                <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Work Package</th>
                                <th>Activity</th>
                                <th>Comment</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No time logs found.</td></tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log._id}>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                            {new Date(log.date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Avatar name={log.user?.name} size="sm" />
                                                <span style={{ fontSize: '13px' }}>{log.user?.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {log.workPackage ? (
                                                <Link to={`/work-packages/${log.workPackage._id}`} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-main)' }}>
                                                    #{log.workPackage._id.slice(-6)} {log.workPackage.subject}
                                                </Link>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>Deleted</span>
                                            )}
                                        </td>
                                        <td><span className="badge" style={{ background: 'var(--color-secondary)' }}>{log.activity}</span></td>
                                        <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{log.comment || '—'}</td>
                                        <td style={{ fontWeight: 600 }}>{log.hours} h</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
