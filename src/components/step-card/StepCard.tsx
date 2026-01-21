import React from 'react';
import success from '@assets/images/success.svg';
import arrow from '@assets/images/right-arrow.svg';
import { remToPx } from '@utils/Size';
import { DEFAULT_INFORMATION_WIDTH, IStepCardProps } from '.';
import './StepCard.scss';

// Vite dynamic imports for electronic-documents icons
const iconModules = import.meta.glob<{ default: string }>('/src/assets/images/electronic-documents/*.svg', { eager: true });

const getIconSrc = (iconName: string): string => {
    const path = `/src/assets/images/electronic-documents/${iconName}.svg`;
    return iconModules[path]?.default || '';
};

export const StepCard: React.FC<IStepCardProps> = ({
    id,
    icon,
    title,
    description,
    informationWidth = remToPx(DEFAULT_INFORMATION_WIDTH),
    isComplete,
    handleClick,
}) => {
    return (
        <button id={id} className="step-card" type="button" onClick={handleClick}>
            <img
                alt="Module"
                className="cursor-pointer icon--step"
                src={getIconSrc(icon)}
            />
            <div className="mx-2 step-card__information" style={{ width: informationWidth }}>
                <h2 className="text-sm text-left text-green font-allerbold lg:text-base">{title}</h2>
                <p className="text-sm text-left text-gray-dark lg:text-base">{description}</p>
            </div>
            <img className="mr-2 w-5.5 h-6" src={arrow} alt="Next" />
            {isComplete && <img src={success} className="icon--completed" alt="Success" />}
        </button>
    );
};
