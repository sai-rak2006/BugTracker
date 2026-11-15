import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from './ui/Avatar';
import Modal from './ui/Modal';
import { Search, Grid, HelpCircle, Bell, ChevronDown, LogOut, User as UserIcon, Settings, Info, Zap, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showApps, setShowApps] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    return (
        <header className="app-header">
            {/* Left — Project Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: 'transparent',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{
                        width: '24px', height: '24px', 
                        background: 'var(--color-primary)', 
                        color: 'white', 
                        borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold'
                    }}>
                        M
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>
                        BugTracker Pro
                    </span>
                    <ChevronDown size={14} color="var(--text-muted)" />
                </button>
            </div>

            {/* Center — Search Bar */}
            <div className="header-search">
                <Search />
                <input type="text" placeholder="Search work packages, projects, or users..." />
            </div>

            {/* Right — Notifications & Profile */}
            <div className="header-actions">
                {/* APPS DROP DOWN */}
                <div style={{ position: 'relative' }}>
                    <button className="btn-icon" onClick={() => setShowApps(!showApps)} title="Apps">
                        <Grid size={18} />
                    </button>
                    {showApps && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowApps(false)}/>
                            <div style={{ position: 'absolute', right: 0, top: '40px', width: '280px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', zIndex: 50, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
                                {[
                                    { label: 'Admin', color: '#ef4444' },
                                    { label: 'Board', color: '#3b82f6' },
                                    { label: 'Gantt', color: '#10b981' },
                                    { label: 'Drive', color: '#f59e0b' },
                                    { label: 'Mail', color: '#ec4899' },
                                    { label: 'Calendar', color: '#8b5cf6' }
                                ].map(app => (
                                    <div key={app.label} style={{ cursor: 'pointer', padding: '8px', borderRadius: 'var(--radius-sm)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-app)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ width: '32px', height: '32px', background: app.color, borderRadius: '8px', margin: '0 auto 8px', opacity: 0.9 }}></div>
                                        <span style={{ fontSize: '11px', fontWeight: '500' }}>{app.label}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* HELP MODAL TRIGGER */}
                <div style={{ position: 'relative' }}>
                    <button className="btn-icon" onClick={() => setShowHelpModal(true)} title="Help & Support">
                        <HelpCircle size={18} />
                    </button>
                </div>

                {/* NOTIFICATIONS DROP DOWN */}
                <div style={{ position: 'relative' }}>
                    <button className="btn-icon" style={{ position: 'relative' }} onClick={() => setShowNotifs(!showNotifs)} title="Notifications">
                        <Bell size={18} />
                        <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: 'var(--status-rejected)', borderRadius: '50%', border: '2px solid white' }} />
                    </button>
                    {showNotifs && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotifs(false)}/>
                            <div style={{ position: 'absolute', right: 0, top: '40px', width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0', zIndex: 50, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                                <div style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Notifications</span>
                                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', cursor: 'pointer' }}>Mark all as read</span>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {[
                                        { title: 'New bug assigned', time: '2m ago', desc: 'Critical issue in payment gateway' },
                                        { title: 'Comment on #WP-102', time: '1h ago', desc: 'Alice replied to your thread' }
                                    ].map((n, i) => (
                                        <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-app)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '600' }}>{n.title}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{n.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '10px', textAlign: 'center', fontSize: '12px', background: 'var(--bg-app)', borderTop: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '500' }}>
                                    View all notifications
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }} />

                {/* LOGOUT BUTTON (FIX) */}
                <button className="btn-secondary" onClick={logout} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: '600', color: '#ef4444' }}>
                    <LogOut size={14} /> Log Out
                </button>

                <div style={{ position: 'relative', marginLeft: '12px' }}>
                    <div 
                        className="header-profile" 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Avatar name={user?.name} size="sm" />
                    </div>

                    {showProfileMenu && (
                        <>
                            <div 
                                style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div style={{
                                position: 'absolute', right: 0, top: '40px',
                                width: '220px', background: 'var(--bg-card)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: 'var(--radius-md)', 
                                boxShadow: 'var(--shadow-lg)',
                                padding: '8px 0', zIndex: 50
                            }}>
                                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user?.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
                                </div>
                                <button
                                    onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                                    style={{ width: '100%', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-app)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <UserIcon size={14} /> My Profile
                                </button>
                                <button
                                    onClick={() => { setShowProfileMenu(false); logout(); }}
                                    style={{ width: '100%', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-rejected)', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <LogOut size={14} /> Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* HELP MODAL CONTENT (Outside actions but inside header for scope) */}
            {showHelpModal && (
                <Modal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} title="Help & Support" size="md">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(26, 107, 181, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <Info size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0' }}>Documentation</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Learn how to track bugs, log time, and manage sub-tasks.</p>
                                <a href="#" style={{ fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>Read More <Zap size={10}/></a>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(37, 138, 67, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                                <Zap size={20} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 style={{ margin: '0 0 4px 0' }}>Keyboard Shortcuts</h4>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    <span style={{ fontSize: '11px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}>Ctrl + N (New)</span>
                                    <span style={{ fontSize: '11px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}>Ctrl + S (Save)</span>
                                    <span style={{ fontSize: '11px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}>/ (Search)</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '20px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <MessageSquare size={18} color="var(--color-primary)" />
                                <h4 style={{ margin: 0, fontSize: '15px' }}>Contact Support</h4>
                            </div>
                            
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target;
                                const data = {
                                    subject: form.subject.value,
                                    message: form.message.value,
                                    type: form.type.value
                                };
                                try {
                                    const { supportAPI } = await import('../services/api');
                                    const { toast } = await import('react-hot-toast');
                                    const res = await supportAPI.submit(data);
                                    toast.success(res.data.message || "Your request has been submitted");
                                    setShowHelpModal(false);
                                } catch (err) {
                                    const { toast } = await import('react-hot-toast');
                                    toast.error(err.response?.data?.message || "Failed to submit request");
                                }
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <input name="subject" className="form-input" placeholder="Subject" required />
                                    <select name="type" className="form-select">
                                        <option value="help">Help</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="bug_report">Bug Report</option>
                                    </select>
                                </div>
                                <textarea name="message" className="form-textarea" placeholder="Describe your issue or feedback..." style={{ minHeight: '100px', marginBottom: '12px' }} required />
                                <button type="submit" className="btn-primary w-full" style={{ height: '40px' }}>
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </header>
    );
}
