import React, { useEffect, useState } from 'react';
import {
    DatePickerDayInput,
    IOptionSelect,
    PLACEHOLDER_DOCUMENT_TYPE,
    SelectInput,
    SelectSearchInput,
    TextInput,
    TimePicker,
} from '@components/input';
import { Table } from '@components/table';
import { Link, LinkColor } from '@components/button';
import { Icon } from '@components/icon';
import { NumberFormatInput, Text, Title, PercentageFormatInput } from '@components/table-input';
import { IGenericRecord } from '@models/GenericRecord';
import { getHourValue, getUnixFromDate } from '@utils/Date';
import './ElectronicDocument.scss';
import {
    headersTable,
    fieldsBody,
    dataFake,
    headerTableTaxes,
    dataTaxes,
    titleTotals,
    initFields,
    initFieldsTable,
    initFieldsTaxTable,
    IElectronicDocumentProps,
    ITotalInvoiceTablesProps,
    data,
    limitsPaginator,
    currentPagePaginator,
} from '.';
import { getTime, INITIAL_HOUR, ITime } from '@utils/TimePicker';
import { Paginator } from '@components/paginator';
import { useCorrection } from '@hooks/useCorrection';

export const ElectronicDocument: React.FC<IElectronicDocumentProps> = ({
    isNew = false,
    isInfoView = false,
    className = '',
    ids = [],
    inputsKeys = false,
    fieldsInputsKeys = {},
    setFieldsInputsKeys = (): void => {},
    setSelectedId = (): void => {},
    handleDelete = (): void => {},
    data_main_table = dataFake,
    data_taxes = dataTaxes,
    fields = initFields,
    fields_main_table = initFieldsTable,
    fields_tax_table = initFieldsTaxTable,
    totalValues = false,
    handleTotals = (): void => {},
    valueTotals = [],
    addProductService = false,
    delete_elements = false,
    reason_rejection = false,
    other_fields = false,
    route = '#',
    textRoute = '',
    routeOnClick = (): void => {},
    closeTimer = (): void => {},
    validateClickTimePicker = false,
    fiscal_responsibilities = [],
    handleAddNewResponsibility = (): void => {},
    showPaginator = false,
    fileLinkView = '',
    editableTotals = false,
    debitCreditNotes = false,
    fieldInputs = {},
    setFieldInputs = (): void => {},
    onChangeProductTable = (): void => {},
}) => {
    const { formatValueTitles } = useCorrection();
    const [timePicker, setTimePicker] = useState<boolean>(false);
    const [storeTime, setStoreTime] = useState<ITime>(INITIAL_HOUR);
    const times = getTime(storeTime, setStoreTime);
    const [clickTimePicker, setClickTimePicker] = useState({ hour: false, minutes: false, schedule: false });

    const [timePicker2, setTimePicker2] = useState<boolean>(false);
    const [storeTime2, setStoreTime2] = useState<ITime>(INITIAL_HOUR);
    const times2 = getTime(storeTime2, setStoreTime2);
    const [clickTimePicker2, setClickTimePicker2] = useState({ hour: false, minutes: false, schedule: false });

    const [dataTotals, setDataTotals] = useState<{ title: string; value: number }[]>([]);
    const [fiscalResponsibilities, setFiscalResponsibilities] = useState<IGenericRecord[]>([]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFieldInputs({
            ...fieldInputs,
            [e.target.name]: e.target.value,
        });
    };
    const handleChangeSelect = (option: IOptionSelect, name: string): void => {
        if (inputsKeys) {
            setFieldsInputsKeys({
                ...fieldsInputsKeys,
                [name]: option.key ? option.key : option,
            });
        }
        setFieldInputs({
            ...fieldInputs,
            [name]: option.value ? option.value : option,
        });
    };
    const handleChangeDate = (date: Date, name: string): void => {
        setFieldInputs({
            ...fieldInputs,
            [name]: getUnixFromDate(date),
        });
    };

    useEffect(() => {
        setDataTotals(formatValueTitles(titleTotals, valueTotals));
        setClickTimePicker({ hour: false, minutes: false, schedule: false });
        document.body.addEventListener('click', closeTimer);
        return (): void => {
            document.body.removeEventListener('click', closeTimer);
        };
    }, [valueTotals]);

    useEffect(() => {
        if (fiscal_responsibilities.length) {
            const newData: IGenericRecord[] = [];
            fiscal_responsibilities.forEach((item: IGenericRecord) => {
                newData.push(item);
            });
            setFiscalResponsibilities(newData);
        } else {
            setFiscalResponsibilities([
                {
                    value: '',
                    options: [],
                    onChange: (): void => {},
                    disabled: false,
                },
            ]);
        }
    }, [fiscal_responsibilities.length]);

    useEffect(() => {
        if (validateClickTimePicker) {
            setClickTimePicker({ hour: false, minutes: false, schedule: false });
            setTimePicker(!timePicker);
            setClickTimePicker2({ hour: false, minutes: false, schedule: false });
            setTimePicker2(!timePicker);
        }
        setFieldInputs({ ...fieldInputs, broadcast_time: storeTime2 });
    }, [clickTimePicker, clickTimePicker2]);

    const classItem = (validation: boolean): string =>
        validation ? 'bg-gray-light border-none items-center' : 'input--container';

    const handleSetTimePicker = (validation: boolean, picker: boolean, second = false): void => {
        if (!validation && second) return setTimePicker2(!picker);
        if (!validation) return setTimePicker(!picker);
    };

    const handleClasses = (): {
        rotation: string;
        rotatitionOtherTimer: string;
        toggleTimer: string;
        toggleTimerOther: string;
    } => {
        const rotation =
            (validateClickTimePicker || timePicker) && !fields.hour_issue_associated_document.disabled
                ? 'rotate-180'
                : 'rotate-0';
        const rotatitionOtherTimer =
            (validateClickTimePicker || timePicker2) && !fields.broadcast_time.disabled ? 'rotate-180' : 'rotate-0';
        const toggleTimer = validateClickTimePicker || !timePicker ? 'hidden' : 'block';
        const toggleTimerOther = validateClickTimePicker || !timePicker2 ? 'hidden' : 'block';
        return {
            rotation,
            rotatitionOtherTimer,
            toggleTimer,
            toggleTimerOther,
        };
    };

    const handleTextFields = (): { labelInvoice: string; labelPurchase: string } => {
        const labelInvoice = !other_fields ? '*Número de factura de venta' : '*Número nota crédito';
        const labelPurchase = isNew ? '*Número de orden de compra' : '*Número de orden de compra asociada';
        return {
            labelInvoice,
            labelPurchase,
        };
    };

    const renderPaginator = (show: boolean): React.ReactElement | null =>
        show ? (
            <Paginator
                data={data}
                dataLimits={data}
                limits={limitsPaginator}
                setLimits={(): void => {}}
                currentPage={currentPagePaginator}
                setCurrentPage={(): void => {}}
                electronicDocument
            />
        ) : null;

    const renderTextRouter = (route: string): React.ReactElement | null =>
        route ? (
            <div className="my-4">
                <span className=" text-gray-dark">
                    {textRoute}, &nbsp;
                    <Link
                        href={route}
                        onClick={routeOnClick}
                        text="haga click aquí."
                        classes="text-base"
                        linkColor={LinkColor.PURPLE}
                    />
                </span>
            </div>
        ) : null;

    return (
        <div className={`flex flex-col justify-between w-full electronic-document ${className}`}>
            {other_fields && (
                <div className="flex flex-row px-0 mb-5 lg:gap-x-3">
                    <TextInput
                        labelText="*Prefijo documento asociado:"
                        placeholder="Input default"
                        value={fieldInputs.associated_document_prefix}
                        onChange={(e): void => handleChange(e)}
                        disabled={fields.associated_document_prefix.disabled}
                        classesWrapper="w-73 xs:w-full"
                        name="associated_document_prefix"
                    />
                    <TextInput
                        labelText="*Número de documento asociado:"
                        placeholder="00000"
                        classesWrapper="ml-6 w-73 xs:w-full"
                        value={fieldInputs.associated_document_number}
                        onChange={(e): void => handleChange(e)}
                        disabled={fields.associated_document_number.disabled}
                        name="associated_document_number"
                    />
                </div>
            )}
            {debitCreditNotes && (
                <div className="flex flex-row px-0 mb-5 lg:gap-x-3">
                    <DatePickerDayInput
                        classesWrapper="w-38 xs:mb-5 mb-0 xs:w-full"
                        labelText="*Fecha de emisión documento asociado:"
                        selected={fields.date_issue_associated_document.value}
                        onChangeDate={fields.date_issue_associated_document.onChange}
                        disabled={fields.date_issue_associated_document.disabled}
                        name="date_issue_associated_document"
                    />
                    <div className="relative flex flex-col mb-0 ml-4 xs:ml-0 xs:mb-5 w-38 xs:w-full">
                        <label htmlFor="hours" className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">
                            *Hora de emisión documento asociado
                        </label>
                        <div
                            id="hours"
                            className={`relative flex justify-center h-full p-1 border cursor-pointer rounded-md border-gray timepicker-handler ${classItem(
                                fields.hour_issue_associated_document.disabled
                            )}`}
                            onClick={(): void => handleSetTimePicker(fields.hour_issue_associated_document.disabled, timePicker)}
                        >
                            <span className="relative mr-2 text-sm text-gray-dark timepicker-handler right-1">
                                {getHourValue(times?.time?.hour ?? 0)}:{getHourValue(times?.time?.minutes ?? 0)}
                                :00 &nbsp;
                                {times?.time?.schedule}
                            </span>
                            <Icon
                                name="arrowDownGray"
                                className={`transition duration-200 transform cursor-pointer timepicker-handler absolute right-0 ${
                                    handleClasses().rotation
                                }`}
                            />
                        </div>
                        {!fields.hour_issue_associated_document.disabled && (
                            <TimePicker
                                className={`transition duration-200 absolute notifications-top -right-6 xs:-right-0 ${
                                    handleClasses().toggleTimer
                                } z-50`}
                                time={times?.time || { hour: 12, minutes: Number('00'), schedule: 'am' }}
                                setTime={times?.setTime || ((): void => {})}
                                setClickTimePicker={setClickTimePicker}
                                clickTimePicker={clickTimePicker}
                            />
                        )}
                    </div>
                </div>
            )}
            {renderPaginator(showPaginator)}
            <div className="flex flex-col px-0 mb-5 ml-2 md:flex-row xs:px-3 md:ml-0">
                <SelectInput
                    labelText="*Prefijo:"
                    placeholder="Input default"
                    required={fields.prefix.required}
                    requiredText={fields.prefix.requiredText}
                    options={fields.prefix.options}
                    value={fieldInputs.prefix}
                    optionSelected={(option): void => handleChangeSelect(option, 'prefix')}
                    disabled={fields.prefix.disabled}
                    classesWrapper="w-73 xs:w-full"
                    name="prefix"
                />
                <TextInput
                    labelText={handleTextFields().labelInvoice}
                    placeholder="00000"
                    classesWrapper="mt-4 md:mt-0 md:ml-4 w-73 xs:w-full"
                    value={fieldInputs.invoice_number}
                    onChange={(e): void => handleChange(e)}
                    disabled={fields.invoice_number.disabled}
                    name="invoice_number"
                />
            </div>
            <div className="px-0 mb-5 ml-2 xs:px-3 md:ml-0">
                <SelectSearchInput
                    labelText="*Divisa"
                    placeholder="Seleccionar"
                    optionSelect={fields.badge.options}
                    valueSelect={fieldInputs.badge}
                    onChangeSelect={(option): void => handleChangeSelect(option, 'badge')}
                    disabled={fields.badge.disabled}
                    classesWrapper="w-73 xs:w-full"
                    name="badge"
                />
            </div>
            <div className="flex flex-row px-0 mb-5 ml-2 xs:flex-wrap xs:px-3 md:ml-0">
                <DatePickerDayInput
                    classesWrapper="w-38 xs:mb-5 mb-0 xs:w-full"
                    labelText="*Fecha de emisión:"
                    selected={fieldInputs.date_issue}
                    onChangeDate={(e): void => handleChangeDate(e, 'date_issue')}
                    disabled={fields.date_issue.disabled}
                    name="date_issue"
                    required={fields.date_issue.required}
                    requiredText={fields.date_issue.requiredText}
                />
                <div className="relative flex flex-col mx-4 mb-0 xs:mx-0 xs:mb-5 w-38 xs:w-full">
                    <label htmlFor="date-emission" className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">
                        *Hora de emisión
                    </label>
                    <div
                        id="date-emission"
                        className={`relative flex justify-center h-full p-1 border cursor-pointer rounded-md border-gray timepicker-handler ${classItem(
                            fields.broadcast_time.disabled
                        )}`}
                        onClick={(): void => handleSetTimePicker(fields.broadcast_time.disabled, timePicker2, true)}
                    >
                        <span className="relative mr-2 text-sm text-gray-dark timepicker-handler right-1">
                            {getHourValue(times2?.time?.hour ?? 0)}:{getHourValue(times2?.time?.minutes ?? 0)}
                            :00 &nbsp;
                            {times2?.time?.schedule}
                        </span>
                        <Icon
                            name="arrowDownGray"
                            className={`transition duration-200 transform cursor-pointer timepicker-handler absolute right-0 ${
                                handleClasses().rotatitionOtherTimer
                            }`}
                        />
                    </div>
                    {!fields.broadcast_time.disabled && (
                        <>
                            <TimePicker
                                className={`transition duration-200 absolute notifications-top -right-6 xs:-right-0 ${
                                    handleClasses().toggleTimerOther
                                } z-50`}
                                time={times2?.time || { hour: 12, minutes: Number('00'), schedule: 'am' }}
                                setTime={times2?.setTime || ((): void => {})}
                                setClickTimePicker={setClickTimePicker2}
                                clickTimePicker={clickTimePicker2}
                            />
                            {fields.broadcast_time.required && (
                                <span className="self-end text-tiny text-purple mr-1.5 text-right">
                                    {fields.broadcast_time.requiredText}
                                </span>
                            )}
                        </>
                    )}
                </div>
                <DatePickerDayInput
                    classesWrapper="w-38 xs:mb-5 mb-0 xs:w-full"
                    labelText="*Fecha de vencimiento"
                    selected={fieldInputs.due_date}
                    onChangeDate={(e): void => handleChangeDate(e, 'due_date')}
                    disabled={fields.due_date.disabled}
                />
                {reason_rejection && (
                    <TextInput
                        labelText="Motivo de rechazo:"
                        classesWrapper="ml-4 w-73 xs:ml-0"
                        classesInput="text-tiny"
                        value={fieldInputs.reason_rejection}
                        onChange={(e): void => handleChange(e)}
                        disabled={fields.reason_rejection.disabled}
                        name="reason_rejection"
                    />
                )}
            </div>
            <div className="flex flex-wrap w-full mb-3 xs:flex-col lg:gap-x-7">
                <div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73"
                            labelText={handleTextFields().labelPurchase}
                            placeholder="000000"
                            value={fieldInputs.purchase_order_number}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.purchase_order_number.disabled}
                            name="purchase_order_number"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectInput
                            labelText="Tipo de documento encargado de venta:"
                            placeholder={PLACEHOLDER_DOCUMENT_TYPE}
                            options={fields.seller_type_document.options}
                            value={fieldInputs.seller_type_document}
                            optionSelected={(option): void => handleChangeSelect(option, 'seller_type_document')}
                            disabled={fields.seller_type_document.disabled}
                            classesWrapper="xs:w-full w-73"
                            name="seller_type_document"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Nombre cliente:"
                            placeholder="Nombre"
                            value={fieldInputs.customer_name}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.customer_name.disabled}
                            name="customer_name"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            labelText="*Número de documento del cliente:"
                            placeholder="00000 00000 0000"
                            value={fieldInputs.customer_document_number}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.customer_document_number.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="customer_document_number"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            labelText="*Dirección:"
                            placeholder="Cra xx #00-00"
                            value={fieldInputs.address}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.address.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="address"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectSearchInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Departamento/Estado:"
                            placeholder="Cundinamarca"
                            optionSelect={fields.department_state.options}
                            valueSelect={fieldInputs.department_state}
                            onChangeSelect={(option): void => handleChangeSelect(option, 'department_state')}
                            disabled={fields.department_state.disabled}
                            name="department_state"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Código postal:"
                            maxLength={6}
                            min={6}
                            placeholder="111111"
                            value={fieldInputs.postal_code}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.postal_code.disabled}
                            name="postal_code"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="Encargado de compra:"
                            placeholder="Nombre"
                            value={fieldInputs.purchase_manager}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.purchase_manager.disabled}
                            name="purchase_manager"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="Número de documento encargado de compra"
                            placeholder="000000"
                            value={fieldInputs.purchase_number_document_number}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.purchase_number_document_number.disabled}
                            name="purchase_number_document_number"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            labelText="*Días de cobro:"
                            placeholder="Seleccionar"
                            value={fieldInputs.collection_days}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.collection_days.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="collection_days"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectInput
                            labelText="*Tipo de contribuyente:"
                            placeholder="Persona jurídica"
                            options={fields.type_tax_payer.options}
                            value={fieldInputs.type_taxpayer}
                            optionSelected={(option): void => handleChangeSelect(option, 'type_taxpayer')}
                            disabled={fields.type_taxpayer.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="type_taxpayer"
                        />
                    </div>
                    <div className="flex flex-col justify-center mb-5 ml-4 md:flex-row sm:justify-start md:ml-0">
                        <SelectInput
                            labelText="*Detalle de impuestos:"
                            placeholder="Seleccionar"
                            options={fields.tax_detail.options}
                            value={fieldInputs.tax_detail}
                            optionSelected={(option): void => handleChangeSelect(option, 'tax_detail')}
                            disabled={fields.tax_detail.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="tax_detail"
                        />
                    </div>
                    <div className="flex justify-center xs:mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="Observaciones:"
                            placeholder="..."
                            value={fieldInputs.observations}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.observations.disabled}
                            name="observations"
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-center mt-4 mb-5 sm:justify-start md:mt-0">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="Encargado de la venta:"
                            placeholder="Input default"
                            onChangeSelect={(e): void => handleChange(e)}
                            value={fieldInputs.sales_manager}
                            disabled={fields.sales_manager.disabled}
                            name="sales_manager"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            labelText="*Número de documento encargado de la venta:"
                            placeholder="00000 00000 0000"
                            value={fieldInputs.customer_document_number}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.seller_document_number.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="seller_document_number"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectInput
                            labelText="*Tipo de documento del cliente:"
                            placeholder={PLACEHOLDER_DOCUMENT_TYPE}
                            options={fields.customer_document_type.options}
                            value={fields.customer_document_type.value}
                            optionSelected={(option): void => handleChangeSelect(option, 'customer_document_type')}
                            disabled={fields.customer_document_type.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="customer_document_type"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Correo electrónico:"
                            placeholder="correo@gmail.com"
                            value={fieldInputs.email}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.email.disabled}
                            name="email"
                            limitCharacters={false}
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectSearchInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*País:"
                            placeholder="Colombia"
                            optionSelect={fields.country.options}
                            valueSelect={fieldInputs.country}
                            onChangeSelect={(option): void => handleChangeSelect(option, 'country')}
                            disabled={fields.country.disabled}
                            name="country"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectSearchInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Ciudad:"
                            placeholder="Bogotá"
                            optionSelect={fields.city.options}
                            valueSelect={fieldInputs.city}
                            onChangeSelect={(option): void => handleChangeSelect(option, 'city')}
                            disabled={fields.city.disabled}
                            name="city"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <TextInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Teléfono:"
                            placeholder="000 000 0000"
                            value={fieldInputs.phone}
                            onChange={(e): void => handleChange(e)}
                            disabled={fields.phone.disabled}
                            name="phone"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="Tipo de documento encargado de compra:"
                            placeholder={PLACEHOLDER_DOCUMENT_TYPE}
                            options={fields.type_document_purchase_manager.options}
                            value={fieldInputs.type_document_purchase_manager}
                            optionSelected={(option): void => handleChangeSelect(option, 'type_document_purchase_manager')}
                            disabled={fields.type_document_purchase_manager.disabled}
                            name="type_document_purchase_manager"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectInput
                            classesWrapper="w-73 xs:w-full"
                            labelText="*Tipo de pago"
                            placeholder="Crédito"
                            options={fields.payment_type.options}
                            value={fieldInputs.payment_type}
                            optionSelected={(option): void => handleChangeSelect(option, 'payment_type')}
                            disabled={fields.payment_type.disabled}
                            name="payment_type"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <SelectInput
                            labelText="*Forma de pago"
                            placeholder="Seleccionar"
                            options={fields.way_pay.options}
                            value={fieldInputs.way_pay}
                            optionSelected={(option): void => handleChangeSelect(option, 'way_pay')}
                            disabled={fields.way_pay.disabled}
                            classesWrapper="w-73 xs:w-full"
                            name="way_pay"
                        />
                    </div>
                    <div className="flex justify-center mb-5 sm:justify-start">
                        <div className="flex flex-col h-auto">
                            {fiscalResponsibilities.map(fiscal_responsibility => (
                                <SelectInput
                                    key={Symbol(fiscal_responsibility.value).toString()}
                                    labelText="*Responsabilidad fiscal:"
                                    placeholder="Seleccionar"
                                    options={fiscal_responsibility.options}
                                    value={fiscal_responsibility.value}
                                    optionSelected={fiscal_responsibility.onChange}
                                    disabled={fiscal_responsibility.disabled}
                                    classesWrapper="mb-5 relative w-73 xs:w-80"
                                    name="fiscal_responsibility"
                                />
                            ))}
                            {!isInfoView && (
                                <Link
                                    href="#"
                                    text="+Agregar responsabilidad fiscal"
                                    classes="text-base mt-2"
                                    onClick={handleAddNewResponsibility}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="my-3 text-gray-dark">
                    Si va a facturar servicios, agregue junto con la descripción de cada uno, el periodo facturado (fecha inicial
                    - fecha final) en la columna de Descripción.
                    {delete_elements && (
                        <span className="ml-1">
                            Si necesita eliminar una fila, selecciónela en las casillas ubicadas al lado derecho de la tabla y
                            utilice el ícono de la caneca.
                        </span>
                    )}
                </p>
            </div>
            <div className="flex flex-col">
                {delete_elements && (
                    <Icon name="trashBlue" hoverIcon="trashGreen" className="self-end mb-2" onClick={handleDelete} />
                )}
                <Table
                    headersTable={headersTable}
                    fieldsBody={fieldsBody(fields_main_table, onChangeProductTable)}
                    data={data_main_table}
                    setSelected={setSelectedId}
                    selected={ids}
                    editable={true}
                    className="mt-2"
                />
            </div>
            {addProductService && (
                <div className="mt-2">
                    <Link href="#" text="+Agregar producto/servicio" classes="text-base" />
                </div>
            )}
            <TotalInvoiceTables
                dataTaxes={data_taxes}
                dataTotals={dataTotals}
                fields_tax_table={fields_tax_table}
                totalValues={totalValues}
                handleTotals={handleTotals}
                editableTotals={editableTotals}
                onChangeProductTable={onChangeProductTable}
            />
            {fileLinkView && (
                <div className="my-4">
                    <span className=" text-gray-dark">
                        Para visualizar el registro de sus archivos importados anteriormente,{' '}
                        <Link href={route} text="haga click aquí." classes="text-base" linkColor={LinkColor.PURPLE} />
                    </span>
                </div>
            )}
            {renderTextRouter(textRoute)}
        </div>
    );
};

export const TotalInvoiceTables: React.FC<ITotalInvoiceTablesProps> = ({
    dataTaxes,
    dataTotals,
    fields_tax_table,
    totalValues,
    editableTotals,
    handleTotals,
    onChangeProductTable,
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, item: IGenericRecord): void => {
        if (onChangeProductTable) onChangeProductTable(e, item);
    };

    return (
        <div className="flex flex-row mt-7 xs:flex-col">
            <div className="w-3/5 mb-0 xs:w-full xs:mb-5">
                <Table className="w-full overflow-x-hidden xs:w-187" customTable data={dataTaxes} headersTable={headerTableTaxes}>
                    <tr>
                        <th colSpan={4} className="field-header--uneditable">
                            <Title text="*Impuestos" disabled={true} color="blue" className="my-1" />
                        </th>
                    </tr>
                    {dataTaxes.map(
                        item =>
                            item?.is_tax && (
                                <tr key={item.id}>
                                    <td className={`field-body--${fields_tax_table.base.disabled ? 'uneditable' : 'editable'}`}>
                                        <Text
                                            text={item.name}
                                            disabled={false}
                                            type="text"
                                            editTable={false}
                                            name={'name'}
                                            onChange={(e): void => handleInputChange(e, item)}
                                        />
                                    </td>
                                    <td className={`field-body--${fields_tax_table.base.disabled ? 'uneditable' : 'editable'}`}>
                                        <NumberFormatInput
                                            value={item.value}
                                            disabled={fields_tax_table.base.disabled}
                                            inputClass="w-full"
                                            handleChange={(e): void => handleInputChange(e, item)}
                                            name={'value'}
                                        />
                                    </td>
                                    <td className={`field-body--${fields_tax_table.rate.disabled ? 'uneditable' : 'editable'}`}>
                                        {typeof item.percentage === 'number' ? (
                                            <PercentageFormatInput
                                                value={item.percentage}
                                                disabled={fields_tax_table.rate.disabled}
                                                inputClass="w-full"
                                                handleChange={(e): void => handleInputChange(e, item)}
                                                name={'rate'}
                                            />
                                        ) : (
                                            <Text
                                                text={item.percentage}
                                                disabled={fields_tax_table.rate.disabled}
                                                type="text"
                                                editTable={!fields_tax_table.rate.disabled}
                                                name={'rate'}
                                                onChange={(e): void => handleInputChange(e, item)}
                                            />
                                        )}
                                    </td>
                                    <td className={`field-body--${fields_tax_table.value.disabled ? 'uneditable' : 'editable'}`}>
                                        <NumberFormatInput
                                            value={item.other_value}
                                            disabled={fields_tax_table.value.disabled}
                                            inputClass="w-full"
                                            handleChange={(e): void => handleInputChange(e, item)}
                                            name={'value'}
                                        />
                                    </td>
                                </tr>
                            )
                    )}
                    <tr>
                        <th colSpan={4} className="field-header--uneditable">
                            <Title text="*Retenciones" disabled={true} color="blue" className="my-1" />
                        </th>
                    </tr>
                    {dataTaxes.map(
                        item =>
                            !item.is_tax && (
                                <tr key={item.id}>
                                    <td className={`field-body--${fields_tax_table.tax.disabled ? 'uneditable' : 'editable'}`}>
                                        <Text
                                            text={item.name}
                                            disabled={fields_tax_table.tax.disabled}
                                            type="text"
                                            editTable={false}
                                            name={'name'}
                                            onChange={(e): void => handleInputChange(e, item)}
                                        />
                                    </td>
                                    <td className={`field-body--${fields_tax_table.base.disabled ? 'uneditable' : 'editable'}`}>
                                        <NumberFormatInput
                                            value={item.value}
                                            disabled={fields_tax_table.base.disabled}
                                            inputClass="w-full"
                                            handleChange={(e): void => handleInputChange(e, item)}
                                            name={'value'}
                                        />
                                    </td>
                                    <td
                                        className={`border-t border-gray-dark field-body--${
                                            editableTotals ? 'uneditable' : 'editable'
                                        }`}
                                    >
                                        <PercentageFormatInput
                                            value={item.percentage}
                                            disabled={fields_tax_table.rate.disabled}
                                            inputClass="w-full"
                                            handleChange={(e): void => handleInputChange(e, item)}
                                            name={'rate'}
                                        />
                                    </td>
                                    <td className={`field-body--${fields_tax_table.value.disabled ? 'uneditable' : 'editable'}`}>
                                        <NumberFormatInput
                                            value={item.other_value}
                                            disabled={fields_tax_table.value.disabled}
                                            inputClass="w-full"
                                            handleChange={(e): void => handleInputChange(e, item)}
                                            name={'value'}
                                        />
                                    </td>
                                </tr>
                            )
                    )}
                </Table>
            </div>
            <div className="w-2/5 ml-7 xs:w-full xs:ml-0">
                <table className="table-custom xs:w-full">
                    {dataTotals.map((item: IGenericRecord) => (
                        <tr key={Symbol(item.id).toString()}>
                            <td className="justify-center field-body--uneditable first:border-t first:border-gray-dark w-52 xs:w-3/6">
                                <Title text={item.title} disabled={true} color="blue" />
                            </td>
                            <td className={`border-t border-gray-dark field-body--${editableTotals ? 'uneditable' : 'editable'}`}>
                                <NumberFormatInput
                                    value={item.value}
                                    disabled={totalValues}
                                    inputClass="w-full"
                                    handleChange={handleTotals}
                                    name={'totalsValue'}
                                />
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
};
