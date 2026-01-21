import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberFormatValues } from 'react-number-format';
import { v4 } from 'uuid';
import usePermissions from '@hooks/usePermissions';
import { useSymbolCurrency } from '@hooks/useSymbolCurrency';
import useDigitVerification from '@hooks/useDigitVerification';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { ICalculateInvoice, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { MODAL_TYPE } from '@information-texts/ElectronicNote';
import { MODAL_TOTAL, TOOLTIPS_PAGE } from '@information-texts/SupportDocumentAndBuy';
import { RootState } from '@redux/rootReducer';
import { getInvoiceCalculations } from '@redux/electronic-invoice/actions';
import { getRoute } from '@utils/Paths';
import { includeArray } from '@utils/Array';
import { calculatePercentage } from '@utils/Number';
import { lengthGreaterThanZero } from '@utils/Length';
import { getDateFromUnix, getUnixFromDate } from '@utils/Date';
import {
    calculatorDetail,
    getTotalsByInvoiceDetails,
    updateTableRetentions,
    updateTableTaxes,
    updateTableTotals,
} from '@utils/ElectronicInvoice';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { IOption } from '@components/select-search';
import { Form } from '@components/form';
import { ModalType } from '@components/modal';
import { TableTotals } from '@components/table-totals';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { TypeNamesInputs } from '@components/electronic-invoice';
import { TableTaxRetention } from '@components/table-tax-retention';
import { TableInvoice, ADD_PRODUCT_SERVICE, buildOptionsTable, IHandleParam } from '@components/table-invoice';
import { DatePickerDayInput, IOptionSelect, MoneyInput, SelectInput, TextArea, TextInput } from '@components/input';
import { RETE_IVA } from '@components/support-document-and-buy';
import { Routes } from '@constants/Paths';
import { ZERO } from '@constants/UtilsConstants';
import { TitleButtons } from '@constants/Buttons';
import { CREDIT } from '@constants/CancellationElectronic';
import { InvoiceTableKeys, KEYS_HANDLE } from '@constants/TableInvoice';
import { DATA_TOTAL_VALUES, INVOICE_CALCULATES, MAXIMUM_DIGITS, MaxLengthFields, NA } from '@constants/ElectronicInvoice';
import { IAdjustmentNoteProps, TOTAL } from '.';
import './AdjustmentNote.scss';

export const AdjustmentNote: React.FC<IAdjustmentNoteProps> = ({
    form,
    setForm,
    tableTotals,
    productsStock,
    tableRetentions,
    tableAdjustmentNote,
    setTableTotals,
    requiredFormFields,
    setTableRetentions,
    setTableTaxes,
    requiredFieldsTable,
    setTableAdjustmentNote,
    optionsForm,
    submit = false,
    errorRetentions: { messageFuente, messageIca, messageIva },
    originalData: { products: supportDetails, ...originalData },
}) => {
    const dispatch = useDispatch();
    const { disabledInputs } = usePermissions();
    const { person } = form;
    const { supplier } = person;
    const { SKU, WAREHOUSE, BATCH, DATE } = InvoiceTableKeys;

    const { digitVerification, isTypeNit } = useDigitVerification(person.document_type_name, person.document_number);
    const { symbol, calculateWithRate } = useSymbolCurrency(form.foreign_exchange_id, productsStock);

    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [totalWarning, setTotalWarning] = useState<boolean>(false);
    const [deleteItemTableProduct, setDeleteItemTableProduct] = useState<{ id: string }[]>([]);
    const [totalValues, setTotalValues] = useState({ ...DATA_TOTAL_VALUES });

    const invoiceCalculations = useSelector((state: RootState) => state.electronicInvoice.invoiceCalculations);

    const onChangeSelectInput = (item: IOptionSelect, name: string, id: string): void => {
        setForm({ ...form, [name]: item.value, [id]: item.id });
    };

    const isTotalGreat = useMemo(() => (tableTotals.find(({ field }) => field === 'total')?.value ?? 0) > originalData.total, [
        tableTotals,
        originalData,
    ]);

    const onChange = (item: IGenericRecord): void => setForm({ ...form, [item?.name]: item?.value });

    const handleTables = (): void => {
        setTableTaxes(updateTableTaxes(tableAdjustmentNote, invoiceCalculations));
        setTableRetentions(
            updateTableRetentions(tableRetentions, {
                totalBuy: invoiceCalculations.total_gross - invoiceCalculations.total_charge_amount,
                totalIVA: invoiceCalculations.total_iva,
            })
        );
        setTotalValues({ ...totalValues, total_charge_amount: invoiceCalculations.total_charge_amount });
        setTableTotals([...updateTableTotals(invoiceCalculations, false, true)]);
    };

    const getCalculate = (forCalculate: ICalculateInvoice): void => {
        dispatch(getInvoiceCalculations(forCalculate));
    };

    const onChangeTableRetention = (
        { floatValue = NaN }: NumberFormatValues,
        nameField: string,
        item: ITableTaxesAndRetention,
        id = ''
    ): void => {
        const withholdings = tableRetentions.map(withholding => {
            if (withholding.name == item.name) {
                if (nameField === TypeNamesInputs.PERCENTAGE) {
                    if (floatValue > MAXIMUM_DIGITS && !item.name.toLowerCase().includes(RETE_IVA)) {
                        return withholding;
                    }
                    return {
                        ...withholding,
                        ...(item.isSelectInput && { label: id }),
                        value: (withholding.base * floatValue) / 100,
                        [nameField]: floatValue,
                    };
                }
                return {
                    ...withholding,
                    [nameField]: floatValue,
                };
            }
            return withholding;
        });

        getCalculate({ products: tableAdjustmentNote, sending_charge: totalValues.total_charge_amount, withholdings });
        setTableRetentions([...withholdings]);
    };

    const handleTotals = ({ floatValue = 0 }: NumberFormatValues, name: string): void => {
        setTotalValues({
            ...totalValues,
            [name]: floatValue,
        });
        getCalculate({
            products: tableAdjustmentNote,
            withholdings: tableRetentions,
            sending_charge: floatValue,
        });
    };

    const onDeleteItems = (): void => {
        const updateTable = tableAdjustmentNote?.filter(item => !deleteItemTableProduct.some(({ id }) => item.id === id));
        setTableAdjustmentNote([...updateTable]);
        setDeleteItemTableProduct([]);
        getCalculate({
            products: updateTable,
            sending_charge: totalValues.total_charge_amount,
            withholdings: updateTableRetentions(tableRetentions, getTotalsByInvoiceDetails(updateTable)),
        });
        setShowModalDelete(!showModalDelete);
    };

    const onAddProductTable = (): void =>
        setTableAdjustmentNote([
            ...tableAdjustmentNote,
            {
                ...ADD_PRODUCT_SERVICE,
                id: v4(),
            },
        ]);

    const handleChangeTable = (param: IHandleParam): void => {
        const { field } = param;
        if (KEYS_HANDLE.CHANGE_OPTIONS.includes(field as InvoiceTableKeys)) onChangeSelectProduct(param);
        if (KEYS_HANDLE.CHANGES_NUMBERS.includes(field as InvoiceTableKeys)) onChangeNumberProduct(param);
        if (KEYS_HANDLE.CHANGES_TEXT.includes(field as InvoiceTableKeys)) onChangeTextProduct(param);
    };

    const updateProductDetails = (field: string, value: string, item: IInvoiceDetails): IInvoiceDetails => {
        if (field !== SKU) return item;

        const { is_product, ...detail } = (supportDetails ?? []).find(
            (product: IGenericRecord) => product.unique_products_id === value
        ) ?? { is_product: false };

        return {
            ...detail,
            quantity: 0,
            warehouse_name: !is_product ? NA : detail.warehouse_name,
            batch_number: !is_product ? NA : detail.batch_number,
            date_expiration: !is_product ? NA : getDateFromUnix(getUnixFromDate(detail.date_expiration)).dateFormat,
            percentage_discount: calculatePercentage(detail.unit_value, detail.discount),
            taxes: item.product_taxes?.map(({ company_tax_id, tax_value }: ITaxesProductsStock) => ({
                company_tax_id,
                tax_value,
            })),
        };
    };

    const updateAdjustmentNoteField = (field: string, id: string, value: string, item: IInvoiceDetails): IInvoiceDetails => {
        if ([WAREHOUSE, BATCH, DATE].includes(field as InvoiceTableKeys)) {
            return {
                ...item,
                ...(WAREHOUSE === field && { warehouse_id: id, [WAREHOUSE]: value }),
                ...(BATCH === field && { batch_id: id, [BATCH]: value }),
                ...(DATE === field && { date_id: id, [DATE]: value }),
            };
        }
        return item;
    };

    const onChangeSelectProduct = ({ field, index, target: { id = '', value = '' } }: IHandleParam): void => {
        setTableAdjustmentNote(
            tableAdjustmentNote?.map((item, indexState) => {
                if (indexState !== index) return item;
                let updatedItem = updateAdjustmentNoteField(field, id, value, item);
                if (field === SKU) updatedItem = updateProductDetails(field, value, updatedItem);
                return updatedItem;
            })
        );
    };

    const onChangeNumberProduct = ({ field, index, target: { floatValue } }: IHandleParam): void => {
        const updateTable = tableAdjustmentNote?.map((detail, indexState) => {
            if (indexState === index) {
                const itemNew = {
                    ...detail,
                    [field]:
                        field === InvoiceTableKeys.PERCENTAGE_DISCOUNT &&
                        (floatValue || 0) > MaxLengthFields.DS_PERCENTAGE_DISCOUNT
                            ? detail.percentage_discount
                            : floatValue,
                };
                return {
                    ...itemNew,
                    ...calculatorDetail(itemNew),
                };
            }
            return detail;
        });
        setTableAdjustmentNote([...updateTable]);
        getCalculate({
            products: updateTable,
            sending_charge: totalValues.total_charge_amount,
            withholdings: updateTableRetentions(tableRetentions, getTotalsByInvoiceDetails(updateTable)),
        });
    };

    const onChangeTextProduct = ({ field, index, target }: IHandleParam): void => {
        setTableAdjustmentNote(
            tableAdjustmentNote?.map((detail, indexState) => {
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

    const handleModal = (): void => setShowModalDelete(!showModalDelete);

    const handleShowTotalWarning = (): void => setTotalWarning(prev => !prev);

    const handleWarningTotal = (): void => {
        const totalValue = tableTotals?.find(item => item.title.trim() === TOTAL)?.value ?? 0;
        if (totalValue < ZERO && !totalWarning) handleShowTotalWarning();
    };

    useEffect(() => {
        if (JSON.stringify(invoiceCalculations) !== JSON.stringify(INVOICE_CALCULATES)) handleTables();
    }, [invoiceCalculations, tableAdjustmentNote]);

    useEffect(() => {
        handleWarningTotal();
    }, [tableTotals]);

    useEffect(() => {
        if (lengthGreaterThanZero(tableAdjustmentNote))
            setTableAdjustmentNote([...calculateWithRate(tableAdjustmentNote, form.foreign_exchange_rate)]);
    }, [form.foreign_exchange_rate]);

    return (
        <Form className="adjustment-note">
            <ModalType
                moduleId={`${ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE}-trash`}
                iconName="trash"
                open={showModalDelete}
                text={MODAL_TYPE.DELETE}
                finalAction={onDeleteItems}
                handleClosed={handleModal}
                textButton={TitleButtons.DELETE}
                otherButton={{
                    textButton: TitleButtons.CANCEL,
                    onClick: handleModal,
                }}
            />
            <ModalType
                moduleId={`${ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE}-warning`}
                iconName="alertMulticolor"
                open={totalWarning}
                text={MODAL_TOTAL.WARNING}
                textButton={TitleButtons.CLOSE}
                finalAction={handleShowTotalWarning}
            />
            <h2 className="font-allerbold text-base text-blue leading-19.38px mb-4.5">Información para nota de ajuste</h2>
            <div className="content-form">
                <SelectInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `create-prefix`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    optionSelected={(option): void => {
                        setForm({ ...form, prefix_id: option.id ?? '', prefix_name: option.value });
                    }}
                    required={submit && includeArray(requiredFormFields, 'prefix_name')}
                    disabled={disabledInputs}
                    classesWrapper="content-form__input-style"
                    options={optionsForm.prefix}
                    labelText="*Prefijo nota de ajuste:"
                    value={form.prefix_name || ''}
                    placeholder="Seleccionar"
                    {...TOOLTIPS_PAGE.PREFIX}
                    tooltipInfo
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                        submodule: `create-prefix-associated-document`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="Prefijo documento soporte asociado:"
                    value={form.prefix_name_associated + form.prefix_number_associated || ''}
                    classesWrapper="content-form__input-style"
                    name="prefix_associated_support_document"
                    placeholder="Input Default"
                    disabled
                />
                <div className="content-form__section-inputs">
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-date-associated`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Fecha de transmisión del documento soporte:"
                        selected={getUnixFromDate(form.date_associated)}
                        classesWrapper="md:w-38 w-full mb-0 p-0"
                        name="date_associated_support_document"
                        disabled
                    />
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-date-expiration-associated`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Fecha de vencimiento del documento soporte:"
                        selected={getUnixFromDate(form.date_associated)}
                        classesWrapper="md:w-38 w-full mb-0 p-0"
                        name="date_associated_support_document"
                        disabled
                    />
                </div>
                <div className="content-form__section-inputs">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-supplier-name`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="content-form__input-style"
                        value={supplier?.name || ''}
                        {...TOOLTIPS_PAGE.SUPPLIER}
                        labelText="*Proveedor:"
                        name="supplier_name"
                        placeholder="Nombre"
                        tooltipInfo
                        disabled
                    />
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-document-type-supplier`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="content-form__input-style"
                        value={person.document_type_name || ''}
                        {...TOOLTIPS_PAGE.TYPE_DOCUMENT}
                        labelText="*Tipo de documento:"
                        name="supplier_document_type"
                        placeholder="CC/CE/NIT/PA"
                        tooltipInfo
                        disabled
                    />
                </div>
                <div className="content-form__section-inputs">
                    <div className="flex gap-x-7 content-form__input-style">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-document-number-supplier`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            classesWrapper={`xs:w-full ${isTypeNit ? 'w-55.5' : 'lg:w-72'}`}
                            value={person.document_number || ''}
                            {...TOOLTIPS_PAGE.DOCUMENT_NUMBER}
                            labelText="*Número de documento:"
                            name="supplier_document_number"
                            placeholder="00000 00000 0000"
                            tooltipInfo
                            disabled
                        />
                        {isTypeNit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-dv-supplier`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="xs:w-full w-12.5"
                                value={digitVerification}
                                labelText="*DV:"
                                placeholder="0"
                                name="dv"
                                disabled
                            />
                        )}
                    </div>
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-taxpayer`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        value={supplier.tax_details_name || ''}
                        name="purchase_employee_document_type"
                        labelText="*Tipo de contribuyente:"
                        classesWrapper="xs:w-full lg:w-72"
                        {...TOOLTIPS_PAGE.TAXPAYER}
                        placeholder="CC/CE/NIT/PA"
                        tooltipInfo
                        disabled
                    />
                </div>
                <div className="content-form__section-inputs">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-invoice-number-supplier`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Número de la cuenta de cobro o documento equivalente por el proveedor:"
                        classesWrapper="content-form__input-style adjustment-note__tooltip-number"
                        {...TOOLTIPS_PAGE.SUPPORT_DOCUMENT}
                        value={form.invoice_number_supplier || ''}
                        name="supplier_name"
                        placeholder="..."
                        tooltipInfo
                        disabled
                    />
                </div>
                <div className="content-form__section-inputs">
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-payment-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelected={(option): void => {
                            onChangeSelectInput(option, 'payment_type_name', 'payment_type_id');
                        }}
                        classesWrapper="content-form__input-style"
                        options={[]}
                        value={form.payment_type_name || ''}
                        labelText="*Forma de pago"
                        {...TOOLTIPS_PAGE.WAY_PAY}
                        placeholder="Seleccionar"
                        name="payment_type_name"
                        tooltipInfo
                        disabled
                    />
                    {form.payment_type_name === CREDIT && (
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-days-collection`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            classesWrapper="content-form__input-style"
                            value={form.days_collection || ''}
                            labelText="*Días de cobro:"
                            name="days_collection"
                            placeholder="111111"
                            disabled
                        />
                    )}
                </div>
                <div className="content-form__section-inputs">
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-payment-methods`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelected={(option): void => {
                            onChangeSelectInput(option, 'payment_method_name', 'payment_method_id');
                        }}
                        options={[]}
                        value={form.payment_method_name || ''}
                        classesWrapper="content-form__input-style"
                        {...TOOLTIPS_PAGE.PAYMENT_METHOD}
                        name="payment_method_name"
                        labelText="*Medio de pago"
                        placeholder="Seleccionar"
                        tooltipInfo
                        disabled
                    />
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `create-foreign-exchange`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        value={form.foreign_exchange_name || ''}
                        classesWrapper="content-form__input-style"
                        {...TOOLTIPS_PAGE.DOCUMENT_NUMBER}
                        name="prefix_adjustment_note"
                        placeholder="Seleccionar"
                        labelText="*Divisa:"
                        tooltipInfo
                        disabled
                    />
                    {!!form.foreign_exchange_rate && (
                        <MoneyInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-foreign-exchange-rate`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            value={form.foreign_exchange_rate || ''}
                            classesWrapper="content-form__input-style"
                            classesInput="text-number-format"
                            labelText="*Tasa de cambio:"
                            placeholder="..."
                            disabled
                        />
                    )}
                </div>
                <CollapseJsx
                    title="Información opcional"
                    wrapperClass="not-margin"
                    data={
                        <div className="content-form__section-inputs">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-number-purchase-order`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="purchase_employee"
                                labelText="Número de orden de compra:"
                                classesWrapper="content-form__input-style"
                                placeholder="111111"
                                value={form.number_purchase_order || ''}
                                disabled
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-manager-purchase-order`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="purchase_employee"
                                labelText="Encargado de la venta:"
                                classesWrapper="content-form__input-style"
                                placeholder="111111"
                                value={form.purchasing_manager || ''}
                                disabled
                            />
                            <SelectInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-document-type-manager`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                name="purchase_employee_document_type"
                                labelText="Tipo de documento encargado de la venta:"
                                classesWrapper="content-form__input-style"
                                placeholder="CC/CE/NIT/PA"
                                options={[]}
                                value={form.document_type_name_purchasing_manager || ''}
                                disabled
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                    submodule: `create-document-number-manager`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                name="document_number_purchasing_manager"
                                labelText="Número de documento del encargado de la venta:"
                                classesWrapper="content-form__input-style"
                                placeholder="00000000"
                                value={form.document_number_purchasing_manager || ''}
                                disabled
                            />
                        </div>
                    }
                />
            </div>
            <TableInvoice
                symbol={symbol}
                data={tableAdjustmentNote}
                deleteProduct={(): void => {
                    if (lengthGreaterThanZero(deleteItemTableProduct)) setShowModalDelete(!showModalDelete);
                }}
                options={buildOptionsTable({
                    products: productsStock,
                    invoiceDetails: supportDetails,
                    noteDetails: tableAdjustmentNote,
                })}
                onChangeTable={handleChangeTable}
                selected={deleteItemTableProduct}
                addProductService={onAddProductTable}
                setSelected={setDeleteItemTableProduct}
                requiredFieldsTable={requiredFieldsTable}
                redirectRoute={getRoute(Routes.HOME)}
                showAddProduct={tableAdjustmentNote?.length !== supportDetails?.length}
            />
            <div className="flex flex-row w-full mb-0 lgm:flex-col">
                <div className="lgm:mb-4.5 mb-0 mr-7 lgm:mr-0">
                    <TableTaxRetention
                        symbol={symbol}
                        dataValuesTableRetention={tableRetentions}
                        onChangeTableRetention={onChangeTableRetention}
                        errorsTableRetention={{
                            reteFuente: !!messageFuente,
                            messageFuente,
                            reteIca: !!messageIca,
                            messageIca,
                            reteIva: !!messageIva,
                            messageIva,
                        }}
                        options={{
                            reteIVA: optionsForm.withholdings.map(({ id, value }) => ({
                                value: id,
                                name: value,
                            })) as IOption[],
                        }}
                        isSupportOrAdjustment
                        isElectronicInvoice
                    />
                    <div className="flex justify-between xs:flex-col mt-7 xs:gap-y-4.5">
                        <TextArea
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-observations`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            classesWrapper="xs:w-full lg:w-72"
                            onChange={(item): void => {
                                onChange(item.target);
                            }}
                            labelText="Observaciones:"
                            value={form.note || ''}
                            classesInput="h-17.1"
                            placeholder="..."
                            name="note"
                            disabled={disabledInputs}
                        />
                        <TextArea
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                                submodule: `create-internal-notes`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Comentario para uso interno:"
                            classesWrapper="xs:w-full lg:w-72"
                            tooltip={TOOLTIPS_PAGE.COMMENTS}
                            onChange={(item): void => {
                                onChange(item.target);
                            }}
                            value={form.internal_notes || ''}
                            classesInput="h-17.1"
                            name="internal_notes"
                            placeholder="..."
                            disabled={disabledInputs}
                        />
                    </div>
                </div>
                <div className="content-taxes-withholdings__table-withholdings">
                    <TableTotals
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_CREDIT_DEBIT_ADJUSTMENT_NOTE,
                            submodule: `totals`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        totalValues={totalValues}
                        dataTotals={tableTotals}
                        onChange={handleTotals}
                        isSupportOrAdjustment
                        symbol={symbol}
                    />
                    {isTotalGreat && (
                        <span className="text-tiny text-purple">
                            *El <span className="font-allerbold">Total</span> de la nota de ajuste no puede ser superior al
                            documento de soporte
                        </span>
                    )}
                </div>
            </div>
        </Form>
    );
};
