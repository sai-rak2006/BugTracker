import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from './ui/Spinner';
import { Bug } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const loadDemo = (roleEmail) => {
        setEmail(roleEmail);
        setPassword('password123');
    };

    return (
        <div className="login-wrapper">
            <div className="login-card animate-fade-in">
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <Bug size={28} />
                    </div>
                    <h1>Sign in to BugTracker</h1>
                </div>

                {error && (
                    <div className="mb-4" style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group position-relative" style={{ position: 'relative' }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                style={{ paddingRight: '40px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500'
                                }}
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-2" disabled={loading} style={{ padding: '10px' }}>
                        {loading ? <Spinner size="sm" color="white" /> : 'Sign in'}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
                    <Link to="/register" style={{ fontWeight: '600' }}>Create account</Link>
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-center mb-2" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        DEMO ACCOUNTS
                    </p>
                    <div className="form-grid-2">
                        <button type="button" className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => loadDemo('admin@demo.com')}>Admin</button>
                        <button type="button" className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => loadDemo('developer@demo.com')}>Developer</button>
                        <button type="button" className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => loadDemo('tester@demo.com')}>Tester</button>
                        <button type="button" className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => loadDemo('manager@demo.com')}>Manager</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
