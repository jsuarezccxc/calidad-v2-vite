/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';
import { Form } from '@components/form';
import { CreditCollection } from '@components/credit-collection';
import { InputSelectTime } from '@components/form-invoice-purchase/components/input-select-time';
import { DatePickerDayInput, MoneyInput, SelectInput, SelectSearchInput, TextInput } from '@components/input';
import { CREDIT } from '@constants/Invoice';
import { CURRENCY_TEXT, REQUIRED_FIELD, VALIDATION_CUFE } from '@constants/FieldsValidation';
import { COLOMBIAN_CURRENCY_ID, MaxLengthFields, NINE } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName, IFormPurchaseInvoice } from '@models/PurchaseInvoice';
import { RootState } from '@redux/rootReducer';
import { buildOptions } from '@utils/Company';
import { getUnixFromDate } from '@utils/Date';
import { stringToFloat } from '@utils/ElectronicInvoice';
import usePermissions from '@hooks/usePermissions';
import useDigitVerification from '@hooks/useDigitVerification';
import { TOOLTIP_DATA } from '@information-texts/GeneratePurchaseInvoice';
import { getFieldProps, IInvoiceFormProps, ID_KEY } from '.';

export const InvoiceForm: React.FC<IInvoiceFormProps> = ({
    data,
    handleValueChange,
    updateData,
    openForm,
    utils,
    validate,
    validationError,
}) => {
    const {
        prefixes,
        suppliers: { data: suppliers = [] },
        selectedSupplier,
    } = useSelector(({ electronicInvoice, suppliers }: RootState) => ({
        ...electronicInvoice,
        ...suppliers,
    }));

    const [cop, setCop] = useState<SelectSearchOption[]>();

    const [timePicker, setTimePicker] = useState<boolean>(false);

    const { disabledInputs } = usePermissions();

    const supplier = useMemo(() => suppliers?.find(supplier => supplier.id === (data.supplier_id || selectedSupplier.id)), [
        data.supplier_id,
        suppliers,
    ]);

    const { isTypeNit, digitVerification } = useDigitVerification(supplier?.document_name ?? '', supplier?.document_number ?? '');

    const isCufeError = validationError.includes(FieldName.DocumentUuid);

    useEffect(() => {
        if (utils?.foreign_exchange)
            setCop(utils?.foreign_exchange?.map((item: IGenericRecord) => ({ ...item, value: item.id })));
    }, [utils]);

    useEffect(() => {
        updateData({ ...data, supplier: supplier?.person, person_id: supplier?.person_id });
    }, [supplier]);

    const handleDateChange = (date: Date, name: string): void => updateData({ ...data, [name]: getUnixFromDate(date) });

    const handleOptionChange = ({ value, id }: IGenericRecord, name = ''): void => {
        const keyId = ID_KEY[name];
        updateData({ ...data, [name]: value, ...(keyId && { [keyId]: id }) });
    };

    const fieldProps = getFieldProps(
        selectedSupplier ? { ...data, supplier: supplier?.name || data.supplier?.name || '' } : data,
        validate
    );

    const prefixesOptionsRender = prefixes?.map(({ prefix, ...item }) => ({
        ...item,
        key: prefix,
        value: prefix,
        name: prefix,
    }));

    const suppliersOptionsRender =
        suppliers?.map((item: IGenericRecord) => ({ ...item, value: item.name, key: item.name })) ?? [];

    const paymentTypesRender = buildOptions(utils?.payment_types).map(item => ({ ...item, name: item.value }));

    const paymentMethodsRender = buildOptions(utils?.payment_methods).map(item => ({ ...item, name: item.value }));

    return (
        <Form sendWithEnter className="invoice-form">
            <TextInput
                {...fieldProps[FieldName.Cufe]}
                onChange={handleValueChange}
                alphanumericNoWhitespace
                disabled={disabledInputs}
                required={(validate && !data.cufe) || isCufeError}
                requiredText={isCufeError ? VALIDATION_CUFE : REQUIRED_FIELD}
            />
            <TextInput onChange={handleValueChange} {...fieldProps[FieldName.InvoiceNumber]} disabled={disabledInputs} />
            <SelectSearchInput
                optionSelect={prefixesOptionsRender}
                onChangeSelect={(_, selectedOption): void => {
                    handleOptionChange(selectedOption, fieldProps[FieldName.Prefix].name);
                }}
                disabled={disabledInputs}
                {...fieldProps[FieldName.Prefix]}
            />
            <div className="invoice-form__group">
                <DatePickerDayInput
                    {...fieldProps[FieldName.BroadcastDate]}
                    onChangeDate={(value): void => handleDateChange(value, 'date')}
                    disabled={disabledInputs}
                />
                <InputSelectTime
                    setTimeValue={({ time_issue }): void => updateData({ ...data, time_issue })}
                    {...TOOLTIP_DATA[FieldName.BroadcastTime]}
                    className="invoice-form__time-input"
                    setTimePicker={setTimePicker}
                    disabled={disabledInputs}
                    timePicker={timePicker}
                    timeValue={data}
                />
                <DatePickerDayInput
                    {...fieldProps[FieldName.ExpirationDate]}
                    onChangeDate={(value): void => handleDateChange(value, FieldName.ExpirationDate)}
                    disabled={disabledInputs}
                />
            </div>
            <div className="invoice-form__group">
                <div>
                    <SelectSearchInput
                        {...fieldProps[FieldName.Supplier]}
                        optionSelect={suppliersOptionsRender}
                        onChangeSelect={(_, selectedOption): void => {
                            handleOptionChange(selectedOption, fieldProps[FieldName.Supplier].name);
                        }}
                        disabled={disabledInputs}
                    />
                    <button
                        className={`mt-2 underline cursor-pointer ${disabledInputs ? 'text-gray' : 'text-green'}`}
                        onClick={openForm}
                        type="button"
                        disabled={disabledInputs}
                    >
                        +Agregar proveedor
                    </button>
                </div>
                <SelectInput {...fieldProps[FieldName.DocumentType]} value={supplier?.document_name} />
            </div>
            <div className="invoice-form__group">
                <div className="flex form-field">
                    <TextInput
                        {...fieldProps[FieldName.DocumentNumber]}
                        value={supplier?.document_number}
                        classesWrapper={isTypeNit ? 'mr-2 w-full' : ' w-full'}
                    />
                    {isTypeNit && (
                        <TextInput
                            tooltipInfo
                            descTooltip="DV: Dígito de verificación"
                            classesWrapper="w-11.2"
                            labelText="DV:"
                            disabled
                            value={digitVerification}
                        />
                    )}
                </div>
                <SelectInput {...fieldProps[FieldName.PersonType]} value={supplier?.person?.type_taxpayer_name} />
            </div>
            <div className="invoice-form__group">
                <SelectSearchInput
                    {...fieldProps[FieldName.PaymentType]}
                    optionSelect={paymentTypesRender}
                    onChangeSelect={(_, selectedOption): void => {
                        handleOptionChange(selectedOption, fieldProps[FieldName.PaymentType].name);
                    }}
                    disabled={disabledInputs}
                />
                {data?.payment_type_name === CREDIT && (
                    <CreditCollection
                        data={data}
                        updateData={(data): void => updateData(data as IFormPurchaseInvoice)}
                        validate={validate}
                    />
                )}
            </div>
            <div className="invoice-form__group">
                <SelectSearchInput
                    {...fieldProps[FieldName.PaymentMethod]}
                    optionSelect={paymentMethodsRender}
                    onChangeSelect={(_, selectedOption): void => {
                        handleOptionChange(selectedOption, fieldProps[FieldName.PaymentMethod].name);
                    }}
                    disabled={disabledInputs}
                />
                <SelectSearchInput
                    {...fieldProps[FieldName.ForeignExchange]}
                    optionSelect={cop ? cop : [{ name: data.foreign_exchange_name, value: data.foreign_exchange_id }]}
                    onChangeSelect={(option, { name }): void =>
                        updateData({ ...data, foreign_exchange_id: option, foreign_exchange_name: name })
                    }
                    disabled={disabledInputs}
                />
            </div>
            {data?.[FieldName.ForeignExchange] && data[FieldName.ForeignExchange] !== COLOMBIAN_CURRENCY_ID && (
                <fieldset className="flex flex-col form-field">
                    <MoneyInput
                        handleChange={({ target: { name, value } }): void => {
                            const floatValue = stringToFloat(value);
                            const [integers] = String(floatValue).split('.');
                            updateData({
                                ...data,
                                [name]: integers.length > NINE ? data?.foreign_exchange_rate : floatValue,
                            });
                        }}
                        required={validate && !data?.[FieldName.ForeignExchangeRate]}
                        value={data?.[FieldName.ForeignExchangeRate]}
                        name={FieldName.ForeignExchangeRate}
                        labelText="*Tasa de cambio:"
                        classesWrapper="form-field"
                        disabled={disabledInputs}
                        maxLength={MaxLengthFields.FOREIGN_EXCHANGE_RATE}
                        withIcon={false}
                    />
                    <span className="invoice-form__foreign-message">{CURRENCY_TEXT}</span>
                </fieldset>
            )}
        </Form>
    );
};
