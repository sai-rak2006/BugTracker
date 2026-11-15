import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BugList = ({ bugs, onRefresh }) => {
    const { user } = useAuth();
    const isAdmin = user.role === 'Admin';

    const handleUpdateStatus = async (id, currentStatus) => {
        let nextStatus = '';
        if (currentStatus === 'Open') nextStatus = 'In Progress';
        else if (currentStatus === 'In Progress') nextStatus = 'Resolved';
        else return;

        try {
            await axios.put(`/api/bugs/${id}`, { status: nextStatus });
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/bugs/${id}`);
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bug-list">
            {bugs.length === 0 ? (
                <div className="empty-state">No active bug tickets. System healthy. ✅</div>
            ) : (
                bugs.map(bug => (
                    <div key={bug.id} className="bug-item">
                        <div className="bug-info">
                            <h4>{bug.title}</h4>
                            <p>{bug.description}</p>
                            <div className="badges">
                                <span className={`badge badge-${bug.priority.toLowerCase()}`}>{bug.priority}</span>
                                <span className={`badge badge-${bug.status.toLowerCase().replace(' ', '')}`}>{bug.status}</span>
                                <span style={{fontSize: '0.7rem', color: '#888'}}>By: {bug.creatorName || 'Unknown'}</span>
                            </div>
                        </div>
                        <div className="actions">
                            {isAdmin && bug.status !== 'Resolved' && (
                                <button className="btn btn-sm btn-status" onClick={() => handleUpdateStatus(bug.id, bug.status)}>
                                    Next Step →
                                </button>
                            )}
                            {isAdmin && (
                                <button className="btn btn-sm btn-delete" onClick={() => handleDelete(bug.id)}>🗑️</button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default BugList;
