import React from 'react';
import { Icon } from '@components/icon';
import { IStepComponent } from '..';

export const StepsCard: React.FC<IStepComponent> = ({ icon, title, description, onClick, stepComplete }) => {
    return (
        <div className={`steps-card`} onClick={onClick}>
            <div className="flex flex-col sm:flex-row items-center">
                <div className="icon-container">
                    <Icon name={icon} className="cursor-pointer" />
                </div>
                <div className="flex flex-col justify-center content">
                    <p className="text-green font-allerbold text-center sm:text-left">{title}</p>
                    <p className="text-gray-dark text-center sm:text-left">{description}</p>
                </div>
                <div className="row-icon">
                    <Icon name="arrowInstructions" className="cursor-pointer w-5.5 h-5.5" />
                    {stepComplete && <Icon name="successMulticolor" className="ml-2 cursor-pointer icon-size mr-4.5" />}
                </div>
            </div>
        </div>
    );
};
