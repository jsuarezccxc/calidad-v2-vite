/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import information from '@assets/images/info-multicolor.svg';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { formatMoney } from '@utils/Decimals';
import { getButtonText } from '@utils/Plans';
import { ICardProps, FREE_PLAN_DATA, UNLIMITED_DOCUMENTS, UNLIMITED_PER_YEAR } from '.';

export const Card: React.FC<ICardProps> = ({ card, hasActivePlan, selectedPlan, selectPlan, toggleLogin }) => {
    const { anchorEl, mouseProps } = usePopper();

    const { name, price_month: price } = card;

    const documents = name.split(' ').find(item => !isNaN(Number(item))) ?? name;

    const unlimitedDocuments = name === UNLIMITED_PER_YEAR;

    const isDiggiPage = location.pathname === '/payments-plans';

    return (
        <div className={`card ${!unlimitedDocuments ? 'desing-padding' : 'premium-padding'}`}>
            {unlimitedDocuments && <div className="card__recomend">Recomendado</div>}

            <div className="">
                <p className="card__documents">
                    <span className={`card__documents--value ${unlimitedDocuments ? 'card__documents--unlimited' : ''}`}>
                        {unlimitedDocuments ? UNLIMITED_DOCUMENTS : documents}
                    </span>
                    {documents !== name && <span className="card__documents--text">Documentos</span>}
                </p>
            </div>
            <div className="card__body">
                {price ? (
                    <p className="card__price">{formatMoney(price, 0)}</p>
                ) : (
                    <p>
                        <span className="card__plan">
                            <img alt="Information" className="icon--info-free" src={information} {...mouseProps} />
                            <div className="card-price">PLAN GRATIS</div>
                        </span>
                        <span className="card__objective">Para microempresas</span>
                    </p>
                )}
                <button
                    className={`card__button ${!price ? 'mt-4' : 'mt-9'} card__button--${
                        !isDiggiPage ? 'unlimited' : 'default'
                    } card__button--${card.isActive ? 'active' : ''}`}
                    onClick={toggleLogin || selectPlan}
                >
                    {getButtonText(card, { plan: selectedPlan, hasActivePlan }, toggleLogin)}
                </button>
            </div>
            {!price && <Tooltip anchorEl={anchorEl} iconName="infoBlue" placement="bottom-start" {...FREE_PLAN_DATA} />}
        </div>
    );
};
