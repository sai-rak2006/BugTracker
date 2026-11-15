import React, { useEffect, useState, useCallback, useRef } from 'react';
import { workPackageAPI, userAPI } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { StatusBadge, TypeBadge, PriorityBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Filter, Bug } from 'lucide-react';

const STATUS_OPTIONS = ['New', 'In Progress', 'Closed', 'On Hold', 'Rejected'];
const TYPE_OPTIONS = ['BUG', 'FEATURE', 'EPIC', 'TASK'];
const PRIORITY_OPTIONS = ['Low', 'Normal', 'High', 'Urgent'];

function CreateModal({ isOpen, onClose, onCreated }) {
    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        subject: '', description: '', type: 'BUG', status: 'New', priority: 'Normal',
        assignee: '', category: '', version: '', startDate: '', dueDate: '', 
        work: '', remainingWork: ''
    });

    useEffect(() => {
        if (isOpen && users.length === 0) {
            userAPI.getAll().then(res => setUsers(res.data.data)).catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form };
            Object.keys(payload).forEach(k => {
                if (payload[k] === '') delete payload[k];
            });
            const res = await workPackageAPI.create(payload);
            toast.success(res.data.message || 'Work package created successfully');
            onCreated();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create work package');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} onClose={onClose} title="New Work Package" size="lg"
            footer={<>
                <button onClick={onClose} className="btn-secondary">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary" disabled={saving}>
                    {saving ? <Spinner size="sm" color="white" /> : 'Create'}
                </button>
            </>}
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Subject (Title)</label>
                    <input autoFocus className="form-input" value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} required placeholder="Enter clear summary" />
                </div>
                
                <div className="form-grid-2">
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select className="form-select" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                            {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
                            {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select className="form-select" value={form.priority} onChange={e=>setForm({...form, priority: e.target.value})}>
                            {PRIORITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Assignee</label>
                        <select className="form-select" value={form.assignee} onChange={e=>setForm({...form, assignee: e.target.value})}>
                            <option value="">— Unassigned —</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input className="form-input" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Version</label>
                        <input className="form-input" value={form.version} onChange={e=>setForm({...form, version: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-input" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input type="date" className="form-input" value={form.dueDate} onChange={e=>setForm({...form, dueDate: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Work (hrs)</label>
                        <input type="number" step="0.5" className="form-input" value={form.work} onChange={e=>setForm({...form, work: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Remaining Work (hrs)</label>
                        <input type="number" step="0.5" className="form-input" value={form.remainingWork} onChange={e=>setForm({...form, remainingWork: e.target.value})} />
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default function WorkPackages() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [data, setData] = useState({ workPackages: [], total: 0, pages: 0 });
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(searchParams.get('create') === 'true');
    
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        status: '',
        priority: '',
        page: 1,
        sort: '-createdAt'
    });
    const searchDebounce = useRef(null);

    const loadData = useCallback(async (currentFilters) => {
        setLoading(true);
        try {
            const params = {
                page: currentFilters.page,
                limit: 15,
                sort: currentFilters.sort,
                ...(currentFilters.search && { search: currentFilters.search }),
                ...(currentFilters.type && { type: currentFilters.type }),
                ...(currentFilters.status && { status: currentFilters.status }),
                ...(currentFilters.priority && { priority: currentFilters.priority })
            };
            const res = await workPackageAPI.getAll(params);
            
            let wps = res.data.data || [];
            
            // Build hierarchy map
            const parentMap = {};
            wps.forEach(wp => {
                if (wp.parent) {
                    if (!parentMap[wp.parent]) parentMap[wp.parent] = [];
                    parentMap[wp.parent].push(wp);
                }
            });

            // Only show root nodes + their children directly below them
            const roots = wps.filter(wp => !wp.parent);
            const ordered = [];
            roots.forEach(root => {
                ordered.push({ ...root, isRoot: true });
                if (parentMap[root._id]) {
                    parentMap[root._id].forEach(child => {
                        ordered.push({ ...child, isChild: true });
                    });
                }
            });
            // If we have items without roots in this page view just add them to the end
            wps.forEach(wp => {
                if (wp.parent && !roots.find(r => r._id === wp.parent)) {
                    ordered.push(wp);
                }
            });

            setData({ 
                workPackages: ordered, 
                total: res.data.pagination?.total || 0, 
                pages: res.data.pagination?.pages || 0 
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(filters); }, [filters, loadData]);

    const handleSearchChange = (val) => {
        if(searchDebounce.current) clearTimeout(searchDebounce.current);
        searchDebounce.current = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: val, page: 1 }));
        }, 500);
    };

    return (
        <div className="animate-fade-in">
            <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    Work Packages 
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '12px' }}>
                        {data.total} items
                    </span>
                </div>
                {(user?.role === 'Admin' || user?.role === 'Tester') && (
                    <button 
                        className="btn-primary" 
                        style={{ 
                            height: '40px', 
                            padding: '0 20px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }} 
                        onClick={() => setShowCreate(true)}
                    >
                        <Plus size={18} /> Create Work Package
                    </button>
                )}
            </div>

            {/* FILTER BAR - EXACTLY ON ONE ROW */}
            <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', marginBottom: '24px' }}>
                <div className="filter-input-group" style={{ flexGrow: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        className="form-input" 
                        style={{ paddingLeft: '32px', width: '100%' }} 
                        placeholder="Search by ID or subject..." 
                        onChange={e => handleSearchChange(e.target.value)} 
                    />
                </div>
                
                <select className="form-select" style={{ width: '150px', flexShrink: 0 }} value={filters.type} onChange={e => setFilters(f => ({...f, type: e.target.value, page: 1}))}>
                    <option value="">All Types</option>
                    {TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>

                <select className="form-select" style={{ width: '150px', flexShrink: 0 }} value={filters.status} onChange={e => setFilters(f => ({...f, status: e.target.value, page: 1}))}>
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>

                <select className="form-select" style={{ width: '150px', flexShrink: 0 }} value={filters.priority} onChange={e => setFilters(f => ({...f, priority: e.target.value, page: 1}))}>
                    <option value="">All Priorities</option>
                    {PRIORITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                
                <button className="btn-secondary" style={{ flexShrink: 0 }} onClick={() => setFilters({ search: '', type: '', status: '', priority: '', page: 1, sort: '-createdAt' })}>
                    <Filter size={14} /> Clear
                </button>
            </div>

            {/* TABLE */}
            <div className="table-container">
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}><Spinner /></div>
                ) : data.workPackages.length === 0 ? (
                    <EmptyState 
                        icon={Bug} 
                        title="No work packages found" 
                        description="Try adjusting your filters, or create a new work package to get started." 
                        action={<button className="btn-primary" onClick={() => setShowCreate(true)}>Create Package</button>}
                    />
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Assignee</th>
                                <th>Due Date</th>
                                <th style={{ width: '100px' }}>% Done</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.workPackages.map((wp) => (
                                <tr key={wp._id} onClick={() => navigate(`/work-packages/${wp._id}`)}>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                        #{wp._id.substring(wp._id.length - 4)}
                                    </td>
                                    <td>
                                        <div style={{ marginLeft: wp.isChild ? '24px' : '0' }}>
                                            <TypeBadge type={wp.type} />
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: '500' }}>{wp.subject}</td>
                                    <td><StatusBadge status={wp.status} /></td>
                                    <td><PriorityBadge priority={wp.priority} /></td>
                                    <td>
                                        {wp.assignee ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Avatar name={wp.assignee.name} size="sm" />
                                                <span style={{ fontSize: '13px' }}>{wp.assignee.name}</span>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Unassigned</span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: '13px' }}>
                                        {wp.dueDate ? new Date(wp.dueDate).toLocaleDateString() : '—'}
                                    </td>
                                    <td>
                                        <div className="progress-container">
                                            <div className="progress-fill" style={{ width: `${wp.progress || 0}%`, background: wp.progress >= 100 ? 'var(--status-closed)' : 'var(--color-primary)' }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PAGINATION */}
            {!loading && data.pages > 1 && (
                <Pagination 
                    page={filters.page} 
                    pages={data.pages} 
                    onPageChange={(p) => setFilters(f => ({ ...f, page: p }))} 
                />
            )}

            {/* CREATE MODAL */}
            <CreateModal 
                isOpen={showCreate} 
                onClose={() => {
                    setShowCreate(false);
                    if(searchParams.get('create')) {
                        searchParams.delete('create');
                        setSearchParams(searchParams);
                    }
                }} 
                onCreated={() => loadData(filters)} 
            />
        </div>
    );
}
