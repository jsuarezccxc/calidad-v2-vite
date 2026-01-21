import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { NumberFormatValues } from 'react-number-format';
import usePermissions from '@hooks/usePermissions';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';
import useDigitVerification from '@hooks/useDigitVerification';
import {
    TAXES_INVOICE,
    MAXIMUM_DIGITS,
    DATA_TOTAL_VALUES,
    INVOICE_CALCULATES,
    RadioDaysCollectionType,
    NA,
    MaxLengthFields,
    NINE,
} from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { IVA } from '@constants/BuildProduct';
import { ZERO } from '@constants/UtilsConstants';
import { TitleButtons } from '@constants/Buttons';
import { CURRENCY_TEXT } from '@constants/FieldsValidation';
import { InvoiceTableKeys, KEYS_ASSIGN_DETAIL, KEYS_HANDLE } from '@constants/TableInvoice';
import { DEFAULT_BATCH, DEFAULT_DATE } from '@constants/ElectronicNote';
import { CREDIT, INIT_VALUE_PERCENTAGE } from '@constants/CancellationElectronic';
import { COLOMBIAN_PESO, KEYS_ASSIGN_SUPPLIER, SupportingDocumentFieldNames } from '@constants/SupportDocument';
import { IFiscal } from '@models/Company';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { ICalculateInvoice, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { RootState } from '@redux/rootReducer';
import { getInvoiceCalculations, setInvoiceCalculations, setStateInvoice } from '@redux/electronic-invoice/actions';
import {
    calculatorDetail,
    updateTableTaxes,
    validateDateLimit,
    updateTableTotals,
    validateTypeProduct,
    updateTableRetentions,
    getTotalsByInvoiceDetails,
    unitCostToDetails,
} from '@utils/ElectronicInvoice';
import { getRoute } from '@utils/Paths';
import { assignValue } from '@utils/Json';
import { getCurrency } from '@utils/ForeignExchange';
import { multiOptionsSelect } from '@utils/ElectronicNote';
import { includeArray, someArrayObject } from '@utils/Array';
import { lengthEqualOne, lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { MODAL_TOTAL, MODAL_TYPE, PAGE_TEXT, TOOLTIPS_PAGE } from '@information-texts/SupportDocumentAndBuy';
import { Form } from '@components/form';
import { Link } from '@components/button';
import { ModalType } from '@components/modal';
import { RadioButton } from '@components/radiobutton';
import { TableTotals } from '@components/table-totals';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { TypeNamesInputs } from '@components/electronic-invoice';
import { TableTaxRetention } from '@components/table-tax-retention';
import { ISelected, TableInvoice, ADD_PRODUCT_SERVICE, buildOptionsTable, IHandleParam } from '@components/table-invoice';
import { TextArea, TextInput, MoneyInput, ChangeEvent, SelectInput, IOptionSelect, SelectSearchInput } from '@components/input';
import { RETE_IVA, ISupportDocumentProps, TOTAL } from '.';
import './SupportDocumentAndBuy.scss';

export const SupportDocumentAndBuying: React.FC<ISupportDocumentProps> = ({
    fieldsValues,
    setFieldsValues,
    products,
    tableDetail,
    setTableDetail,
    optionsForm: { foreignExchange, ...optionsForm },
    errorsCustom,
    errorsTableProduct,
    errorsTableRetention: { messageFuente, messageIca, messageIva },
    setTableRetention,
    setTableTaxes,
    setTableTotals,
    tableRetention,
    tableTotals,
    className = '',
    isSubmit,
}) => {
    const [dispatch, { DAYS_COLLECTION }] = [useDispatch(), SupportingDocumentFieldNames];
    const { WAREHOUSE, WAREHOUSE_ID, BATCH, BATCH_ID } = InvoiceTableKeys;
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [totalWarning, setTotalWarning] = useState<boolean>(false);
    const [deleteInvoiceDetail, setDeleteInvoiceDetail] = useState<ISelected[]>([]);
    const [totalValues, setTotalValues] = useState({
        ...DATA_TOTAL_VALUES,
    });

    const { disabledInputs } = usePermissions();
    const { isTypeNit, digitVerification } = useDigitVerification(fieldsValues.document_name, fieldsValues.document_number);
    const { symbol, calculateWithRate } = useSymbolCurrency(fieldsValues.foreign_exchange_id, products);

    const { invoiceCalculations, suppliers, stateDocument } = useSelector(({ suppliers, electronicInvoice }: RootState) => ({
        suppliers: suppliers.suppliers.data,
        invoiceCalculations: electronicInvoice.invoiceCalculations,
        stateDocument: electronicInvoice.stateInvoice,
    }));

    const listProducts = useMemo(
        () =>
            products.filter(
                ({ unique_product_taxes }) =>
                    (lengthEqualOne(unique_product_taxes) &&
                        unique_product_taxes.some((tax: ITaxesProductsStock) => tax.tax_name === IVA)) ||
                    lengthEqualToZero(unique_product_taxes)
            ),
        [products]
    );
    const disabledTableTotalsAndWithholdings = useMemo(() => !someArrayObject(tableDetail, InvoiceTableKeys.SKU), [tableDetail]);

    const initData = async (): Promise<void> => {
        const bodyApp = document.getElementById('bodyApp');
        bodyApp?.scrollBy(0, -window.innerHeight);
    };

    const handleTables = (): void => {
        setTableTaxes(updateTableTaxes(tableDetail, invoiceCalculations, TAXES_INVOICE));
        setTableRetention(
            updateTableRetentions(tableRetention, {
                totalBuy: invoiceCalculations.total_gross - invoiceCalculations.total_charge_amount,
                totalIVA: invoiceCalculations.total_iva,
            })
        );
        setTableTotals([...updateTableTotals(invoiceCalculations, false, true)]);
    };

    const getCalculate = async (forCalculate: ICalculateInvoice): Promise<void> => {
        if (lengthGreaterThanZero(forCalculate.products)) await dispatch(getInvoiceCalculations(forCalculate));
    };

    const onChangeTableRetention = (
        { floatValue = NaN }: NumberFormatValues,
        nameField: string,
        item: ITableTaxesAndRetention,
        id = ''
    ): void => {
        const withholdings = tableRetention.map(withholding => {
            if (withholding.name == item.name) {
                switch (nameField) {
                    case TypeNamesInputs.PERCENTAGE:
                        if (floatValue > MAXIMUM_DIGITS && !item.name.toLowerCase().includes(RETE_IVA)) {
                            return withholding;
                        }
                        return {
                            ...withholding,
                            ...(item.isSelectInput && { label: id }),
                            value: (withholding.base * floatValue) / 100,
                            [nameField]: floatValue,
                        };
                    default:
                        return {
                            ...withholding,
                            [nameField]: floatValue,
                        };
                }
            }
            return withholding;
        });
        getCalculate({ products: tableDetail, sending_charge: totalValues.total_charge_amount, withholdings });
        setTableRetention([...withholdings]);
    };

    const handleTotals = ({ floatValue = 0 }: NumberFormatValues, name: string): void => {
        setTotalValues({
            ...totalValues,
            [name]: floatValue,
        });
        getCalculate({
            products: tableDetail,
            withholdings: tableRetention,
            sending_charge: floatValue,
        });
    };

    const handleText = ({ target: { name, value } }: ChangeEvent): void => {
        setFieldsValues({
            ...fieldsValues,
            [name]: value,
        });
    };

    const handleSelect = ({ value, id = '' }: IOptionSelect, name: string | undefined): void => {
        setFieldsValues({
            ...fieldsValues,
            [`${name}_id`]: id,
            [`${name}_name`]: value,
        });
    };

    const handleSelectPerson = ({ value, id = '' }: IOptionSelect): void => {
        const { fiscal_responsibilities, ...supplier } = assignValue(
            KEYS_ASSIGN_SUPPLIER,
            suppliers.find((supplier: IGenericRecord) => id === supplier.person_id) || {}
        );
        setFieldsValues({
            ...fieldsValues,
            person_id: id,
            name: value,
            ...supplier,
            fiscal_responsibilities: fiscal_responsibilities.map((fiscal: IFiscal) => ({ ...fiscal, id: String(fiscal.id) })),
        });
    };

    const handleSelectPayment = ({ value, id = '' }: IOptionSelect): void => {
        setFieldsValues({
            ...fieldsValues,
            payment_type_id: id,
            payment_type_name: value,
            days_collection: '',
            date_limit: value === CREDIT ? '' : fieldsValues.date,
        });
    };

    const handleDaysCollection = ({ target: { value, name } }: ChangeEvent): void => {
        setFieldsValues({
            ...fieldsValues,
            [name]: value,
            date_limit: validateDateLimit(Number(value), fieldsValues.days_collection_type),
        });
    };

    const handleDaysCollectionType = (value: string): void => {
        setFieldsValues({
            ...fieldsValues,
            days_collection_type: value,
            date_limit: validateDateLimit(Number(fieldsValues.days_collection), value),
        });
    };

    const handleModal = (): void => setModalDelete(!modalDelete);

    const addProductOrService = (): void => {
        setTableDetail([...tableDetail, { ...ADD_PRODUCT_SERVICE, id: uuid() }]);
    };

    // eslint-disable-next-line
    const handleTableDetail = (param: IHandleParam): void => {
        const { field } = param;
        if (KEYS_HANDLE.CHANGE_OPTIONS.includes(field as InvoiceTableKeys)) handleOptionSelected(param);
        if (KEYS_HANDLE.CHANGES_NUMBERS.includes(field as InvoiceTableKeys)) handleNumberInputs(param);
        if (KEYS_HANDLE.CHANGES_TEXT.includes(field as InvoiceTableKeys)) handleInputsTable(param);
    };

    const handleOptionSelected = ({ index, field, target: { name = '', value = '' } }: IHandleParam): void => {
        setTableDetail(
            tableDetail.map((detail, indexState) => {
                if (index === indexState) {
                    if (field === InvoiceTableKeys.SKU) {
                        const productFound = listProducts.find(product => product.id === value) || {};
                        const [iva] = productFound.unique_product_taxes as ITaxesProductsStock[];
                        let unitValue = unitCostToDetails(productFound, iva ? [iva] : []);
                        const { foreign_exchange_rate } = fieldsValues;
                        if (foreign_exchange_rate) unitValue = unitValue / foreign_exchange_rate;
                        return {
                            ...detail,
                            ...validateTypeProduct(productFound),
                            ...assignValue(KEYS_ASSIGN_DETAIL, productFound),
                            quantity: 0,
                            discount: 0,
                            sale: unitValue,
                            delivery_cost: 0,
                            product_taxes: iva ? [iva] : [],
                            unit_cost: unitValue,
                            total_buy: unitValue,
                            unit_value: unitValue,
                            percentage_discount: 0,
                            iva: INIT_VALUE_PERCENTAGE,
                            impoconsumption: INIT_VALUE_PERCENTAGE,
                            taxes: iva ? [{ company_tax_id: iva.company_tax_id, tax_value: iva.tax_value }] : [],
                        };
                    }
                    if ([WAREHOUSE, BATCH].includes(field as InvoiceTableKeys)) {
                        const assignValue = {
                            ...detail,
                            [field]: name,
                            [WAREHOUSE === field ? WAREHOUSE_ID : BATCH_ID]: value,
                        };
                        const {
                            multiBatch: [batch],
                            batchDetailId,
                        } = multiOptionsSelect(products, [assignValue]);
                        return {
                            ...assignValue,
                            ...(BATCH === field && { batch_detail_id: batchDetailId, date_expiration: '' }),
                            ...(WAREHOUSE === field
                                ? lengthEqualToZero(batch)
                                    ? { batch_number: NA, date_expiration: NA }
                                    : { ...DEFAULT_BATCH, ...DEFAULT_DATE }
                                : {}),
                        };
                    }
                    return {
                        ...detail,
                        ...(InvoiceTableKeys.MANDATE === field
                            ? {
                                  [field]: value,
                                  mandate: suppliers.find((supplier: IGenericRecord) => supplier.id) || null,
                                  is_mandate: true,
                              }
                            : { [field]: name, [`${field}_id`]: value }),
                    };
                }
                return detail;
            })
        );
    };

    const handleNumberInputs = ({ index, field, target: { floatValue } }: IHandleParam): void => {
        const updateTableDetail = tableDetail.map((detail, indexState) => {
            if (indexState === index) {
                const update = {
                    ...detail,
                    [field]:
                        field === InvoiceTableKeys.PERCENTAGE_DISCOUNT &&
                        (floatValue || 0) > MaxLengthFields.DS_PERCENTAGE_DISCOUNT
                            ? detail.percentage_discount
                            : floatValue,
                };
                return {
                    ...update,
                    ...calculatorDetail(update),
                };
            }
            return detail;
        });
        getCalculate({
            products: updateTableDetail,
            sending_charge: totalValues.total_charge_amount,
            withholdings: updateTableRetentions(tableRetention, getTotalsByInvoiceDetails(updateTableDetail)),
        });
        setTableDetail([...updateTableDetail]);
    };

    const handleInputsTable = ({ index, field, target }: IHandleParam): void => {
        setTableDetail(
            tableDetail.map((detail, indexState) => {
                if (indexState === index) {
                    return {
                        ...detail,
                        [field]: target.value,
                    };
                }
                return detail;
            })
        );
    };

    const handleDelete = (): void => {
        const invoiceDetail = tableDetail.filter(item => !deleteInvoiceDetail.some(({ id }) => item.id === id));
        setTableDetail([...invoiceDetail]);
        handleModal();
    };

    const handleShowTotalWarning = (): void => setTotalWarning(prev => !prev);

    const handleWarningTotal = (): void => {
        const totalValue = tableTotals?.find(item => item.title.trim() === TOTAL)?.value ?? 0;
        if (totalValue < ZERO && !totalWarning) handleShowTotalWarning();
    };

    const assignToState = async (): Promise<void> => {
        if (stateDocument && lengthGreaterThanZero(Object.keys(stateDocument))) {
            const { form, details, retentions, sendingCharge } = stateDocument;
            setFieldsValues({ ...form });
            setTableDetail([...details]);
            getCalculate({ products: details, sending_charge: sendingCharge, withholdings: retentions });
            setTableRetention([...retentions]);
            setTotalValues({ ...totalValues, total_charge_amount: sendingCharge });
            dispatch(setStateInvoice({}));
        }
    };

    const handleClickSupplier = (): void => {
        dispatch(
            setStateInvoice({
                form: fieldsValues,
                details: tableDetail,
                retentions: tableRetention,
                sendingCharge: totalValues.total_charge_amount,
            })
        );
    };

    const handleReloadCurrency = (): void => {
        const details = calculateWithRate(tableDetail, fieldsValues.foreign_exchange_rate);
        setTableDetail([...details]);
        getCalculate({
            products: details,
            sending_charge: totalValues.total_charge_amount,
            withholdings: updateTableRetentions(tableRetention, getTotalsByInvoiceDetails(details)),
        });
    };

    useEffect(() => {
        const abortController = new AbortController();
        initData();
        return (): void => {
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (JSON.stringify(invoiceCalculations) !== JSON.stringify(INVOICE_CALCULATES)) handleTables();
    }, [invoiceCalculations, tableDetail]);

    useEffect(() => {
        handleWarningTotal();
    }, [tableTotals]);

    useEffect(() => {
        assignToState();
    }, [stateDocument]);

    useEffect(() => {
        if (lengthGreaterThanZero(tableDetail)) handleReloadCurrency();
    }, [fieldsValues.foreign_exchange_rate]);

    const optionsPrefixRender = optionsForm.prefix.map(item => ({ ...item, name: item.value }));
    const optionsSupplierRender = optionsForm.suppliers.map(item => ({ ...item, name: item.value }));
    const optionsPaymentTypesRender = optionsForm.paymentTypes.map(item => ({ ...item, name: item.value }));
    const optionsPaymentMethodsRender = optionsForm.paymentMethods.map(item => ({ ...item, name: item.value }));
    const optionsDocumentTypesRender = optionsForm.documentTypes.map(item => ({ ...item, name: item.value }));

    return (
        <div className={`support-document-and-buy ${className}`}>
            <ModalType
                moduleId={ModuleApp.SUPPORT_DOCUMENT}
                iconName="trash"
                open={modalDelete}
                text={MODAL_TYPE.DELETE}
                handleClosed={handleModal}
                finalAction={handleDelete}
                textButton={TitleButtons.DELETE}
                otherButton={{
                    onClick: handleModal,
                    textButton: TitleButtons.CANCEL,
                }}
            />
            <ModalType
                moduleId={ModuleApp.SUPPORT_DOCUMENT}
                iconName="alertMulticolor"
                open={totalWarning}
                text={MODAL_TOTAL.WARNING}
                textButton={TitleButtons.CLOSE}
                finalAction={handleShowTotalWarning}
            />
            <h3 className="text-base text-blue font-allerbold leading-19.38px mb-4.5">Información para documento soporte</h3>
            <Form sendWithEnter className="section-form">
                <div className="box-input">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `prefix`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.PREFIX_ID)}
                        valueSelect={fieldsValues.prefix_name}
                        classesWrapper="w-73 xs:w-full"
                        selectIconType="arrowDownGreen"
                        onChangeSelect={(_, e): void => handleSelect(e, 'prefix')}
                        optionSelect={optionsPrefixRender}
                        {...TOOLTIPS_PAGE.PREFIX}
                        placeholder="Seleccionar"
                        labelText="*Prefijo:"
                        name="prefix"
                        clearOption
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                </div>
                <div className="box-input">
                    <div className="box-input__input-supplier">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `supplier`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.NAME)}
                            classesWrapper="box-input__input-select"
                            onChangeSelect={(_, e): void => handleSelectPerson(e)}
                            optionSelect={optionsSupplierRender}
                            selectIconType="arrowDownGreen"
                            {...TOOLTIPS_PAGE.SUPPLIER}
                            valueSelect={fieldsValues.name}
                            labelText="*Proveedor:"
                            placeholder="Proveedor"
                            tooltipInfo
                            disabled={disabledInputs}
                        />
                        <Link
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `supplier`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.LNK,
                            })}
                            classes="box-input__input-supplier__link-modal hover:text-purple"
                            href={getRoute(Routes.CREATE_SUPPLIER)}
                            onClick={handleClickSupplier}
                            text="+ Agregar proveedor"
                            disabled={disabledInputs}
                        />
                    </div>
                    <fieldset className="group-input-text">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.DOCUMENT_NAME)}
                            classesWrapper="box-input__input-select"
                            options={optionsForm.documentTypes}
                            value={fieldsValues.document_name}
                            {...TOOLTIPS_PAGE.TYPE_DOCUMENT}
                            labelText="*Tipo de documento:"
                            selectIconType="arrowDownGreen"
                            tooltipInfo
                            disabled
                        />
                        <span className="rate-message">{PAGE_TEXT.DOCUMENT_TYPE}</span>
                    </fieldset>
                </div>
                <div className="box-input">
                    <div className="flex items-end xs:w-full w-73">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `document-number`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            classesWrapper={`${isTypeNit ? 'box-input__input-digit mr-2' : 'box-input__input-select'} `}
                            value={fieldsValues.document_number}
                            {...TOOLTIPS_PAGE.DOCUMENT_NUMBER}
                            labelText="Número de documento:"
                            placeholder="0000 000 000"
                            type="number"
                            tooltipInfo
                            disabled
                        />
                        {isTypeNit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `dv`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                tooltipInfo
                                descTooltip="DV: Dígito de verificación"
                                classesWrapper="w-11.2"
                                labelText="DV:"
                                disabled
                                value={digitVerification}
                            />
                        )}
                    </div>
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `type-taxpayer`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.TYPE_TAXPAYER_NAME)}
                        classesWrapper="box-input__input-select"
                        value={fieldsValues.type_taxpayer_name}
                        labelText="*Tipo de contribuyente:"
                        options={optionsForm.typeTaxPayer}
                        selectIconType="arrowDownGreen"
                        {...TOOLTIPS_PAGE.TAXPAYER}
                        name="document_type"
                        tooltipInfo
                        disabled
                    />
                </div>
                <div className="box-input">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `invoice-number-supplier`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Número de la cuenta de cobro o documento equivalente por el proveedor:"
                        value={fieldsValues.invoice_number_supplier}
                        classesWrapper="box-input__input-select box-input__input-select--icon-size "
                        {...TOOLTIPS_PAGE.SUPPORT_DOCUMENT}
                        classesInput="text-number-format"
                        name="invoice_number_supplier"
                        onChange={handleText}
                        placeholder="000000"
                        alphanumeric
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                </div>
                <div className="box-input">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `payment-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.PAYMENT_TYPE_ID)}
                        classesWrapper="box-input__input-select focus:border-green"
                        valueSelect={fieldsValues.payment_type_name}
                        onChangeSelect={(_, e): void => handleSelectPayment(e)}
                        optionSelect={optionsPaymentTypesRender}
                        selectIconType="arrowDownGreen"
                        labelText="*Forma de pago:"
                        {...TOOLTIPS_PAGE.WAY_PAY}
                        placeholder="Seleccionar"
                        tooltipInfo
                        clearOption
                        disabled={disabledInputs}
                    />
                    {fieldsValues.payment_type_name === CREDIT && (
                        <div className="flex items-center gap-2 xs:flex-col">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `days-collection`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                required={isSubmit && includeArray(errorsCustom, DAYS_COLLECTION)}
                                value={fieldsValues.days_collection}
                                classesWrapper="w-38.2 xs:w-full"
                                onChange={handleDaysCollection}
                                labelText="*Días de cobro:"
                                name={DAYS_COLLECTION}
                                integerNumbers
                                disabled={disabledInputs}
                            />
                            <RadioButton
                                moduleId={ModuleApp.SUPPORT_DOCUMENT}
                                classesContainer="self-end"
                                selected={fieldsValues.days_collection_type}
                                setSelected={handleDaysCollectionType}
                                entities={RadioDaysCollectionType}
                                linkerId={SupportingDocumentFieldNames.DAYS_COLLECTION_TYPE}
                                disabled={disabledInputs}
                            />
                        </div>
                    )}
                </div>
                <div className="box-input">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `payment-method`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.PAYMENT_METHOD_ID)}
                        valueSelect={fieldsValues.payment_method_name}
                        optionSelect={optionsPaymentMethodsRender}
                        {...TOOLTIPS_PAGE.PAYMENT_METHOD}
                        classesWrapper="w-73 xs:w-full"
                        selectIconType="arrowDownGreen"
                        onChangeSelect={(_, e): void => handleSelect(e, 'payment_method')}
                        labelText="*Medio de pago:"
                        placeholder="Seleccionar"
                        name="payment_method"
                        clearOption
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `foreign-exchange`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        {...(fieldsValues.foreign_exchange_id && {
                            placeholder: getCurrency(fieldsValues.foreign_exchange_id, foreignExchange),
                            classesWrapperInput: 'currency-input',
                        })}
                        onChangeSelect={(selectedValue, selectedOption): void =>
                            setFieldsValues({
                                ...fieldsValues,
                                foreign_exchange_id: selectedOption.value,
                                foreign_exchange_name: selectedOption.name,
                                foreign_exchange_rate: 0,
                            })
                        }
                        required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.FOREIGN_EXCHANGE_ID)}
                        valueSelect={fieldsValues.foreign_exchange_id}
                        optionSelect={foreignExchange}
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-73 xs:w-full"
                        classNameMain="w-73 xs:w-full"
                        placeholder="Seleccionar"
                        {...TOOLTIPS_PAGE.BADGE}
                        name="foreign_exchange"
                        labelText="*Divisa:"
                        isTableSearch
                        tooltipInfo
                        clearOption
                        disabled={disabledInputs}
                    />
                </div>
                {fieldsValues.foreign_exchange_name !== COLOMBIAN_PESO && (
                    <fieldset className="foreign-currency">
                        <MoneyInput
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `foreign-exchange-rate`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            required={isSubmit && includeArray(errorsCustom, SupportingDocumentFieldNames.FOREIGN_EXCHANGE_RATE)}
                            value={fieldsValues.foreign_exchange_rate}
                            classesInput="text-number-format"
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Tasa de cambio:"
                            placeholder="..."
                            onChange={({ floatValue }): void => {
                                const [integers] = String(floatValue).split('.');
                                setFieldsValues({
                                    ...fieldsValues,
                                    foreign_exchange_rate:
                                        integers.length > NINE ? fieldsValues?.foreign_exchange_rate : floatValue,
                                });
                            }}
                            maxLength={MaxLengthFields.FOREIGN_EXCHANGE_RATE}
                            disabled={disabledInputs}
                            withIcon={false}
                        />
                        <span className="foreign-currency__message">{CURRENCY_TEXT}</span>
                    </fieldset>
                )}
                <CollapseJsx
                    id={generateId({
                        module: ModuleApp.SUPPORT_DOCUMENT,
                        submodule: `collapse`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.CONT,
                    })}
                    title="Información opcional"
                    wrapperClass="margin-8"
                    data={
                        <>
                            <div className="box-input mb-4.5 -mt-5">
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.SUPPORT_DOCUMENT,
                                        submodule: `number-purchase-order`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    classesWrapper="box-input__input-select"
                                    value={fieldsValues.number_purchase_order}
                                    labelText="Número de orden de compra:"
                                    name="number_purchase_order"
                                    onChange={handleText}
                                    placeholder="..."
                                    type="text"
                                    onlyNumbers
                                    disabled={disabledInputs}
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.SUPPORT_DOCUMENT,
                                        submodule: `purchasing-manager`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name={SupportingDocumentFieldNames.PURCHASING_MANAGER}
                                    classesWrapper="box-input__input-select"
                                    value={fieldsValues.purchasing_manager}
                                    labelText="Encargado de la venta:"
                                    onChange={handleText}
                                    placeholder="..."
                                    alphanumeric
                                    type="text"
                                    disabled={disabledInputs}
                                />
                            </div>
                            <div className="box-input">
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.SUPPORT_DOCUMENT,
                                        submodule: `document-type-manager`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    onChangeSelect={(_, { value, id = '' }): void => {
                                        setFieldsValues({
                                            ...fieldsValues,
                                            document_type_purchasing_manager: id,
                                            document_name_purchasing_manager: value,
                                        });
                                    }}
                                    valueSelect={fieldsValues.document_name_purchasing_manager}
                                    labelText="Tipo de documento encargado de la venta:"
                                    classesWrapper="box-input__input-select"
                                    optionSelect={optionsDocumentTypesRender}
                                    selectIconType="arrowDownGreen"
                                    placeholder="Seleccionar"
                                    disabled={disabledInputs}
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.SUPPORT_DOCUMENT,
                                        submodule: `document-number-manager`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name={SupportingDocumentFieldNames.DOCUMENT_NUMBER_PURCHASING_MANAGER}
                                    labelText="Número de documento del encargado de la venta:"
                                    value={fieldsValues.document_number_purchasing_manager}
                                    classesWrapper="box-input__input-select"
                                    placeholder="0000 000 000"
                                    onChange={handleText}
                                    type="text"
                                    onlyNumbers
                                    disabled={disabledInputs}
                                />
                            </div>
                        </>
                    }
                />
            </Form>
            <TableInvoice
                id={generateId({
                    module: ModuleApp.SUPPORT_DOCUMENT,
                    submodule: `invoice`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                showAddProduct
                symbol={symbol}
                className="mt-4.5"
                data={tableDetail}
                deleteProduct={(): void => {
                    if (lengthGreaterThanZero(deleteInvoiceDetail)) setModalDelete(!modalDelete);
                }}
                selected={deleteInvoiceDetail}
                onChangeTable={handleTableDetail}
                setSelected={setDeleteInvoiceDetail}
                addProductService={addProductOrService}
                requiredFieldsTable={errorsTableProduct}
                redirectRoute={`${getRoute(Routes.PRODUCT_DATABASE)}?add-product=true`}
                options={buildOptionsTable({ products: listProducts, invoiceDetails: [], noteDetails: tableDetail })}
            />
            <div className="section-table">
                <div className="flex w-full xs:flex-col xs:gap-y-2 gap-x-7">
                    <div className="flex flex-col gap-y-7">
                        <TableTaxRetention
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `tax`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            symbol={symbol}
                            dataValuesTableRetention={tableRetention}
                            onChangeTableRetention={onChangeTableRetention}
                            errorsTableRetention={{
                                messageFuente,
                                messageIca,
                                messageIva,
                                reteFuente: !!messageFuente,
                                reteIca: !!messageIca,
                                reteIva: !!messageIva,
                            }}
                            isDisabledWithholdings={disabledTableTotalsAndWithholdings}
                            options={{
                                reteIVA: optionsForm.withholdings.map(({ id = '', value }) => ({
                                    name: value,
                                    value: id,
                                })),
                            }}
                            isSupportOrAdjustment
                            isElectronicInvoice
                        />
                        <div className="flex justify-between xs:flex-col gap-y-2">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `observation`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="xs:w-full w-70"
                                labelText="Observaciones:"
                                value={fieldsValues.note}
                                classesInput="h-22.2"
                                onChange={handleText}
                                placeholder="..."
                                name="note"
                                disabled={disabledInputs}
                            />
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `internal-notes`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Comentario para uso interno:"
                                tooltip={TOOLTIPS_PAGE.INTERNAL_COMMENT}
                                value={fieldsValues.internal_notes}
                                classesWrapper="xs:w-full w-70"
                                classesInput="h-22.2"
                                onChange={handleText}
                                name="internal_notes"
                                placeholder="..."
                                disabled={disabledInputs}
                            />
                        </div>
                    </div>
                    <div className="content-taxes-withholdings__table-withholdings">
                        <TableTotals
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `totals`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TBL,
                            })}
                            isDisabledTotals={disabledTableTotalsAndWithholdings}
                            totalValues={totalValues}
                            dataTotals={tableTotals}
                            onChange={handleTotals}
                            isSupportOrAdjustment
                            symbol={symbol}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
