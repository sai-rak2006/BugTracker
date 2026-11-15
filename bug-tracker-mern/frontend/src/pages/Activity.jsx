import React, { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import { formatDistanceToNow } from 'date-fns';
import { Clock, CheckCircle, Edit, MessageSquare, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Activity() {
    const [data, setData] = useState({ activities: [], total: 0, pages: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadActivity = async () => {
            setLoading(true);
            try {
                const res = await activityAPI.getAll({ page, limit: 20 });
                setData({
                    activities: res.data.data,
                    total: res.data.pagination.total,
                    pages: res.data.pagination.pages
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadActivity();
    }, [page]);

    const getIcon = (action) => {
        switch (action) {
            case 'created': return <PlusCircle size={16} className="text-blue-500" />;
            case 'status_changed': return <CheckCircle size={16} className="text-green-500" />;
            case 'commented': return <MessageSquare size={16} className="text-purple-500" />;
            case 'updated': return <Edit size={16} className="text-orange-500" />;
            default: return <Clock size={16} className="text-gray-500" />;
        }
    };

    if (loading && data.activities.length === 0) {
        return <div className="flex justify-center p-12"><Spinner /></div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="page-title mb-6">
                <div>Activity Feed <span style={{fontSize: '14px', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '8px'}}>{data.total} events</span></div>
            </div>

            <div className="card p-0">
                {data.activities.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No activity recorded yet in this project.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {data.activities.map((act) => (
                            <div key={act._id} style={{ 
                                padding: '16px 24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '16px',
                                borderBottom: '1px solid var(--border-color)',
                                transition: 'background 0.2s'
                            }} className="hover:bg-gray-50">
                                {/* LEFT: Avatar */}
                                <div style={{ flexShrink: 0 }}>
                                    <Avatar name={act.actor?.name} size="md" />
                                </div>

                                {/* CENTER: Event Description */}
                                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{act.actor?.name}</span>
                                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{act.detail}</span>
                                    {act.workPackage && (
                                        <Link 
                                            to={`/work-packages/${act.workPackage._id}`}
                                            style={{ 
                                                fontSize: '13px', 
                                                fontWeight: '500', 
                                                color: 'var(--color-primary)',
                                                textDecoration: 'none',
                                                marginLeft: '4px'
                                            }}
                                        >
                                            #{act.workPackage._id.substring(act.workPackage._id.length - 4)} {act.workPackage.subject}
                                        </Link>
                                    )}
                                </div>

                                {/* RIGHT: Icon & Timestamp */}
                                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {getIcon(act.action)}
                                        {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {data.pages > 1 && (
                <div className="mt-6">
                    <Pagination page={page} pages={data.pages} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
