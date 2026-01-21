import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useParam from '@hooks/useParam';
import { PageTitle } from '@components/page-title';
import { getCompanyPaymentGateway } from '@redux/payment-gateway/action';
import { PaymentCategories, PaymentInstructions, PaymentSteps } from './components';
import { UTILS } from '.';
import './PaymentGatewaySynchronization.scss';

const PaymentGatewaySynchronization: React.FC = () => {
    const dispatch = useDispatch();
    const { queryParam: paymentType } = useParam('type');
    const { queryParam: step } = useParam('step');

    useEffect(() => {
        dispatch(getCompanyPaymentGateway());
    }, []);

    const switchPage = (type: string, step: string): JSX.Element => {
        if (type && step) return <PaymentInstructions type={type} step={step} />;
        if (type) return <PaymentSteps type={type} />;
        return <PaymentCategories />;
    };

    return (
        <main className="payment-gateway-synchronization">
            <PageTitle title={UTILS.PAGE_TITLE} />
            {switchPage(paymentType, step)}
        </main>
    );
};

export default PaymentGatewaySynchronization;
