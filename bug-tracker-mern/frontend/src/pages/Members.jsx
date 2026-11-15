import React, { useEffect, useState } from 'react';
import { projectAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ROLES = ['Admin', 'Developer', 'Tester', 'Manager'];

function AddMemberModal({ isOpen, onClose, projectId, allUsers, onAdded }) {
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('Developer');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async () => {
        if (!userId) { return setError('Please select a user'); }
        setSaving(true);
        try {
            await projectAPI.addMember(projectId, { userId, role });
            toast.success('Member added successfully');
            onAdded();
            onClose();
            setUserId('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add member');
            setError(err.response?.data?.message || 'Failed to add member');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Member" size="sm" footer={<>
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleAdd} className="btn-primary" disabled={saving}>{saving ? <Spinner size="sm"/> : 'Add Member'}</button>
        </>}>
            <div className="form-group">
                <label className="form-label">Select User</label>
                <select className="form-select" value={userId} onChange={e => setUserId(e.target.value)}>
                    <option value="">— Choose a user —</option>
                    {allUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Project Role</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
            </div>
            {error && <div style={{ padding: '8px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginTop: '16px' }}>{error}</div>}
        </Modal>
    );
}

export default function Members() {
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const [projRes, usersRes] = await Promise.all([projectAPI.get(), userAPI.getAll()]);
            setProject(projRes.data.data);
            setAllUsers(usersRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleRemove = async (memberId) => {
        if (!window.confirm('Are you sure you want to completely delete this user?')) return;
        try {
            await userAPI.delete(memberId);
            toast.success('User deleted successfully');
            await load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
            console.error(err);
        }
    };

    const filteredUsers = allUsers.filter(u => {
        const s = search.toLowerCase();
        return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    });

    if (loading) return <div className="flex" style={{ height: '60vh', alignItems: 'center', justifyContent: 'center' }}><Spinner size="lg" /></div>;

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">
                <div>Members <span style={{fontSize: '14px', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '8px'}}>{project?.members?.length || 0} team members</span></div>
                {user?.role === 'Admin' && (
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={16} /> Add Member
                    </button>
                )}
            </h1>

            <div className="filter-bar">
                <div className="filter-input-group" style={{ position: 'relative', width: '300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: '32px' }} placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {filteredUsers.map(u => (
                    <div key={u._id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                        <Avatar name={u.name} size="xl" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '15px' }}>{u.name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{u.email}</div>
                            <span className="badge" style={{ background: 'var(--color-secondary)', color: 'var(--text-main)', fontSize: '11px', fontWeight: 'bold' }}>{u.role.toUpperCase()}</span>
                        </div>
                        {user?._id !== u._id && (
                            <button className="btn-danger w-full mt-2" onClick={() => handleRemove(u._id)}>
                                <Trash2 size={14} /> Delete User
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add User placeholder/modal would go here if needed, but currently uses register */}
        </div>
    );
}
