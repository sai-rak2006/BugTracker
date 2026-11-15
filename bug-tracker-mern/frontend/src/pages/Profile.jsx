import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            await updateProfile(user._id, { name: form.name, email: form.email });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="page-title">My Profile</h1>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                    <Avatar name={user?.name} size="xl" />
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{user?.name}</h2>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{user?.email}</div>
                        <span className="badge" style={{ background: 'var(--color-secondary)', color: 'var(--text-main)' }}>Role: {user?.role}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" name="name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" name="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
                    </div>
                    
                    {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
                    {success && <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px' }}>Profile updated successfully!</div>}

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <Spinner size="sm"/> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
