import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import pdf from '@assets/images/new-pdf.svg';
import retry from '@assets/images/plans/retry-multicolor.svg';
import finish from '@assets/images/plans/finish-multicolor.svg';
import type { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { getInfoPayment, setInfoPayment } from '@redux/payments/actions';
import { PSE_RESPONSE } from '@pages/purchasing-process';
import InactivityDetector from '@pages/payment-methods/components';
import { formatMoney } from '@utils/Decimals';
import { removeCharacters } from '@utils/Text';
import LocalStorage from '@utils/LocalStorage';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { PAYMENT_DATA } from '@constants/Plans';
import { APPROVED, Field, PURCHASE_PARAMS, getReferenceId, getRequestFile, FILE_TITLE, PENDING, REJECTED } from '.';
import './PurchaseSummary.scss';

export const PurchaseSummary: React.FC<{
    finalizeTransaction: (message?: string) => void;
    retryTransaction: () => void;
    handleInactivity: () => void;
}> = ({ finalizeTransaction, retryTransaction, handleInactivity }) => {
    const dispatch = useDispatch();
    const { search } = useLocation();

    const { statusPaymentInfo } = useSelector(({ payments }: RootState) => ({
        ...payments,
    }));

    const [paymentDataToStore, setPaymentDataToStore] = useState<{ data: IGenericRecord; request: IGenericRecord }>({
        data: {},
        request: {},
    });

    const getPurchaseData = (url: string): IGenericRecord => {
        if (!url) return {};
        const data: IGenericRecord = { transactionId: getReferenceId(url) };
        url.replace('?', '')
            .split('&')
            .forEach(item => {
                if (PURCHASE_PARAMS.some(param => item.includes(param))) {
                    const [key, value] = item.split('=');
                    data[key] = value;
                }
            });
        return data;
    };

    const data = useMemo(() => getPurchaseData((search || LocalStorage.get(PSE_RESPONSE)) ?? ''), [search]);

    useEffect(() => {
        if (data?.transactionId) dispatch(setInfoPayment(data?.transactionId, data));

        const paymentDataLocalStorage = LocalStorage.get(PAYMENT_DATA);

        if (paymentDataLocalStorage) {
            const parsedData = JSON.parse(paymentDataLocalStorage);

            setPaymentDataToStore({
                data: parsedData.data,
                request: parsedData.request,
            });
        }
    }, []);

    useEffect(() => {
        if (data?.transactionId) LocalStorage.set(PSE_RESPONSE, search);
    }, [data?.transactionId]);

    const refreshPaymentInfo = (): void => {
        if (data?.transactionId) dispatch(getInfoPayment(data?.transactionId));
    };

    const paymentData = useMemo(() => {
        return statusPaymentInfo?.transactionId ? statusPaymentInfo : data;
    }, [statusPaymentInfo, data]);

    const isPurchaseRejected = paymentData?.message !== APPROVED;
    const isPurchaseApproved = paymentData?.message === APPROVED;
    const isPurchasePending = paymentData?.message === PENDING;

    const descriptionPage =
        isPurchaseRejected && !isPurchasePending ? (
            <>
                Visualice los datos de la compra. En caso de que su transacción haya sido rechazada haga click en
                <span className="font-allerbold"> Reintentar transacción.</span>
            </>
        ) : (
            <>Visualice los datos de la compra.</>
        );

    const statusMessage = isPurchasePending ? PENDING : isPurchaseApproved ? APPROVED : REJECTED;

    const downloadFile = (): void => {
        dispatch(
            getFile(
                getRequestFile({
                    ...paymentData,
                    pseBank: removeCharacters(paymentData?.pseBank),
                    description: removeCharacters(paymentData?.description),
                    client_name: paymentDataToStore.data.client_name,
                    document_type: paymentDataToStore.data.document_type,
                    document_number: paymentDataToStore.data.document_number,
                }),
                FILE_TITLE
            )
        );
    };

    return (
        <div className="purchase-summary">
            <h2 className="page-subtitle">Datos de la compra</h2>
            <p className="text-center text-gray-dark my-4.5 font-aller text-2lg">{descriptionPage}</p>
            <div className="flex gap-4.5">
                {!isPurchaseRejected && !isPurchasePending && (
                    <div
                        id={generateId({
                            module: ModuleApp.PAYMENT_PLANS,
                            submodule: 'summary-pse-pdf',
                            action: ActionElementType.DOWNLOAD,
                            elementType: ElementType.BTN,
                        })}
                        className="purchase-summary__card"
                        onClick={downloadFile}
                    >
                        <img src={pdf} alt="Download pdf" />
                        <p className="purchase-summary__card-text">Descargar PDF</p>
                    </div>
                )}
                {!isPurchasePending && (
                    <div
                        id={generateId({
                            module: ModuleApp.PAYMENT_PLANS,
                            submodule: 'summary-pse-finalize-transaction',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="purchase-summary__card"
                        onClick={(): void => finalizeTransaction(paymentData?.message)}
                    >
                        <img src={finish} alt="Finish transaction" />
                        <p className="purchase-summary__card-text">Finalizar transacción</p>
                    </div>
                )}
                {isPurchaseRejected && !isPurchasePending && (
                    <div
                        id={generateId({
                            module: ModuleApp.PAYMENT_PLANS,
                            submodule: 'summary-pse-pdf-transaction',
                            action: ActionElementType.RETRY,
                            elementType: ElementType.BTN,
                        })}
                        className="purchase-summary__card"
                        onClick={(): void => retryTransaction()}
                    >
                        <img src={retry} alt="Finish transaction" />
                        <p className="purchase-summary__card-text">Reintentar transacción</p>
                    </div>
                )}
                {isPurchasePending && (
                    <div
                        id={generateId({
                            module: ModuleApp.PAYMENT_PLANS,
                            submodule: 'summary-pse-transaction',
                            action: ActionElementType.REFRESH,
                            elementType: ElementType.BTN,
                        })}
                        className="purchase-summary__card"
                        onClick={(): void => refreshPaymentInfo()}
                    >
                        <img src={retry} alt="Refresh transaction" />
                        <p className="purchase-summary__card-text">Actualizar estado</p>
                    </div>
                )}
            </div>
            <form className="purchase-summary__form">
                <h2 className="text-green font-allerbold mb-4.5">Resultados de la operación</h2>
                <div className="purchase-summary__group">
                    <Field label="Nombre del cliente" value={paymentDataToStore.data.client_name ?? ''} />
                    <Field label="Tipo de documento" value={paymentDataToStore.data.document_type ?? ''} />
                    <Field label="Número de documento" value={paymentDataToStore.data.document_number ?? ''} />
                </div>
                <div className="purchase-summary__group">
                    <Field label="Fecha" value={paymentData?.processingDate} />
                    <Field label="Estado" value={statusMessage} />
                    <Field label="Referencia de pedido" value={paymentData?.transactionId} />
                </div>
                <div className="purchase-summary__group">
                    <Field label="Número de transacción" value={paymentData?.cus} />
                    <Field label="Referencia de transacción" value={paymentData?.referenceCode} />
                </div>
                <div className="purchase-summary__group">
                    <Field label="Banco" value={removeCharacters(paymentData?.pseBank)} />
                    <Field label="Valor" value={formatMoney(paymentData?.TX_VALUE, 0)} />
                    <Field label="Moneda" value={paymentData?.currency} />
                </div>
                <div className="purchase-summary__group">
                    <Field label="Descripción" fullSize value={decodeURIComponent(removeCharacters(paymentData?.description))} />
                </div>
            </form>
            <InactivityDetector onInactive={handleInactivity} />
        </div>
    );
};
