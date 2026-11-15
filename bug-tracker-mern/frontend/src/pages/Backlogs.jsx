import React, { useEffect, useState } from 'react';
import { workPackageAPI } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Link } from 'react-router-dom';

const PRIORITIES = ['Urgent', 'High', 'Normal', 'Low'];

export default function Backlogs() {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workPackageAPI.getAll({ limit: 1000, sort: '-createdAt' })
            .then(res => setBugs(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>;

    const grouped = PRIORITIES.map(p => ({
        priority: p,
        items: bugs.filter(b => b.priority === p)
    })).filter(g => g.items.length > 0);

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Backlogs</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
                {grouped.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No work packages found in the backlog.
                    </div>
                ) : (
                    grouped.map(group => (
                        <div key={group.priority} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div className="card-header" style={{ padding: '16px 20px', background: 'var(--color-secondary)' }}>
                                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                    {group.priority} Priority 
                                    <span className="badge" style={{ background: 'var(--bg-main)' }}>{group.items.length}</span>
                                </h2>
                            </div>
                            <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
                                <table className="data-table">
                                    <tbody>
                                        {group.items.map(wp => (
                                            <tr key={wp._id}>
                                                <td style={{ width: '80px', color: 'var(--text-muted)', fontSize: '12px' }}>#{wp._id.slice(-6)}</td>
                                                <td style={{ width: '100px' }}><TypeBadge type={wp.type} /></td>
                                                <td>
                                                    <Link to={`/work-packages/${wp._id}`} style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                                                        {wp.subject}
                                                    </Link>
                                                </td>
                                                <td style={{ width: '140px' }}><StatusBadge status={wp.status} /></td>
                                                <td style={{ width: '180px', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                        <Avatar name={wp.assignee?.name} size="sm" />
                                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{wp.assignee?.name || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
