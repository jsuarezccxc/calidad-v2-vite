/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { useLocation } from 'react-router-dom';
import information from '@assets/images/info-blue.svg';
import usePopper from '@hooks/usePopper';
import { Tooltip } from '@components/tooltip';
import { GRADIENTS } from '@constants/PaymentPlans';
import { Routes } from '@constants/Paths';
import { PLAN_DESCRIPTIONS } from '@information-texts/PaymentPlans';
import { formatMoney } from '@utils/Decimals';
import { getButtonText } from '@utils/Plans';
import { getRoute } from '@utils/Paths';
import { ICardProps, PREMIUM_PLAN_ASTERISK } from '.';

export const Card: React.FC<ICardProps> = ({ data, card, hasActivePlan, hideButton, selectPlan, toggleLogin }) => {
    const location = useLocation();
    const { anchorEl, mouseProps } = usePopper();

    const { index, name, price_year: annualPrice, price_semester: semiAnnualPrice } = card;

    const [, tooltip] = [GRADIENTS[index], PLAN_DESCRIPTIONS[index]];

    const { websitePlan, annualPlan } = data;

    const isPremiumCard = name === PREMIUM_PLAN_ASTERISK;

    const isDiggiPage = location.pathname === getRoute(Routes.PAYMENT_PLANS_MENU);

    return (
        <div className={`card card--big ${name !== PREMIUM_PLAN_ASTERISK ? 'desing-padding' : 'premium-padding'}`}>
            {isPremiumCard && <div className="card__recomend">Recomendado</div>}
            <div className={`card__header ${isPremiumCard && 'mt-2'}`}>
                <p className="card__plan">{name}</p>
                <img alt="Information" className="icon--info cursor-pinter" src={information} {...mouseProps} />
            </div>

            <div className="card__body">
                <p>
                    <span className="card__price">{formatMoney(annualPlan ? annualPrice : semiAnnualPrice, 0)}</span>
                    <span className="card__payment-period">pago {annualPlan ? 'anual' : 'semestral'}</span>
                </p>
                {!hideButton && (
                    <button
                        className={`card__button card__button--${!isDiggiPage ? 'unlimited' : 'default'} card__button--${
                            card.isActive ? 'active' : ''
                        }`}
                        onClick={toggleLogin || selectPlan}
                    >
                        {getButtonText(card, { plan: websitePlan, hasActivePlan }, toggleLogin)}
                    </button>
                )}
            </div>
            <Tooltip anchorEl={anchorEl} iconName="infoBlue" placement="bottom-start" {...tooltip} />
        </div>
    );
};
