import React, { useEffect, useState } from 'react';
import { workPackageAPI } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { TypeBadge } from '../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter } from 'lucide-react';

export default function GanttCharts() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        workPackageAPI.getAll({ limit: 1000 })
            .then(res => setBugs(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>;

    // Filter logic
    let timelineBugs = bugs.filter(b => b.startDate && b.dueDate);
    if (filterDate) {
        timelineBugs = timelineBugs.filter(b => b.startDate.startsWith(filterDate) || b.dueDate.startsWith(filterDate));
    }

    const canCreate = user?.role === 'Admin' || user?.role === 'Tester';

    const headerContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Gantt Charts</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
                <div className="filter-input-group" style={{ position: 'relative' }}>
                    <input 
                        type="month" 
                        className="form-input" 
                        value={filterDate} 
                        onChange={e => setFilterDate(e.target.value)} 
                    />
                </div>
                {canCreate && (
                    <button className="btn-primary" onClick={() => navigate('/work-packages?create=true')}>
                        <Plus size={16} /> Create
                    </button>
                )}
            </div>
        </div>
    );

    if (timelineBugs.length === 0) {
        return (
            <div className="animate-fade-in">
                {headerContent}
                <div className="card empty-state" style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Timeline is Empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>No work packages found with both Start Date and Due Date for this period.</p>
                    {canCreate && (
                        <button className="btn-primary" onClick={() => navigate('/work-packages?create=true')}>
                            <Plus size={16} /> Add First Plan
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Determine timeline boundaries
    const timestamps = timelineBugs.flatMap(b => [new Date(b.startDate).getTime(), new Date(b.dueDate).getTime()]);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const totalDuration = maxTime - minTime || 86400000; // avoid div by 0

    // Compute styles
    const getBarStyle = (start, end) => {
        const sTime = new Date(start).getTime();
        const eTime = new Date(end).getTime();
        const leftPct = ((sTime - minTime) / totalDuration) * 100;
        const widthPct = ((eTime - sTime) / totalDuration) * 100;
        return {
            left: `${leftPct}%`,
            width: `${Math.max(widthPct, 1)}%` // min 1% width
        };
    };

    const formatDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return (
        <div className="animate-fade-in">
            {headerContent}

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <div style={{ minWidth: '800px', padding: '24px' }}>
                    {/* Timeline Header Axis */}
                    <div style={{ display: 'flex', marginLeft: '240px', position: 'relative', height: '30px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                        <div style={{ position: 'absolute', left: '0' }}>{formatDate(minTime)}</div>
                        <div style={{ position: 'absolute', right: '0' }}>{formatDate(maxTime)}</div>
                    </div>

                    {/* Timeline Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {timelineBugs.map(wp => {
                            const style = getBarStyle(wp.startDate, wp.dueDate);
                            const bg = wp.type === 'BUG' ? '#ef4444' : wp.type === 'FEATURE' ? '#3b82f6' : '#a855f7';
                            
                            return (
                                <div key={wp._id} style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* Label Section */}
                                    <div style={{ width: '240px', flexShrink: 0, paddingRight: '16px', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <TypeBadge type={wp.type} />
                                        <Link to={`/work-packages/${wp._id}`} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-main)', textDecoration: 'none' }}>
                                            {wp.subject}
                                        </Link>
                                    </div>
                                    
                                    {/* Track Section */}
                                    <div style={{ flex: 1, position: 'relative', height: '24px', background: 'var(--bg-main)', borderRadius: '12px', overflow: 'hidden' }}>
                                        <div 
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                bottom: 0,
                                                left: style.left,
                                                width: style.width,
                                                background: bg,
                                                borderRadius: '12px',
                                                opacity: 0.85
                                            }}
                                            title={`Start: ${formatDate(wp.startDate)} | Due: ${formatDate(wp.dueDate)}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
