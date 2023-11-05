// components/Skeleton.tsx

import React from 'react';

const Skeleton: React.FC = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex space-x-4">
                    <div className="bg-gray-300 rounded-full animate-pulse w-16 h-16"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
