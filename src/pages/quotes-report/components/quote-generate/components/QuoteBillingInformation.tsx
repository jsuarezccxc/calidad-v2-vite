import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { ChangeEvent, TextArea } from '@components/input';
import { SharedModal } from '@components/modal';
import { ContingencyState } from '@constants/ContingencyActivation';
import { INVOICE_CALCULATES } from '@constants/ElectronicInvoice';
import { MANDATE } from '@constants/Invoice';
import { ModalType } from '@constants/Modal';
import { INFORMATION } from '@information-texts/GenerateSalesInvoice';
import { Form as FormQuery } from '@models/ElectronicDocuments';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName, Modal } from '@models/SalesInvoice';
import { getSpecificDocument, setSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { setClientSelected } from '@redux/client-portal/actions';
import { getInvoiceCalculations as getTotals, setInvoiceCalculations, setStateInvoice } from '@redux/electronic-invoice/actions';
import { ISetInvoiceCalculations } from '@redux/electronic-invoice/types';
import { RootState } from '@redux/rootReducer';
import useModal from '@hooks/useModal';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import useTable from '@hooks/useTable';
import { useBillingTableHandlers } from '../hooks/useBillingTableHandlers';
import {
    calculateQuoteProductTaxes,
    calculateWithholdingValues,
    createTableConfig,
    getQuotePerishableErrors,
    IQuoteBillingInformationProps,
    isDraftDocumentReady,
    isStateDataReadyForTotals,
    processDraftDocument,
    QUOTE_MODALS,
    QUOTE_PAYMENT_METHOD,
    QUOTE_REQUIRED_TABLE_FIELDS,
    QUOTE_WITHHOLDING_DATA,
    QuoteFinancialSummary,
    QuoteInvoiceForm,
    QuoteProductsTable,
} from '.';

export const QuoteBillingInformation: React.FC<IQuoteBillingInformationProps> = ({
    formData,
    openForm,
    updateFormData,
    isContingency,
    onProductsChange,
}) => {
    const dispatch = useDispatch();
    const { queryParam: quoteId }: { queryParam: string } = useParam('ID');

    const { products, stateInvoice, invoiceValues, draftDocument, contingency } = useSelector(
        ({ electronicInvoice, cancellationElectronicDocuments, contingency }: RootState) => ({
            products: electronicInvoice.products || [],
            stateInvoice: electronicInvoice.stateInvoice,
            invoiceValues: electronicInvoice.invoiceCalculations,
            draftDocument: cancellationElectronicDocuments.document,
            contingency: contingency.contingency,
        })
    );

    const [consultTotals, setConsulTotals] = useState<boolean>(false);
    const [productData, setProductData] = useState<IInvoiceDetails[]>([]);
    const [sendingCharge, setSendingCharge] = useState<number>(0);
    const [withholdingTable, setWithholdingData] = useState<IGenericRecord[]>(QUOTE_WITHHOLDING_DATA);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const includeSupplier = formData?.[FieldName.OperationType] === MANDATE;

    const productsWithTaxes = useMemo(() => {
        return calculateQuoteProductTaxes(productData);
    }, [productData]);

    const { errorMessages } = useTable(productData, QUOTE_REQUIRED_TABLE_FIELDS(includeSupplier));
    const { toggleModal } = useModal(QUOTE_MODALS);

    const { disabledInputs } = usePermissions();

    useEffect(() => {
        dispatch(setSpecificDocument({}));
        return (): void => {
            dispatch(setClientSelected({}));
            dispatch(setSpecificDocument({}));
        };
    }, []);

    useEffect(() => {
        if (quoteId) dispatch(getSpecificDocument(quoteId));
    }, [quoteId]);

    useEffect(() => {
        if (isDraftDocumentReady(quoteId, draftDocument)) draftDocumentAssign();
    }, [draftDocument, products]);

    useEffect(() => {
        if (!formData.payment_method_id) updateFormData({ ...formData, ...QUOTE_PAYMENT_METHOD });
    }, []);

    useEffect(() => {
        setSendingCharge(invoiceValues?.total_charge_amount);
    }, [invoiceValues]);

    useEffect(() => {
        setWithholdingData(calculateWithholdings());
    }, [productsWithTaxes]);

    useEffect(() => {
        getQuoteTotals();
    }, [consultTotals, sendingCharge]);

    useEffect(() => {
        if (!isContingency && contingency?.status === ContingencyState.InProgress) toggleModal(Modal.ErrorDIAN);
    }, [contingency]);

    useEffect(() => {
        if (stateInvoice && !!Object.keys(stateInvoice).length) assignToState();
    }, [stateInvoice]);

    useEffect(() => {
        if (onProductsChange) onProductsChange(productsWithTaxes);
    }, [productsWithTaxes, onProductsChange]);

    const draftDocumentAssign = (): void => {
        const { processedProducts, sendingCharge, withholdings } = processDraftDocument(
            draftDocument,
            formData,
            updateFormData,
            products
        );

        setProductData([...processedProducts]);
        setSendingCharge(sendingCharge);
        setWithholdingData([...withholdings]);
        setConsulTotals(true);
    };

    const getQuoteTotals = (): ISetInvoiceCalculations | void => {
        if (!productData.length) return dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        if (consultTotals) {
            dispatch(
                getTotals({
                    products: productsWithTaxes.map(item => ({
                        ...item,
                        taxes: item?.product_taxes ?? [],
                    })),
                    withholdings: calculateWithholdings(),
                    sending_charge: sendingCharge,
                })
            );
            toggleTotalsQuery();
        }
    };

    const calculateWithholdings = (): IGenericRecord[] => {
        return calculateWithholdingValues(productsWithTaxes, withholdingTable);
    };

    const assignToState = async (): Promise<void> => {
        const { formData: form, productData: details, sendingCharge: charge, withholdingTable: retentions } = stateInvoice || {};
        if (form) updateFormData({ ...form });
        if (typeof charge === 'number') setSendingCharge(charge);
        if (details && Array.isArray(details)) setProductData(details);
        if (isStateDataReadyForTotals(details, retentions)) {
            await dispatch(
                getTotals({
                    products: calculateQuoteProductTaxes(details),
                    withholdings: retentions,
                    sending_charge: charge || 0,
                })
            );
        }
        if (retentions && Array.isArray(retentions)) setWithholdingData([...retentions]);
    };

    const handleValueChange = ({ target: { name, value } }: ChangeEvent): void => updateFormData({ ...formData, [name]: value });

    const toggleTotalsQuery = useCallback((): void => setConsulTotals(!consultTotals), [consultTotals]);

    const showDeleteConfirmation = (): void => {
        const hasSelectedItems = productData.some(item => item.checked);
        if (hasSelectedItems) {
            setShowDeleteModal(true);
        }
    };

    const perishableErrors = getQuotePerishableErrors(productData);

    const tableConfig = createTableConfig(productData, errorMessages, perishableErrors);
    const tableHandlers = useBillingTableHandlers(setProductData, toggleTotalsQuery, showDeleteConfirmation);

    const handleToClientPage = (): void => {
        dispatch(setStateInvoice({ formData, productData, withholdingTable, sendingCharge }));
        openForm(FormQuery.Client);
    };

    const updateSendingChargeCallback = useCallback(({ value }: { value: number }): void => setSendingCharge(value), []);

    const handleCloseDeleteModal = (): void => setShowDeleteModal(false);

    const handleConfirmDelete = async (): Promise<void> => {
        try {
            setProductData(productData.filter(item => !item.checked));
            toggleTotalsQuery();
            setShowDeleteModal(false);
        } catch (error) {
            updateFormData({
                ...formData,
                hasDeleteError: true,
                deleteErrorMessage: 'Error eliminando productos seleccionados',
            });
        }
    };

    return (
        <>
            <div className="w-full">
                <QuoteInvoiceForm
                    formData={formData}
                    validate={false}
                    openForm={handleToClientPage}
                    isContingency={isContingency}
                    updateFormData={updateFormData}
                />
                <p className="text-tiny text-blue my-4.5">{INFORMATION.PRODUCT_TABLE_INDICATION}</p>
                <QuoteProductsTable
                    tableConfig={tableConfig}
                    tableHandlers={tableHandlers}
                    tableOptions={{
                        isMandate: formData?.[FieldName.OperationType] === MANDATE,
                    }}
                />
                <div className="flex flex-col w-full gap-4 lg:flex-row">
                    <div>
                        <QuoteFinancialSummary
                            withholdingData={withholdingTable}
                            updateWithholdingData={(data: IGenericRecord[]): void => setWithholdingData(data)}
                            totals={invoiceValues}
                            sendingCharge={sendingCharge}
                            updateSendingCharge={updateSendingChargeCallback}
                            disableShippingCost={!productData.some(product => product.sku_internal)}
                            toggleTotalsQuery={toggleTotalsQuery}
                            isOnlyWithholdingTable={true}
                        />
                        <div className="quote-generate__billing-information--lower-section">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `observations`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                classesWrapper="quote-generate__billing-information--text-area"
                                labelText="Observaciones:"
                                rows={3}
                                onChange={handleValueChange}
                                value={formData.note}
                                name="note"
                                disabled={disabledInputs}
                            />
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `internal-notes`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                classesWrapper="quote-generate__billing-information--text-area"
                                labelText="Comentario para uso interno:"
                                rows={3}
                                onChange={handleValueChange}
                                value={formData.internal_notes}
                                name="internal_notes"
                                tooltip={INFORMATION.INTERNAL_NOTES}
                                disabled={disabledInputs}
                            />
                        </div>
                    </div>
                    <QuoteFinancialSummary
                        withholdingData={withholdingTable}
                        updateWithholdingData={(data: IGenericRecord[]): void => setWithholdingData(data)}
                        totals={invoiceValues}
                        sendingCharge={sendingCharge}
                        updateSendingCharge={updateSendingChargeCallback}
                        disableShippingCost={!productData.some(product => product.sku_internal)}
                        toggleTotalsQuery={toggleTotalsQuery}
                        isOnlySubTotals={true}
                    />
                </div>
            </div>

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-delete`}
                open={showDeleteModal}
                type={ModalType.Delete}
                handleClosed={handleCloseDeleteModal}
                finalAction={handleConfirmDelete}
            />
        </>
    );
};
