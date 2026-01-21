import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardFile } from '@components/card-file';
import { INFORMATION } from '@information-texts/Invoice';
import { RootState } from '@redux/rootReducer';
import { getPrefixCompany } from '@redux/electronic-invoice/actions';
import { FIRST_PURCHASE_INVOICE, ICardsProps, PREFIX_INDEX } from '.';
import './Cards.scss';

export const PurchaseInvoiceCards: React.FC<ICardsProps> = ({ invoiceData, companyData, updateInvoiceData, isEdit }) => {
    const dispatch = useDispatch();
    const { filesLogo: file } = useSelector((state: RootState) => state.parameterizationInvoice);
    const { storePrefix } = useSelector((state: RootState) => state.electronicInvoice);

    const [prefix, invoiceNumber] = useMemo(() => {
        const { last_consecutive_number, number } = storePrefix[PREFIX_INDEX] || {
            last_consecutive_number: 0,
            number: 0,
        };
        return [
            invoiceData?.prefix_id,
            isEdit
                ? invoiceData.number || FIRST_PURCHASE_INVOICE
                : (last_consecutive_number || number) + FIRST_PURCHASE_INVOICE ?? FIRST_PURCHASE_INVOICE,
        ];
    }, [invoiceData, storePrefix, isEdit]);

    useEffect(() => {
        updateInvoiceData({ ...invoiceData, urlLogo: file?.url });
    }, [file]);

    useEffect(() => {
        if (prefix) dispatch(getPrefixCompany({ prefixes: [prefix] }));
    }, [prefix]);

    return (
        <div className="purchase-cards">
            <CardFile
                file={invoiceData?.logo}
                url={invoiceData?.urlLogo}
                className="purchase-cards__logo-card"
                updateFile={(logo): void => updateInvoiceData({ ...invoiceData, logo, urlLogo: '' })}
            />
            <div className="purchase-cards__company-card">{INFORMATION.COMPANY(companyData)}</div>
            <div className="purchase-cards__numeration-card">{INFORMATION.PURCHASE_NUMBER(invoiceNumber)}</div>
        </div>
    );
};
