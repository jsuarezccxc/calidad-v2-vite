import React from 'react';
import clients from '@assets/images/clients.svg';
import earnings from '@assets/images/earnings.svg';
import { getComparisonValue } from '@utils/AnalyticalData';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ICardProps, CardDisabled } from '.';

export const TrafficCards: React.FC<ICardProps> = ({ disable, sales, dates }) => {
    const [previousData, currentData] = [sales?.[dates.previous], sales?.[dates.current]];

    const getCustomerBalance = (): string => {
        const balance = (currentData?.new_customer ?? 0) - (previousData?.new_customer ?? 0);
        return getComparisonValue(balance);
    };

    const getSalesBalance = (): string => getComparisonValue((previousData?.quantity_sales * 100) / currentData?.quantity_sales);

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
            <div className="traffic-card traffic-card--sales">
                <p className="traffic-card__sales">Cantidad de ventas</p>
                <img src={earnings} className="mx-auto my-3 icon-width--card" alt="Earnings" />
                <p className="traffic-card__value" title={currentData?.quantity_sales}>
                    {currentData?.quantity_sales}
                </p>
                <p className="traffic-card__growth">{getSalesBalance()} comparado con el mes anterior</p>
            </div>
            <div className="traffic-card traffic-card--clients">
                <p className="traffic-card__sales">Nuevos clientes</p>
                <img src={clients} className="mx-auto my-3 icon-width--card" alt="Earnings" />
                <p className="traffic-card__value">{currentData?.new_customer}</p>
                <p className="traffic-card__growth">{getCustomerBalance()} clientes comparados con el mes anterior</p>
            </div>
            {disable && <CardDisabled />}
        </div>
    );
};
