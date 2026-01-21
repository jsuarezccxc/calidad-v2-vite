import React from 'react';
import { IInformationCardLanding } from '.';
import './InformationCardLanding.scss';

const InformationCardLanding: React.FC<IInformationCardLanding> = ({ title, information, subtitle, date }) => {
    return (
        <div className="flex flex-col justify-center informationCardLanding">
            <h1 className="informationCardLanding__title">{title}</h1>
            {subtitle && <p className="informationCardLanding__subtitle">{subtitle}</p>}
            <p className="pt-2 xs:p-0 informationCardLanding__information">{information}</p>
            {date && <p className="p-1 xs:p-0 informationCardLanding__date">{date}</p>}
        </div>
    );
};

export default React.memo(
    InformationCardLanding,
    (
        prepProps: Readonly<React.PropsWithChildren<IInformationCardLanding>>,
        nextProps: Readonly<React.PropsWithChildren<IInformationCardLanding>>
    ) => prepProps?.information === nextProps?.information || prepProps?.date === nextProps?.date
);
