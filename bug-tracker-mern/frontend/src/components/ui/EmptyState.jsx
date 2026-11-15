import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)'
        }}>
            {Icon && (
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--color-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <Icon size={32} strokeWidth={1.5} color="var(--text-muted)" />
                </div>
            )}
            
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
                {title}
            </h3>
            
            <p style={{ fontSize: '14px', maxWidth: '300px', marginBottom: action ? '24px' : '0' }}>
                {description}
            </p>
            
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
