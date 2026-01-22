/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ProductsTable } from '@pages/generate-sales-invoice/components';
import { NA } from '@components/table';
import { ModalType } from '@components/modal';
import { SharedModal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { ChangeEvent, TextArea } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { AddPerson, PageDirections, PurchaseInvoiceCards } from '@components/electronic-documents';

import { Routes } from '@constants/Paths';
import { FORM } from '@constants/Invoice';
import { FILE_INDEX } from '@constants/File';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { ValidateClassName } from '@constants/ElectronicInvoice';
import { KEYS_ASSIGN_PURCHASE } from '@constants/PurchaseInvoice';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';

import useParam from '@hooks/useParam';
import useTable from '@hooks/useTable';
import usePermissions from '@hooks/usePermissions';
import useScrollToError from '@hooks/useScrollToError';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';

import { INFORMATION } from '@information-texts/GeneratePurchaseInvoice';

import { Form } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { FieldName, IFormPurchaseInvoice } from '@models/PurchaseInvoice';

import { RootState } from '@redux/rootReducer';
import { getUtils } from '@redux/utils/actions';
import { getSuppliers } from '@redux/suppliers/actions';
import { getCompanyTaxes, getInformationCompany } from '@redux/company/actions';
import { createInvoiceWarehouse as createInvoice, putPurchaseInvoice } from '@redux/invoice-warehouse/actions';
import { getPrefixCompany, getUniqueProductStock } from '@redux/electronic-invoice/actions';
import { getInvoicePurchase, setInvoicePurchase } from '@redux/report-note-purchase/actions';
import { getFilesCompanyAction, postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';

import { ID } from '@constants/UtilsConstants';
import { assignValue } from '@utils/Json';
import { buttonsFooterProps } from '@utils/Button';
import { calculatePercentage } from '@utils/Number';
import { validateEmptyFields } from '@utils/Fields';
import { isCorrectResponse } from '@utils/Response';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

import { ZERO } from '@pages/website-editor';
import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';

import { InvoiceForm, MaxiLengthTable, OptionalFields, Totals } from './components';

import {
    formatRequestData,
    getRoutes,
    INVOICE_LOGO,
    INITIAL_INVOICE,
    REQUIRED_FORM_FIELDS,
    REQUIRED_TABLE_FIELDS,
    TYPE_PREFIX,
    GET_UTILS,
} from '.';

import './GeneratePurchaseInvoice.scss';

const GeneratePurchaseInvoice: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { scrollToInput } = useScrollToError();
    const { user, utils, information, editDocument, products } = useSelector(
        ({ company, session, utils, reportNotesPurchase, electronicInvoice }: RootState) => ({
            ...utils,
            ...company,
            ...session,
            products: electronicInvoice.products,
            editDocument: reportNotesPurchase.invoice,
        })
    );
    const containerRef = useRef<HTMLDivElement>(null);

    const { disabledInputs } = usePermissions();

    const [formData, setFormData] = useState<IFormPurchaseInvoice>(INITIAL_INVOICE);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [tableData, setTableData] = useState<IInvoiceDetails[]>([]);
    const [validate, setValidate] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<string>('');
    const [totals, setTotals] = useState<IGenericRecord>({});
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string[]>([]);

    const { errorMessages, hasEmptyFields } = useTable(tableData, REQUIRED_TABLE_FIELDS);
    const { symbol, calculateWithRate } = useSymbolCurrency(formData.foreign_exchange_id, products);
    const [{ queryParam }, { queryParam: purchaseId }] = [useParam(FORM), useParam(ID)];

    useEffect(() => {
        dispatch(setInvoicePurchase({}));
        getData();
        return (): void => {
            dispatch(setInvoicePurchase({}));
        };
    }, []);

    useEffect(() => {
        if (purchaseId) dispatch(getInvoicePurchase(purchaseId));
    }, [purchaseId]);

    useEffect(() => {
        if (purchaseId && editDocument && lengthGreaterThanZero(Object.keys(editDocument))) assignPurchase();
    }, [editDocument]);

    useEffect(() => {
        if (lengthGreaterThanZero(tableData)) setTableData([...calculateWithRate(tableData, formData.foreign_exchange_rate)]);
    }, [formData.foreign_exchange_rate]);

    const getData = async (): Promise<void> => {
        await Promise.all([
            dispatch(getUniqueProductStock()),
            dispatch(getSuppliers(true)),
            dispatch(getInformationCompany()),
            dispatch(getUtils(GET_UTILS)),
            dispatch(getPrefixCompany({ with_prefixes: true, types: [TYPE_PREFIX] }, true)),
            dispatch(getFilesCompanyAction(INVOICE_LOGO)),
            dispatch(getCompanyTaxes()),
        ]);
    };

    const handleValueChange = ({ target: { name, value } }: ChangeEvent): void => setFormData({ ...formData, [name]: value });

    const openForm = (): void => history.push(`?${FORM}=${Form.Supplier}`);

    const preventSaving = (): Record<string, boolean> => ({
        form: validateEmptyFields(REQUIRED_FORM_FIELDS(formData), formData),
        table: hasEmptyFields || lengthEqualToZero(tableData),
    });

    const resetData = (): void => {
        history.go(ZERO);
        containerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const saveLogo = async (): Promise<void> => {
        const file = formData?.logo?.[FILE_INDEX]?.files[FILE_INDEX];
        if (file) dispatch(postFileCompanyAction(file, INVOICE_LOGO));
    };

    const saveData = async (): Promise<void> => {
        const { form, table } = preventSaving();
        if (form || table) {
            if (form) scrollToInput();
            if (!form && table) scrollToInput(ValidateClassName.Invoice);
            return setValidate(true);
        }
        const finalData = formatRequestData(
            {
                formData: { ...formData, ...totals },
                tableData,
                user,
            },
            products
        );
        Promise.all([
            dispatch(purchaseId ? putPurchaseInvoice(purchaseId, finalData) : createInvoice(finalData)),
            saveLogo(),
        ]).then(([{ errors = null, ...res }]: any) => {
            if (isCorrectResponse(res?.statusCode)) {
                setInvoice(res?.data?.id);
                toggleModal();
                return;
            }
            if (errors) {
                setValidationError(Object.keys(errors));
                scrollToInput();
            }
        });
    };

    const assignPurchase = (): void => {
        const { person, supplier, ...form } = assignValue(KEYS_ASSIGN_PURCHASE, editDocument);
        setFormData({
            ...INITIAL_INVOICE,
            ...form,
            supplier_id: supplier.id,
            person_id: person.id,
            supplier: {
                ...supplier,
                document_type: person.document_type,
                document_name: person.document_type_name,
                person,
            },
        });
        setTableData(
            editDocument.products.map(({ warehouse_name, batch_number, ...item }: IInvoiceDetails) => {
                const isNullWarehouse = !warehouse_name;
                const isBatchNumber = !batch_number;
                return {
                    ...item,
                    warehouse_name: isNullWarehouse ? NA : warehouse_name,
                    batch_number: isBatchNumber ? NA : batch_number,
                    date_expiration: isBatchNumber ? NA : getDateFromUnix(getUnixFromDate(item.date_expiration || '')).dateFormat,
                    percentage_discount: calculatePercentage(item.unit_value, item.discount),
                    taxes: item.product_taxes.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })) || [],
                };
            })
        );
    };

    const toggleModal = (): void => setOpenModal(!openModal);
    const toggleSuccessModal = (): void => setShowSuccess(!showSuccess);

    const updateFormData = (data: IFormPurchaseInvoice): void => setFormData(data);

    const fieldProps = { data: formData, handleValueChange, updateData: updateFormData, utils };

    return (
        <div className="purchase-invoice">
            <PageTitle title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
            <BreadCrumb routes={getRoutes(queryParam || purchaseId)} />
            <h2 className="page-subtitle">{MODULE_TITLES.INVOICE}</h2>
            {queryParam === Form.Supplier || queryParam === Form.EditSupplier ? (
                <AddPerson isClient={false} toggleModal={toggleSuccessModal} />
            ) : (
                <>
                    <PageDirections
                        isEdit={!!purchaseId}
                        quantityInvoices={{}}
                        includeCounter={false}
                        routeIndex={Routes.GENERATE_PURCHASE_INVOICE}
                    />
                    <PurchaseInvoiceCards
                        isEdit={!!purchaseId}
                        invoiceData={formData}
                        companyData={information}
                        updateInvoiceData={(data): void => setFormData(data as IFormPurchaseInvoice)}
                    />
                    <div className="bg-white py-4.5 px-7 rounded mt-4.5">
                        <InvoiceForm {...fieldProps} openForm={openForm} validate={validate} validationError={validationError} />
                        <OptionalFields {...fieldProps} />
                        <p className="text-tiny text-blue my-4.5">{INFORMATION.PRODUCT_TABLE_INDICATION}</p>
                        <ProductsTable
                            symbol={symbol}
                            data={tableData}
                            isPurchaseInvoice
                            validate={validate}
                            errorMessages={errorMessages}
                            toggleTotalsQuery={(): void => {}}
                            foreignExchangeRate={formData.foreign_exchange_rate}
                            updateData={(data: IInvoiceDetails[]): void => setTableData(data)}
                        />
                        <div className="flex gap-x-7 flex-col lg:flex-row gap-y-4.5 mt-4.5">
                            <div className="purchase-invoice__lower-section">
                                <TextArea
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-observations`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    classesWrapper="purchase-invoice__text-area"
                                    labelText="Observaciones:"
                                    rows={4}
                                    onChange={handleValueChange}
                                    name={FieldName.Note}
                                    value={formData.note}
                                    maxLength={MaxiLengthTable.Large}
                                    disabled={disabledInputs}
                                />
                                <TextArea
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-internal-notes`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    classesWrapper="purchase-invoice__text-area"
                                    labelText="Comentario para uso interno:"
                                    rows={4}
                                    name={FieldName.InternalNotes}
                                    tooltip={INFORMATION.INTERNAL_NOTES}
                                    onChange={handleValueChange}
                                    value={formData.internal_notes}
                                    maxLength={MaxiLengthTable.Large}
                                    disabled={disabledInputs}
                                />
                            </div>
                            <Totals symbol={symbol} data={tableData} onTotalsCalculated={(totals): void => setTotals(totals)} />
                        </div>
                    </div>
                    <PageButtonsFooter
                        {...buttonsFooterProps(ModuleApp.ELECTRONIC_INVOICE, history, saveData, {
                            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                            moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        })}
                        disabledRight={disabledInputs}
                    />
                </>
            )}
            {openModal && (
                <SharedModal
                    moduleId={`${ModuleApp.ELECTRONIC_INVOICE}-purchase`}
                    {...(purchaseId
                        ? {
                              text: INFORMATION.SUCCESS_EDIT,
                              finishButtonText: 'Aceptar',
                          }
                        : {
                              leftButton: { action: resetData, text: 'Generar nueva factura de compra' },
                              text: INFORMATION.SUCCESS_MODAL,
                              finishButtonText: 'Siguiente',
                          })}
                    finalAction={(): void =>
                        history.push(
                            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${invoice}&type=${
                                TYPE_NAVIGATION.CREATED_INVOICE_PURCHASE
                            }`
                        )
                    }
                    open
                />
            )}
            {showSuccess && (
                <ModalType
                    moduleId={`${ModuleApp.ELECTRONIC_INVOICE}-purchase`}
                    iconName="check"
                    text={{
                        title: 'Información guardada',
                        description: '¡Su información ha sido guardada con éxito!',
                    }}
                    open={showSuccess}
                    finalAction={(): void => {
                        toggleSuccessModal();
                        history.push(getRoute(Routes.GENERATE_PURCHASE_INVOICE));
                    }}
                />
            )}
        </div>
    );
};

export default GeneratePurchaseInvoice;
