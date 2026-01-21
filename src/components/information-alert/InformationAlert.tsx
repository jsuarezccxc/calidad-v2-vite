import React from 'react';
import { Icon } from '@components/icon';
import './InformationAlert.scss';

export const InformationAlert: React.FC = () => {
    return (
        <div className="information-alert">
            <div className="information-alert__info">
                <p className="text">Preguntas frecuentes</p>
            </div>
            <Icon name="questionRoundedGreen" className="information-alert--icon" />
        </div>
    );
};
