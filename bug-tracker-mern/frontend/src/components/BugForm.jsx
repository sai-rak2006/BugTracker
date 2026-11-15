import React, { useState } from 'react';
import axios from 'axios';

const BugForm = ({ onBugAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/bugs', { title, description, priority });
            setTitle('');
            setDescription('');
            setPriority('Medium');
            onBugAdded();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bug-form-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Create New Ticket</h3>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Issue Summary</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Database connection timeout" required />
                </div>
                <div className="form-field">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Detailed steps to reproduce..." 
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #E5E7EB', minHeight: '120px', fontFamily: 'inherit', marginBottom: '1.25rem' }} 
                        required 
                    ></textarea>
                </div>
                <div className="form-field">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Priority Level</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="Low">🟢 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🔴 High</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                    🚀 Add to Backlog
                </button>
            </form>
        </div>
    );
};

export default BugForm;
