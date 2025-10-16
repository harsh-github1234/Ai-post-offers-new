import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div 
            className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-100"
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
        </div>
    );
};

export default Spinner;