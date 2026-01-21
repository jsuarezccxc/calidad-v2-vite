import React from 'react';
import { useHistory } from 'react-router';
import { Icon } from '@components/icon';
import { ZERO_DAYS as ZERO } from '@constants/Memberships';
import { IColorCardProps, IContentCardProps, ILittleCardProps, ISimpleCardProps, UTILS_CARD } from '.';
import './Card.scss';

export const SimpleCard: React.FC<ISimpleCardProps> = ({ id, iconName, principalText, secondText, route, isBlueText }) => {
    const history = useHistory();
    const redirectRoute = (): void => history.push(route);

    return (
        <div id={id} className="simple-card">
            <Icon name={iconName} className="simple-card__img" />
            <label className={`${isBlueText ? 'simple-card__label-blue' : 'simple-card__label'}`} onClick={redirectRoute}>
                {principalText} <br /> <span className={`${!isBlueText ? 'simple-card__label--bold' : ''}`}>{secondText}</span>
            </label>
        </div>
    );
};

export const ColorCard: React.FC<IColorCardProps> = ({
    id,
    className,
    classNameLine,
    classNameNumber,
    iconName,
    number,
    text,
}) => (
    <div id={id} className={`color-card ${className}`}>
        <div className={`color-card__line ${classNameLine}`} />
        <div className="color-card__content-text">
            <h1 className={`${classNameNumber} ${number.length >= UTILS_CARD.ELEVEN ? 'text-xl' : 'text-28lg'}`}>{number}</h1>
            <label>{text}</label>
        </div>
        <Icon name={iconName} className="color-card__icon" />
    </div>
);

export const LittleCard: React.FC<ILittleCardProps> = ({ id, className, number, title, isUnlimited }) => (
    <div id={id} className={`little-card ${className}`}>
        <label className="little-card__title">{title}</label>
        {!isUnlimited && (
            <label className={`little-card__number ${number > ZERO ? 'text-green' : 'text-gray-dark'}`}>{number}</label>
        )}
    </div>
);

export const ContentCard: React.FC<IContentCardProps> = ({ id, className, classNameContent, title, children }) => (
    <div id={id} className={`content-card ${className}`}>
        <label className="content-card__title">{title}</label>
        <div className={`content-card__content ${classNameContent}`}>{children}</div>
    </div>
);
