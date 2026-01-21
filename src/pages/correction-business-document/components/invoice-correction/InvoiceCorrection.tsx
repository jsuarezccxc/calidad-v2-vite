import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import {
    getInvoiceCalculations,
    getPrefixCompany,
    getUniqueProductStock,
    setInvoiceCalculations,
} from '@redux/electronic-invoice/actions';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { getCurrentErrors, getUtilsData, updateCorrectedInvoice } from '@redux/correction-business-document/actions';
import { storeSupportDocument } from '@redux/support-document/actions';
import { postAdjustmentNoteData } from '@redux/create-adjustment-note/actions';
import { getFilesCompanyAction, postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getDynamicData } from '@redux/warehouses/actions';
import { Modal, ModalType as ModalCustomType } from '@components/modal';
import { Button } from '@components/button';
import { IOptionSelect } from '@components/input';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { ModalType } from '@components/modal-custom';
import { ChangeEvent } from '@components/radiobutton';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { initFieldsTable, initFieldsTaxTable } from '@components/electronic-document';
import { TypeNamesInputs } from '@components/electronic-invoice';
import { fieldsMessage } from '@information-texts/CreateElectronicInvoice';
import { VALIDATIONS_INVOICES } from '@information-texts/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { ActionType } from '@constants/ActionType';
import { WITHHOLDINGS, ZERO } from '@constants/UtilsConstants';
import {
    CREDIT_NOTE,
    EDIT_INPUTS,
    INVOICE,
    MaxLengthFields,
    INVOICE_CALCULATES,
    SUPPORTING_DOCUMENT,
    ADJUSTMENT_NOTE,
    DEBIT_NOTE,
    TypeFile,
    ValidateClassName,
    COLOMBIAN_CURRENCY_ID,
} from '@constants/ElectronicInvoice';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import { useCorrection } from '@hooks/useCorrection';
import useScrollToError from '@hooks/useScrollToError';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';
import { getTimeDate } from '@utils/Date';
import { buttonsFooterProps } from '@utils/Button';
import { isCorrectResponse } from '@utils/Response';
import { buildOptionsSearch } from '@utils/Company';
import { getRoute, getRouteName } from '@utils/Paths';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { lowerCase } from '@utils/Text';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { ICalculateInvoice, IInvoiceDetails } from '@models/ElectronicInvoice';
import { DELETE_PRODUCT_MODAL, TEXT_MODAL_ERROR_DATA, TEXT_MODAL_OPTIONS } from '@information-texts/DocumentCorrection';
import { MODAL_TOTAL } from '@information-texts/SupportDocumentAndBuy';
import { RETE_IVA } from '@constants/ElectronicInvoice';
import { initFields } from '@pages/correction-documents-client-employer';
import { ID, VIEW } from '@pages/correction-business-document';
import { useFieldsValues } from '@pages/correction-documents-client-employer/components/electronic-document-correction';
import DocumentCorrection from '../DocumentCorrection/DocumentCorrection';
import {
    routes,
    formatMainDataTable,
    dataTaxes,
    dataWithHoldings,
    formatDataRequest,
    enabledReteIva,
    BASIC_FIELDS,
    WAREHOUSE_FIELDS,
    WAREHOUSE_NAME,
    totalsToTable,
    FIELDS_TO_RECALCULATE_TOTALS,
    getTaxesAndRetentionFormat,
    formatBussinesProducts,
    fileTypeMap,
    InvoiceType,
    isObjEmpty,
    principalTitle,
} from '.';
import './InvoiceCorrection.scss';

const InvoiceCorrection: React.FC<IGenericRecord> = ({ dateInput }) => {
    const [
        history,
        dispatch,
        view,
        id,
        {
            formatDataSelect,
            formatTaxes,
            handleDelete,
            handleChangeTable,
            formatAddNewProduct,
            formatChangeWarehouse,
            formatChangeBatchAndDate,
        },
        { disabledInputs },
    ] = [useHistory(), useDispatch(), useParam(VIEW).queryParam, useParam(ID).queryParam, useCorrection(), usePermissions()];
    const { scrollToInput } = useScrollToError();
    const {
        warehouses: { getDynamicRequest },
        correctionBusinessDocument: { utilsData, currentErrors },
        company: { information },
        electronicInvoice: { products, invoiceCalculations },
        cancellationElectronicDocuments: { document: invoiceCorrection },
    } = useSelector((state: RootState) => state);

    const [businessTable, setBusinessTable] = useState<IGenericRecord[]>([]);
    const [taxTableData, setTaxBusinessTable] = useState<IGenericRecord[]>([]);
    const [fieldInputs, setFieldInputs] = useState<IGenericRecord>({});
    const [withHoldingsBusiness, setwithHoldingsBusiness] = useState<IGenericRecord[]>([]);
    const [selected, setSelected] = useState<IGenericRecord[]>([]);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [oneProductTable, setOneProductTable] = useState<boolean>(false);
    const [showValidateModal, setShowValidateModal] = useState<boolean>(false);
    const [totalWarning, setTotalWarning] = useState<boolean>(false);
    const [currentError, setCurrentError] = useState<IGenericRecord[]>([]);
    const [sendInvoice, setSendInvoice] = useState<boolean>(false);
    const [tableErrors, setTableErrors] = useState<IGenericRecord[]>([]);
    const [valuesTotal, setValuesTotal] = useState<IGenericRecord>({
        ...INVOICE_CALCULATES,
    });
    const [selectFile, setSelectFile] = useState<IGenericRecord>({ logo: {}, urlLogo: '' });

    const [totalsBusinessTable, setTotalsBusinessTable] = useState<IGenericRecord[]>([]);

    const [recalculateTotals, setRecalculateTotals] = useState(false);

    const [showModal, setShowModal] = useState<IGenericRecord>({
        save: false,
        next: false,
        prefix: 'xxx',
        number: 'yyy',
        hour: '00:00:00',
        saveNext: false,
    });
    const [isProductsDelete, setIsProductsDelete] = useState<boolean>(false);
    const [showErrorDataModal, setShowErrorDataModal] = useState<boolean>(false);

    const isCreditNote = useMemo(() => invoiceCorrection?.invoice_type === CREDIT_NOTE, [invoiceCorrection]);

    const { symbol, calculateWithRate } = useSymbolCurrency(fieldInputs?.badge?.value, products);

    useEffect(() => {
        return (): void => {
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        };
    }, []);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        if (recalculateTotals) {
            getCalculate({
                withholdings: getTaxesAndRetentionFormat(withHoldingsBusiness),
                sending_charge: stringToFloat(valuesTotal.total_charge_amount),
                products: formatBussinesProducts(businessTable),
            });
            setRecalculateTotals(false);
        }
    }, [recalculateTotals]);

    useEffect(() => {
        if (invoiceCalculations) {
            setValuesTotal({ ...invoiceCalculations });
        }
    }, [invoiceCalculations]);

    useEffect(() => {
        if (lengthEqualToZero(Object.keys(invoiceCorrection || {}))) return;
        const fileType = fileTypeMap[invoiceCorrection.invoice_type as InvoiceType] || TypeFile.LOGO_INVOICE;
        dispatch(getFilesCompanyAction(fileType));
        setFieldInputs(useFieldsValues(invoiceCorrection, utilsData, true, true));
        setBusinessTable(
            formatMainDataTable({
                data: invoiceCorrection.invoice_details ?? invoiceCorrection.products,
                products: products,
                primary: true,
            })
        );
        setwithHoldingsBusiness(
            dataWithHoldings(
                invoiceCorrection.withholdings,
                invoiceCorrection.invoice_details,
                typeOfDocuments.isAdjustmentNote || typeOfDocuments.isSupportDocument
            )
        );
        dispatch(
            getPrefixCompany({ with_prefixes: true, types: [invoiceCorrection?.invoice_type ?? INVOICE], only_available: true })
        );
        setValuesTotal({ ...valuesTotal, total_charge_amount: invoiceCorrection.sending_charge });
        setRecalculateTotals(true);
    }, [invoiceCorrection]);

    useEffect(() => {
        setOneProductTable(false);
        setSelected([]);
    }, [businessTable, invoiceCorrection]);

    useEffect(() => {
        checkProducts(businessTable);
        if (lengthEqualToZero(Object.keys(invoiceCorrection || {}))) return;
        const currentHoldings = lengthGreaterThanZero(withHoldingsBusiness)
            ? withHoldingsBusiness
            : invoiceCorrection.withholdings;
        setwithHoldingsBusiness(
            dataWithHoldings(
                currentHoldings,
                businessTable,
                typeOfDocuments.isAdjustmentNote || typeOfDocuments.isSupportDocument
            )
        );
    }, [businessTable]);

    useEffect(() => {
        setTotalsBusinessTable(totalsToTable(valuesTotal, withHoldingsBusiness));
    }, [withHoldingsBusiness, valuesTotal, businessTable]);

    useEffect(() => {
        setTaxBusinessTable(dataTaxes(businessTable));
    }, [businessTable]);

    useEffect(() => {
        handleWarningTotal();
    }, [valuesTotal]);

    const handleShowTotalWarning = (): void => setTotalWarning(prev => !prev);

    const handleWarningTotal = (): void => {
        const totalValue = valuesTotal?.total ?? 0;
        if (totalValue < ZERO && !totalWarning) handleShowTotalWarning();
    };

    const getData = async (): Promise<void> => {
        await Promise.all([
            await dispatch(getUtilsData()),
            dispatch(getSpecificDocument(id)),
            dispatch(getCurrentErrors(id)),
            dispatch(getInformationCompany()),
            dispatch(getUniqueProductStock()),
            dispatch(getDynamicData([WITHHOLDINGS])),
        ]);
    };

    const handleDeleteModal = (show: boolean): void => {
        setShowModalDelete(show);
    };

    const handleChange = (e: IGenericRecord, item: IGenericRecord, name = '', isText = false, isOnBlur = false): void => {
        setBusinessTable(
            formatMainDataTable({
                data: handleChangeTable(e, item, name, businessTable, isText, isOnBlur),
                products: products,
            })
        );
        if (FIELDS_TO_RECALCULATE_TOTALS.includes(name)) {
            setRecalculateTotals(true);
        }
    };

    const handleChangeBusinessSelect = ({ id = '' }: IOptionSelect, item: IGenericRecord): void => {
        const currentProduct = products.find((product: IGenericRecord) => product.product_id === id || product.id === id) || {};
        formatDataSelect(businessTable, setBusinessTable, currentProduct, {
            ...item,
            rate: stringToFloat(fieldInputs.foreign_exchange_rate),
        });
    };

    const handleChangeTaxes = (e: IGenericRecord, item: IGenericRecord, isWithHoldings?: boolean): void => {
        formatTaxes(e, item, taxTableData, setTaxBusinessTable, withHoldingsBusiness, setwithHoldingsBusiness, isWithHoldings);
        if (isWithHoldings) setRecalculateTotals(true);
    };

    const handleChangeWarehouse = (option: IOptionSelect, item: IGenericRecord): void => {
        setBusinessTable(formatChangeWarehouse(businessTable, option, item, products));
    };
    const handleChangeBatchAndDate = (option: IOptionSelect, item: IGenericRecord, isDate: boolean): void => {
        setBusinessTable(formatChangeBatchAndDate(option, item, businessTable, isDate, products));
    };

    const handleChangeSaveModal = (): void => {
        !showModal.saveNext
            ? history.push(getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT))
            : history.push(getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER));
        setShowModal({ ...showModal, save: false });
    };

    const handleShowModal = (): void => {
        setShowModal({ ...showModal, save: false });
    };

    const checkCrudRequired = (): IGenericRecord =>
        Object?.values(fieldInputs)?.filter((item: IGenericRecord) => item?.required && !item.value);

    const checkFormCountry = (): boolean =>
        fieldInputs.receive_products &&
        (!fieldInputs.country.name || !fieldInputs.department_state.name || !fieldInputs.city.name || !fieldInputs.address.value);

    const optionsWithholdings = buildOptionsSearch(getDynamicRequest?.withholdings || []);

    const checkReteIVATableError = (): boolean => {
        const reteIVA = withHoldingsBusiness.find(item => lowerCase(item.name) === lowerCase(RETE_IVA)) ?? null;
        if (!parseFloat(reteIVA?.percentage)) return true;
        return optionsWithholdings.some(option => parseInt(option.name) === reteIVA?.percentage);
    };

    const checkProducts = (data: IGenericRecord[]): boolean => {
        const errors: IGenericRecord[] = [];
        const message = `*La ${
            invoiceCorrection?.invoice_type !== INVOICE ? 'nota crédito/debito' : 'factura de venta'
        } debe contener al menos un producto/servicio`;

        if (!lengthGreaterThanZero(data)) {
            errors.push({
                field: '',
                error: message,
            });
            setTableErrors(errors);
            return true;
        }

        data.forEach((product: IGenericRecord) => {
            const validateInput = product?.warehouse_name?.value === EDIT_INPUTS.WAREHOUSE_INPUT;
            BASIC_FIELDS.forEach(field => {
                if (!product[field]?.value && field !== TypeNamesInputs.PERCENTAGE_DISCOUNT) {
                    switch (field) {
                        case TypeNamesInputs.SKU:
                            return errors.push({
                                field,
                                error: VALIDATIONS_INVOICES.SKU,
                            });
                        case TypeNamesInputs.UNIQUE_PRODUCT:
                            return errors.push({
                                field,
                                error: VALIDATIONS_INVOICES.SKU,
                            });
                        case TypeNamesInputs.QUANTITY:
                            return errors.push({
                                field,
                                error: VALIDATIONS_INVOICES.QUANTITY_ZERO,
                            });
                        case TypeNamesInputs.UNIT_COST:
                            return errors.push({
                                field,
                                error: VALIDATIONS_INVOICES.UNIT_COST,
                            });
                        default:
                            return errors.push({
                                field,
                                error: message,
                            });
                    }
                }
                if (
                    field === TypeNamesInputs.PERCENTAGE_DISCOUNT &&
                    stringToFloat(product[field]?.value) > MaxLengthFields.PERCENTAGE_DISCOUNT
                ) {
                    return errors.push({
                        field,
                        error: VALIDATIONS_INVOICES.PERCENTAGE_DISCOUNT,
                    });
                }
            });
            if (!validateInput && !product[WAREHOUSE_NAME]?.value) {
                return errors.push({
                    field: WAREHOUSE_NAME,
                    error: VALIDATIONS_INVOICES.WAREHOUSE,
                });
            }
            if (!validateInput && product?.warehouse_name?.id) {
                const currentWarehouse = product?.test?.find(
                    (warehouse: IGenericRecord) => warehouse.warehouses_id === product?.warehouse_name?.id
                );
                if (currentWarehouse && lengthGreaterThanZero(currentWarehouse?.batch)) {
                    WAREHOUSE_FIELDS.forEach(field => {
                        if (!product[field]?.id) {
                            return errors.push({
                                field,
                                error: VALIDATIONS_INVOICES.BATCH_AND_WAREHOUSE,
                            });
                        }
                    });
                }
            }
        });
        setTableErrors(errors);
        return lengthGreaterThanZero(errors);
    };

    const onClickButtonCenter = async (): Promise<void> => {
        setSendInvoice(true);
        const validateForm =
            lengthEqualToZero(checkCrudRequired()) &&
            !checkFormCountry() &&
            lengthEqualToZero(currentError) &&
            !(fieldInputs?.badge?.value !== COLOMBIAN_CURRENCY_ID && !fieldInputs.foreign_exchange_rate);
        const validateTable = checkProducts(businessTable);
        if (!validateForm) scrollToInput();
        if (validateForm && validateTable) scrollToInput(ValidateClassName.CorrectionNote);
        if (validateForm && !validateTable && checkReteIVATableError()) {
            const file = selectFile?.logo;
            if (!isObjEmpty(file)) {
                const fileType = fileTypeMap[invoiceCorrection?.invoice_type as InvoiceType] || TypeFile.LOGO_INVOICE;
                await dispatch(postFileCompanyAction(file, fileType));
            }
            const data = formatDataRequest(
                fieldInputs,
                invoiceCorrection,
                currentErrors,
                products,
                businessTable,
                taxTableData,
                totalsBusinessTable,
                invoiceCorrection.invoice_type,
                withHoldingsBusiness
            );
            let responseData: IGenericRecord;
            typeOfDocuments.isSupportDocument
                ? (responseData = await dispatch(storeSupportDocument(data)))
                : typeOfDocuments.isAdjustmentNote
                ? (responseData = await dispatch(postAdjustmentNoteData(data)))
                : (responseData = await dispatch(updateCorrectedInvoice(invoiceCorrection.id, data, dateInput)));
            if (isCorrectResponse(responseData.statusCode)) {
                setShowModal({
                    ...showModal,
                    prefix: fieldInputs.prefix.value,
                    number: fieldInputs.invoice_number,
                    hour: getTimeDate(data.time_issue),
                    save: true,
                });
                handleValidateModal();
            } else {
                setShowErrorDataModal(true);
            }
        }
    };

    const addNewProduct = (): void => {
        const documentDetails = formatAddNewProduct(businessTable);
        setBusinessTable(documentDetails);
        if (isCreditNote && documentDetails.length === invoiceCorrection.invoice_details.length) setIsProductsDelete(false);
    };

    const deleteProductsBusiness = (): void => {
        handleDelete(businessTable, setBusinessTable, selected, setSelected, setOneProductTable);
        if (isCreditNote) setIsProductsDelete(true);
    };

    const handleValidateModal = (): void => {
        if (lengthGreaterThanZero(checkCrudRequired()) || checkFormCountry()) setShowValidateModal(!showModalDelete);
    };

    const handleTotals = (e: ChangeEvent): void => {
        const { name, value } = e.target;
        setValuesTotal({
            ...valuesTotal,
            [name]: value,
        });

        if (FIELDS_TO_RECALCULATE_TOTALS.includes(name)) setRecalculateTotals(true);
    };

    const getCalculate = (forCalculate: ICalculateInvoice): void => {
        dispatch(getInvoiceCalculations(forCalculate));
    };

    const typeOfDocuments = useMemo(() => {
        return {
            isClientNote: invoiceCorrection?.invoice_type === DEBIT_NOTE || invoiceCorrection?.invoice_type === CREDIT_NOTE,
            isSupportOrAdjustment:
                invoiceCorrection?.invoice_type === SUPPORTING_DOCUMENT || invoiceCorrection?.invoice_type === ADJUSTMENT_NOTE,
            isSupportDocument: invoiceCorrection?.invoice_type === SUPPORTING_DOCUMENT,
            isAdjustmentNote: invoiceCorrection?.invoice_type === ADJUSTMENT_NOTE,
            isInvoice: invoiceCorrection?.invoice_type === INVOICE,
        };
    }, [invoiceCorrection]);

    useEffect(() => {
        if (lengthGreaterThanZero(businessTable) && fieldInputs.foreign_exchange_rate) {
            const details = calculateWithRate(
                formatBussinesProducts(businessTable) as IInvoiceDetails[],
                fieldInputs.foreign_exchange_rate
            );
            setBusinessTable([
                ...formatMainDataTable({
                    products: products,
                    data: details,
                    primary: true,
                }),
            ]);
            setRecalculateTotals(true);
        }
    }, [fieldInputs.foreign_exchange_rate]);

    return (
        <div>
            <ModalType
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `invoice-correction`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                type={ActionType.INFO}
                show={showValidateModal}
                showModal={(): void => {
                    setShowValidateModal(!showValidateModal);
                }}
                classesWrapper="w-120.9 xs:w-full"
                isHiddenButton={false}
                title="Información"
                text={fieldsMessage.fieldsRequired}
                backBtnText={TitleButtons.ACCEPT}
            />
            <ModalCustomType
                moduleId={ModuleApp.ELECTRONIC_DOCUMENTS}
                iconName="alertMulticolor"
                open={totalWarning}
                text={MODAL_TOTAL.WARNING}
                textButton={TitleButtons.CLOSE}
                finalAction={handleShowTotalWarning}
            />
            <Modal
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `invoice-correction`,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.MDL,
                })}
                open={showModal.save}
                handleClose={handleChangeSaveModal}
            >
                {
                    TEXT_MODAL_OPTIONS(history, handleShowModal, id)[
                        invoiceCorrection?.invoice_type as keyof typeof TEXT_MODAL_OPTIONS
                    ]
                }
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `invoice-correction`,
                    action: ActionElementType.ERROR,
                    elementType: ElementType.MDL,
                })}
                open={showErrorDataModal}
                handleClose={(): void => setShowErrorDataModal(false)}
            >
                {TEXT_MODAL_ERROR_DATA(setShowErrorDataModal)[invoiceCorrection?.invoice_type as keyof typeof TEXT_MODAL_OPTIONS]}
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `invoice-correction`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.MDL,
                })}
                open={showModalDelete}
                handleClose={(): void => handleDeleteModal(false)}
            >
                {DELETE_PRODUCT_MODAL(deleteProductsBusiness, handleDeleteModal, showModalDelete)}
            </Modal>
            <PageTitle title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
            <BreadCrumb routes={routes(invoiceCorrection)} className="mb-2" />
            <h3 className="w-full font-bold text-center font-allerbold text-26lg text-blue mb-7">
                {principalTitle(invoiceCorrection?.invoice_type)}
            </h3>
            <p className="mb-2 font-bold font-allerbold text-blue">
                Corrección del documento electrónico por parte del empresario
            </p>
            <p className="mb-5 text-gray-dark w-224">
                Cuando termine de corregir los errores, haga click en el botón Guardar en la parte inferior de la pantalla para
                almacenar la información y transmitir el documento corregido a la DIAN
            </p>
            <div>
                <DocumentCorrection
                    symbol={symbol}
                    addProductService={Boolean(!view) || isProductsDelete}
                    annulation={Boolean(view)}
                    currentError={currentError}
                    data_main_table={businessTable}
                    data_taxes={taxTableData}
                    dataWithHoldings={withHoldingsBusiness}
                    delete_elements={false}
                    editableTotals
                    fieldInputs={fieldInputs}
                    fields_main_table={initFieldsTable}
                    fields_tax_table={initFieldsTaxTable}
                    fields={initFields(Boolean(view), true, Boolean(view))}
                    handleChangeBatchAndDate={handleChangeBatchAndDate}
                    handleDelete={(): void => handleDeleteModal(!showModalDelete)}
                    handleTotals={handleTotals}
                    ids={selected}
                    isAdjustmentNote={typeOfDocuments.isAdjustmentNote}
                    isClientNote={typeOfDocuments.isClientNote}
                    isInvoice={typeOfDocuments.isInvoice}
                    isSupportDocument={typeOfDocuments.isSupportDocument}
                    isSupportOrAdjustment={typeOfDocuments.isSupportOrAdjustment}
                    isViewTableTotals={enabledReteIva(fieldInputs, businessTable, information || undefined)}
                    onChangeProductTable={handleChange}
                    onChangeSelect={handleChangeBusinessSelect}
                    onChangeTaxes={handleChangeTaxes}
                    onChangeWarehouse={handleChangeWarehouse}
                    oneFiscalResponsibility
                    oneProductTable={oneProductTable}
                    optionsWithHoldings={optionsWithholdings}
                    other_fields
                    reason_rejection={false}
                    route="#"
                    routeOnClick={addNewProduct}
                    selectFile={selectFile}
                    sendInvoice={sendInvoice}
                    setCurrentError={setCurrentError}
                    setFieldInputs={setFieldInputs}
                    setSelectedId={setSelected}
                    setSelectFile={setSelectFile}
                    setTableData={setBusinessTable}
                    tableErrors={tableErrors}
                    totalValues
                    typeNote={invoiceCorrection?.invoice_type}
                    valuesTotal={valuesTotal}
                    valueTotals={totalsBusinessTable}
                />
            </div>
            {view ? (
                <div className="flex items-end justify-end text-right mt-7 xs:mb-8 xs:flex xs:items-center xs:justify-center">
                    <Button
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `invoice-correction`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text={TitleButtons.BACK}
                        background={'gray-light'}
                        onClick={(): void => history.goBack()}
                    />
                </div>
            ) : (
                <PageButtonsFooter
                    {...buttonsFooterProps(ModuleApp.ELECTRONIC_DOCUMENTS, history, '#', { name: '', moduleName: '' })}
                    titleButtonRight={TitleButtons.SAVE}
                    disabledRight={disabledInputs}
                    onClickButtonRight={onClickButtonCenter}
                />
            )}
        </div>
    );
};

export default InvoiceCorrection;
