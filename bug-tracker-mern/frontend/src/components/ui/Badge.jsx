import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function StatusBadge({ status, className }) {
    const bg = {
        'New': 'var(--status-new)',
        'In Progress': 'var(--status-in-progress)',
        'Closed': 'var(--status-closed)',
        'On Hold': 'var(--status-on-hold)',
        'Rejected': 'var(--status-rejected)'
    }[status] || 'var(--text-muted)';
    
    return (
        <span className={cn("badge", className)} style={{ backgroundColor: bg, color: '#fff' }}>
            {status}
        </span>
    );
}

export function TypeBadge({ type, className }) {
    const bg = {
        'BUG': 'var(--status-rejected)',
        'FEATURE': 'var(--status-new)',
        'EPIC': 'var(--status-on-hold)',
        'TASK': 'var(--status-in-progress)'
    }[type] || 'var(--text-muted)';

    return (
        <span className={cn("badge", className)} style={{ backgroundColor: bg, color: '#fff' }}>
            {type}
        </span>
    );
}

export function PriorityBadge({ priority, className }) {
    const color = {
        'Low': 'var(--status-closed)',
        'Normal': 'var(--status-new)',
        'High': 'var(--status-in-progress)',
        'Urgent': 'var(--status-rejected)'
    }[priority] || 'var(--text-muted)';

    return (
        <span className={cn("badge", className)} style={{ color, border: `1px solid ${color}`, background: 'transparent' }}>
            {priority}
        </span>
    );
}
