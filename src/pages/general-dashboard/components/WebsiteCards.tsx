import React from 'react';
import permanence from '@assets/images/permanence.svg';
import visitors from '@assets/images/visitors.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { getComparisonValue } from '@utils/AnalyticalData';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { getSum } from '@utils/Array';
import { COUNT, CardDisabled } from '.';

export const WebsiteCards: React.FC<{ disable: boolean; data: IGenericRecord[] }> = ({ data = [], disable }) => {
    const [oldData, currentData] = data;
    const getVisitors = (): { currentMonth: number; oldMonth: number } => ({
        currentMonth: getSum(currentData?.ages, COUNT),
        oldMonth: getSum(oldData?.ages, COUNT),
    });

    const getPermanenceBalance = (): string => {
        const balance = (currentData?.percentageDesktopDevice ?? 0) - (oldData?.percentageDesktopDevice ?? 0);
        return getComparisonValue(balance);
    };

    const { currentMonth, oldMonth } = getVisitors();

    return (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'website-chart-traffic',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="traffic-cards"
        >
            <div className="traffic-card traffic-card--sales traffic-card--website">
                <p className="traffic-card__sales">Número de visitantes</p>
                <img src={visitors} className="mx-auto my-3 icon-width--card" alt="Earnings" />
                <p className="traffic-card__value">{currentMonth}</p>
                <p className="traffic-card__growth">
                    {getComparisonValue(currentMonth - oldMonth)}% visitantes comparados con el mes anterior
                </p>
            </div>
            <div className="traffic-card traffic-card--clients traffic-card--website">
                <p className="traffic-card__sales">Tiempo de permanencia</p>
                <img src={permanence} className="mx-auto my-3 icon-width--card" alt="Earnings" />
                <p className="traffic-card__value">{currentData?.percentageDesktopDevice} s</p>
                <p className="traffic-card__growth">{getPermanenceBalance()} s comparado con el mes anterior</p>
            </div>
            {disable && <CardDisabled />}
        </div>
    );
};
