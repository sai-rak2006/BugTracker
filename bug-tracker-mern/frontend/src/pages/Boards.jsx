import React, { useEffect, useState } from 'react';
import { workPackageAPI } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { TypeBadge, PriorityBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Link } from 'react-router-dom';

const COLUMNS = [
    { id: 'New', title: 'New' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Closed', title: 'Closed' }
];

export default function Boards() {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggingId, setDraggingId] = useState(null);

    const loadData = async () => {
        try {
            // Fetch everything (limit 1000 for board)
            const res = await workPackageAPI.getAll({ limit: 1000 });
            setBugs(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDragStart = (e, wpId) => {
        setDraggingId(wpId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        if (!draggingId) return;

        // Optimistic UI update
        const wpToUpdate = bugs.find(b => b._id === draggingId);
        if (wpToUpdate && wpToUpdate.status !== targetStatus) {
            setBugs(prev => prev.map(b => b._id === draggingId ? { ...b, status: targetStatus } : b));
            try {
                // Call API
                await workPackageAPI.update(draggingId, { status: targetStatus });
            } catch (err) {
                console.error(err);
                // Revert on failure
                loadData();
            }
        }
        setDraggingId(null);
    };

    if (loading) return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>;

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h1 className="page-title">Current Board</h1>
            
            <div style={{ display: 'flex', gap: '24px', flex: 1, overflowX: 'auto', paddingBottom: '20px' }}>
                {COLUMNS.map(col => {
                    const columnBugs = bugs.filter(b => {
                        if (col.id === 'Closed') return b.status === 'Closed' || b.status === 'Rejected' || b.status === 'On Hold';
                        return b.status === col.id;
                    });

                    return (
                        <div 
                            key={col.id}
                            style={{ 
                                flex: 1, 
                                minWidth: '320px', 
                                background: 'var(--color-secondary)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{col.title}</h3>
                                <div style={{ fontSize: '12px', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '12px' }}>{columnBugs.length}</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                                {columnBugs.map(wp => (
                                    <div 
                                        key={wp._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, wp._id)}
                                        className="card"
                                        style={{ 
                                            padding: '16px', 
                                            cursor: 'grab', 
                                            opacity: draggingId === wp._id ? 0.5 : 1,
                                            borderLeft: `4px solid ${wp.type === 'BUG' ? '#ef4444' : wp.type === 'EPIC' ? '#a855f7' : '#3b82f6'}`
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>#{wp._id.slice(-6)}</span>
                                            <TypeBadge type={wp.type} />
                                        </div>
                                        <Link to={`/work-packages/${wp._id}`} style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.4 }}>
                                            {wp.subject}
                                        </Link>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <PriorityBadge priority={wp.priority} />
                                            <Avatar name={wp.assignee?.name} size="sm" />
                                        </div>
                                    </div>
                                ))}
                                {columnBugs.length === 0 && (
                                    <div style={{ padding: '24px', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Drop items here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
