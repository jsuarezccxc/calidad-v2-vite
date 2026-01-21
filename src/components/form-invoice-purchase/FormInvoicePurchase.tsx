import React, { FC, useEffect, useMemo, useState } from 'react';
import dayjs from '@utils/Dayjs';
import { v4 as uuid } from 'uuid';
import { SelectSearchOption } from 'react-select-search';

//--- Root ---//
import './FormInvoicePurchase.scss';
import {
    INPUT_NAME,
    formatTaxDetails,
    getDocumentTypeName,
    buildOptionsSuppliers,
    MAXIMUM_LENGTH,
    IFormInvoicePurchaseProps,
    fieldsNamePurchaseCufe,
} from './';

//--- Components ---//
import { Icon } from '@components/icon';
import { Link } from '@components/button';
import { Form } from '@components/form/Form';
import {
    ChangeEvent,
    DatePickerDayInput,
    IOptionSelect,
    MoneyInput,
    SelectInput,
    SelectSearchInput,
    TextInput,
} from '@components/input';

//--- Utils ---//
import { validateEmail } from '@utils/Validation';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { getCurrency, getForeignExchange } from '@utils/ForeignExchange';
import { differenceDate, getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { lengthEqualFive, lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';

//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';

//--- Constants ---//
import { DEBIT, CREDIT } from '@components/purchase-note';
import { COLOMBIA_ID } from '@constants/Location';
import { LEGAL_PERSON } from '@constants/DynamicRequest';
import { VALUE_ZERO } from '@constants/ElectronicInvoice';

//--- Hooks ---//
import useDigitVerification from '@hooks/useDigitVerification';
import { Checkbox } from '@components/checkbox';
import { InputSelectTime } from './components/input-select-time';
import usePermissions from '@hooks/usePermissions';

export const FormInvoicePurchase: FC<IFormInvoicePurchaseProps> = ({
    isNote,
    isEdit,
    typeNote,
    documents = [],
    suppliers = [],
    invoiceValue,
    optionsPrefix,
    modalSupplier,
    requiredFields,
    taxpayerSelected,
    getDynamicRequest,
    validateFiscalRepeated,
    requiredTextFiscalRepeated,
    fiscalResponsibilitiesOptions,
    validateFiscalResponsibilities,
    setInvoiceValue,
    setRequiredFields,
    handleModalSupplier,
    setTaxpayerSelected,
    setValidateSupplier,
    validateRepeatFiscal,
    information,
    fieldsDisabled,
    validateForm,
    errorsFromBack = {},
}) => {
    useEffect(() => {
        handleInitMulti();
    }, [invoiceValue]);
    const [timePicker1, setTimePicker1] = useState<boolean>(false);
    const [timePicker2, setTimePicker2] = useState<boolean>(false);
    const hasPaymentType = invoiceValue.payment_type_name === INPUT_NAME.COUNTED || !invoiceValue.payment_type_name;
    const [currencyOptions, setCurrencyOptions] = useState<SelectSearchOption[]>([]);
    const [isPrimeCurrency, setIsPrimeCurrency] = useState<boolean>(true);

    const { disabledInputs: disabledInputsByRol } = usePermissions();

    useEffect(() => {
        setCurrencyOptions(
            buildOptionsSearch(
                getForeignExchange(
                    information?.companies_foreign_exchange || [],
                    getDynamicRequest?.foreign_exchange,
                    information?.foreign_exchange_id ?? ''
                )
            )
        );
        setInvoiceValue({ ...invoiceValue, foreign_exchange_id: information?.foreign_exchange_id ?? '' });
    }, [information, getDynamicRequest]);

    useEffect(() => {
        setIsPrimeCurrency(information?.foreign_exchange_id === invoiceValue?.foreign_exchange_id);
    }, [information, invoiceValue]);

    const isCredit = invoiceValue.payment_type_name === CREDIT;

    const listDocumentType = [{ code: '', name: 'Seleccione tipo de documento', id: '' }, ...documents];

    const departments = useMemo(() => {
        if (invoiceValue.supplier.country_id && lengthGreaterThanZero(getDynamicRequest?.departments)) {
            return getDynamicRequest?.departments?.filter(
                (department: IGenericRecord) => Number(department?.country_id) === Number(invoiceValue.supplier.country_id)
            );
        }
        return getDynamicRequest?.departments;
    }, [invoiceValue.supplier.country_id]);

    const cities = useMemo(() => {
        if (
            invoiceValue.supplier.department_id &&
            lengthGreaterThanZero(getDynamicRequest?.cities) &&
            !invoiceValue.supplier.city_id
        ) {
            return getDynamicRequest?.cities?.filter(
                (city: IGenericRecord) => Number(city?.department_id) === Number(invoiceValue.supplier.department_id)
            );
        }
        return getDynamicRequest?.cities;
    }, [invoiceValue.supplier.department_id]);

    const handleChange = ({ target: { name, value } }: ChangeEvent): void => {
        let valueWithoutSpaces = '';
        const validateCufeName = name === fieldsNamePurchaseCufe;
        if (validateCufeName) {
            valueWithoutSpaces = value.replaceAll(' ', '');
            if (valueWithoutSpaces.length === MAXIMUM_LENGTH.CUFE + 1) return;
        }
        setInvoiceValue({ ...invoiceValue, [name]: validateCufeName ? valueWithoutSpaces : value });
        setRequiredFields({ ...requiredFields, [name]: !value });
    };

    const updateDateLimit = ({ target: { name, value } }: ChangeEvent): void => {
        if (isCredit) {
            const days = parseInt(value) < 1 ? 0 : parseInt(value);
            const baseDateStr = getDateFromUnix(invoiceValue.date, 'YYYY-MM-DD').dateFormat;
            const newUnix = getUnixFromDate(dayjs(baseDateStr, 'YYYY-MM-DD').add(days, 'day').toDate());
            setInvoiceValue({ ...invoiceValue, [name]: value, date_limit: newUnix });
            setRequiredFields({ ...requiredFields, [name]: !value, date_limit: !value });
        } else {
            setInvoiceValue({ ...invoiceValue, [name]: value });
            setRequiredFields({ ...requiredFields, [name]: !value });
        }
    };

    const updateDaysPayment = (date: Date, name: string): void => {
        if (isCredit) {
            const start = dayjs(getDateFromUnix(invoiceValue.date, 'YYYY-MM-DD').dateFormat, 'YYYY-MM-DD');
            const end = dayjs(date).startOf('day');

            setInvoiceValue({ ...invoiceValue, [name]: getUnixFromDate(date), days_payment: String(end.diff(start, 'day')) });
            setRequiredFields({ ...requiredFields, [name]: !date, days_payment: false });
        } else {
            onSelectDate(date, name);
        }
    };

    useEffect(() => {
        if (isCredit) {
            const days = differenceDate(invoiceValue.date, invoiceValue.date_limit);

            setInvoiceValue({ ...invoiceValue, days_payment: days });
            setRequiredFields({ ...requiredFields, days_payment: false });
        }
    }, [invoiceValue.payment_type_name]);

    const handleChangeSupplier = ({ target: { name, value } }: ChangeEvent): void => {
        setInvoiceValue({ ...invoiceValue, supplier: { ...invoiceValue.supplier, [name]: value } });
        name === INPUT_NAME.EMAIL_PROVIDER && !validateEmail(value)
            ? setRequiredFields({ ...requiredFields, email: true })
            : setRequiredFields({ ...requiredFields, [name]: !value });
    };

    const handleChangeExchangeRate = (name: string, value: string): void => {
        setInvoiceValue({
            ...invoiceValue,
            [name]: value,
        });
        setRequiredFields({ ...requiredFields, [name]: !value });
    };

    const onSelectValue = ({ value, name = '' }: { value: string; name?: string }, type: string): void => {
        setInvoiceValue({ ...invoiceValue, [type]: value });
        setRequiredFields({ ...requiredFields, [type]: !value });
        if (type === INPUT_NAME.PREFIX) {
            setInvoiceValue({ ...invoiceValue, prefix_id: value, prefix: name });
            setRequiredFields({ ...requiredFields, prefix: false, prefix_id: false });
        }
        if (type === INPUT_NAME.FOREIGN_EXCHANGE_ID) {
            setInvoiceValue({ ...invoiceValue, foreign_exchange_id: value, foreign_exchange_name: name });
            setRequiredFields({ ...requiredFields, foreign_exchange_id: false });
        }
        if (type === INPUT_NAME.PAYMENT_TYPE_ID && name === INPUT_NAME.COUNTED) {
            setInvoiceValue({ ...invoiceValue, payment_type_id: value, payment_type_name: name, days_payment: '0' });
            setRequiredFields({ ...requiredFields, payment_type_id: false, days_payment: false });
        }
        if (type === INPUT_NAME.PAYMENT_TYPE_ID && name !== INPUT_NAME.COUNTED) {
            setInvoiceValue({ ...invoiceValue, payment_type_id: value, payment_type_name: name });
            setRequiredFields({ ...requiredFields, payment_type_id: false, days_payment: false });
        }
    };

    const onSelectValueSupplier = ({ value, key }: { value: string; key: string }, type: string): void => {
        setInvoiceValue({ ...invoiceValue, supplier: { ...invoiceValue.supplier, [type]: value } });
        setRequiredFields({ ...requiredFields, [type]: !value });
        if (type === INPUT_NAME.NAME_SUPPLIER) {
            const data = suppliers.find((item: IGenericRecord) => item.person_id === key);
            if (data) {
                const hasDocumentType = data.person.document_type;

                setInvoiceValue({
                    ...invoiceValue,
                    supplier: {
                        ...data.person,
                        id: data.id,
                        name: data.name,
                        person_id: data.person.id,
                        document_name: hasDocumentType ? data.document_name : '',
                        tax_details_code: data.tax_details_code,
                        tax_details_name: data.tax_details_name,
                    },
                });

                setValidateSupplier({
                    ...data.person,
                    id: data.id,
                    name: data.name,
                    person_id: data.person.id,
                    tax_details_code: data.tax_details_code,
                    tax_details_name: data.tax_details_name,
                });
                setRequiredFields({
                    ...requiredFields,
                    ...Object.keys(data.person).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                    name: !data.name,
                });
            }
        }

        if (type === INPUT_NAME.DOCUMENT_NAME) {
            setTaxpayerSelected(value);
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    document_name: key,
                    document_type: value,
                },
            });
            setRequiredFields({ ...requiredFields, [type]: !value });
        }
        if (type === INPUT_NAME.TYPE_TAXPAYER) {
            setTaxpayerSelected(value);
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    [type]: value,
                    fiscal_responsibilities: [{ id_fiscal: uuid(), id: '', name: '' }],
                },
            });
            setRequiredFields({ ...requiredFields, [type]: !value });
        }
        if (type === INPUT_NAME.DEPARTMENT_ID) {
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    [type]: value,
                    city_id: 0,
                    city_name: '',
                },
            });
        }
        if (type === INPUT_NAME.CITY_ID) {
            const cityName = value.endsWith(' ') ? value.slice(0, -1) : value;
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    city_id: parseInt(key),
                    city_name: cityName,
                },
            });
        }
    };

    const onSelectDate = (date: Date, name: string): void => {
        setInvoiceValue({ ...invoiceValue, [name]: getUnixFromDate(date) });
        setRequiredFields({ ...requiredFields, [name]: !date });
    };

    const selectFiscalResponsibility = (selectedValue: IOptionSelect, indexValue: number): void => {
        const { value, id }: IGenericRecord = selectedValue;
        const { fiscal_responsibilities } = invoiceValue.supplier;

        validateRepeatFiscal();
        setInvoiceValue({
            ...invoiceValue,
            supplier: {
                ...invoiceValue.supplier,
                fiscal_responsibilities: fiscal_responsibilities.map((item: IGenericRecord, index: number) => {
                    if (indexValue === index) {
                        return { ...item, id: id, name: value };
                    } else {
                        return item;
                    }
                }),
            },
        });
    };

    const AddFiscalResponsibility = (): void => {
        validateRepeatFiscal();
        if (lengthGreaterThanZero(invoiceValue.supplier.fiscal_responsibilities)) {
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    fiscal_responsibilities: [
                        ...invoiceValue.supplier.fiscal_responsibilities,
                        { id_fiscal: uuid(), id: '', name: '' },
                    ],
                },
            });
        } else {
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    fiscal_responsibilities: [{ id_fiscal: uuid(), id: '', name: '' }],
                },
            });
        }
    };

    const handleDeleteFiscalResponsibility = (id: string): void => {
        const newFilter = invoiceValue.supplier.fiscal_responsibilities.filter((item: IGenericRecord) => {
            if (item.id_fiscal !== undefined) {
                if (item.id_fiscal !== id) return item;
            }
            if (item.id !== id) return item;
        });

        if (invoiceValue.supplier && newFilter) {
            setInvoiceValue({
                ...invoiceValue,
                supplier: {
                    ...invoiceValue.supplier,
                    fiscal_responsibilities: newFilter,
                },
            });
        }
    };

    const disableInputs = (input: string): boolean => {
        if (fieldsDisabled.includes(input)) return true;
        return false;
    };

    const { multiDigitVerification, handleInitMulti } = useDigitVerification('', '', {
        supplier: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: invoiceValue?.supplier?.document_name ?? '',
            numberDocument: invoiceValue?.supplier?.document_number ?? '',
        },
    });

    const validateMessage = (keysField: string): boolean => Object.keys(errorsFromBack).includes(keysField);
    const handleValidateFiscalRepeated = (index: number): string =>
        validateFiscalRepeated ? requiredTextFiscalRepeated[index] : '';

    const labelTextFields = (): { numberPruchaseOrderLabel: string; emailLabel: string } => {
        const numberPruchaseOrderLabel = isNote ? '*Número de orden de compra asociada:' : 'Número de orden:';
        const emailLabel =
            invoiceValue.supplier.email && !validateEmail(invoiceValue.supplier.email)
                ? 'Email no es valido'
                : '*Campo obligatorio';
        return {
            numberPruchaseOrderLabel,
            emailLabel,
        };
    };

    const validationsScreen = (): {
        countryValidation: boolean;
        taxResponsabilityValidation: boolean;
    } => {
        const countryValidation = invoiceValue.supplier.country_id === COLOMBIA_ID && !isNote;
        const taxResponsabilityValidation =
            taxpayerSelected === LEGAL_PERSON || (invoiceValue.supplier.type_taxpayer_name === LEGAL_PERSON && !isNote);
        return {
            countryValidation,
            taxResponsabilityValidation,
        };
    };

    const renderFieldsNote = (isNote: boolean): React.ReactElement =>
        isNote ? (
            <>
                {typeNote === CREDIT && !isEdit && (
                    <Checkbox
                        checked={invoiceValue?.is_annulled || false}
                        name="is_annulled"
                        label="Anulación"
                        classContainer="w-full lg:w-151.50 mt-4.5"
                        classLabel=" rounded-lg ml-2.5 bg-gray-100 py-2.25 px-5.5 text-blue font-aller"
                        onChange={(): void => {
                            if (!validateForm()) {
                                setInvoiceValue({ ...invoiceValue, is_annulled: !invoiceValue.is_annulled });
                            }
                        }}
                        disabled={disableInputs('is_annulled') || disabledInputsByRol}
                    />
                )}
                <TextInput
                    name="cude"
                    alphanumeric
                    labelText="CUDE:"
                    value={invoiceValue.cude}
                    maxLength={MAXIMUM_LENGTH.CUDE}
                    placeholder="00000000000000000000000"
                    classesWrapper="w-full lg:w-151.50 mt-5 mb-5"
                    onChange={(e): void => handleChange(e)}
                    disabled={disableInputs('cude') || disabledInputsByRol}
                />
                <div className="input-container">
                    <TextInput
                        name="number"
                        placeholder="..."
                        value={invoiceValue?.associated_invoice_number}
                        classesWrapper="input mt-4.5 lg:mt-0"
                        labelText="Número factura de compra asociada:"
                        onChange={(e): void => handleChange(e)}
                        disabled={disableInputs('associated_invoice_number') || disabledInputsByRol}
                    />
                </div>
                <div className="input-container">
                    <DatePickerDayInput
                        name="associated_issuance_date"
                        maxDate={new Date()}
                        selected={invoiceValue.associated_issuance_date}
                        labelText="Fecha de emisión documento asociado:"
                        classesWrapper="w-full mb-5 lg:w-38"
                        onChangeDate={(e): void => onSelectDate(e, 'date')}
                        disabled={disableInputs('associated_issuance_date') || disabledInputsByRol}
                    />

                    <InputSelectTime
                        label="Hora de emisión documento asociado:"
                        disabled={disableInputs('associated_issuance_time') || disabledInputsByRol}
                        value={invoiceValue?.hour_associated_issuance_time}
                        timeValue={invoiceValue}
                        setTimeValue={setInvoiceValue}
                        timePicker={timePicker1}
                        setTimePicker={setTimePicker1}
                    />
                </div>
                <div className="input-container">
                    <TextInput
                        name="prefix_note"
                        placeholder="Input default"
                        value={invoiceValue.prefix_note}
                        required={requiredFields.prefix_note}
                        classesWrapper="input mt-4.5 lg:mt-0"
                        labelText="*Prefijo:"
                        onChange={(e): void => handleChange(e)}
                        disabled={disableInputs('prefix_note') || disabledInputsByRol}
                        alphanumeric
                    />
                    <TextInput
                        name="number"
                        integerNumbers
                        placeholder="00000"
                        value={invoiceValue.number}
                        required={requiredFields.number}
                        classesWrapper="input mt-4.5 lg:mt-0"
                        labelText={`*Número nota ${typeNote === DEBIT ? 'débito' : 'crédito'}:`}
                        onChange={(e): void => handleChange(e)}
                        disabled={disableInputs('number') || disabledInputsByRol}
                    />
                </div>
                <div className="input-container">
                    <SelectInput
                        placeholder="Seleccionar"
                        name="foreign_exchange_id"
                        classesWrapper="input mb-5"
                        value={invoiceValue.foreign_exchange_name}
                        required={requiredFields.foreign_exchange_id}
                        options={buildOptions(getDynamicRequest?.foreign_exchange)}
                        labelText="*Divisa:"
                        onChangeSelect={(e, selectedOption): void => onSelectValue(selectedOption, 'foreign_exchange_id')}
                        disabled={disableInputs('foreign_exchange_id') || disabledInputsByRol}
                    />
                    <SelectInput
                        name="prefix"
                        placeholder="Seleccionar"
                        classesWrapper="input lg:mt-0"
                        required={requiredFields.prefix_id}
                        options={buildOptions(optionsPrefix)}
                        labelText="*Prefijo para contabilidad:"
                        value={getDocumentTypeName(optionsPrefix, invoiceValue.prefix_id)}
                        optionSelected={({ id, value }): void => onSelectValue({ value: id ?? '', name: value }, 'prefix')}
                        disabled={disableInputs('prefix_co') || disabledInputsByRol}
                    />
                </div>
            </>
        ) : (
            <>
                <TextInput
                    name={fieldsNamePurchaseCufe}
                    alphanumeric
                    labelText="CUFE:"
                    value={invoiceValue.cufe}
                    placeholder="00000000000000000000000"
                    classesWrapper="w-full lg:w-151.50 mt-4.5 mb-5"
                    required={validateMessage('document_uuid')}
                    requiredText={errorsFromBack?.document_uuid}
                    onChange={(e): void => handleChange(e)}
                    disabled={disabledInputsByRol}
                />
                <div className="input-container">
                    <TextInput
                        placeholder="..."
                        name="supplier_invoice_number"
                        classesWrapper="input mb-4.5 lg:mb-0"
                        value={invoiceValue.supplier_invoice_number}
                        labelText="*Número de factura del proveedor:"
                        required={requiredFields.supplier_invoice_number || validateMessage('supplier_invoice_number')}
                        requiredText={errorsFromBack?.supplier_invoice_number}
                        onChange={(e): void => handleChange(e)}
                        disabled={disabledInputsByRol}
                    />

                    <SelectInput
                        name="prefix"
                        placeholder="Seleccionar"
                        classesWrapper="input mt-0"
                        value={invoiceValue.prefix}
                        required={requiredFields.prefix}
                        options={buildOptions(optionsPrefix)}
                        labelText="*Prefijo para contabilidad:"
                        disabled={disabledInputsByRol}
                        optionSelected={({ id, value }): void => onSelectValue({ value: id ?? '', name: value }, 'prefix')}
                    />
                </div>
                <div className="input-container">
                    <SelectSearchInput
                        labelText="*Divisa:"
                        placeholder="Seleccionar"
                        name="foreign_exchange_id"
                        classesWrapper="input mb-5"
                        value={invoiceValue.foreign_exchange_id}
                        required={requiredFields.foreign_exchange_id}
                        valueSelect={invoiceValue.foreign_exchange_id}
                        {...(invoiceValue.foreign_exchange_id && {
                            placeholder: getCurrency(invoiceValue.foreign_exchange_id, currencyOptions),
                            classesWrapperInput: 'currency-input',
                        })}
                        disabled={disabledInputsByRol}
                        optionSelect={currencyOptions}
                        onChangeSelect={(e, selectedOption): void => onSelectValue(selectedOption, 'foreign_exchange_id')}
                    />
                    {!isPrimeCurrency && (
                        <MoneyInput
                            classesInput="text-number-format"
                            labelText="*Tasa de cambio:"
                            placeholder="..."
                            classesWrapper="md:mt-0 w-73 xs:w-full xs:mt-4.5"
                            value={invoiceValue.foreign_exchange_rate ?? ''}
                            name="foreign_exchange_rate"
                            required={requiredFields.foreign_exchange_rate}
                            disabled={disabledInputsByRol}
                            onChange={(e: IGenericRecord): void =>
                                handleChangeExchangeRate('foreign_exchange_rate', e.floatValue)
                            }
                        />
                    )}
                </div>
            </>
        );

    const renderDocumentNote = (isNote: boolean): React.ReactElement =>
        isNote ? (
            <div className="flex flex-row items-center">
                <TextInput
                    integerNumbers
                    placeholder="..."
                    classesWrapper={`input ${multiDigitVerification.supplier.isTypeNit ? 'input__nit-input' : ''}`}
                    name="document_number"
                    required={requiredFields.document_number}
                    maxLength={MAXIMUM_LENGTH.DOCUMENT_NUMBER}
                    value={invoiceValue.supplier.document_number}
                    labelText="*Número de documento del proveedor:"
                    onChange={(e): void => handleChangeSupplier(e)}
                    disabled={disableInputs('supplier_document_number') || disabledInputsByRol}
                />
                {multiDigitVerification.supplier.isTypeNit && (
                    <TextInput
                        classesWrapper="ml-4.5 w-11.2 input input__DV-input"
                        labelText="*DV:"
                        disabled
                        value={multiDigitVerification.supplier.digitVerification}
                    />
                )}
            </div>
        ) : (
            <TextInput
                integerNumbers
                placeholder="..."
                classesWrapper="input"
                name="document_number"
                required={requiredFields.document_number}
                maxLength={MAXIMUM_LENGTH.DOCUMENT_NUMBER}
                value={invoiceValue.supplier.document_number}
                labelText="*Número de documento del proveedor:"
                onChange={(e): void => handleChangeSupplier(e)}
                disabled={disableInputs('supplier_document_number') || disabledInputsByRol}
            />
        );

    const renderCountry = (isNote: boolean): React.ReactElement =>
        !isNote ? (
            <SelectSearchInput
                name="country_id"
                labelText="*País:"
                placeholder="Seleccionar"
                classesWrapper="input mt-4 lg:mt-0"
                required={requiredFields.country_id}
                valueSelect={!isNote ? invoiceValue.supplier.country_id : invoiceValue.supplier.country_name}
                optionSelect={buildOptionsSearch(getDynamicRequest?.countries)}
                onChangeSelect={(e, values): void => onSelectValueSupplier(values, 'country_id')}
                disabled={disableInputs('supplier_country_id') || disabledInputsByRol}
            />
        ) : (
            <TextInput
                lettersWithAccent
                name="country_name"
                placeholder="Seleccionar"
                classesWrapper="input lg:mt-0"
                labelText="*País:"
                required={requiredFields.country_name}
                value={invoiceValue.supplier.country_name}
                onChange={(e): void => handleChangeSupplier(e)}
                disabled={disableInputs('supplier_country_name') || disabledInputsByRol}
            />
        );

    return (
        <>
            {renderFieldsNote(isNote)}
            <div className="flex flex-col lg:flex-row">
                <DatePickerDayInput
                    name="date"
                    maxDate={new Date()}
                    selected={invoiceValue.date}
                    labelText="*Fecha de emisión:"
                    classesWrapper="w-full mb-5 lg:w-38"
                    onChangeDate={(e): void => onSelectDate(e, 'date')}
                    disabled={disableInputs('date') || disabledInputsByRol}
                />

                <InputSelectTime
                    disabled={disableInputs('date') || disabledInputsByRol}
                    timeValue={invoiceValue}
                    setTimeValue={setInvoiceValue}
                    timePicker={timePicker2}
                    setTimePicker={setTimePicker2}
                />

                <DatePickerDayInput
                    name="date_limit"
                    showPlaceHolderDate
                    labelText={'*Fecha de vencimiento:'}
                    selected={invoiceValue.date_limit}
                    required={requiredFields.date_limit}
                    classesWrapper="w-full mb-5 lg:w-38 lg:ml-6"
                    onChangeDate={(e): void => updateDaysPayment(e, 'date_limit')}
                    disabled={disableInputs('date_limit') || disabledInputsByRol}
                />
            </div>
            <div className="input-container">
                <TextInput
                    alphanumeric
                    placeholder="..."
                    classesWrapper="input"
                    name="number_purchase_order"
                    required={requiredFields.number_purchase_order}
                    labelText={labelTextFields().numberPruchaseOrderLabel}
                    value={invoiceValue.number_purchase_order}
                    maxLength={MAXIMUM_LENGTH.NUMBER_PURCHASE}
                    onChange={(e): void => handleChange(e)}
                    disabled={disableInputs('number_purchase_order') || disabledInputsByRol}
                />

                <TextInput
                    alphanumeric
                    placeholder="..."
                    name="sales_manager"
                    value={invoiceValue.sales_manager}
                    labelText="Encargado de la venta:"
                    classesWrapper="input mt-4.5 lg:mt-0"
                    maxLength={MAXIMUM_LENGTH.SALES_MANAGER}
                    onChange={(e): void => handleChange(e)}
                    disabled={disableInputs('sales_manager') || disabledInputsByRol}
                />
            </div>
            <div className="input-container">
                <SelectInput
                    placeholder="Seleccionar"
                    classesWrapper="input lg:mt-0"
                    name="document_type_sales_manager"
                    options={buildOptions(listDocumentType)}
                    labelText="Tipo de documento encargado de la venta:"
                    value={getDocumentTypeName(getDynamicRequest?.document_types, invoiceValue.document_type_sales_manager)}
                    optionSelected={({ id, value }): void =>
                        onSelectValue({ value: id ?? '', name: value }, 'document_type_sales_manager')
                    }
                    disabled={disableInputs('document_type_sales_manager') || disabledInputsByRol}
                />

                <TextInput
                    integerNumbers
                    placeholder="..."
                    name="document_number_sales_manager"
                    classesWrapper="input mt-4.5 lg:mt-0"
                    maxLength={MAXIMUM_LENGTH.DOCUMENT_MANAGER}
                    value={invoiceValue.document_number_sales_manager}
                    labelText="Número de documento encargado de la venta:"
                    onChange={(e): void => handleChange(e)}
                    disabled={disableInputs('document_number_sales_manager') || disabledInputsByRol}
                />
            </div>
            <div className="input-container-mb">
                <SelectInput
                    name="name"
                    classesWrapper="input"
                    placeholder="Seleccionar"
                    required={requiredFields.name}
                    value={invoiceValue.supplier.name}
                    labelText="*Nombre del proveedor:"
                    options={buildOptionsSuppliers(suppliers)}
                    optionSelected={(values): void => onSelectValueSupplier(values, 'name')}
                    disabled={disableInputs('supplier_name') || disabledInputsByRol}
                />
                <SelectInput
                    name="document_name"
                    placeholder="Seleccionar"
                    options={buildOptions(documents)}
                    classesWrapper="input mt-4.5 lg:mt-0"
                    required={requiredFields.document_name}
                    value={invoiceValue.supplier.document_name}
                    labelText="*Tipo de documento del proveedor:"
                    disabled={disableInputs('supplier_document_name') || disabledInputsByRol}
                    optionSelected={({ id, value }): void =>
                        onSelectValueSupplier({ value: id ?? '', key: value }, 'document_name')
                    }
                />
            </div>
            {!isNote && (
                <Link
                    href="#"
                    text="+ Agregar proveedor"
                    classes="text-base mt-2"
                    onClick={(): void => handleModalSupplier(!modalSupplier)}
                    disabled={disabledInputsByRol}
                />
            )}

            <div className="mt-5 input-container">
                {renderDocumentNote(isNote)}
                <TextInput
                    name="email"
                    placeholder="..."
                    required={requiredFields.email}
                    labelText="*Correo electrónico:"
                    classesWrapper="input mt-4 lg:mt-0"
                    value={invoiceValue.supplier.email}
                    requiredText={labelTextFields().emailLabel}
                    onChange={(e): void => handleChangeSupplier(e)}
                    disabled={disableInputs('supplier_email') || disabledInputsByRol}
                    limitCharacters={false}
                />
            </div>
            <div className="input-container">
                <TextInput
                    alphanumeric
                    name="address"
                    placeholder="..."
                    classesWrapper="input"
                    labelText="*Dirección:"
                    required={requiredFields.address}
                    maxLength={MAXIMUM_LENGTH.ADDRESS}
                    value={invoiceValue.supplier.address}
                    onChange={(e): void => handleChangeSupplier(e)}
                    disabled={disableInputs('supplier_address') || disabledInputsByRol}
                />
                {renderCountry(isNote)}
            </div>
            <div className="input-container">
                {validationsScreen().countryValidation ? (
                    <>
                        <SelectSearchInput
                            name="department_id"
                            placeholder="Seleccionar"
                            classesWrapper="input lg:mt-0"
                            labelText="*Departamento/Estado:"
                            required={requiredFields.department_id}
                            optionSelect={buildOptionsSearch(departments)}
                            valueSelect={invoiceValue.supplier.department_id}
                            onChangeSelect={(e, values): void => onSelectValueSupplier(values, 'department_id')}
                            disabled={disableInputs('supplier_department_id') || disabledInputsByRol}
                        />
                        <SelectSearchInput
                            name="city_id"
                            labelText="*Ciudad:"
                            placeholder="Seleccionar"
                            required={requiredFields.city_id}
                            classesWrapper="input mt-4.5 lg:mt-0"
                            optionSelect={buildOptionsSearch(cities)}
                            valueSelect={invoiceValue.supplier.city_id}
                            onChangeSelect={(e, { value, name }): void =>
                                onSelectValueSupplier({ value: name, key: value }, 'city_id')
                            }
                            disabled={disableInputs('supplier_city_id') || disabledInputsByRol}
                        />
                    </>
                ) : (
                    <>
                        <TextInput
                            lettersWithAccent
                            name="department_name"
                            placeholder="Seleccionar"
                            classesWrapper="input lg:mt-0"
                            labelText="*Departamento/Estado:"
                            required={requiredFields.department_name}
                            value={invoiceValue.supplier.department_name}
                            onChange={(e): void => handleChangeSupplier(e)}
                            disabled={disableInputs('supplier_department_name') || disabledInputsByRol}
                        />
                        <TextInput
                            name="city_name"
                            lettersWithAccent
                            labelText="*Ciudad:"
                            placeholder="Seleccionar"
                            required={requiredFields.city_name}
                            classesWrapper="input mt-4.5 lg:mt-0"
                            value={invoiceValue.supplier.city_name}
                            onChange={(e): void => handleChangeSupplier(e)}
                            disabled={disableInputs('supplier_city_name') || disabledInputsByRol}
                        />
                    </>
                )}
            </div>
            <div className="input-container">
                <TextInput
                    integerNumbers
                    placeholder="..."
                    name="postal_code"
                    classesWrapper="input"
                    labelText="*Código postal:"
                    required={requiredFields.postal_code}
                    maxLength={MAXIMUM_LENGTH.POSTAL_CODE}
                    value={invoiceValue.supplier.postal_code}
                    onChange={(e): void => handleChangeSupplier(e)}
                    disabled={disableInputs('supplier_postal_code') || disabledInputsByRol}
                />

                <TextInput
                    name="phone"
                    integerNumbers
                    placeholder="..."
                    labelText="*Teléfono:"
                    required={requiredFields.phone}
                    maxLength={MAXIMUM_LENGTH.PHONE}
                    value={invoiceValue.supplier.phone}
                    classesWrapper="input mt-4.5 lg:mt-0"
                    onChange={(e): void => handleChangeSupplier(e)}
                    disabled={disableInputs('supplier_phone') || disabledInputsByRol}
                />
            </div>

            {isNote ? (
                <div className="input-container">
                    <TextInput
                        alphanumeric
                        placeholder="..."
                        classesWrapper="input"
                        name="purchasing_manager"
                        labelText="Encargado de compra:"
                        value={invoiceValue.purchasing_manager}
                        maxLength={MAXIMUM_LENGTH.PURCHASING_MANAGER}
                        onChange={(e): void => handleChange(e)}
                        disabled={disableInputs('purchasing_manager') || disabledInputsByRol}
                    />

                    <SelectInput
                        name="payment_type_id"
                        placeholder="Seleccionar"
                        labelText="*Tipo de pago:"
                        classesWrapper="input mt-4.5 lg:mt-0"
                        required={requiredFields.payment_type_id}
                        options={buildOptions(getDynamicRequest?.payment_types)}
                        value={getDocumentTypeName(getDynamicRequest?.payment_types, invoiceValue.payment_type_id)}
                        optionSelected={({ id, value }): void =>
                            onSelectValue({ value: id ?? '', name: value }, 'payment_type_id')
                        }
                        disabled={disableInputs('payment_type_id') || disabledInputsByRol}
                    />
                </div>
            ) : (
                <>
                    <div className="input-container">
                        <TextInput
                            alphanumeric
                            placeholder="..."
                            classesWrapper="input"
                            name="purchasing_manager"
                            labelText="Encargado de compra:"
                            value={invoiceValue.purchasing_manager}
                            maxLength={MAXIMUM_LENGTH.PURCHASING_MANAGER}
                            onChange={(e): void => handleChange(e)}
                            disabled={disableInputs('purchasing_manager') || disabledInputsByRol}
                        />

                        <SelectInput
                            placeholder="Seleccionar"
                            options={buildOptions(listDocumentType)}
                            classesWrapper="input mt-4.5 lg:mt-0"
                            name="document_type_purchasing_manager"
                            labelText="Tipo de documento encargado de compra:"
                            value={getDocumentTypeName(
                                getDynamicRequest?.document_types,
                                invoiceValue.document_type_purchasing_manager
                            )}
                            optionSelected={({ id, value }): void =>
                                onSelectValue({ value: id ?? '', name: value }, 'document_type_purchasing_manager')
                            }
                            disabled={disableInputs('document_type_purchasing_manager') || disabledInputsByRol}
                        />
                    </div>
                    <div className="input-container">
                        <TextInput
                            integerNumbers
                            placeholder="..."
                            classesWrapper="input"
                            name="document_number_purchasing_manager"
                            maxLength={MAXIMUM_LENGTH.DOCUMENT_NUMBER_MANAGER}
                            labelText="Número de documento encargado de compra:"
                            value={invoiceValue.document_number_purchasing_manager}
                            onChange={(e): void => handleChange(e)}
                            disabled={disableInputs('document_number_purchasing_manager') || disabledInputsByRol}
                        />

                        <SelectInput
                            name="payment_type_id"
                            placeholder="Seleccionar"
                            labelText="*Tipo de pago:"
                            classesWrapper="input mt-4.5 lg:mt-0"
                            required={requiredFields.payment_type_id}
                            options={buildOptions(getDynamicRequest?.payment_types)}
                            value={getDocumentTypeName(getDynamicRequest?.payment_types, invoiceValue.payment_type_id)}
                            optionSelected={({ id, value }): void =>
                                onSelectValue({ value: id ?? '', name: value }, 'payment_type_id')
                            }
                            disabled={disableInputs('payment_types') || disabledInputsByRol}
                        />
                    </div>
                </>
            )}
            <div className="input-container">
                <TextInput
                    integerNumbers
                    placeholder="..."
                    name="days_payment"
                    classesWrapper="input"
                    disabled={hasPaymentType || disableInputs('days_payment') || disabledInputsByRol}
                    labelText="*Días de cobro:"
                    value={invoiceValue.days_payment}
                    required={requiredFields.days_payment}
                    maxLength={MAXIMUM_LENGTH.DAYS_PAYMENT}
                    onChange={updateDateLimit}
                />

                <SelectInput
                    name="payment_method_id"
                    placeholder="Seleccionar"
                    labelText="*Forma de pago:"
                    classesWrapper="input mt-4 lg:mt-0"
                    required={requiredFields.payment_method_id}
                    options={buildOptions(getDynamicRequest?.payment_methods) || []}
                    value={getDocumentTypeName(getDynamicRequest?.payment_methods, invoiceValue.payment_method_id)}
                    optionSelected={(values): void => onSelectValue({ value: values.id ?? '' }, 'payment_method_id')}
                    disabled={disableInputs('payment_method_id') || disabledInputsByRol}
                />
            </div>
            <div className="flex flex-col lg:flex-row">
                <div>
                    <SelectInput
                        name="type_taxpayer_name"
                        placeholder="Seleccionar"
                        classesWrapper="input mb-5"
                        labelText="*Tipo de contribuyente:"
                        required={requiredFields.type_taxpayer_name}
                        value={invoiceValue.supplier.type_taxpayer_name}
                        options={buildOptions(getDynamicRequest?.type_tax_payer) || []}
                        optionSelected={(values): void => onSelectValueSupplier(values, 'type_taxpayer_name')}
                        disabled={disableInputs('supplier_type_taxpayer_name') || disabledInputsByRol}
                    />
                    <SelectInput
                        name="taxes_details"
                        placeholder="Seleccionar"
                        classesWrapper="input mb-5"
                        labelText="*Detalle de impuestos:"
                        value={invoiceValue.taxes_details}
                        required={requiredFields.taxes_details}
                        options={formatTaxDetails(buildOptions(getDynamicRequest?.tax_details))}
                        optionSelected={(values): void => onSelectValue(values, 'taxes_details')}
                        disabled={disableInputs('taxes_details') || disabledInputsByRol}
                    />
                    <Form>
                        <TextInput
                            name="note"
                            alphanumeric
                            placeholder="..."
                            classesWrapper="input"
                            labelText="Observaciones:"
                            value={invoiceValue.note}
                            maxLength={MAXIMUM_LENGTH.NOTE}
                            onChange={(e): void => handleChange(e)}
                            disabled={disableInputs('note') || disabledInputsByRol}
                        />
                    </Form>
                </div>
                <div>
                    {invoiceValue.supplier.fiscal_responsibilities?.map(
                        (fiscal_responsibility: IGenericRecord, index: number) => (
                            <div key={Symbol(fiscal_responsibility.name).toString()} className="flex flex-row mt-5 lg:mt-0">
                                <SelectInput
                                    classesWrapper="input"
                                    placeholder="Seleccionar"
                                    name="fiscal_responsibility"
                                    value={fiscal_responsibility.name}
                                    labelText="*Responsabilidad fiscal:"
                                    disabled={
                                        !invoiceValue.supplier.type_taxpayer_name ||
                                        disableInputs('type_taxpayer_name') ||
                                        disabledInputsByRol
                                    }
                                    options={buildOptions(fiscalResponsibilitiesOptions)}
                                    required={
                                        (validateFiscalResponsibilities && !fiscal_responsibility.name) || validateFiscalRepeated
                                    }
                                    requiredText={
                                        validateFiscalResponsibilities ? '*Campo requerido' : handleValidateFiscalRepeated(index)
                                    }
                                    optionSelected={(option: IOptionSelect): void => selectFiscalResponsibility(option, index)}
                                />
                                {index > 0 && (
                                    <Icon
                                        name="trashBlue"
                                        hoverIcon="trashGreen"
                                        {...(!disabledInputsByRol && {
                                            onClick: (): void =>
                                                handleDeleteFiscalResponsibility(
                                                    fiscal_responsibility.id_fiscal === undefined
                                                        ? fiscal_responsibility.id
                                                        : fiscal_responsibility.id_fiscal
                                                ),
                                        })}
                                    />
                                )}
                            </div>
                        )
                    )}
                    {validationsScreen().taxResponsabilityValidation && (
                        <Link
                            href="#"
                            text="+ Agregar responsabilidad fiscal"
                            classes="text-base"
                            onClick={AddFiscalResponsibility}
                            disabled={
                                disabledInputsByRol ||
                                lengthEqualToZero(buildOptions(fiscalResponsibilitiesOptions)) ||
                                lengthEqualFive(invoiceValue.supplier.fiscal_responsibilities)
                            }
                        />
                    )}
                </div>
            </div>
        </>
    );
};
