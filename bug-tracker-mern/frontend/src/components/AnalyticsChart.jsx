import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';

const AnalyticsChart = () => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/work-packages/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    // Color mapping based on OpenProject status
    const getColor = (status) => {
        switch(status) {
            case 'New': return '#ffb300';
            case 'In Progress': return '#1e88e5';
            case 'Closed': return '#43a047';
            case 'On Hold': return '#e53935';
            case 'Rejected': return '#757575';
            default: return '#8884d8';
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>;
    if (data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
