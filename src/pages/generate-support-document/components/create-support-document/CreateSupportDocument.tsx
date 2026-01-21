import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getInvoiceCalculations, getPrefix } from '@redux/electronic-invoice/actions';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { assignValue } from '@utils/Json';
import { calculatePercentage } from '@utils/Number';
import { tableTotalsToJson } from '@utils/ElectronicNote';
import { getDateAnyFormat, getTodaysTime } from '@utils/Date';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupportDocumentForm } from '@models/SupportDocument';
import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import useParam from '@hooks/useParam';
import useInvoiceHeader from '@hooks/useInvoiceHeader';
import { INIT_SUPPORT_DOCUMENT, KEYS_ASSIGN_DRAFT, KEYS_ASSIGN_SUPPLIER } from '@constants/SupportDocument';
import { DATA_TAXES, SUPPORTING_DOCUMENT, DATA_WITHHOLDINGS, DATA_TABLE_TOTALS } from '@constants/ElectronicInvoice';
import { INFORMATION_PAGE } from '@information-texts/GenerateSupportDocument';
import { NA } from '@components/table';
import InvoiceHeader from '@components/Invoice-header';
import { IDataTableTotals } from '@components/table-totals';
import { InformationElectronicDocument } from '@components/information';
import { SupportDocumentAndBuying } from '@components/support-document-and-buy';
import { SupportContext } from '@pages/generate-support-document/context';

export const CreateSupportDocument: React.FC = () => {
    const dispatch = useDispatch();
    const { queryParam: supportId } = useParam('ID');
    const {
        optionsForm,
        products,
        submit,
        setSupportDocument,
        reset,
        setReset,
        validations: { supportError },
        cardFile,
        setCardFile,
    } = useContext(SupportContext);
    const [messageFuente, messageIca, messageIva] = supportError.retentions;
    const {
        informationCompany,
        invoiceCalculates,
        suppliers: {
            suppliers: { data: suppliers },
            selectedSupplier,
        },
        quantityInvoices = {},
        draftDocument,
    } = useSelector(({ company, electronicInvoice, suppliers, cancellationElectronicDocuments }: RootState) => ({
        informationCompany: company.information,
        invoiceCalculates: electronicInvoice.invoiceCalculations,
        suppliers: suppliers,
        draftDocument: cancellationElectronicDocuments.document,
        ...electronicInvoice,
    }));
    const [fieldsValue, setFieldsValue] = useState<ISupportDocumentForm>({ ...INIT_SUPPORT_DOCUMENT });
    const [tableDetail, setTableDetail] = useState<IInvoiceDetails[]>([]);
    const [tableTaxes, setTableTaxes] = useState<ITableTaxesAndRetention[]>([...DATA_TAXES]);
    const [tableRetentions, setTableRetentions] = useState<ITableTaxesAndRetention[]>([...DATA_WITHHOLDINGS(true)]);
    const [tableTotals, setTableTotals] = useState<IDataTableTotals[]>([...DATA_TABLE_TOTALS({ isSupportOrDocument: true })]);
    const {
        centerColumn,
        leftColumn,
        propsInput: { valueSelect, ...propsInput },
    } = useInvoiceHeader();

    const draftSupportAssign = (): void => {
        const { invoice_details, withholdings, sending_charge, ...formValues } = assignValue(KEYS_ASSIGN_DRAFT, draftDocument);
        const mainTable: IInvoiceDetails[] = invoice_details.map(
            ({ warehouse_name, batch_number, date_expiration, ...product }: IInvoiceDetails) => {
                return {
                    ...product,
                    warehouse_name: warehouse_name ? warehouse_name : NA,
                    batch_number: batch_number ? batch_number : NA,
                    date_expiration: date_expiration ? date_expiration : NA,
                    percentage_discount: calculatePercentage(product.unit_value, product.discount),
                };
            }
        );
        setFieldsValue({ ...fieldsValue, ...formValues });
        setTableRetentions([...withholdings]);
        setTableDetail([...mainTable]);
        dispatch(getInvoiceCalculations({ products: mainTable, sending_charge, withholdings }));
    };

    useEffect(() => {
        if (supportId) dispatch(getSpecificDocument(supportId));
    }, [supportId]);

    useEffect(() => {
        if (supportId && draftDocument && Object.keys(draftDocument).length) draftSupportAssign();
    }, [draftDocument, products]);

    useEffect(() => {
        if (reset) {
            setFieldsValue({ ...INIT_SUPPORT_DOCUMENT });
            setTableDetail([]);
            setTableTaxes([...DATA_TAXES]);
            setTableRetentions([...DATA_WITHHOLDINGS(true)]);
            setTableTotals([...DATA_TABLE_TOTALS({ isSupportOrDocument: true })]);
            setReset(!reset);
        }
    }, [reset]);

    useEffect(() => {
        if (fieldsValue.prefix_id) dispatch(getPrefix(fieldsValue.prefix_id));
    }, [fieldsValue.prefix_id]);

    useEffect(() => {
        if (supportId) return;
        const option = optionsForm.foreignExchange.find(option => option.value === informationCompany?.foreign_exchange_id) || {
            value: '',
            name: '',
        };
        const { fiscal_responsibilities, ...supplier } = assignValue(
            KEYS_ASSIGN_SUPPLIER,
            suppliers.find((supplier: IGenericRecord) => selectedSupplier.personId === supplier.person_id) || {}
        );
        setFieldsValue({
            ...fieldsValue,
            company_postal_code: informationCompany?.postal_code || '',
            foreign_exchange_id: String(option.value),
            foreign_exchange_name: option.name,
            company_address: informationCompany?.address || '',
            send_address: informationCompany?.address || '',
            ...supplier,
            fiscal_responsibilities,
            person_id: selectedSupplier.personId,
            name: selectedSupplier.name,
        });
    }, [informationCompany, optionsForm.foreignExchange]);

    useEffect(() => {
        setSupportDocument({
            ...fieldsValue,
            ...tableTotalsToJson(invoiceCalculates, tableRetentions),
            lang: valueSelect,
            taxes: tableTaxes,
            products: tableDetail,
            withholdings: tableRetentions,
        });
    }, [fieldsValue, tableDetail, tableTaxes, tableRetentions, tableTotals, valueSelect]);

    return (
        <>
            <InformationElectronicDocument
                {...INFORMATION_PAGE}
                title="Generar documento soporte"
                quantityInvoices={quantityInvoices}
            />
            <InvoiceHeader
                leftColumn={leftColumn()}
                centerColumn={centerColumn({ documentType: SUPPORTING_DOCUMENT, isElectronicDocument: false })}
                textBack={INFORMATION_PAGE.TEXT_DATE}
                propsInput={{ ...propsInput, valueSelect }}
                cardFile={{
                    file: cardFile,
                    updateFile: (logo): void => setCardFile(logo),
                }}
                dates={{
                    transmission: getDateAnyFormat(fieldsValue.date),
                    hour: getTodaysTime(),
                    expiration: getDateAnyFormat(fieldsValue.date_limit),
                }}
            />
            <SupportDocumentAndBuying
                errorsCustom={supportError.form}
                errorsTableProduct={supportError.details}
                errorsTableRetention={{ messageFuente, messageIca, messageIva }}
                isSubmit={submit}
                products={products}
                optionsForm={optionsForm}
                fieldsValues={fieldsValue}
                setFieldsValues={setFieldsValue}
                setTableDetail={setTableDetail}
                setTableRetention={setTableRetentions}
                setTableTaxes={setTableTaxes}
                setTableTotals={setTableTotals}
                tableDetail={tableDetail}
                tableRetention={tableRetentions}
                tableTotals={tableTotals}
            />
        </>
    );
};
