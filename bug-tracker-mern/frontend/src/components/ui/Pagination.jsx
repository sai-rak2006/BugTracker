import React from 'react';

export default function Pagination({ page, pages, onPageChange }) {
    if (pages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= Math.min(5, pages); i++) {
        pageNumbers.push(i);
    }
    // Simplistic pagination logic for demo purposes (1..5)
    // You could expand this logic for proper ellipses

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button 
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                style={{ padding: '4px 10px' }}
            >
                Prev
            </button>
            
            <div style={{ display: 'flex', gap: '4px' }}>
                {pageNumbers.map(num => (
                    <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            border: `1px solid ${page === num ? 'var(--color-primary)' : 'var(--border-color)'}`,
                            background: page === num ? 'var(--color-primary)' : '#fff',
                            color: page === num ? '#fff' : 'var(--text-main)',
                            fontSize: '13px',
                            cursor: 'pointer'
                        }}
                    >
                        {num}
                    </button>
                ))}
            </div>

            <button 
                className="btn btn-secondary"
                disabled={page === pages}
                onClick={() => onPageChange(page + 1)}
                style={{ padding: '4px 10px' }}
            >
                Next
            </button>
        </div>
    );
}
