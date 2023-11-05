'use client'
import React, { useState } from 'react';
import localFont from "next/dist/compiled/@next/font/dist/local";

// 假设这个组件从父组件接收一个 `numericAddress` prop
const NumericAddressComponent = ({numericAddress}: any) => {
    const [isHovering, setIsHovering] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    // 用于显示完整或截断的地址
    const displayAddress = isHovering
        ? numericAddress
        : `${numericAddress.substring(0, 4)}...${numericAddress.substring(numericAddress.length - 4)}`;

    const handleCopy = async () => {
        console.log('复制')
        await navigator.clipboard.writeText(numericAddress);
        setCopySuccess('Copied!');
        setTimeout(() => {
            setCopySuccess('');
        }, 800);
    };

    return (
        <div
            className="flex items-center space-x-2 py-2 px-5 mr-2 bg-white border bg-gray-100 rounded-xl cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleCopy}
        >
            {/*<div className="h-6 w-6 rounded-full overflow-hidden">*/}
            {/*    <img src="/path-to-your-icon.png" alt="" className="h-full w-full object-cover" />*/}
            {/*</div>*/}
            <span className={`text-sm font-medium ${!isHovering && 'truncate'}`}>
        {displayAddress}
      </span>
            {copySuccess && (
                <div className="absolute bg-black text-white py-1 px-3 rounded-md text-xs">
                    {copySuccess}
                </div>
            )}
        </div>
    );
};

export default NumericAddressComponent;
