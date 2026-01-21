import React from 'react';

export const Arrow: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg
        className={`w-4.5 h-4.5 transition-all transform ${isActive ? 'rotate-180' : ''} toggle-button`}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
    >
        <g clipPath="url(#clip0_75574_448585)" className="toggle-button">
            <path
                d="M5.5575 6.44238L9 9.87738L12.4425 6.44238L13.5 7.49988L9 11.9999L4.5 7.49988L5.5575 6.44238Z"
                fill="#0B2C4C"
            />
        </g>
        <defs className="toggle-button">
            <clipPath id="clip0_75574_448585">
                <rect width="18" height="18" fill="white" />
            </clipPath>
        </defs>
    </svg>
);
