import React, { useState } from 'react';
import { X, Clock, Target, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const WorkPackageDetailPanel = ({ isOpen, onClose, pkg }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen || !pkg) return null;

    const getTypeColor = (type) => {
        switch(type) {
            case 'BUG': return 'text-red-600 bg-red-100';
            case 'FEATURE': return 'text-blue-600 bg-blue-100';
            case 'EPIC': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform border-l border-gray-200 flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-200 bg-gray-50">
                <div className="pr-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={clsx("px-2 py-0.5 text-xs font-bold uppercase rounded", getTypeColor(pkg.type))}>
                            {pkg.type}
                        </span>
                        <span className="text-sm text-gray-500">#{pkg._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">{pkg.subject}</h2>
                </div>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-full border border-transparent shadow-sm hover:border-gray-200 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-gray-200 px-5">
                {['overview', 'activity', 'time logging'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "py-3 px-4 text-sm font-medium border-b-2 transition-colors capitalize",
                            activeTab === tab ? "border-openProject-activeBg text-openProject-activeBg" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        
                        {/* Description block */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-2">Description</h3>
                            <div className="p-4 bg-gray-50 rounded border border-gray-100 text-sm text-gray-700 min-h-[100px] leading-relaxed">
                                {pkg.description || <span className="italic text-gray-400">Add a description...</span>}
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Status</span>
                                <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded text-sm font-medium shadow-sm">{pkg.status}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Priority</span>
                                <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded text-sm font-medium shadow-sm">{pkg.priority}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Assignee</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                        {pkg.assignee?.name?.[0] || '-'}
                                    </div>
                                    <span className="text-sm text-openProject-header hover:underline cursor-pointer">{pkg.assignee?.name || '- unassigned -'}</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Reporter</span>
                                <span className="text-sm">{pkg.reporter?.name || '-'}</span>
                            </div>
                        </div>

                        {/* Estimates & Time */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Estimates & Time</h3>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                                <div>
                                    <span className="block text-xs text-gray-500">Estimated time</span>
                                    <span className="text-sm font-medium">{pkg.estimatedHours || 0} h</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500">Spent time</span>
                                    <span className="text-sm font-medium text-openProject-header hover:underline cursor-pointer">0 h</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-xs text-gray-500 mb-1">% Complete</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pkg.percentComplete || 0}%` }}></div>
                                        </div>
                                        <span className="text-sm font-bold w-10 text-right">{pkg.percentComplete || 0}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="pt-4 flex space-x-3">
                                <button className="flex-1 op-btn-secondary flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    <Target size={16} className="mr-2 text-gray-400" /> Update Progress
                                </button>
                                <button className="flex-1 op-btn-primary flex justify-center items-center py-2 px-4 shadow-sm text-sm font-medium rounded-md">
                                    <Clock size={16} className="mr-2" /> Log Time
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'activity' && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
                        No recent activity.
                    </div>
                )}
                
                {activeTab === 'time logging' && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        <Clock size={32} className="mx-auto mb-3 text-gray-300" />
                        No time logged yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkPackageDetailPanel;
