import React from 'react';

export default function Modal({ isOpen, onClose, title, children, footer, size = "md" }) {
    if (!isOpen) return null;

    const maxWidths = {
        sm: '400px',
        md: '500px',
        lg: '600px',
        xl: '800px'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-content animate-fade-in" 
                style={{ maxWidth: maxWidths[size] }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="btn-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
