/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import hand from '@assets/images/green-hand.svg';
import inflationIcon from '@assets/images/inflation.svg';
import marketRateIcon from '@assets/images/market-rate.svg';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { MARKET_RATE_INDEX, IIndicatorCardsProps } from '.';

export const IndicatorCards: React.FC<IIndicatorCardsProps> = ({ goToPaymentPlans, user = {}, marketRate, inflation }) => (
    <div className="indicator-cards">
        <h2 className="indicator-cards__greeting">
            ¡Bienvenido/a, <br />
            {user?.name}
        </h2>
        <div className="hidden lg:flex gap-4.5">
            <button
                id={generateId({
                    module: ModuleApp.DASHBOARD,
                    submodule: 'payment-plans',
                    action: ActionElementType.REDIRECT,
                    elementType: ElementType.BTN,
                })}
                className="informative-card"
                onClick={goToPaymentPlans}
            >
                <img src={hand} className="informative-icon--width" alt="Green hand" />
                <p className="informative-card__text">Planes de pago que se ajustan a su negocio</p>
            </button>
            <div
                id={generateId({
                    module: ModuleApp.DASHBOARD,
                    submodule: 'indicator-inflation',
                    action: ActionElementType.INFO,
                    elementType: ElementType.CRD,
                })}
                className="representative-card"
            >
                <img src={inflationIcon} className="representative-icon" alt="Inflation" />
                <p className="text-blue">
                    <span className="representative-card__indicator">Inflación anual</span>
                    <span className="representative-card__value">{inflation?.value ?? 0}%</span>
                </p>
            </div>
            <div
                id={generateId({
                    module: ModuleApp.DASHBOARD,
                    submodule: 'indicator-market-rate',
                    action: ActionElementType.INFO,
                    elementType: ElementType.CRD,
                })}
                className="representative-card"
            >
                <img src={marketRateIcon} className="representative-icon" alt="Market rate" />
                <p className="text-blue">
                    <span className="representative-card__indicator">Tasa representativa del mercado</span>
                    <span className="representative-card__value">${marketRate?.[MARKET_RATE_INDEX]?.valor ?? 0}</span>
                </p>
            </div>
        </div>
    </div>
);
