import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ChangeEvent, TextArea } from '@components/input';
import { SharedModal } from '@components/modal';

import { ProductsTable } from '@pages/generate-sales-invoice/components';

import { MANDATE } from '@constants/Invoice';
import { ContingencyState } from '@constants/ContingencyActivation';
import { DATA_WITHHOLDINGS, INVOICE_CALCULATES } from '@constants/ElectronicInvoice';
import { ModalType } from '@constants/Modal';
import { MINIMUM_VALUE } from '@constants/QuoteViewLabels';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

import useModal from '@hooks/useModal';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import useTable from '@hooks/useTable';

import { INFORMATION } from '@information-texts/GenerateSalesInvoice';

import { Form as FormQuery } from '@models/ElectronicDocuments';
import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IQuoteProduct } from '@models/QuoteGeneration';
import { FieldName, Modal } from '@models/SalesInvoice';

import { getSpecificDocument, setSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { setClientSelected } from '@redux/client-portal/actions';
import { getInvoiceCalculations as getTotals, setInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { ISetInvoiceCalculations } from '@redux/electronic-invoice/types';
import { RootState } from '@redux/rootReducer';

import { calculateQuoteVat } from '@utils/quoteCalculations';

import {
    calculateQuoteProductTaxes,
    calculateWithholdingValues,
    getQuotePerishableErrors,
    IQuoteBillingInformationProps,
    IQuoteInvoiceState,
    isDraftDocumentReady,
    isStateDataReadyForTotals,
    processDraftDocument,
    QUOTE_PAYMENT_METHOD,
    QUOTE_REQUIRED_TABLE_FIELDS,
    QuoteInvoiceForm,
    QuoteSubTotals,
    QuoteWithholdingTable,
    VARIABLE_TYPE,
} from '.';

import './QuoteBillingInformation.scss';

export const QuoteBillingInformation: React.FC<IQuoteBillingInformationProps> = ({
    formData,
    openForm,
    updateFormData,
    isContingency,
    validate,
    onProductsChange,
    onWithholdingsChange,
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
    const [productData, setProductData] = useState<IQuoteProduct[]>([]);
    const [sendingCharge, setSendingCharge] = useState<number>(0);
    const [withholdingTable, setWithholdingData] = useState<ITableTaxesAndRetention[]>(DATA_WITHHOLDINGS());
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [pendingDeleteProducts, setPendingDeleteProducts] = useState<IQuoteProduct[]>([]);
    const [isLoadingFromState, setIsLoadingFromState] = useState<boolean>(false);
    const includeSupplier = formData?.[FieldName.OperationType] === MANDATE;

    const productsWithTaxes = useMemo(() => {
        return calculateQuoteProductTaxes(productData);
    }, [productData]);

    const { errorMessages } = useTable(productData, QUOTE_REQUIRED_TABLE_FIELDS(includeSupplier));
    const { toggleModal } = useModal({ [Modal.ErrorDIAN]: false });
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
        getQuoteTotals();
    }, [consultTotals, sendingCharge]);

    useEffect(() => {
        if (!isContingency && contingency?.status === ContingencyState.InProgress) toggleModal(Modal.ErrorDIAN);
    }, [contingency]);

    useEffect(() => {
        if (stateInvoice && !!Object.keys(stateInvoice).length) assignToState();
    }, [stateInvoice]);

    useEffect(() => {
        if (isLoadingFromState) {
            return;
        }
        setWithholdingData(calculateWithholdings());
    }, [productsWithTaxes]);

    useEffect(() => {
        if (onProductsChange) {
            const invoiceDetails: IInvoiceDetails[] = productsWithTaxes.map(product => ({
                ...product,
                batch_number: product.batch_number || null,
            })) as IInvoiceDetails[];
            onProductsChange(invoiceDetails);
        }
    }, [productsWithTaxes, onProductsChange]);

    useEffect(() => {
        if (onWithholdingsChange) onWithholdingsChange(withholdingTable);
    }, [withholdingTable]);

    useEffect(() => {
        if (sendingCharge !== formData.sending_charge) {
            updateFormData({ ...formData, sending_charge: sendingCharge });
        }
    }, [sendingCharge]);

    const draftDocumentAssign = (): void => {
        const result: IQuoteInvoiceState = processDraftDocument(draftDocument, formData, updateFormData, products as IQuoteProduct[]);

        setProductData([...result.productData]);
        setSendingCharge(result.sendingCharge);
        setWithholdingData([...result.withholdingTable]);
        setConsulTotals(true);
    };

    const calculateWithholdings = (): ITableTaxesAndRetention[] => {
        return calculateWithholdingValues(productsWithTaxes as IInvoiceDetails[], withholdingTable, calculateQuoteVat);
    };

    const getQuoteTotals = (): ISetInvoiceCalculations | void => {
        if (productData.length === MINIMUM_VALUE) return dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        if (consultTotals) {
            const calculatedWithholdings = calculateWithholdings();

            dispatch(
                getTotals({
                    products: productsWithTaxes.map(item => ({
                        ...item,
                        taxes: item?.product_taxes ?? [],
                    })),
                    withholdings: calculatedWithholdings,
                    sending_charge: sendingCharge,
                })
            );
            toggleTotalsQuery();
        }
    };

    const assignToState = async (): Promise<void> => {
        const { formData: form, productData: details, sendingCharge: charge, withholdingTable: retentions } = stateInvoice || {};

        setIsLoadingFromState(true);

        if (form) updateFormData({ ...form });
        if (typeof charge === VARIABLE_TYPE.NUMBER) setSendingCharge(charge);
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

        setTimeout(() => {
            setIsLoadingFromState(false);
        }, 100);
    };

    const handleValueChange = ({ target: { name, value } }: ChangeEvent): void => updateFormData({ ...formData, [name]: value });

    const toggleTotalsQuery = useCallback((): void => setConsulTotals(!consultTotals), [consultTotals]);

    const perishableErrors = getQuotePerishableErrors(productData);

    const handleToClientPage = (): void => {
        openForm(FormQuery.Client);
    };

    const updateSendingChargeCallback = useCallback(({ value }: { value: number }): void => setSendingCharge(value), []);

    const handleUpdateData = useCallback(
        (products: IInvoiceDetails[]): void => {
            const hasDeletedItems = products.length < productData.length;
            const hasCheckedItems = productData.some(item => item.checked);

            if (hasDeletedItems && hasCheckedItems) {
                setPendingDeleteProducts([...products] as unknown as IQuoteProduct[]);
                setShowDeleteModal(true);
                return;
            }

            setProductData([...products] as unknown as IQuoteProduct[]);
            toggleTotalsQuery();
        },
        [productData, toggleTotalsQuery]
    );

    const handleConfirmDelete = (): void => {
        setProductData(pendingDeleteProducts);
        toggleTotalsQuery();
        setShowDeleteModal(false);
        setPendingDeleteProducts([]);
    };

    const handleCloseDeleteModal = (): void => {
        setShowDeleteModal(false);
        setPendingDeleteProducts([]);
    };

    return (
        <>
            <div className="w-full">
                <QuoteInvoiceForm
                    formData={formData}
                    validate={validate}
                    openForm={handleToClientPage}
                    isContingency={isContingency}
                    updateFormData={updateFormData}
                />
                <p className="text-tiny text-blue my-4.5">{INFORMATION.PRODUCT_TABLE_INDICATION}</p>
                <ProductsTable
                    symbol="$"
                    data={productData as unknown as IInvoiceDetails[]}
                    validate={validate}
                    errorMessages={errorMessages}
                    perishableErrors={perishableErrors}
                    toggleTotalsQuery={toggleTotalsQuery}
                    foreignExchangeRate={1}
                    isMandate={formData?.[FieldName.OperationType] === MANDATE}
                    updateData={handleUpdateData}
                />
                <div className="flex flex-col w-full gap-4 lg:flex-row">
                    <div>
                        <QuoteWithholdingTable
                            withholdingData={withholdingTable}
                            updateWithholdingData={(data: ITableTaxesAndRetention[]): void => setWithholdingData(data)}
                            toggleTotalsQuery={toggleTotalsQuery}
                        />
                        <div className="billing-information__lower-section">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-observations`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="billing-information__text-area"
                                labelText="Observaciones:" // cspell: disable-line
                                rows={4}
                                onChange={handleValueChange}
                                value={formData.note}
                                name="note"
                                disabled={disabledInputs}
                            />
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-internal-notes`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="billing-information__text-area"
                                labelText="Comentario para uso interno:" // cspell: disable-line
                                rows={4}
                                onChange={handleValueChange}
                                value={formData.internal_notes}
                                name="internal_notes"
                                tooltip={INFORMATION.INTERNAL_NOTES}
                                disabled={disabledInputs}
                            />
                        </div>
                    </div>
                    <QuoteSubTotals
                        totals={invoiceValues}
                        sendingCharge={sendingCharge}
                        updateSendingCharge={updateSendingChargeCallback}
                        disableShippingCost={!productData.some(product => product.sku_internal)}
                        toggleTotalsQuery={toggleTotalsQuery}
                    />
                </div>
            </div>

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-delete-product`}
                open={showDeleteModal}
                type={ModalType.Delete}
                handleClosed={handleCloseDeleteModal}
                finalAction={handleConfirmDelete}
            />
        </>
    );
};
