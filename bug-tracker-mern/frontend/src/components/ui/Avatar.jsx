import React from 'react';

export default function Avatar({ name, size = 'md', className = '' }) {
    const initials = name 
        ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';
    
    // Hash string to color
    const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#ed64a6'];
    const colorIndex = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
    const bg = colors[colorIndex];

    const sizes = {
        sm: { width: '24px', height: '24px', fontSize: '10px' },
        md: { width: '32px', height: '32px', fontSize: '13px' },
        lg: { width: '40px', height: '40px', fontSize: '15px' },
        xl: { width: '64px', height: '64px', fontSize: '24px' }
    };

    const s = sizes[size] || sizes.md;

    return (
        <div 
            className={`avatar ${className}`}
            style={{ 
                ...s, 
                backgroundColor: bg,
                color: '#fff',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                userSelect: 'none',
                flexShrink: 0
            }}
            title={name || 'Unknown'}
        >
            {initials}
        </div>
    );
}
