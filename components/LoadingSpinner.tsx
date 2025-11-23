
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Calibrating System..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background-dark text-text-light">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-accent-teal rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    🌱
                </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-accent-teal animate-pulse-slow">
                {message}
            </p>
        </div>
    );
};

export default LoadingSpinner;