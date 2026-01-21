import React from 'react';
import { useHistory } from 'react-router';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import { SUB_TITLE } from '@constants/PaymentGatewaySynchronization';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { CardImg } from '../card';
import { UTILS } from '.';

export const PaymentCategories: React.FC = () => {
    const history = useHistory();

    const handleClick = (route: string): void => history.push(route);

    return (
        <>
            <BreadCrumb routes={UTILS.routes()} />
            <Information title={SUB_TITLE} classNameSubContainer="justify-center items-center" classNameTitle="sub-title-pages" />
            <h3 className="title-section">Sincronización de pasarelas de pago con diggi pymes</h3>
            <div className="content-cards">
                {UTILS.CARDS.map((card, index) => (
                    <CardImg key={index} {...card} onClick={(): void => handleClick(card.route)} />
                ))}
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.PAYMENT_GATEWAY_WEBSITE, history, UTILS.NEXT_PAGE, UTILS.VALIDATION_MODULE)}
                className="margin-t-auto"
            />
        </>
    );
};
