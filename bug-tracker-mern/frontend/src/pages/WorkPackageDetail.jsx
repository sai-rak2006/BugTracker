import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workPackageAPI, userAPI } from '../services/api';
import { StatusBadge, TypeBadge, PriorityBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { Clock, MessageSquare, Play, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STATUS_OPTIONS = ['New', 'In Progress', 'Closed', 'On Hold', 'Rejected'];
const TYPE_OPTIONS = ['BUG', 'FEATURE', 'EPIC', 'TASK'];
const PRIORITY_OPTIONS = ['Low', 'Normal', 'High', 'Urgent'];

export default function WorkPackageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [wp, setWp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState([]);
    
    // Quick Inline form for attributes
    const [form, setForm] = useState({});
    
    // Comments
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    // Modals
    const [showLogTime, setShowLogTime] = useState(false);
    const [timeLogs, setTimeLogs] = useState([]);

    const loadData = async () => {
        try {
            const [wpRes, comRes, timeRes, usersRes] = await Promise.all([
                workPackageAPI.getById(id),
                workPackageAPI.getComments(id),
                workPackageAPI.getTimeLogs(id),
                userAPI.getAll()
            ]);
            setWp(wpRes.data.data);
            setForm({
                ...wpRes.data.data,
                assignee: wpRes.data.data.assignee?._id || wpRes.data.data.assignee || ''
            });
            setComments(comRes.data.data);
            setTimeLogs(timeRes.data.data);
            setUsers(usersRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [id]);

    const handleSave = async (e) => {
        e?.preventDefault();
        setSaving(true);
        try {
            const res = await workPackageAPI.update(id, form);
            setWp(res.data.data);
            setForm(res.data.data);
            toast.success(res.data.message || 'Work package updated successfully');
        } catch(err) {
            toast.error(err.response?.data?.message || 'Failed to save details');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this work package? This action cannot be undone.")) return;
        setSaving(true);
        try {
            const res = await workPackageAPI.delete(id);
            toast.success(res.data.message || "Work package deleted successfully");
            navigate('/work-packages');
        } catch(err) {
            toast.error(err.response?.data?.message || "Failed to delete");
        } finally {
            setSaving(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if(!newComment.trim()) return;
        setSaving(true);
        try {
            await workPackageAPI.addComment(id, { text: newComment });
            toast.success('Comment added');
            setNewComment('');
            const res = await workPackageAPI.getComments(id);
            setComments(res.data.data);
        } catch(err) {
            toast.error(err.response?.data?.message || 'Failed to add comment');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center'}}><Spinner size="lg" /></div>;
    if (!wp) return <h2 className="text-center mt-4">Work package not found</h2>;

    const totalLogged = timeLogs.reduce((acc, log) => acc + log.hours, 0);

    const canEditDetails = user?.role === 'Admin' || user?.role === 'Developer';
    const canComment = user?.role !== 'Manager';

    return (
        <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            
            {/* LEFT AREA: Title, Description, Comments */}
            <div style={{ flex: '1 1 60%', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ padding: '0' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <TypeBadge type={wp.type} />
                                <span style={{ color: 'var(--text-muted)' }}>#{wp._id.substring(wp._id.length - 6)}</span>
                            </div>
                            {(user?.role === 'Admin' || user?._id === wp.reporter?._id || user?._id === wp.reporter) && (
                                <button className="btn-danger" onClick={handleDelete} style={{ padding: '6px 12px', fontSize: '13px' }}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            )}
                        </div>
                        
                        <input 
                            className="form-input" 
                            style={{ fontSize: '20px', fontWeight: 'bold', padding: '8px 12px', border: '1px solid transparent', background: 'transparent', marginLeft: '-12px', width: 'calc(100% + 24px)' }} 
                            value={form.subject} 
                            onChange={e => setForm({...form, subject: e.target.value})}
                            onBlur={handleSave}
                            disabled={!canEditDetails}
                        />
                    </div>
                    
                    <div style={{ padding: '24px' }}>
                        <label className="form-label" style={{ marginBottom: '8px' }}>Description</label>
                        <textarea 
                            className="form-textarea" 
                            style={{ minHeight: '150px', border: '1px solid transparent', background: 'var(--bg-app)', padding: '16px' }}
                            placeholder="Add a description..."
                            value={form.description || ''}
                            onChange={e => setForm({...form, description: e.target.value})}
                            onBlur={handleSave}
                            disabled={!canEditDetails}
                        />
                    </div>
                </div>

                {/* COMMENTS BLOCK */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}><MessageSquare size={14} style={{ display: 'inline', marginRight: '6px' }}/>Activity & Comments</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        {comments.map(c => (
                            <div key={c._id} style={{ display: 'flex', gap: '12px' }}>
                                <Avatar name={c.user?.name} size="sm" />
                                <div style={{ flexGrow: 1, background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '12px' }}>{c.user?.name}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px' }}>{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {canComment && (
                        <form onSubmit={handleComment} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <Avatar name={user?.name} size="sm" />
                            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <textarea 
                                    className="form-textarea" 
                                    style={{ minHeight: '80px' }}
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                />
                                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }} disabled={!newComment.trim()}>
                                    Comment
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* RIGHT AREA: STRICT 2 COL GRID FORM */}
            <div style={{ flex: '1 1 35%', minWidth: '350px' }}>
                <div className="card sticky" style={{ top: '84px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 className="card-title">Details</h3>
                        {saving && <Spinner size="sm" />}
                    </div>

                    {/* CLEAN TABLE FORMAT FOR DETAILS */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {/* TYPE */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', width: '40%' }}>Type</td>
                                <td style={{ padding: '12px 0' }}>
                                    <select className="form-select" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.type} onChange={e=>{setForm({...form, type: e.target.value}); workPackageAPI.update(id, {...form, type: e.target.value}).then(res=>{loadData(); toast.success(res.data.message || 'Updated');}).catch(err=>toast.error(err.response?.data?.message || 'Failed to update'))}} disabled={!canEditDetails || saving}>
                                        {TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </td>
                            </tr>

                            {/* STATUS */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Status</td>
                                <td style={{ padding: '12px 0' }}>
                                    <select className="form-select" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px', fontWeight: '600' }} value={form.status} onChange={e=>{setForm({...form, status: e.target.value}); workPackageAPI.update(id, {...form, status: e.target.value}).then(res=>{loadData(); toast.success(res.data.message || 'Status updated');}).catch(err=>toast.error(err.response?.data?.message || 'Failed to update'))}} disabled={(!canEditDetails && user?.role !== 'Tester') || saving}>
                                        {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </td>
                            </tr>

                            {/* PRIORITY */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Priority</td>
                                <td style={{ padding: '12px 0' }}>
                                    <select className="form-select" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.priority} onChange={e=>{setForm({...form, priority: e.target.value}); workPackageAPI.update(id, {...form, priority: e.target.value}).then(res=>{loadData(); toast.success(res.data.message || 'Priority updated');}).catch(err=>toast.error(err.response?.data?.message || 'Failed to update'))}} disabled={!canEditDetails || saving}>
                                        {PRIORITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </td>
                            </tr>

                            {/* ASSIGNEE */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Assignee</td>
                                <td style={{ padding: '12px 0' }}>
                                    <select className="form-select" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.assignee || ''} onChange={e=>{setForm({...form, assignee: e.target.value}); workPackageAPI.update(id, {...form, assignee: e.target.value}).then(res=>{loadData(); toast.success(res.data.message || 'Assignee updated');}).catch(err=>toast.error(err.response?.data?.message || 'Failed to update'))}} disabled={!canEditDetails || saving}>
                                        <option value="">— Unassigned —</option>
                                        {users.length > 0 ? users.map(u => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        )) : <option disabled>Loading...</option>}
                                    </select>
                                </td>
                            </tr>

                            {/* CATEGORY */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Category</td>
                                <td style={{ padding: '12px 0' }}>
                                    <input className="form-input" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.category || ''} onChange={e=>setForm({...form, category: e.target.value})} onBlur={handleSave} disabled={!canEditDetails} placeholder="—" />
                                </td>
                            </tr>

                            {/* VERSION */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Version</td>
                                <td style={{ padding: '12px 0' }}>
                                    <input className="form-input" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.version || ''} onChange={e=>setForm({...form, version: e.target.value})} onBlur={handleSave} disabled={!canEditDetails} placeholder="—" />
                                </td>
                            </tr>

                            {/* START DATE */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Start Date</td>
                                <td style={{ padding: '12px 0' }}>
                                    <input type="date" className="form-input" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.startDate ? form.startDate.split('T')[0] : ''} onChange={e=>setForm({...form, startDate: e.target.value})} onBlur={handleSave} disabled={!canEditDetails} />
                                </td>
                            </tr>

                            {/* DUE DATE */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Due Date</td>
                                <td style={{ padding: '12px 0' }}>
                                    <input type="date" className="form-input" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px' }} value={form.dueDate ? form.dueDate.split('T')[0] : ''} onChange={e=>setForm({...form, dueDate: e.target.value})} onBlur={handleSave} disabled={!canEditDetails} />
                                </td>
                            </tr>

                            {/* TOTAL WORK */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Total Work</td>
                                <td style={{ padding: '12px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input type="number" step="0.5" className="form-input" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px', width: '60px' }} value={form.work || 0} onChange={e=>setForm({...form, work: e.target.value})} onBlur={handleSave} disabled={!canEditDetails} />
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>h</span>
                                    </div>
                                </td>
                            </tr>

                            {/* REMAINING WORK */}
                            <tr style={{ borderBottom: '1px solid var(--bg-app)' }}>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Remaining Work</td>
                                <td style={{ padding: '12px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input type="number" step="0.5" className="form-input" style={{ border: 'none', padding: '4px 8px', marginLeft: '-8px', width: '60px', fontWeight: '600' }} value={form.remainingWork || 0} onChange={e=>setForm({...form, remainingWork: e.target.value})} onBlur={handleSave} disabled={!canEditDetails} />
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>h</span>
                                    </div>
                                </td>
                            </tr>

                            {/* PROGRESS */}
                            <tr>
                                <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Progress</td>
                                <td style={{ padding: '12px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="progress-container" style={{ flexGrow: 1, height: '6px' }}>
                                            <div className="progress-fill" style={{ width: `${form.work > 0 ? Math.round(((form.work - form.remainingWork) / form.work) * 100) : 0}%`, background: 'var(--color-primary)' }} />
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '32px', textAlign: 'right' }}>
                                            {form.work > 0 ? Math.round(((form.work - form.remainingWork) / form.work) * 100) : 0}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                    {/* TIME LOGGING SUMMARY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Spent Time</span>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{totalLogged}h</span>
                        </div>
                        {user?.role !== 'Manager' && (
                            <button className="btn-secondary w-full" onClick={() => setShowLogTime(true)} style={{ padding: '10px' }}>
                                <Clock size={14} /> Log Time
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {/* LOG TIME MODAL */}
            {showLogTime && (
                <LogTimeModal 
                    isOpen={showLogTime} 
                    onClose={() => setShowLogTime(false)} 
                    workPackageId={id} 
                    onLogged={loadData}
                />
            )}
        </div>
    );
}

// Subcomponent for Logging Time
function LogTimeModal({ isOpen, onClose, workPackageId, onLogged }) {
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], hours: 1, activity: 'Development', comment: '' });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await workPackageAPI.logTime(workPackageId, form);
            toast.success('Time logged');
            onLogged();
            onClose();
        } catch(err) {
            toast.error(err.response?.data?.message || 'Failed to log time');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Time" size="md" footer={<>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Log Time'}</button>
        </>}>
            <form onSubmit={handleSave}>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-input" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Hours</label>
                        <input type="number" step="0.25" min="0.25" className="form-input" value={form.hours} onChange={e=>setForm({...form, hours: e.target.value})} required />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Activity</label>
                    <select className="form-select" value={form.activity} onChange={e=>setForm({...form, activity: e.target.value})}>
                        <option>Development</option>
                        <option>Testing</option>
                        <option>Design</option>
                        <option>Management</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea className="form-textarea" value={form.comment} onChange={e=>setForm({...form, comment: e.target.value})} />
                </div>
            </form>
        </Modal>
    );
}
