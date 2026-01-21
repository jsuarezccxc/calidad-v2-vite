import React from 'react';
import { IInformationCardProps } from '.';
import './InformationCard.scss';

export const InformationCard: React.FC<IInformationCardProps> = ({ title, description, onClick = (): void => {} }) => {
    return (
        <div className="information-card" onClick={onClick}>
            {title && <label className="title text--bold">{title}</label>}
            <div>{description}</div>
        </div>
    );
};
