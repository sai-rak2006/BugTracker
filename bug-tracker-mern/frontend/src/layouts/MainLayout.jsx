import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
    return (
        <div className="app-wrapper">
            <Sidebar />
            <div className="app-main">
                <Header />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
