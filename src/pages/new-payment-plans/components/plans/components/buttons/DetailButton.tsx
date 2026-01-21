import React from 'react';
import arrow from '@assets/images/arrow-down-blue.svg';
import './Buttons.scss';

export const DetailButton: React.FC<{ open: boolean; toggleOpening: () => void }> = ({ children, open, toggleOpening }) => (
    <>
        <button className="detail-button" onClick={toggleOpening}>
            <span>Ver detalle</span>
            <img
                alt="Arrow"
                className={`w-5.5 h-5.5 cursor-pointer transition-all transform ${open ? 'rotate-180' : ''}`}
                src={arrow}
            />
        </button>
        {children}
    </>
);
