import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from '@utils/Dayjs';
import { Form } from '@components/form';
import { CreditCollection } from '@components/credit-collection';
import { DatePickerDayInput, MoneyInput, SelectInput, SelectSearchInput, TextInput, WrapperInput } from '@components/input';
import { SelectSearch } from '@components/select-search';
import { CREDIT } from '@constants/Invoice';
import { CURRENCY_TEXT } from '@constants/FieldsValidation';
import { COLOMBIAN_CURRENCY_ID, DATE_BACK_FORMAT, MaxLengthFields, NINE } from '@constants/ElectronicInvoice';
import { TOOLTIP_DATA } from '@information-texts/GenerateSalesInvoice';
import { Form as FormQuery } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName } from '@models/SalesInvoice';
import { RootState } from '@redux/rootReducer';
import { setClientSelected } from '@redux/client-portal/actions';
import { getDateAnyFormat, getDateISO8601ToDate } from '@utils/Date';
import { lengthGreaterThanZero } from '@utils/Length';
import { stringToFloat, getDocumentType } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import useDigitVerification from '@hooks/useDigitVerification';
import usePermissions from '@hooks/usePermissions';
import {
    formatPrefixes,
    RadioButtons,
    IInformationFormProps,
    ID_KEY,
    INVOICE_TYPES,
    UNAUTHORIZED_DATA,
    AUTHORIZED_DATA,
} from '.';

export const InvoiceForm: React.FC<IInformationFormProps> = ({ formData, updateFormData, openForm, validate, isContingency }) => {
    const dispatch = useDispatch();
    const { utils, clientSelected, clientsThin, storePrefix, contingency } = useSelector(
        ({ clients, clientPortal, electronicInvoice, utils, contingency }: RootState) => ({
            ...utils,
            ...clients,
            ...clientPortal,
            ...electronicInvoice,
            contingency: contingency.contingency,
        })
    );

    const authorizePersonalData = formData?.not_information_customer;

    const { disabledInputs } = usePermissions();

    const updatePersonalFields = (value: boolean): void => {
        if (value) {
            updateFormData({ ...formData, ...AUTHORIZED_DATA, not_information_customer: value });
            dispatch(setClientSelected({}));
            return;
        }
        updateFormData({ ...formData, ...UNAUTHORIZED_DATA, not_information_customer: value });
    };

    const client = clientSelected?.customer?.person;

    const documentType = useMemo(() => getDocumentType(utils, client?.document_type), [utils, client]);

    const { isTypeNit, digitVerification } = useDigitVerification(documentType, client?.document_number ?? '');

    const handleOptionChange = ({ value, name, id }: IGenericRecord): void => {
        const keyId = ID_KEY[name];
        updateFormData({
            ...formData,
            [name]: value,
            ...(keyId && { [keyId]: id }),
            ...(name === FieldName.PaymentType && { collection_days: null, days_collection_type: 'Días calendario' }),
        });
    };

    const prefixes = useMemo(() => formatPrefixes(storePrefix, isContingency), [storePrefix]);

    useEffect(() => {
        if (isContingency && lengthGreaterThanZero(prefixes)) {
            const [{ value, id }] = prefixes;
            updateFormData({ ...formData, prefix_id: id, prefix_name: value });
        }
    }, [prefixes]);

    const invoicesTypesRender = INVOICE_TYPES.map(item => ({ ...item, name: item.value }));
    const prefixesOptionsRender = prefixes.map(item => ({ ...item, name: item.value }));
    const paymentTypesRender = utils?.payment_types?.map((item: IGenericRecord) => ({ ...item, name: item.value }));
    const paymentMethodsRender = utils?.payment_methods?.map((item: IGenericRecord) => ({ ...item, name: item.value }));

    return (
        <Form sendWithEnter className="invoice-form">
            {isContingency && (
                <DatePickerDayInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-date`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="date"
                    labelText="*Fecha de transmisión:"
                    classesWrapper="w-38 xs:w-full mb-4.5"
                    selected={dayjs(formData.date, DATE_BACK_FORMAT).unix()}
                    maxDate={new Date(getDateISO8601ToDate(contingency.end_date, DATE_BACK_FORMAT))}
                    minDate={new Date(getDateISO8601ToDate(contingency.start_date, DATE_BACK_FORMAT))}
                    onChangeDate={(date, name): void => {
                        updateFormData({ ...formData, [name]: getDateAnyFormat(date, DATE_BACK_FORMAT) });
                    }}
                />
            )}
            <SelectSearchInput
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-type-invoice`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                optionSelect={invoicesTypesRender}
                onChangeSelect={(_, e): void => handleOptionChange({ ...e, name: FieldName.OperationType })}
                labelText="*Tipo de factura:"
                classesWrapper="form-field"
                name={FieldName.OperationType}
                valueSelect={formData?.[FieldName.OperationType]}
                required={validate && !formData?.[FieldName.OperationType]}
                disabled={disabledInputs}
                {...TOOLTIP_DATA[FieldName.OperationType]}
            />
            <SelectSearchInput
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-prefix`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                labelText="*Prefijo:"
                optionSelect={prefixesOptionsRender}
                onChangeSelect={(_, e): void => handleOptionChange({ ...e, name: FieldName.Prefix })}
                name={FieldName.Prefix}
                valueSelect={formData?.[FieldName.Prefix]}
                classesWrapper="form-field my-4.5"
                selectIconType="arrowDownGreen"
                required={validate && !formData?.[FieldName.Prefix]}
                disabled={disabledInputs || isContingency}
                {...TOOLTIP_DATA[FieldName.Prefix]}
            />
            <RadioButtons formData={formData} handleChange={updatePersonalFields} disabled={disabledInputs} />
            <fieldset className="flex flex-col gap-y-4.5">
                <div className="invoice-form__group">
                    <div>
                        {authorizePersonalData ? (
                            <>
                                <WrapperInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-client-name`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Nombre del cliente o empresa:"
                                    classesWrapper="form-field"
                                    required={validate && !formData?.client_id}
                                    tooltipInfo
                                    {...TOOLTIP_DATA[FieldName.ClientName]}
                                >
                                    <SelectSearch
                                        options={clientsThin.map(({ client_id: id, name }) => ({ name, value: id }))}
                                        value={formData?.client_id || ''}
                                        onChange={({ value }): void => updateFormData({ ...formData, client_id: value })}
                                        selectIconType="arrowDownGreen"
                                        disabled={disabledInputs}
                                        inputClass="invoice-form__select-search"
                                    />
                                </WrapperInput>
                            </>
                        ) : (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-client-name`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="*Cliente:"
                                value={formData?.[FieldName.ClientName]}
                                disabled
                                classesWrapper="form-field"
                                {...TOOLTIP_DATA[FieldName.ClientName]}
                            />
                        )}
                        <button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-client`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.BTN,
                            })}
                            type="button"
                            className="invoice-form__customer-button"
                            onClick={(): void => openForm(FormQuery.Client)}
                            disabled={!authorizePersonalData || disabledInputs}
                        >
                            +Agregar cliente
                        </button>
                    </div>
                    {authorizePersonalData ? (
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Tipo de documento:"
                            classesWrapper="form-field"
                            disabled
                            value={documentType}
                            {...TOOLTIP_DATA[FieldName.DocumentType]}
                        />
                    ) : (
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Tipo de documento:"
                            value={formData?.[FieldName.DocumentType]}
                            disabled
                            classesWrapper="form-field"
                            {...TOOLTIP_DATA[FieldName.DocumentType]}
                        />
                    )}
                </div>
                <div className="invoice-form__group">
                    <div className="flex form-field">
                        {authorizePersonalData ? (
                            <SelectInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-number`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                labelText="Número de documento:"
                                classesWrapper={isTypeNit ? 'mr-2 w-full' : ' w-full'}
                                disabled
                                value={client?.document_number}
                                {...TOOLTIP_DATA[FieldName.DocumentNumber]}
                            />
                        ) : (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-number`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Número de documento:"
                                classesWrapper={isTypeNit ? 'mr-2 w-full' : ' w-full'}
                                disabled
                                value={formData?.[FieldName.DocumentNumber]}
                                {...TOOLTIP_DATA[FieldName.DocumentNumber]}
                            />
                        )}
                        {isTypeNit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-dv`,
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
                    {authorizePersonalData ? (
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-type-taxpayer-name`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Tipo de contribuyente:"
                            classesWrapper="form-field"
                            disabled
                            value={client?.type_taxpayer_name}
                            {...TOOLTIP_DATA[FieldName.PersonType]}
                        />
                    ) : (
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-type-taxpayer-name`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Tipo de contribuyente:"
                            value={formData?.[FieldName.PersonType]}
                            disabled
                            classesWrapper="form-field"
                            {...TOOLTIP_DATA[FieldName.PersonType]}
                        />
                    )}
                </div>
                <div className="flex gap-x-7">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-payment-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="*Forma de pago:"
                        optionSelect={paymentTypesRender}
                        classesWrapper="form-field"
                        onChangeSelect={(_, e): void => handleOptionChange({ ...e, name: FieldName.PaymentType })}
                        name={FieldName.PaymentType}
                        valueSelect={formData?.[FieldName.PaymentType]}
                        required={validate && !formData?.[FieldName.PaymentType]}
                        disabled={disabledInputs}
                        {...TOOLTIP_DATA[FieldName.PaymentType]}
                    />
                    {formData?.[FieldName.PaymentType] === CREDIT && (
                        <CreditCollection data={formData} updateData={updateFormData} validate={validate} />
                    )}
                </div>
                <div className="invoice-form__group">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-payment-method`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="Medio de pago:"
                        optionSelect={paymentMethodsRender}
                        classesWrapper="form-field"
                        onChangeSelect={(_, e): void => handleOptionChange({ ...e, name: FieldName.PaymentMethod })}
                        name={FieldName.PaymentMethod}
                        valueSelect={formData?.[FieldName.PaymentMethod]}
                        disabled={disabledInputs}
                        {...TOOLTIP_DATA[FieldName.PaymentMethod]}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-foreign-exchange`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="*Divisa:"
                        optionSelect={utils?.foreign_exchange?.map((item: IGenericRecord) => ({ ...item, value: item.id }))}
                        classesWrapper="form-field"
                        valueSelect={formData?.[FieldName.ForeignExchangeId]}
                        onChangeSelect={(option, { name }): void =>
                            updateFormData({
                                ...formData,
                                foreign_exchange_id: option,
                                foreign_exchange_name: name,
                                foreign_exchange_rate: null,
                            })
                        }
                        required={validate && !formData?.[FieldName.ForeignExchangeId]}
                        disabled={disabledInputs}
                        {...TOOLTIP_DATA[FieldName.ForeignExchangeId]}
                    />
                </div>
                {formData?.[FieldName.ForeignExchangeId] && formData[FieldName.ForeignExchangeId] !== COLOMBIAN_CURRENCY_ID && (
                    <fieldset className="flex flex-col form-field">
                        <MoneyInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-foreign-exchange-rate`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            handleChange={({ target: { name, value } }): void => {
                                const floatValue = stringToFloat(value);
                                const [integers] = String(floatValue).split('.');
                                updateFormData({
                                    ...formData,
                                    [name]: integers.length > NINE ? formData?.foreign_exchange_rate : floatValue,
                                });
                            }}
                            required={validate && !formData?.[FieldName.ForeignExchangeRate]}
                            value={formData?.[FieldName.ForeignExchangeRate]}
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
            </fieldset>
        </Form>
    );
};
