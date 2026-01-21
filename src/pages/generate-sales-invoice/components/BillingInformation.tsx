/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { ChangeEvent, TextArea } from '@components/input';
import { OptionalInvoiceFields } from '@components/electronic-documents';
import { SharedModal } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';

import { Routes } from '@constants/Paths';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';
import { TitleButtons } from '@constants/Buttons';
import { BASE, IVA, MANDATE } from '@constants/Invoice';
import { KEYS_ASSIGN_OBJECT } from '@constants/BillingInformation';
import { ContingencyState } from '@constants/ContingencyActivation';
import {
    CONSUMER_CLIENT_DOCUMENT,
    INVOICE_CALCULATES,
    ONE_HUNDRED,
    ONE_THOUSAND,
    TypeFile,
    ValidateClassName,
} from '@constants/ElectronicInvoice';

import useParam from '@hooks/useParam';
import useModal from '@hooks/useModal';
import useTable from '@hooks/useTable';
import usePermissions from '@hooks/usePermissions';
import useScrollToError from '@hooks/useScrollToError';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';

import { IGenericRecord } from '@models/GenericRecord';
import { FieldName, Modal } from '@models/SalesInvoice';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { Form as FormQuery } from '@models/ElectronicDocuments';

import { INFORMATION } from '@information-texts/GenerateSalesInvoice';

import { Direction, DocsInstructionContext } from '@pages/docs-instructions/context';

import { RootState } from '@redux/rootReducer';
import {
    createElectronicInvoiceAction as createInvoice,
    getInvoiceCalculations as getTotals,
    setInvoiceCalculations,
    setStateInvoice,
} from '@redux/electronic-invoice/actions';
import { setClientSelected } from '@redux/client-portal/actions';
import { ISetInvoiceCalculations } from '@redux/electronic-invoice/types';
import { getSpecificDocument, setSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';

import { getSum } from '@utils/Array';
import { assignValue } from '@utils/Json';
import { buttonsFooterProps } from '@utils/Button';
import { validateEmptyFields } from '@utils/Fields';
import { isCorrectResponse } from '@utils/Response';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

import {
    calculateProductTaxes,
    formatInvoiceRequest,
    getPerishableErrors,
    IBillingInformationProps,
    InvoiceForm,
    ProductsTable,
    SubTotals,
    WithholdingTable,
    REQUIRED_FORM_FIELDS,
    WITHHOLDING_DATA,
    REQUIRED_TABLE_FIELDS,
    RESPONSE_MODAL,
    FORM_DATA,
    PAYMENT_METHOD,
    MODALS,
    getModalProps,
    UNAUTHORIZED_DATA,
    INVOICE_TYPES,
    assignProducts,
    calculateVat,
} from '.';

export const BillingInformation: React.FC<IBillingInformationProps> = ({
    formData,
    openForm,
    updateFormData,
    isInsertedPage,
    isContingency,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { queryParam: invoiceId } = useParam('ID');

    const {
        utils,
        products,
        contingency,
        information,
        stateInvoice,
        draftDocument,
        clientSelected: client,
        invoiceCalculations: invoiceValues,
    } = useSelector(
        ({ company, clientPortal, utils, electronicInvoice, cancellationElectronicDocuments, contingency }: RootState) => ({
            ...company,
            ...utils,
            ...clientPortal,
            ...electronicInvoice,
            draftDocument: cancellationElectronicDocuments.document,
            contingency: contingency.contingency,
        })
    );

    const { symbol, calculateWithRate } = useSymbolCurrency(formData?.foreign_exchange_id, products);

    let goBack = (): void => {
        history.goBack();
    };

    if (isInsertedPage) {
        const { getNextStepRoute } = useContext(DocsInstructionContext);
        goBack = (): void => {
            getNextStepRoute(Direction.PREV);
        };
    }

    const [consultTotals, setConsulTotals] = useState<boolean>(false);
    const [productData, setProductData] = useState<IInvoiceDetails[]>([]);
    const [sendingCharge, setSendingCharge] = useState<number>(0);
    const [validate, setValidate] = useState<boolean>(false);
    const [withholdingTable, setWithholdingData] = useState<IGenericRecord[]>(WITHHOLDING_DATA);
    const [invoice, setInvoice] = useState<string>('');
    const includeSupplier = formData?.[FieldName.OperationType] === MANDATE;

    const productsWithTaxes = useMemo(() => calculateProductTaxes(productData), [productData]);

    const { errorMessages, hasEmptyFields } = useTable(productData, REQUIRED_TABLE_FIELDS(includeSupplier));
    const { activeModal, toggleModal } = useModal(MODALS);
    const { scrollToInput } = useScrollToError();

    const { disabledInputs } = usePermissions();

    const draftDocumentAssign = (): void => {
        const { withholdings, invoiceDetails, ...form } = assignValue(KEYS_ASSIGN_OBJECT, draftDocument);
        updateFormData({
            ...formData,
            ...form,
            not_information_customer: form.document_number !== CONSUMER_CLIENT_DOCUMENT,
            operation_type: INVOICE_TYPES.find(item => item.id === form.operation_type_id)?.value,
        });
        setProductData([...calculateWithRate(assignProducts(invoiceDetails, products), form.foreign_exchange_rate)]);
        setSendingCharge(draftDocument?.sending_charge || 0);
        setWithholdingData([...withholdings]);
        setConsulTotals(true);
    };

    const getInvoiceTotals = (): ISetInvoiceCalculations | void => {
        if (!productData.length) return dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        if (consultTotals) {
            dispatch(
                getTotals({
                    products: productsWithTaxes.map(item => ({
                        ...item,
                        quantity: stringToFloat(item.quantity),
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
        return withholdingTable.map(({ name, ...item }: IGenericRecord) => {
            const base = getSum(
                productsWithTaxes.map(({ total_buy, product_taxes }) => ({
                    iva: calculateVat(product_taxes, total_buy),
                    base: total_buy,
                })),
                name === RETE_IVA ? IVA : BASE
            );
            return {
                ...item,
                base,
                name,
                value: (base * item.percentage) / (name === RETE_ICA ? ONE_THOUSAND : ONE_HUNDRED),
            };
        });
    };

    const assignToState = async (): Promise<void> => {
        const { formData: form, productData: details, sendingCharge: charge, withholdingTable: retentions } = stateInvoice;
        const clientId = formData?.client_id || form.client_id;
        updateFormData({ ...form, client_id: clientId });
        setSendingCharge(charge);
        setProductData([...details]);
        await dispatch(
            getTotals({
                sending_charge: charge,
                withholdings: retentions,
                products: calculateProductTaxes(details),
            })
        );
        setWithholdingData([...retentions]);
    };

    const handleValueChange = ({ target: { name, value } }: ChangeEvent): void => updateFormData({ ...formData, [name]: value });

    const perishableErrors = getPerishableErrors(productData);

    const preventSaving = (): { [key: string]: boolean } => {
        return {
            validateTable: hasEmptyFields || !productData.length || !!perishableErrors.length,
            validateForm: validateEmptyFields(REQUIRED_FORM_FIELDS(formData), formData),
        };
    };

    const saveLogo = async (): Promise<void> => {
        const file = formData?.logo;
        if (file) await dispatch(postFileCompanyAction(file, TypeFile.LOGO_INVOICE));
    };

    const saveData = async (isDraft?: boolean): Promise<void> => {
        const { validateTable, validateForm } = preventSaving();
        if (validateTable || validateForm) {
            if (validateForm) scrollToInput();
            if (!validateForm && validateTable) scrollToInput(ValidateClassName.Invoice);
            return setValidate(true);
        }
        const request = formatInvoiceRequest({
            formData: { ...formData, ...(!formData.payment_method_id && PAYMENT_METHOD) },
            information,
            productsWithTaxes,
            utils,
            client,
            invoiceValues,
            withholdingTable,
            products,
            isDraft,
        });
        await Promise.all([dispatch(createInvoice(request)), saveLogo()]).then(([{ statusCode, data }]: any) => {
            const isCorrect = isCorrectResponse(statusCode);
            if (isDraft && isCorrect) return toggleModal(Modal.Draft);
            const [{ answer_dian: dianResponse, id }] = data;
            setInvoice(id);
            toggleModal(isContingency ? Modal.ContingencySave : RESPONSE_MODAL[dianResponse] ?? Modal.InvoiceError);
            if (isCorrect) {
                dispatch(setStateInvoice({}));
                setProductData([]);
                dispatch(setStateInvoice({}));
                dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
                updateFormData({ ...FORM_DATA, ...UNAUTHORIZED_DATA });
                setWithholdingData(WITHHOLDING_DATA);
                setValidate(false);
            }
        });
    };

    const handleToClientPage = (): void => {
        dispatch(setStateInvoice({ formData, productData, withholdingTable, sendingCharge }));
        openForm(FormQuery.Client);
    };

    const resetData = (): void => toggleModal('');

    const toggleTotalsQuery = (): void => setConsulTotals(!consultTotals);

    const fieldProps = { data: formData, handleValueChange, updateData: updateFormData, utils };

    const modalProps = getModalProps({ history, invoice, resetData });

    const stepNameButton = (): string => {
        if (window.location.pathname === getRoute(Routes.DOCS_INSTRUCTIONS)) return TitleButtons.PREV_STEP;
        return TitleButtons.BACK;
    };

    useEffect(() => {
        dispatch(setSpecificDocument({}));
        return (): void => {
            dispatch(setClientSelected({}));
            dispatch(setSpecificDocument({}));
        };
    }, []);

    useEffect(() => {
        if (invoiceId) dispatch(getSpecificDocument(invoiceId));
    }, [invoiceId]);

    useEffect(() => {
        if (invoiceId && draftDocument && Object.keys(draftDocument).length) draftDocumentAssign();
    }, [draftDocument, products]);

    useEffect(() => {
        if (validate && !formData.payment_method_id) updateFormData({ ...formData, ...PAYMENT_METHOD });
    }, [validate]);

    useEffect(() => {
        setSendingCharge(invoiceValues?.total_charge_amount);
    }, [invoiceValues]);

    useEffect(() => {
        setWithholdingData(calculateWithholdings());
    }, [productsWithTaxes]);

    useEffect(() => {
        getInvoiceTotals();
    }, [consultTotals, sendingCharge]);

    useEffect(() => {
        if (!isContingency && contingency.status === ContingencyState.InProgress) toggleModal(Modal.ErrorDIAN);
    }, [contingency]);

    useEffect(() => {
        if (stateInvoice && !!Object.keys(stateInvoice).length) assignToState();
    }, [stateInvoice]);

    useEffect(() => {
        if (lengthGreaterThanZero(productData)) {
            setProductData([...calculateWithRate(productData, formData?.foreign_exchange_rate)]);
            setConsulTotals(true);
        }
    }, [formData?.foreign_exchange_rate]);

    return (
        <>
            {activeModal && <SharedModal {...modalProps[activeModal]} />}
            <div className="billing-information">
                <h3 className="font-allerbold text-blue mb-4.5" onClick={saveLogo}>
                    Información para facturar
                </h3>
                <InvoiceForm
                    formData={formData}
                    validate={validate}
                    openForm={handleToClientPage}
                    isContingency={isContingency}
                    updateFormData={updateFormData}
                />
                <OptionalInvoiceFields {...fieldProps} />
                <p className="text-tiny text-blue my-4.5">{INFORMATION.PRODUCT_TABLE_INDICATION}</p>
                <ProductsTable
                    symbol={symbol}
                    data={productData}
                    validate={validate}
                    errorMessages={errorMessages}
                    perishableErrors={perishableErrors}
                    toggleTotalsQuery={toggleTotalsQuery}
                    foreignExchangeRate={formData?.foreign_exchange_rate}
                    isMandate={formData?.[FieldName.OperationType] === MANDATE}
                    updateData={(products): void => setProductData([...products])}
                />
                <div className="flex flex-col gap-7 w-max lg:flex-row">
                    <div>
                        <WithholdingTable
                            updateData={(data: IGenericRecord[]): void => setWithholdingData(data)}
                            toggleTotalsQuery={toggleTotalsQuery}
                            data={withholdingTable}
                            validate={validate}
                            symbol={symbol}
                        />
                        <div className="billing-information__lower-section">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-billing-observations`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="billing-information__text-area"
                                labelText="Observaciones:"
                                rows={4}
                                onChange={handleValueChange}
                                value={formData.note}
                                name="note"
                                disabled={disabledInputs}
                            />
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-billing-internal-notes`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="billing-information__text-area"
                                labelText="Comentario para uso interno:"
                                tooltip={INFORMATION.INTERNAL_NOTES}
                                value={formData.internal_notes}
                                onChange={handleValueChange}
                                disabled={disabledInputs}
                                name="internal_notes"
                                rows={4}
                            />
                        </div>
                    </div>
                    <SubTotals
                        disableShippingCost={!productData.some(product => product.sku_internal)}
                        updateSendingCharge={({ value }): void => setSendingCharge(value)}
                        toggleTotalsQuery={toggleTotalsQuery}
                        sendingCharge={sendingCharge}
                        totals={invoiceValues}
                        symbol={symbol}
                    />
                </div>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ELECTRONIC_INVOICE, history, saveData, {
                    name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                })}
                {...(!isInsertedPage &&
                    !isContingency && {
                        onClickButtonCenter: async (): Promise<void> => saveData(true),
                        titleButtonCenter: TitleButtons.SAVE_DRAFT,
                        threeButtons: true,
                    })}
                onClickButtonLeft={goBack}
                titleButtonLeft={stepNameButton()}
                threeButtons={!isContingency}
                tooltip={INFORMATION.DRAFT_TOOLTIP}
                className="flex items-center justify-end font-allerbold"
                classNameBtnCenter="inline-flex items-center justify-center px-2.75 py-0.5"
                disabledCenter={disabledInputs}
                disabledRight={disabledInputs}
            />
        </>
    );
};
