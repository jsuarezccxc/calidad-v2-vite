import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import arrowBlue from '@assets/images/sidebar/arrow-blue.svg';
import { IProgressInformation } from '.';
import './ProgressInformation.scss';

export const ProgressInformation: React.FC<IProgressInformation> = ({
    classes,
    module = 'website',
    percentage,
    threeSteps,
    isShowingSteps,
}) => (
    <div
        className={`progress-information ${classes} ${
            module === 'Documentos electrónicos' ? 'progress-information__documents' : 'progress-information__website'
        }`}
    >
        <p className="progress-information__title">
            ¡Está avanzando! ha completado el &nbsp;
            <span className={`text-sm ${module === 'Documentos electrónicos' ? 'text-green' : 'text-purple'}`}>{percentage}</span>
            . Continue los siguientes pasos para conocer y aprovechar las herramientas que {PRODUCT_NAME} tiene para su negocio.
        </p>
        {threeSteps && (
            <img
                className={`progress-information__arrow ${isShowingSteps ? 'progress-information__arrow--active' : ''}`}
                src={arrowBlue}
                alt="Arrow"
            />
        )}
    </div>
);
