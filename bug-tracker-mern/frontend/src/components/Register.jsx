import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from './ui/Spinner';
import { Bug } from 'lucide-react';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Developer' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(form.name, form.email, form.password, form.role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card animate-fade-in">
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <Bug size={28} />
                    </div>
                    <h1>Create Account</h1>
                </div>

                {error && (
                    <div className="mb-4" style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" value={form.password} onChange={handleChange} required minLength="6" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                            <option>Developer</option>
                            <option>Tester</option>
                            <option>Manager</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="btn-primary w-full mt-3" disabled={loading} style={{ padding: '10px' }}>
                        {loading ? <Spinner size="sm" color="white" /> : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                    <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}
