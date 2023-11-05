// components/LoadingModal.tsx

import React from 'react';

const LoadingModal: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-70 p-3 rounded-lg shadow-lg flex items-center space-x-3">
        <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        <div className="text-white">加载中...</div>
      </div>
    </div>
  );
};

export default LoadingModal;
