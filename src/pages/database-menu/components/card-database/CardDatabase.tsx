import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@components/icon';
import { ICardDatabaseProps } from '.';

export const CardDatabase: React.FC<ICardDatabaseProps> = ({ id, iconName, title, color, textColor, cardRoute }) => {
    const history = useHistory();

    const navigateRoute = (): void => {
        if (cardRoute) history.push(cardRoute);
    };

    return (
        <div id={id} className={`database-menu__card database-menu__color-card-${color}`} onClick={navigateRoute}>
            <h3 className={`flex w-39 items-center pr-2 text-lg font-allerbold leading-5 database-menu__text-color-${textColor}`}>
                {title}
            </h3>
            <Icon name={iconName} className="mt-2 cursor-pointer icon-card initial-icon" />
        </div>
    );
};
