import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
    FIELDS_TO_RECALCULATE_TOTALS,
    formatMainDataTable,
} from '@pages/correction-business-document/components/invoice-correction';
import { fiscalResponsibilities, initFields } from '@pages/correction-documents-client-employer';
import DocumentCorrection from '@pages/correction-business-document/components/DocumentCorrection/DocumentCorrection';
import { fieldsMessage } from '@information-texts/CreateElectronicInvoice';
import { DELETE_TABLE_PRODUCTS } from '@information-texts/CorrectionDocumentsClientEmployer';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { ActionType } from '@constants/ActionType';
import { defaultData, INVOICE_CALCULATES, ValidateClassName } from '@constants/ElectronicInvoice';
import { FormNameInputs } from '@constants/CancellationElectronic';
import { getPrefixCompany, setInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { buttonsFooterProps } from '@utils/Button';
import { buildOptionsSearch } from '@utils/Company';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthEqualOne, lengthGreaterThanZero } from '@utils/Length';
import { ModuleApp } from '@utils/GenerateId';
import { useCorrection } from '@hooks/useCorrection';
import useScrollToError from '@hooks/useScrollToError';
import { RootState } from '@redux/rootReducer';
import { saveNote } from '@redux/correction-documents-client-employer/actions';
import { IOptionSelect } from '@components/input';
import { ModalType } from '@components/modal-custom';
import { codeReasonRejection } from '@components/electronic-note';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { CREDIT, INVOICE, formatDataRequest, DEBIT } from '../../visualization-correction-document';

export const VisualizationCreateNote: React.FC<IGenericRecord> = ({
    initFieldsTable,
    initFieldTaxTable,
    tableData = [],
    validationErrors = [],
    inputsFields,
    setInputsFields,
    setTableData,
    taxTableData,
    setTaxTableData,
    setRecalculateTotals,
    totalsTable,
    invoiceCorrection,
    setTypeNote,
    setShowNextModal,
    invoice,
    type,
    withHoldings,
    setwithHoldings,
    handleTotals,
    valuesTotal,
}) => {
    const [
        dispatch,
        {
            formatDataSelect,
            formatTaxes,
            handleDelete,
            handleChangeTable,
            formatChangeBatchAndDate,
            formatAddNewProduct,
            formatChangeWarehouse,
        },
    ] = [useDispatch(), useCorrection()];
    const history = useHistory();
    const { scrollToInput } = useScrollToError();
    const {
        warehouses: { getDynamicRequest },
        electronicInvoice: { products },
        correctionBusinessDocument: { utilsData },
    } = useSelector((state: RootState) => state);
    const { consecutive } = useSelector((state: RootState) => state.correctionDocumentsClientEmployer);
    const [sendInvoice, setSendInvoice] = useState<boolean>(false);
    const [selected, setSelected] = useState<IGenericRecord[]>([]);
    const [showValidate, setShowValidate] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [oneProductTable, setOneProductTable] = useState<boolean>(false);
    const [isProductsDelete, setIsProductsDelete] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getPrefixCompany({ with_prefixes: true, types: [type] }));
        return (): void => {
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        };
    }, []);

    useEffect(() => {
        setOneProductTable(lengthEqualOne(tableData));
        setOneProductTable(false);
    }, [tableData, selected]);

    const isCreditNote = useMemo(() => type === CREDIT, [type]);

    const optionsWithholdings = buildOptionsSearch(getDynamicRequest?.withholdings || []);

    const checkReteIVATableError = (): boolean => {
        const [, , reteIVA] = withHoldings;
        if (!parseFloat(reteIVA.percentage)) return true;
        return optionsWithholdings.some(option => parseInt(option.name) === reteIVA.percentage);
    };

    const checkValidations = (): boolean => {
        let check = true;
        for (const input in inputsFields) {
            if (input === FormNameInputs.PREFIX) {
                if (inputsFields[input].required) {
                    check = false;
                }
            }
        }
        return check;
    };

    const checkTableValidation = (): boolean => {
        let check = true;
        tableData.forEach((item: IGenericRecord) => {
            if (item.validate_delivery || item.required) {
                return (check = false);
            }
        });
        return check && lengthGreaterThanZero(tableData);
    };

    const handleDeleteModal = (show: boolean): void => {
        lengthGreaterThanZero(selected) && setShowModalDelete(show);
        return;
    };

    const handleSave = (): void => {
        setSendInvoice(true);
        const data = {
            ...inputsFields,
            ...(!inputsFields.reason_rejection.id && {
                reason_rejection: {
                    ...defaultData.reasonRejection,
                    ...codeReasonRejection(defaultData.reasonRejection.id, utilsData?.reason_rejections, type === DEBIT),
                },
            }),
        };
        const validationForm = checkValidations();
        const validationTable = checkTableValidation();
        if (!validationForm) scrollToInput();
        if (validationForm && !validationTable) scrollToInput(ValidateClassName.CorrectionNote);
        if (validationForm && validationTable && checkReteIVATableError()) {
            dispatch(
                saveNote(
                    formatDataRequest(
                        data,
                        invoiceCorrection,
                        products,
                        tableData,
                        taxTableData,
                        totalsTable,
                        invoice,
                        type,
                        withHoldings
                    )
                )
            );
        } else {
            !validationForm && setShowValidate(true);
            setInputsFields({ ...inputsFields, ...data });
        }
    };

    const handleChange = (e: IGenericRecord, item: IGenericRecord, name = '', isText = false, isOnBlur = false): void => {
        setTableData(
            formatMainDataTable({
                data: handleChangeTable(e, item, name, tableData, isText, isOnBlur),
                products: products,
            })
        );
        if (FIELDS_TO_RECALCULATE_TOTALS.includes(name)) {
            setRecalculateTotals(true);
        }
    };

    const handleChangeTaxes = (e: IGenericRecord, item: IGenericRecord, isWithHoldings?: boolean): void => {
        formatTaxes(e, item, taxTableData, setTaxTableData, withHoldings, setwithHoldings, isWithHoldings);
        if (isWithHoldings) setRecalculateTotals(true);
    };

    const handleChangeWarehouse = (option: IOptionSelect, item: IGenericRecord): void => {
        setTableData(formatChangeWarehouse(tableData, option, item, products));
    };

    const deleteProducts = (): void => {
        handleDelete(tableData, setTableData, selected, setSelected, setOneProductTable);
        if (isCreditNote) setIsProductsDelete(true);
    };

    const addNewProduct = (): void => {
        const detailsNote = formatAddNewProduct(tableData);
        setTableData(detailsNote);
        if (isCreditNote && detailsNote.length === invoiceCorrection.invoice_details.length) setIsProductsDelete(false);
    };

    const handleChangeSelect = (option: IOptionSelect, item: IGenericRecord): void => {
        const currentProduct = products.find((item: IGenericRecord) => item.id === option.id) || {};
        formatDataSelect(tableData, setTableData, currentProduct, item);
    };

    const handleChangeBatchAndDate = (option: IOptionSelect, item: IGenericRecord, isDate: boolean): void => {
        setTableData(formatChangeBatchAndDate(option, item, tableData, isDate, products));
    };

    return (
        <div className="mt-4.5">
            <ModalType
                type={ActionType.INFO}
                show={showValidate}
                showModal={(): void => {
                    setShowValidate(!showValidate);
                }}
                title="Información"
                classesWrapper="w-120.9 xs:w-full"
                isHiddenButton={false}
                backBtnText={TitleButtons.ACCEPT}
                text={fieldsMessage.fieldRequired}
            />
            <ModalType
                type="delete"
                show={showModalDelete}
                showModal={(): void => handleDeleteModal(!showModalDelete)}
                mainAction={(): void => {
                    deleteProducts();
                    handleDeleteModal(!showModalDelete);
                }}
                title={DELETE_TABLE_PRODUCTS.TITLE}
                text={DELETE_TABLE_PRODUCTS.INFORMATION}
                withUpdateMessage={false}
            />
            <DocumentCorrection
                route="#"
                fieldInputs={inputsFields}
                setFieldInputs={setInputsFields}
                data_main_table={tableData}
                data_taxes={taxTableData}
                fields={initFields(false, false, true)}
                fields_main_table={initFieldsTable}
                fields_tax_table={initFieldTaxTable}
                valueTotals={totalsTable}
                onChangeProductTable={handleChange}
                onChangeSelect={handleChangeSelect}
                onChangeWarehouse={handleChangeWarehouse}
                totalValues
                addProductService={type !== CREDIT || isProductsDelete}
                delete_elements={false}
                reason_rejection={false}
                other_fields={true}
                debitCreditNotes
                editableTotals
                fiscal_responsibilities={fiscalResponsibilities}
                onChangeTaxes={handleChangeTaxes}
                consecutive={consecutive.number ? consecutive.number + 1 : ''}
                routeOnClick={addNewProduct}
                typeNote={type}
                dataWithHoldings={withHoldings}
                sendInvoice={sendInvoice}
                tableValidate={checkTableValidation()}
                setTableData={setTableData}
                handleDelete={(): void => handleDeleteModal(!showModalDelete)}
                ids={selected}
                setSelectedId={setSelected}
                oneProductTable={oneProductTable}
                tableErrors={validationErrors}
                handleChangeBatchAndDate={handleChangeBatchAndDate}
                handleTotals={handleTotals}
                valuesTotal={valuesTotal}
                optionsWithHoldings={optionsWithholdings}
                isClientNote
            />
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.ELECTRONIC_DOCUMENTS,
                    history,
                    getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
                    {
                        name: getRouteName(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
                        moduleName: getRouteName(Routes.ELECTRONIC_INVOICE),
                    }
                )}
                threeButtons
                titleButtonCenter="Guardar"
                onClickButtonLeft={(): void => setTypeNote(INVOICE)}
                onClickButtonCenter={handleSave}
                onClickButtonRight={(): void => setShowNextModal(true)}
            />
        </div>
    );
};
