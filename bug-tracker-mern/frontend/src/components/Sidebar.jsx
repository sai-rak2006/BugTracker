import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, Activity, CheckSquare, BarChart2, 
    Kanban, View, Calendar, Users, Clock, Bug 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import Avatar from './ui/Avatar';

export default function Sidebar() {
    const { user } = useAuth();
    const [project, setProject] = useState(null);

    useEffect(() => {
        projectAPI.get().then(res => setProject(res.data.data)).catch(console.error);
    }, []);

    return (
        <aside className="app-sidebar">
            <div className="sidebar-brand">
                <Bug size={24} style={{ color: 'var(--color-primary-light, #3b82f6)', marginRight: '8px' }} />
                <span>BugTracker</span>
            </div>

            <nav className="sidebar-menu">
                {/* SET 1 */}
                <div className="sidebar-section">
                    <NavLink to="/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard /> Overview
                    </NavLink>
                    <NavLink to="/activity" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <Activity /> Activity
                    </NavLink>
                    <NavLink to="/work-packages" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <CheckSquare /> Work packages
                    </NavLink>
                    <NavLink to="/analytics" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <BarChart2 /> Analytics
                    </NavLink>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: 'var(--spacing-3) 0' }} />

                {/* SET 2 */}
                <div className="sidebar-section">
                    <NavLink to="/boards" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <Kanban /> Boards
                    </NavLink>
                    <NavLink to="/backlogs" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <View /> Backlogs
                    </NavLink>
                    <NavLink to="/gantt" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <Calendar /> Gantt Charts
                    </NavLink>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: 'var(--spacing-3) 0' }} />

                {/* SET 3 */}
                <div className="sidebar-section">
                    {user?.role === 'Admin' && (
                        <NavLink to="/members" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Users /> Members
                        </NavLink>
                    )}
                    <NavLink to="/time-costs" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <Clock /> Time & Costs
                    </NavLink>
                </div>
            </nav>
            {/* Sidebar bottom spacer */}
            <div style={{ flexGrow: 1 }} />
        </aside>
    );
}
