import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@components/icon';
import { CREATE_ACCOUNT, ENABLE_ACCOUNT, IStepCartProps } from '..';
import './StepsCard.scss';

export const StepsCard: React.FC<IStepCartProps> = ({ icon, title, url, type }) => {
    const [create, enable] = [localStorage.getItem(CREATE_ACCOUNT), localStorage.getItem(ENABLE_ACCOUNT)];

    return (
        <Link to={url} className="no-underline">
            <div
                className={`steps-card ${create && type === CREATE_ACCOUNT ? 'steps-card__icon' : ''} ${
                    enable && type === ENABLE_ACCOUNT ? 'steps-card__icon' : ''
                }`}
            >
                <div className="flex items-center">
                    <Icon name={icon} className="mr-5 cursor-pointer" />
                    <p className="text-green font-allerbold">{title}</p>
                </div>
                <div className="flex items-center">
                    <Icon name="arrowInstructions" className="cursor-pointer" />

                    {create && type === CREATE_ACCOUNT && (
                        <Icon name="successMulticolor" className="ml-2 cursor-pointer w-7.5 h-8.2" />
                    )}

                    {enable && type === ENABLE_ACCOUNT && (
                        <Icon name="successMulticolor" className="ml-2 cursor-pointer w-7.5 h-8.2" />
                    )}
                </div>
            </div>
        </Link>
    );
};
