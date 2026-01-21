import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberFormatValues } from 'react-number-format';
import { v4 as uuid } from 'uuid';
import usePermissions from '@hooks/usePermissions';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';
import useDigitVerification from '@hooks/useDigitVerification';
import { RootState } from '@redux/rootReducer';
import { getInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { MODAL_TYPE, TOOLTIPS_PAGE } from '@information-texts/ElectronicNote';
import { IGenericRecord } from '@models/GenericRecord';
import { ICalculateInvoice, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import {
    TextArea,
    TextInput,
    SelectInput,
    IOptionSelect,
    SelectSearchInput,
    DatePickerDayInput,
    PLACEHOLDER_DOCUMENT_TYPE,
    MoneyInput,
} from '@components/input';
import { Form } from '@components/form';
import { ModalType } from '@components/modal';
import { IOption } from '@components/select-search';
import { TableTotals } from '@components/table-totals';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { TableTaxRetention } from '@components/table-tax-retention';
import { TableInvoice, ADD_PRODUCT_SERVICE, buildOptionsTable, IHandleParam } from '@components/table-invoice';
import {
    discardUntaxed,
    calculatorDetail,
    updateTableTotals,
    validateErrorStock,
    validateTypeProduct,
    updateTableRetentions,
    getTotalsByInvoiceDetails,
    updateTableTaxes,
    unitCostToDetails,
} from '@utils/ElectronicInvoice';
import { assignValue } from '@utils/Json';
import { getCurrency } from '@utils/ForeignExchange';
import { getRoute, getRouteName } from '@utils/Paths';
import { multiOptionsSelect } from '@utils/ElectronicNote';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { findItemOption, includeArray, someArrayObject } from '@utils/Array';
import { getDateFromDays, getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { ONE } from '@constants/Numbers';
import { RETE_ICA, RETE_IVA } from '@constants/Tax';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { ZERO_DAYS } from '@constants/Memberships';
import { CURRENCY_TEXT } from '@constants/FieldsValidation';
import { DEFAULT_BATCH, DEFAULT_DATE, MANDATE_ID } from '@constants/ElectronicNote';
import { InvoiceTableKeys, KEYS_ASSIGN_DETAIL, KEYS_HANDLE } from '@constants/TableInvoice';
import {
    DATA_TOTAL_VALUES,
    INVOICE_TYPES,
    ONE_HUNDRED,
    INVOICE_CALCULATES,
    MaxLengthFields,
    NA,
    VALUE_ZERO,
    TEN,
} from '@constants/ElectronicInvoice';
import { CREDIT, INIT_VALUE_PERCENTAGE, TableNameInputs, COUNTED, FormNameInputs } from '@constants/CancellationElectronic';
import { IElectronicNoteProps } from '.';
import './ElectronicNote.scss';

export const ElectronicNote: React.FC<IElectronicNoteProps> = ({
    products,
    fieldsValues,
    setFieldsValues,
    tableNote,
    setTableNote,
    tableRetention,
    setTableTaxes,
    setTableRetention,
    tableTotals,
    setTableTotals,
    isDebitNote,
    optionsForm: { documentTypes, ...options },
    className = '',
    errorsCustom,
    errorsTableProduct,
    errorsTableRetention: { messageFuente, messageIca, messageIva },
}) => {
    const dispatch = useDispatch();
    const [deleteItemTableProduct, setDeleteItemTableProduct] = useState<{ id: string }[]>([]);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [dataValuesTotal, setDataValuesTotal] = useState({ ...DATA_TOTAL_VALUES });
    const { SKU, BATCH, WAREHOUSE, WAREHOUSE_ID, BATCH_ID, MANDATE } = InvoiceTableKeys;
    const { getPermissions, disabledInputs } = usePermissions();
    const DoYouHaveWarehouse = getPermissions(getRouteName(Routes.HOME), getRouteName(Routes.HOME));

    const { multiDigitVerification, handleInitMulti } = useDigitVerification('', '', {
        customer: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldsValues.document_type_name,
            numberDocument: fieldsValues.document_number,
        },
        purchasing_manager: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldsValues.document_type_name_purchasing_manager ?? '',
            numberDocument: fieldsValues.document_number_purchasing_manager ?? '',
        },
        sales_manager: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldsValues.document_type_name_sales_manager ?? '',
            numberDocument: fieldsValues.document_number_sales_manager ?? '',
        },
    });
    const { symbol, calculateWithRate } = useSymbolCurrency(fieldsValues.foreign_exchange_id, products);

    const isDisabledWithholdingsTotals = useMemo(() => !someArrayObject(tableNote, InvoiceTableKeys.SKU), [tableNote]);
    const isPaymentCredit = useMemo(() => fieldsValues.payment_type_name === CREDIT, [fieldsValues.payment_type_name]);
    const isMandate = useMemo(() => fieldsValues.operation_type_id === MANDATE_ID, [fieldsValues.operation_type_id]);

    const {
        cancellationElectronicDocuments: { document: documentForNote },
        electronicInvoice: { invoiceCalculations },
        suppliers: { data: suppliers },
    } = useSelector(({ cancellationElectronicDocuments, electronicInvoice, suppliers }: RootState) => ({
        cancellationElectronicDocuments,
        electronicInvoice,
        suppliers: suppliers.suppliers,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.name,
            value = e.target.value;
        if (name === FormNameInputs.DAYS_COLLECTION && isPaymentCredit) {
            const days = parseInt(value) < ONE ? ZERO_DAYS : parseInt(value);
            setFieldsValues({
                ...fieldsValues,
                date_limit: getDateFromUnix(getDateFromDays(getUnixFromDate(fieldsValues.date), days), 'YYYY-MM-DD').dateFormat,
                [name]: Number(days),
            });
            return;
        }
        setFieldsValues({
            ...fieldsValues,
            [name]: value,
        });
    };

    const handleChangeSelect = (option: IOptionSelect, name: string): void => {
        setFieldsValues({
            ...fieldsValues,
            [`${name}_id`]: option.id,
            [`${name}_name`]: option.value,
        });
    };

    const handleOptionSelected = ({ field, index, target: { value = '', id = '' } }: IHandleParam): void => {
        setTableNote(
            tableNote.map((item, indexState) => {
                if (indexState === index) {
                    if (field === SKU) {
                        return buildDataProduct(item, value);
                    }
                    if ([WAREHOUSE, BATCH].includes(field as InvoiceTableKeys)) {
                        return buildDataBatch(item, field, id, value);
                    }
                    if (field === MANDATE) {
                        return {
                            ...item,
                            [MANDATE]: id,
                            is_mandate: true,
                            mandate: suppliers.find((item: IGenericRecord) => item.id === id) || null,
                        };
                    }
                    return {
                        ...item,
                        [field]: value,
                        [`${field}_id`]: id,
                    };
                }
                return item;
            })
        );
    };

    const buildDataProduct = (item: IInvoiceDetails, value: IGenericRecord): IInvoiceDetails => {
        const product = products.find(product => product.id === value) || {};
        const uniqueProductTaxes = discardUntaxed(product.unique_product_taxes);
        let unit_value = unitCostToDetails(product, uniqueProductTaxes);
        const { foreign_exchange_rate } = fieldsValues;
        if (foreign_exchange_rate) unit_value = unit_value / foreign_exchange_rate;
        return {
            ...item,
            ...validateTypeProduct(product),
            ...assignValue(KEYS_ASSIGN_DETAIL, product),
            ciiu_id: product.product.ciiu_id || '2',
            impoconsumption: INIT_VALUE_PERCENTAGE,
            iva: INIT_VALUE_PERCENTAGE,
            unit_value,
            quantity: 0,
            discount: 0,
            delivery_cost: 0,
            sale: unit_value,
            unit_cost: unit_value,
            total_buy: unit_value,
            percentage_discount: 0,
            product_taxes: uniqueProductTaxes,
            taxes: uniqueProductTaxes.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })),
        };
    };

    const buildDataBatch = (item: IInvoiceDetails, field: string, id: string, value: IGenericRecord): IInvoiceDetails => {
        const assignValue = { ...item, [WAREHOUSE === field ? WAREHOUSE_ID : BATCH_ID]: id, [field]: value };
        const {
            multiBatch: [batch],
            batchDetailId,
        } = multiOptionsSelect(products, [assignValue]);
        const currentBatch = lengthEqualToZero(batch)
            ? { batch_number: NA, date_expiration: NA }
            : { ...DEFAULT_BATCH, ...DEFAULT_DATE };
        return {
            ...assignValue,
            ...(BATCH === field && { batch_detail_id: batchDetailId, date_expiration: '' }),
            ...(WAREHOUSE === field ? currentBatch : {}),
        };
    };

    const handleNumberInputs = ({ field, index, target: { floatValue } }: IHandleParam): void => {
        const updateState = tableNote.map((item, indexState) => {
            if (indexState === index) {
                const update = {
                    ...item,
                    [field]:
                        field === InvoiceTableKeys.PERCENTAGE_DISCOUNT && (floatValue || 0) > MaxLengthFields.PERCENTAGE_DISCOUNT
                            ? item.percentage_discount
                            : floatValue,
                };
                return {
                    ...update,
                    ...calculatorDetail(update),
                };
            }
            return item;
        });
        getCalculate({
            products: updateState,
            sending_charge: dataValuesTotal.total_charge_amount,
            withholdings: updateTableRetentions(tableRetention, getTotalsByInvoiceDetails(updateState)),
        });
        setTableNote(updateState);
    };

    const handleInputsTable = ({ field, index, target }: IHandleParam): void => {
        setTableNote(
            tableNote.map((item, indexState) => {
                if (indexState === index) {
                    return {
                        ...item,
                        [field]: target.value,
                    };
                }
                return item;
            })
        );
    };

    const handleAddProductService = (): void => {
        const productsNote = [
            ...tableNote,
            {
                ...ADD_PRODUCT_SERVICE,
                id: uuid(),
                new_product: false,
            },
        ];
        setDeleteItemTableProduct([]);
        setTableNote(productsNote);
    };

    const handleChangeTable = (param: IHandleParam): void => {
        const { field } = param;
        if (KEYS_HANDLE.CHANGE_OPTIONS.includes(field as InvoiceTableKeys)) handleOptionSelected(param);
        if (KEYS_HANDLE.CHANGES_NUMBERS.includes(field as InvoiceTableKeys)) handleNumberInputs(param);
        if (KEYS_HANDLE.CHANGES_TEXT.includes(field as InvoiceTableKeys)) handleInputsTable(param);
    };

    const handleTotalItem = ({ floatValue = NaN }: NumberFormatValues, nameField: string): void => {
        setDataValuesTotal({
            ...dataValuesTotal,
            [nameField]: floatValue,
        });
        getCalculate({
            products: tableNote,
            sending_charge: floatValue,
            withholdings: tableRetention,
        });
    };

    const handleReteInputs = (
        { floatValue = NaN }: NumberFormatValues,
        nameField: string,
        item: ITableTaxesAndRetention,
        id = ''
    ): void => {
        const withholdings = tableRetention.map(({ name, ...withholding }) => {
            if (name == item.name) {
                if (nameField === TableNameInputs.PERCENTAGE) {
                    let percentage = item.percentage;
                    if (
                        (floatValue < TEN && name.includes(RETE_ICA)) ||
                        (floatValue < ONE_HUNDRED && ![RETE_ICA, RETE_IVA].includes(name))
                    )
                        percentage = floatValue;
                    if (RETE_IVA === name) percentage = floatValue;
                    return {
                        ...withholding,
                        ...(item.isSelectInput && { label: id }),
                        name,
                        value: (withholding.base * percentage) / 100,
                        [nameField]: percentage,
                    };
                }
                return {
                    ...withholding,
                    name,
                    [nameField]: floatValue,
                };
            }
            return { ...withholding, name };
        });
        getCalculate({
            products: tableNote,
            sending_charge: dataValuesTotal.total_charge_amount,
            withholdings,
        });
        setTableRetention([...withholdings]);
    };

    const handleDeleteItemMain = (): void => {
        const main = [...tableNote];
        deleteItemTableProduct.forEach((item: IGenericRecord) => {
            const index = tableNote.findIndex(product => product.id === item.id);
            main.splice(index, 1);
        });
        setDeleteItemTableProduct([]);
        getCalculate({
            products: main,
            sending_charge: dataValuesTotal.total_charge_amount,
            withholdings: tableRetention,
        });
        setTableNote(main);
        handleModal();
    };

    const handleTables = (): void => {
        setTableTaxes(updateTableTaxes(tableNote, invoiceCalculations));
        setTableRetention(
            updateTableRetentions(tableRetention, {
                totalBuy: invoiceCalculations.total_gross - invoiceCalculations.total_charge_amount,
                totalIVA: invoiceCalculations.total_iva,
            })
        );
        setTableTotals([...updateTableTotals(invoiceCalculations)]);
    };

    const getCalculate = (forCalculate: ICalculateInvoice): void => {
        dispatch(getInvoiceCalculations(forCalculate));
    };

    const handleModal = (): void => setShowModalDelete(!showModalDelete);

    const handleReloadCurrency = (): void => {
        const details = calculateWithRate(tableNote, fieldsValues.foreign_exchange_rate);
        setTableNote([...details]);
        getCalculate({
            products: details,
            sending_charge: dataValuesTotal.total_charge_amount,
            withholdings: updateTableRetentions(tableRetention, getTotalsByInvoiceDetails(details)),
        });
    };

    useEffect(() => {
        if (JSON.stringify(invoiceCalculations) !== JSON.stringify(INVOICE_CALCULATES)) handleTables();
    }, [invoiceCalculations, tableNote]);

    useEffect(() => {
        handleInitMulti();
    }, [fieldsValues]);

    useEffect(() => {
        if (fieldsValues.payment_type_name === COUNTED) {
            setFieldsValues({
                ...fieldsValues,
                days_collection: NaN,
            });
        }
    }, [fieldsValues.payment_type_name]);

    useEffect(() => {
        setDataValuesTotal({ ...dataValuesTotal, total_charge_amount: documentForNote?.sending_charge || 0 });
    }, [documentForNote]);

    useEffect(() => {
        if (lengthGreaterThanZero(tableNote)) handleReloadCurrency();
    }, [fieldsValues.foreign_exchange_rate]);

    const prefixOptionsRender = options.prefix.map(item => ({ ...item, name: item.value }));

    return (
        <div className={`electronic-note ${className}`}>
            <ModalType
                moduleId={`${ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE}-trash`}
                iconName="trash"
                open={showModalDelete}
                text={MODAL_TYPE.DELETE}
                finalAction={handleDeleteItemMain}
                handleClosed={handleModal}
                textButton={TitleButtons.DELETE}
                otherButton={{
                    textButton: TitleButtons.CANCEL,
                    onClick: handleModal,
                }}
            />
            <Form sendWithEnter className="content-form-section">
                <div className="form-section">
                    <h2 className="font-allerbold text-base text-blue leading-19.38px">
                        Información de la nota {isDebitNote ? 'débito' : 'credito'}
                    </h2>
                    <div className="box-content-inputs">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-prefix`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            {...(isDebitNote ? TOOLTIPS_PAGE.PREFIX_DEBIT_NOTE : TOOLTIPS_PAGE.PREFIX_CREDIT_NOTE)}
                            onChangeSelect={(_, option): void => handleChangeSelect(option, FormNameInputs.PREFIX)}
                            required={includeArray(errorsCustom, FormNameInputs.PREFIX_NAME)}
                            valueSelect={fieldsValues.prefix_name}
                            labelText="*Prefijo de la nota:"
                            classesWrapper="style-inputs"
                            optionSelect={prefixOptionsRender}
                            placeholder="Prefijo"
                            tooltipInfo
                            disabled={disabledInputs}
                        />
                    </div>
                    <div className="box-content-inputs">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-type-invoice`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            value={findItemOption(INVOICE_TYPES, fieldsValues.operation_type_id).value}
                            {...TOOLTIPS_PAGE.INVOICE_TYPE}
                            labelText="*Tipo de factura:"
                            classesWrapper="style-inputs"
                            options={INVOICE_TYPES}
                            tooltipInfo
                            disabled
                        />
                    </div>
                    <div className="box-content-inputs">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-prefix-associated-document`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            value={fieldsValues.associated_document_prefix || ''}
                            labelText="Prefijo factura electrónica asociada:"
                            name="associated_document_prefix"
                            {...TOOLTIPS_PAGE.PREFIX_INVOICE}
                            classesWrapper="style-inputs"
                            placeholder="Input default"
                            tooltipInfo
                            disabled
                        />
                    </div>
                    <div className="box-content-inputs">
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-date-associated-document`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Fecha de transmisión de la factura electrónica:"
                            selected={getUnixFromDate(fieldsValues.associated_date)}
                            name="date_issue_associated_document"
                            classesWrapper="style-date-input"
                            disabled
                        />
                        <DatePickerDayInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-date--expiration-associated-document`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Fecha de vencimiento de la factura electrónica:"
                            selected={getUnixFromDate(fieldsValues.associated_expiration_date)}
                            name="date_issue_associated_document"
                            classesWrapper="style-date-input"
                            disabled
                        />
                    </div>
                    <h3 className="text-base text-gray-dark font-allerbold">Información de su cliente:</h3>
                    <div className="box-content-inputs">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-customer-name`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Nombre del cliente o empresa:"
                            classesWrapper="style-inputs"
                            {...TOOLTIPS_PAGE.CUSTOMER}
                            value={fieldsValues.name}
                            placeholder="Nombre"
                            name="customer_name"
                            tooltipInfo
                            disabled
                        />
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            optionSelected={(option): void => handleChangeSelect(option, FormNameInputs.CUSTOMER_DOCUMENT_TYPE)}
                            value={fieldsValues.document_type_name}
                            placeholder={PLACEHOLDER_DOCUMENT_TYPE}
                            {...TOOLTIPS_PAGE.DOCUMENT_TYPE}
                            labelText="*Tipo de documento:"
                            classesWrapper="style-inputs"
                            options={documentTypes}
                            tooltipInfo
                            disabled
                        />
                    </div>
                    <div className="box-content-inputs">
                        <div className="flex flex-row items-end justify-between style-inputs">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-document-number`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper={`style-inputs ${
                                    multiDigitVerification.customer.isTypeNit ? 'style-inputs__nit-input' : ''
                                }`}
                                value={fieldsValues.document_number}
                                {...TOOLTIPS_PAGE.DOCUMENT_NUMBER}
                                labelText="*Número de documento:"
                                name="customer_document_number"
                                placeholder="00000 00000 0000"
                                tooltipInfo
                                disabled
                            />
                            {multiDigitVerification.customer.isTypeNit && (
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                        submodule: `create-dv`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    value={multiDigitVerification.customer.digitVerification}
                                    classesWrapper="ml-4.5 w-11.2"
                                    labelText="DV:"
                                    disabled
                                />
                            )}
                        </div>
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-type-tax-payer`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            optionSelected={(option): void => handleChangeSelect(option, FormNameInputs.TYPE_TAXPAYER)}
                            value={fieldsValues.type_taxpayer_name}
                            labelText="*Tipo de contribuyente:"
                            options={options.typeTaxPayer}
                            classesWrapper="style-inputs"
                            {...TOOLTIPS_PAGE.TAXPAYER}
                            tooltipInfo
                            disabled
                        />
                    </div>
                    <section className="box-content-inputs">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-name-legal-representative`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            value={fieldsValues.name_legal_representative || ''}
                            labelText="Nombre del representante legal:"
                            classesWrapper="style-inputs"
                            placeholder="..."
                            disabled
                        />
                    </section>
                    <div className="box-content-inputs">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-payment-types`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            optionSelected={(option): void => handleChangeSelect(option, FormNameInputs.PAYMENT_TYPE)}
                            value={fieldsValues.payment_type_name}
                            options={options.paymentTypes}
                            classesWrapper="style-inputs"
                            labelText="*Forma de pago:"
                            {...TOOLTIPS_PAGE.WAY_PAY}
                            tooltipInfo
                            disabled
                        />
                        {isPaymentCredit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-days-collections`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={String(fieldsValues.days_collection)}
                                classesInput="input-number-negative"
                                classesWrapper="style-inputs"
                                labelText="*Días de cobro:"
                                onChange={handleChange}
                                name="days_collection"
                                placeholder="..."
                                integerNumbers
                                type="number"
                                tooltipInfo
                                disabled
                            />
                        )}
                    </div>
                    <div className="box-content-inputs">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-payment-methods`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            optionSelected={(option): void => handleChangeSelect(option, 'payment_method')}
                            value={fieldsValues.payment_method_name}
                            classesWrapper="style-inputs"
                            labelText="*Medio de pago:"
                            {...TOOLTIPS_PAGE.PAYMENT_METHOD}
                            options={options.paymentMethods}
                            tooltipInfo
                            disabled
                        />
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-foreign-exchange`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            {...(fieldsValues.foreign_exchange_id && {
                                placeholder: getCurrency(fieldsValues.foreign_exchange_id, []),
                                classesWrapperInput: 'currency-input',
                            })}
                            onChangeSelect={(option, optionComplete): void =>
                                handleChangeSelect(optionComplete, FormNameInputs.BADGE)
                            }
                            valueSelect={fieldsValues.foreign_exchange_id}
                            optionSelect={options.foreignExchange}
                            classesWrapper="style-inputs"
                            placeholder="Seleccionar"
                            {...TOOLTIPS_PAGE.BADGE}
                            labelText="*Divisa:"
                            tooltipInfo
                            disabled
                        />
                        {!!fieldsValues.foreign_exchange_rate && (
                            <fieldset className="flex flex-col">
                                <MoneyInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                        submodule: `create-foreign-exchange-rate`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    value={fieldsValues.foreign_exchange_rate}
                                    classesWrapper="md:mt-0 w-73 xs:w-full"
                                    classesInput="text-number-format"
                                    labelText="*Tasa de cambio:"
                                    placeholder="..."
                                    withIcon={false}
                                    disabled
                                />
                                <span className="foreign-message">{CURRENCY_TEXT}</span>
                            </fieldset>
                        )}
                    </div>
                    <CollapseJsx
                        title="Información opcional"
                        wrapperClass="not-margin"
                        data={
                            <div className="box-content-inputs">
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                        submodule: `create-number-purchase`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    value={fieldsValues.number_purchase_order ?? ''}
                                    labelText="Número de orden de compra:"
                                    maxLength={MaxLengthFields.ORDER}
                                    classesInput="text-number-format"
                                    classesWrapper="style-inputs"
                                    name="number_purchase_order"
                                    onChange={handleChange}
                                    placeholder="..."
                                    disabled
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                        submodule: `create-sales-manager`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    value={fieldsValues.sales_manager ?? ''}
                                    labelText="Encargado de la venta:"
                                    classesWrapper="style-inputs"
                                    onChange={handleChange}
                                    name="sales_manager"
                                    placeholder="..."
                                    disabled
                                />
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                        submodule: `create-document-type-sales-manager`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    optionSelected={(option): void => handleChangeSelect(option, 'sales_manager')}
                                    value={fieldsValues.document_type_name_sales_manager ?? ''}
                                    labelText="Tipo de documento encargado de la venta:"
                                    classesWrapper="style-inputs"
                                    placeholder="Seleccionar"
                                    options={documentTypes}
                                    clearOption
                                    disabled
                                />
                                <div className="flex flex-row items-end justify-between style-inputs">
                                    <TextInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                            submodule: `create-document-number-sales-manager`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        labelText="Número de documento del encargado de la venta:"
                                        value={fieldsValues.document_number_sales_manager ?? ''}
                                        maxLength={MaxLengthFields.DOCUMENT}
                                        name="document_number_sales_manager"
                                        classesInput="text-number-format"
                                        classesWrapper="style-inputs"
                                        onChange={handleChange}
                                        placeholder="..."
                                        onlyNumbers
                                        alphanumeric
                                        disabled
                                    />
                                    {multiDigitVerification.sales_manager.isTypeNit && (
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                                submodule: `create-dv-sales-manager`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            classesWrapper="ml-4.5 w-11.2 xs:w-1/5"
                                            value={multiDigitVerification.sales_manager.digitVerification}
                                            labelText="DV:"
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    />
                </div>
            </Form>
            <TableInvoice
                symbol={symbol}
                data={tableNote}
                isMandate={isMandate}
                options={buildOptionsTable({
                    invoiceDetails: documentForNote?.invoice_details,
                    addMoreProducts: isDebitNote,
                    noteDetails: tableNote,
                    suppliers,
                    products,
                })}
                deleteProduct={(): void => {
                    if (lengthGreaterThanZero(deleteItemTableProduct)) handleModal();
                }}
                selected={deleteItemTableProduct}
                onChangeTable={handleChangeTable}
                setSelected={setDeleteItemTableProduct}
                requiredFieldsTable={errorsTableProduct}
                addProductService={handleAddProductService}
                redirectRoute={getRoute(Routes.HOME)}
                warningsStock={DoYouHaveWarehouse ? validateErrorStock(tableNote) : []}
                showAddProduct={isDebitNote || tableNote.length !== documentForNote?.invoice_details?.length}
            />
            <div className="flex flex-row xs:flex-col">
                <div className="mb-0 xs:w-full xs:mb-5">
                    <TableTaxRetention
                        symbol={symbol}
                        dataValuesTableRetention={tableRetention}
                        errorsTableRetention={{
                            reteFuente: !!messageFuente,
                            messageFuente,
                            reteIca: !!messageIca,
                            messageIca,
                            reteIva: !!messageIva,
                            messageIva,
                        }}
                        onChangeTableRetention={handleReteInputs}
                        isDisabledWithholdings={isDisabledWithholdingsTotals}
                        options={{
                            reteIVA: options.withholdings.map(({ id, value }) => ({
                                value: id,
                                name: value,
                            })) as IOption[],
                        }}
                        isElectronicInvoice
                    />
                    <div className="box-content-inputs mt-7">
                        <TextArea
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-observations`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            maxLength={MaxLengthFields.OBSERVATIONS}
                            value={fieldsValues.note || ''}
                            classesWrapper="style-inputs"
                            classesInput="px-2 height-69"
                            labelText="Observaciones:"
                            disabled={disabledInputs}
                            onChange={handleChange}
                            name="note"
                            placeholder="..."
                        />
                        <TextArea
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-internal-notes`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            maxLength={MaxLengthFields.OBSERVATIONS}
                            tooltip={TOOLTIPS_PAGE.INTERNAL_COMMENT}
                            labelText="Comentario para uso interno:"
                            value={fieldsValues.internal_notes || ''}
                            classesWrapper="style-inputs"
                            classesInput="px-2 height-69"
                            disabled={disabledInputs}
                            onChange={handleChange}
                            name="internal_notes"
                            placeholder="..."
                        />
                    </div>
                </div>
                <div className="ml-7 xs:w-full xs:ml-0">
                    <TableTotals
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `totals`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        isDisabledTotals={isDisabledWithholdingsTotals}
                        totalValues={dataValuesTotal}
                        onChange={handleTotalItem}
                        dataTotals={tableTotals}
                        symbol={symbol}
                    />
                </div>
            </div>
        </div>
    );
};
