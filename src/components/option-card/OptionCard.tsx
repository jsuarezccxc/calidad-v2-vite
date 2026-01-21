import React from 'react';
import { Icon } from '@components/icon';
import { IOptionCardProps } from '.';
import './OptionCard.scss';

export const OptionCard: React.FC<IOptionCardProps> = ({ icon, title, description, onClick, completed = false }) => {
    return (
        <div className={`option-card ${completed ? 'mr--completed' : ''}`} onClick={onClick}>
            <div className="option-card__content">
                <Icon name={icon} className="icon--styles" />
                <div className="container__information">
                    <label className="container__information--title">{title}</label>
                    {description && <p className="container__information--description">{description}</p>}
                </div>
            </div>
            <div className="container__arrow">
                <Icon name="arrowRightDGray" className="arrow--styles" />
            </div>
            {completed && (
                <div className="container__completed">
                    <Icon name="successRoundedMulticolor" className="completed" />
                </div>
            )}
        </div>
    );
};
