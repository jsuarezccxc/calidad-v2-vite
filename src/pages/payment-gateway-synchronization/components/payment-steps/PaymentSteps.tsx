import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import { PAYMENT_CATEGORIES } from '@information-texts/PaymentGatewaySynchronization';
import { ONE } from '@constants/ElectronicInvoice';
import { SUB_TITLE } from '@constants/PaymentGatewaySynchronization';
import { Icon } from '@components/icon';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { CardSection, SimpleCard } from '../card';
import { getLocalStorage, routesToSteps } from '..';
import { IPaymentInstructionsProps, UTILS } from '.';

export const PaymentSteps: React.FC<IPaymentInstructionsProps> = ({ type }) => {
    const [history, { getRoute, Routes, getRouteName }] = [useHistory(), UTILS];
    const { pathname } = useLocation();
    const { title, cardOne, cardTwo } = PAYMENT_CATEGORIES[type];

    const handleClick = (step: number): void => {
        const url = `${pathname}?type=${type}&step=${step + ONE}`;
        history.push(url);
    };

    const handleCheck = (index: number): boolean => {
        const { stepComplete } = getLocalStorage(type);
        return stepComplete.includes(`${pathname}?type=${type}&step=${index + ONE}`);
    };

    const handleBlocked = (index: number): boolean => {
        if (!index) return true;
        const { stepComplete } = getLocalStorage(type);
        return stepComplete.includes(`${pathname}?type=${type}&step=${index}`);
    };

    return (
        <>
            <BreadCrumb routes={routesToSteps(type)} />
            <Information title={SUB_TITLE} classNameSubContainer="justify-center items-center" classNameTitle="sub-title-pages" />
            <section className="content-steps">
                <div className="content-steps__column">
                    <h3 className="content-steps__column__title">{title}</h3>
                    {UTILS.CARD_OPTIONS[type].map((item, index) => (
                        <CardSection
                            {...item}
                            key={`card-${index}`}
                            isCheck={handleCheck(index)}
                            isNotBlocked={handleBlocked(index)}
                            onClick={(): void => handleClick(index)}
                        />
                    ))}
                </div>
                <div className="content-steps__column">
                    <article className="content-steps__question-card">
                        <span className="text-sm text-white">Preguntas frecuentes</span>
                        <Icon name="questionRoundedGreen" className="content-steps__question-card__img" />
                    </article>
                    <SimpleCard className="payment-gateway-synchronization__simple-card" onClick={(): void => {}}>
                        {cardOne}
                    </SimpleCard>
                    <SimpleCard className="payment-gateway-synchronization__simple-card" onClick={(): void => {}}>
                        {cardTwo}
                    </SimpleCard>
                </div>
            </section>
            <PageButtonsFooter
                className="margin-t-auto"
                {...buttonsFooterProps(ModuleApp.PAYMENT_GATEWAY_WEBSITE, history, getRoute(Routes.PRODUCT_DATABASE), {
                    name: getRouteName(Routes.PAYMENT_GATEWAY_SYNCHRONIZATION),
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
            />
        </>
    );
};
