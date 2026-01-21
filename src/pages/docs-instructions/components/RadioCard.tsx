import React from 'react';
import { Icon } from '@components/icon';
import { IRadioCard } from '.';

export const RadioCard: React.FC<IRadioCard> = ({ icon, title, isSelected = false, validate = false, onClick }) => {
    return (
        <div className="radio-card" onClick={onClick}>
            <div className="card">
                <Icon name={icon} classIcon="icon" />
                <span>{title}</span>
            </div>
            <div className="mt-4">
                <div
                    className={`radio ${validate && 'border-purple'} ${isSelected && !validate ? 'bg-blue' : 'border-gray-300'}`}
                ></div>
            </div>
        </div>
    );
};
