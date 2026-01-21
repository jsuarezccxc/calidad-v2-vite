import React from 'react';
import { IStepWrapper } from '.';

export const StepWrapper: React.FC<IStepWrapper> = ({ children, title, description }) => {
    return (
        <div className="flex flex-col gap-4.5">
            <div
                className="flex flex-col bg-blue px-4.5 py-2 border-gray border-1 rounded-lg justify-center text-white leading-5"
                style={{ minHeight: '3.375rem' }}
            >
                <h3 className="font-allerbold">{title}</h3>
                <p>{description}</p>
            </div>
            {children}
        </div>
    );
};
