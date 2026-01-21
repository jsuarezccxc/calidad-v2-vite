import React from 'react';
import { Icon } from '@components/icon';
import triangle from '@assets/images/triangle.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { TERMS } from '.';
import './TooltipTitle.scss';

export const TooltipTitle: React.FC<{ tooltip: string; invest?: boolean; classTooltip?: string; titleInfo?: string }> = ({
    tooltip,
    invest = false,
    classTooltip = '',
    titleInfo = '',
}) => (
    <div className={`tooltip-title ${invest ? 'tooltip-title--invested' : ''} ${classTooltip}`}>
        <div className="relative flex items-center gap-2 mb-2 text-sm font-allerbold text-blue">
            <Icon name="infoBlue" />
            {titleInfo ? titleInfo : 'Definición de términos'}
            <div className={`triangle ${invest ? 'triangle--invested' : ''}`}>
                <img alt={TERMS[tooltip]?.title} className="triangle__icon" src={triangle} />
                <div className="triangle__bg" />
            </div>
        </div>
        {Array.isArray(TERMS[tooltip]) ? (
            TERMS[tooltip].map((item: IGenericRecord, index: number) => (
                <p className="text-sm text-gray-dark" key={`option${index}`}>
                    <span className="font-allerbold">{item.title}:</span> {item.description}
                </p>
            ))
        ) : (
            <p className="text-sm text-gray-dark">
                {TERMS[tooltip]?.title && <span className="font-allerbold">{TERMS[tooltip]?.title}: </span>}
                {TERMS[tooltip]?.description}
            </p>
        )}
    </div>
);
