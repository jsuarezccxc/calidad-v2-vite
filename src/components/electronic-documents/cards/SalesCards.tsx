import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SelectSearchInput } from '@components/input';
import { CardFile } from '@components/card-file';
import { Form } from '@components/form';
import usePermissions from '@hooks/usePermissions';
import useInvoiceHeader from '@hooks/useInvoiceHeader';
import { INFORMATION } from '@information-texts/Invoice';
import { RootState } from '@redux/rootReducer';
import { getDateAnyFormat } from '@utils/Date';
import { validateDateLimit } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ICardsProps } from '.';
import './Cards.scss';

export const SalesCards: React.FC<ICardsProps> = ({ invoiceData, companyData, updateInvoiceData }) => {
    const { filesLogo: file } = useSelector(({ parameterizationInvoice }: RootState) => parameterizationInvoice);

    const { disabledInputs } = usePermissions();
    const {
        centerColumn,
        propsInput: { valueSelect, ...propsInput },
    } = useInvoiceHeader();

    useEffect(() => {
        updateInvoiceData({ ...invoiceData, urlLogo: file?.url });
    }, [file]);

    useEffect(() => {
        updateInvoiceData({ ...invoiceData, lang: valueSelect });
    }, [valueSelect]);

    const expirationDate = getDateAnyFormat(
        validateDateLimit(Number(invoiceData?.collection_days), invoiceData?.days_collection_type)
    );

    return (
        <>
            <Form sendWithEnter>
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-language`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    classesWrapper="w-37 xs:w-full mb-2"
                    labelText="Idioma del documento:"
                    selectIconType="arrowDownGreen"
                    valueSelect={valueSelect}
                    disabled={disabledInputs}
                    {...propsInput}
                />
            </Form>
            <div className="sales-cards">
                <div className="flex flex-col gap-2">
                    <CardFile
                        className="w-full"
                        file={invoiceData?.logo}
                        url={invoiceData?.urlLogo}
                        updateFile={(logo): void => updateInvoiceData({ ...invoiceData, logo, urlLogo: '' })}
                    />
                    <div className="sales-cards__company-card">{INFORMATION.COMPANY(companyData)}</div>
                </div>
                <div className="sales-cards__billing-card">{centerColumn({ documentType: 'INVOICE' })}</div>
                <div className="flex flex-col gap-2">
                    <div className="sales-cards__code-card">
                        <label className="invoice-cards__text--green">Código QR</label>
                    </div>
                    <div className="sales-cards__date-card">
                        {INFORMATION.INVOICE_DATE(invoiceData?.payment_type_name, expirationDate)}
                    </div>
                </div>
            </div>
            <p className="text-blue text-tiny mt-2 mb-4.5">{INFORMATION.INVOICE_DATE_EXPLANATION}</p>
        </>
    );
};
