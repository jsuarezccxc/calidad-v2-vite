import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { CreditCollection } from '@components/credit-collection';
import { Form } from '@components/form';
import { DatePickerDayInput, MoneyInput, SelectInput, SelectSearchInput, TextInput, WrapperInput } from '@components/input';
import { SelectSearch } from '@components/select-search';

import { CREDIT } from '@constants/Invoice';
import { QUOTE_CONSTANTS, QUOTE_MAGIC_NUMBERS } from '@constants/QuoteViewLabels';

import usePermissions from '@hooks/usePermissions';

import { TOOLTIP_DATA } from '@information-texts/GenerateSalesInvoice';

import { Form as FormQuery } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { IQuoteFormData, IClientData, ISalesManagerData, IPaymentConfigData } from '@models/QuoteGeneration';
import { FieldName } from '@models/SalesInvoice';
import { IOptionSelect } from '@components/input';

import { setClientSelected } from '@redux/client-portal/actions';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getQuotes } from '@redux/quotes/actions';
import { RootState } from '@redux/rootReducer';

import './QuoteInvoiceForm.scss';

import { buildOptions } from '@utils/Company';
import { getDateAnyFormat, getDateISO8601ToDate, getUnixFromDate } from '@utils/Date';
import { getDocumentType } from '@utils/ElectronicInvoice';
import { lengthGreaterThanZero } from '@utils/Length';
import {
    getDocumentTypeValue,
    handleExchangeRateChange,
    handleOptionChange,
    updatePersonalFields,
    inferDocumentTypeId,
} from '@utils/quoteCalculations';
import { getUserData } from '@utils/User';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

import { RadioButtons } from '@pages/generate-sales-invoice/components';

import { ConditionalFieldInput } from './ConditionalFieldInput';

import { formatQuotePrefixes, INVOICE_TYPES, QUOTE_PAGINATION_CONFIG, QUOTE_AUTHORIZED_DATA, QUOTE_UNAUTHORIZED_DATA } from '.';

/**
 * Tooltip data structure from TOOLTIP_DATA constant
 *
 * @interface ITooltipFieldData
 * @typeParam titleTooltip: string - Optional tooltip title text
 * @typeParam descTooltip: string | React.ReactElement - Optional tooltip description (text or JSX element)
 */
interface ITooltipFieldData {
    titleTooltip?: string;
    descTooltip?: string | React.ReactElement;
}

/**
 * Props interface for QuoteInvoiceForm component
 * Manages quote invoice form state and validation
 *
 * @interface IQuoteInformationFormProps
 * @typeParam formData: IQuoteFormData - Current form data state with quote-specific fields
 * @typeParam updateFormData: (data: Partial<IQuoteFormData> | ((prev: IQuoteFormData) => IQuoteFormData)) => void - Function to update form data with typed structure or callback with previous state
 * @typeParam openForm: (formType?: string) => void - Function to open modal forms
 * @typeParam validate: boolean - Flag to enable/disable validation display
 * @typeParam isContingency: boolean - Flag indicating if this is a contingency quote
 */
export interface IQuoteInformationFormProps {
    formData: IQuoteFormData;
    updateFormData: (data: IQuoteFormData | ((prev: IQuoteFormData) => IQuoteFormData)) => void;
    openForm: (formType?: string) => void;
    validate: boolean;
    isContingency: boolean;
}

/**
 * Sales manager information structure for quote generation
 *
 * @interface ISalesManagerInfo
 * @typeParam sales_manager: string - Sales manager full name
 * @typeParam manager_document_number: string - Sales manager's document number
 * @typeParam manager_document_type: string - Sales manager's document type code
 * @typeParam manager_document_type_id: string - Sales manager's document type identifier
 * @typeParam document_number_sales_manager: string - Alternative field for sales manager document number
 * @typeParam document_type_sales_manager: string - Alternative field for sales manager document type
 */
interface ISalesManagerInfo {
    sales_manager: string;
    manager_document_number: string;
    manager_document_type: string;
    manager_document_type_id: string;
    document_number_sales_manager: string;
    document_type_sales_manager: string;
}

/**
 * Extended user data interface that includes all possible fields from getUserData
 * Used for building sales manager information with flexible field mappings
 *
 * @interface IExtendedUserData
 * @extends ISalesManagerData
 * @typeParam document_type_id: string - Primary document type identifier
 * @typeParam type_document_id: string - Alternative document type identifier field
 * @typeParam document: string - Primary document number field
 * @typeParam identification: string - Alternative identification number field
 * @typeParam id_number: string - Alternative ID number field
 * @typeParam full_name: string - User's full name
 * @typeParam username: string - User's username
 */
interface IExtendedUserData extends ISalesManagerData {
    document_type_id?: string;
    type_document_id?: string;
    document?: string;
    identification?: string;
    id_number?: string;
    full_name?: string;
    username?: string;
}

const buildSalesManagerInfo = (userData: IExtendedUserData): ISalesManagerInfo => {
    const documentTypeValue = getDocumentTypeValue(userData);
    const documentTypeId = String(userData.document_type_id || userData.type_document_id || '');
    const documentNumber = String(
        userData.document_number || userData.document || userData.identification || userData.id_number || ''
    );
    const salesManagerName = String(userData.name || userData.full_name || userData.username || 'Encargado de la venta');

    return {
        sales_manager: salesManagerName,
        manager_document_number: documentNumber,
        manager_document_type: documentTypeValue || '',
        manager_document_type_id: documentTypeId,
        document_number_sales_manager: documentNumber,
        document_type_sales_manager: documentTypeId,
    };
};

const handleClientSelection = (
    value: string,
    formData: IQuoteFormData,
    updateFormData: (data: IQuoteFormData | ((prev: IQuoteFormData) => IQuoteFormData)) => void,
    clientsThin: IClientData[]
): void => {
    const selectedClient = clientsThin.find((c: IClientData) => c.client_id === value);

    updateFormData((currentFormData: IQuoteFormData): IQuoteFormData => ({
        ...currentFormData,
        client_id: value,
        not_information_customer: true,
        selectedClientName: selectedClient?.name || '',
    }));
};

const handlePaymentMethodChange = (
    option: string,
    formData: IQuoteFormData,
    updateFormData: (data: IQuoteFormData | IGenericRecord) => void
): void => {
    updateFormData({
        ...formData,
        payment_method_id: option || '',
    });
};

const handleForeignExchangeChange = (
    option: string,
    { name }: { name: string },
    formData: IQuoteFormData,
    updateFormData: (data: IQuoteFormData | IGenericRecord) => void
): void => {
    updateFormData({
        ...formData,
        foreign_exchange_id: option,
        foreign_exchange_name: name,
        foreign_exchange_rate: null,
    });
};

export const QuoteInvoiceForm: React.FC<IQuoteInformationFormProps> = ({
    formData,
    updateFormData,
    openForm,
    validate,
    isContingency,
}) => {
    const updateFormDataGeneric = (data: IGenericRecord): void => {
        updateFormData(data as IQuoteFormData);
    };

    const dispatch = useDispatch();
    const reduxState = useSelector(
        ({
            clients,
            clientPortal,
            electronicInvoice,
            utils,
            contingency,
            company,
            parameterizationInvoice,
            quotes,
        }: RootState) => ({
            payment_types: utils?.utils?.payment_types || [],
            payment_methods: utils?.utils?.payment_methods || [],
            foreign_exchange: utils?.utils?.foreign_exchange || [],
            document_types: utils?.utils?.document_types || [],
            type_taxpayer_types: utils?.utils?.type_taxpayer_types || [],

            utils: utils,

            clientSelected: clientPortal.clientSelected,
            clientsThin: (clients.clientsThin || []) as IClientData[],

            storePrefix: electronicInvoice.storePrefix,

            company: company?.information || {},

            file: parameterizationInvoice.filesLogo,
            quotesData: quotes.responseList,

            contingency: contingency.contingency,
        })
    );

    const {
        payment_types,
        payment_methods,
        foreign_exchange,
        document_types,
        type_taxpayer_types,
        clientSelected,
        clientsThin,
        storePrefix,
        contingency,
        utils,
    } = reduxState;

    useEffect(() => {
        dispatch(getFilesCompanyAction(QUOTE_CONSTANTS.TypeFile.LOGO_INVOICE));
        dispatch(getQuotes({ per_page: QUOTE_PAGINATION_CONFIG.ALL_QUOTES_LIMIT, page: QUOTE_PAGINATION_CONFIG.INITIAL_PAGE }));
    }, [dispatch]);

    useEffect(() => {
        const userData = getUserData() as IExtendedUserData | null;

        if (userData) {
            updateFormData(currentFormData => {
                if (!currentFormData.sales_manager) {
                    const salesManagerInfo = buildSalesManagerInfo(userData);
                    return {
                        ...currentFormData,
                        ...salesManagerInfo,
                    };
                }
                return currentFormData;
            });
        }
    }, []);

    useEffect(() => {
        if (clientSelected?.customer?.person) {
            const client = clientSelected.customer.person;

            const inferredDocType =
                !client.document_type && client.type_taxpayer_name
                    ? inferDocumentTypeId(client.type_taxpayer_name, document_types)
                    : null;

            const finalDocType = client.document_type || inferredDocType;

            updateFormData(currentFormData => ({
                ...currentFormData,
                name: currentFormData.selectedClientName || client.name,
                document_type: finalDocType,
                document_type_id: client.document_type_id,
                document_number: client.document_number,
                clientInfo: {
                    ...currentFormData.clientInfo,
                    name: currentFormData.selectedClientName || client.name,
                    address: client.address,
                    city_id: client.city_id,
                    city_name: client.city_name,
                    country_id: client.country_id,
                    country_name: client.country_name,
                    department_id: client.department_id,
                    department_name: client.department_name,
                    documentNumber: client.document_number,
                    documentType: finalDocType,
                    documentTypeId: client.document_type_id,
                    email: client.email,
                    phone: client.phone,
                    postal_code: client.postal_code,
                    fiscal_responsibilities: client.fiscal_responsibilities || [],
                    taxpayerType: client.type_taxpayer_id,
                    taxpayerTypeName: client.type_taxpayer_name,
                },
            }));
        }
    }, [clientSelected]);

    const authorizePersonalData = formData?.not_information_customer;

    const { disabledInputs } = usePermissions();

    const handlePersonalFieldsChange = (value: boolean): void => {
        updatePersonalFields(
            value,
            formData as IGenericRecord,
            updateFormDataGeneric,
            dispatch,
            setClientSelected,
            QUOTE_AUTHORIZED_DATA,
            QUOTE_UNAUTHORIZED_DATA
        );
    };

    const client = clientSelected?.customer?.person;

    const documentType = useMemo(() => {
        const utilsWithDocTypes = {
            ...utils,
            document_types: document_types,
        };

        let docType = formData.document_type || client?.document_type;

        if (!docType && client?.type_taxpayer_name) {
            docType = inferDocumentTypeId(client.type_taxpayer_name, document_types);
        }

        return getDocumentType(utilsWithDocTypes, docType);
    }, [utils, formData.document_type, client?.document_type, client?.type_taxpayer_name, document_types]);

    const prefixes = useMemo(() => formatQuotePrefixes(storePrefix, isContingency), [storePrefix]);

    useEffect(() => {
        if (isContingency && lengthGreaterThanZero(prefixes)) {
            const [{ value, id }] = prefixes;
            updateFormData({ ...formData, prefix_id: id, prefix_name: value });
        }
    }, [prefixes]);

    return (
        <Form sendWithEnter className="mb-6">
            {isContingency && (
                <DatePickerDayInput
                    id={generateId({
                        module: ModuleApp.QUOTES,
                        submodule: `generate-transmission-date`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="date"
                    labelText="*Fecha de transmisión:"
                    classesWrapper="w-38 xs:w-full mb-4.5"
                    selected={getUnixFromDate(formData.date)}
                    maxDate={new Date(getDateISO8601ToDate(contingency.end_date, QUOTE_CONSTANTS.DATE_BACK_FORMAT))}
                    minDate={new Date(getDateISO8601ToDate(contingency.start_date, QUOTE_CONSTANTS.DATE_BACK_FORMAT))}
                    onChangeDate={(date, name): void => {
                        updateFormData({ ...formData, [name]: getDateAnyFormat(date, QUOTE_CONSTANTS.DATE_BACK_FORMAT) });
                    }}
                />
            )}
            <SelectInput
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `generate-operation-type`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                options={INVOICE_TYPES}
                optionSelected={(option: IOptionSelect): void =>
                    handleOptionChange(option, FieldName.OperationType, formData, updateFormDataGeneric)
                }
                labelText="*Tipo de factura:"
                classesWrapper="form-field"
                name={FieldName.OperationType}
                value={formData?.[FieldName.OperationType]}
                required={validate && !formData?.[FieldName.OperationType]}
                disabled={disabledInputs}
                titleTooltip={(TOOLTIP_DATA[FieldName.OperationType] as ITooltipFieldData)?.titleTooltip || ''}
                descTooltip={
                    typeof (TOOLTIP_DATA[FieldName.OperationType] as ITooltipFieldData)?.descTooltip === 'string'
                        ? ((TOOLTIP_DATA[FieldName.OperationType] as ITooltipFieldData)?.descTooltip as string)
                        : ''
                }
            />
            <RadioButtons
                formData={formData as IGenericRecord}
                handleChange={handlePersonalFieldsChange}
                disabled={disabledInputs}
            />
            <fieldset className="flex flex-col gap-y-4.5">
                <div className="content-group-input content-group-input-width-864">
                    <div className="input-style">
                        {authorizePersonalData ? (
                            <>
                                <WrapperInput
                                    id={generateId({
                                        module: ModuleApp.QUOTES,
                                        submodule: `generate-client-name`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    labelText="*Nombre del cliente o empresa:"
                                    classesWrapper="form-field"
                                    required={validate && !formData?.client_id}
                                    tooltipInfo
                                    titleTooltip={TOOLTIP_DATA[FieldName.ClientName]?.titleTooltip || ''}
                                    descTooltip={
                                        typeof TOOLTIP_DATA[FieldName.ClientName]?.descTooltip === 'string'
                                            ? TOOLTIP_DATA[FieldName.ClientName]?.descTooltip
                                            : ''
                                    }
                                >
                                    <SelectSearch
                                        options={clientsThin.map(({ client_id: id, name }) => ({ name, value: id }))}
                                        value={formData?.client_id || ''}
                                        onChange={({ value }): void =>
                                            handleClientSelection(value, formData, updateFormData, clientsThin)
                                        }
                                        selectIconType="arrowDownGray"
                                        disabled={disabledInputs}
                                        inputClass="w-full leading-4 max-h-8"
                                    />
                                </WrapperInput>
                            </>
                        ) : (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-client-name`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="*Cliente:"
                                value={formData?.[FieldName.ClientName]}
                                disabled
                                classesWrapper="form-field"
                                titleTooltip={TOOLTIP_DATA[FieldName.ClientName]?.titleTooltip || ''}
                                descTooltip={
                                    typeof TOOLTIP_DATA[FieldName.ClientName]?.descTooltip === 'string'
                                        ? TOOLTIP_DATA[FieldName.ClientName]?.descTooltip
                                        : ''
                                }
                            />
                        )}
                        <button
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `generate-client`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.BTN,
                            })}
                            type="button"
                            className="p-0 mt-2 transition-colors bg-transparent border-0 quote-form-client-button"
                            onClick={(): void => openForm(FormQuery.Client)}
                            disabled={!authorizePersonalData || disabledInputs}
                        >
                            +Agregar cliente
                        </button>
                    </div>
                    <div className="input-style">
                        <ConditionalFieldInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `generate-document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            condition={authorizePersonalData}
                            labelText="Tipo de documento:"
                            classesWrapper="form-field"
                            disabled
                            tooltipData={{
                                title: TOOLTIP_DATA[FieldName.DocumentType]?.titleTooltip || '',
                                description:
                                    typeof TOOLTIP_DATA[FieldName.DocumentType]?.descTooltip === 'string'
                                        ? TOOLTIP_DATA[FieldName.DocumentType]?.descTooltip
                                        : '',
                            }}
                            selectProps={{
                                value: documentType,
                            }}
                            textProps={{
                                value: formData?.[FieldName.DocumentType],
                            }}
                        />
                    </div>
                </div>

                <div className="content-group-input content-group-input-width-864">
                    <div className="input-style">
                        <ConditionalFieldInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `generate-document-number`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            condition={authorizePersonalData}
                            labelText="Número de documento:"
                            classesWrapper="form-field"
                            disabled
                            tooltipData={{
                                title: TOOLTIP_DATA[FieldName.DocumentNumber]?.titleTooltip || '',
                                description:
                                    typeof TOOLTIP_DATA[FieldName.DocumentNumber]?.descTooltip === 'string'
                                        ? TOOLTIP_DATA[FieldName.DocumentNumber]?.descTooltip
                                        : '',
                            }}
                            selectProps={{
                                value: client?.document_number || '',
                            }}
                            textProps={{
                                value: formData?.[FieldName.DocumentNumber],
                            }}
                        />
                    </div>
                    <div className="input-style">
                        <ConditionalFieldInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `generate-taxpayer-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            condition={authorizePersonalData}
                            labelText="Tipo de contribuyente:"
                            classesWrapper="form-field"
                            disabled
                            tooltipData={{
                                title: TOOLTIP_DATA[FieldName.PersonType]?.titleTooltip || '',
                                description:
                                    typeof TOOLTIP_DATA[FieldName.PersonType]?.descTooltip === 'string'
                                        ? TOOLTIP_DATA[FieldName.PersonType]?.descTooltip
                                        : '',
                            }}
                            selectProps={{
                                value: client?.type_taxpayer_name || '',
                                options: type_taxpayer_types,
                            }}
                            textProps={{
                                value: formData?.[FieldName.PersonType],
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-x-7">
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: `generate-payment-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="*Forma de pago:"
                        options={payment_types}
                        classesWrapper="form-field"
                        optionSelected={(option: IOptionSelect): void =>
                            handleOptionChange(option, FieldName.PaymentType, formData as IGenericRecord, updateFormDataGeneric)
                        }
                        name={FieldName.PaymentType}
                        value={formData?.[FieldName.PaymentType]}
                        required={validate && !formData?.[FieldName.PaymentType]}
                        disabled={disabledInputs}
                        titleTooltip={(TOOLTIP_DATA[FieldName.PaymentType] as ITooltipFieldData)?.titleTooltip || ''}
                        descTooltip={
                            typeof (TOOLTIP_DATA[FieldName.PaymentType] as ITooltipFieldData)?.descTooltip === 'string'
                                ? ((TOOLTIP_DATA[FieldName.PaymentType] as ITooltipFieldData)?.descTooltip as string)
                                : ''
                        }
                    />
                    {formData?.[FieldName.PaymentType] === CREDIT && (
                        <CreditCollection data={formData as IGenericRecord} updateData={updateFormDataGeneric} validate={validate} />
                    )}
                </div>
                <div className="content-group-input content-group-input-width-864">
                    <div className="input-style">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `generate-payment-method`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="*Medio de pago:"
                            optionSelect={payment_methods
                                ?.filter(
                                    (item: IPaymentConfigData) =>
                                        item.name !== 'Instrumento no definido' && item.value !== 'Instrumento no definido'
                                )
                                .map((item: IPaymentConfigData) => ({ name: item.name || item.value, value: item.id }))}
                            classesWrapper="form-field"
                            onChangeSelect={(option): void => handlePaymentMethodChange(option, formData, updateFormDataGeneric)}
                            name={FieldName.PaymentMethod}
                            valueSelect={
                                !formData?.payment_method_id ||
                                formData?.payment_method_id === 'Instrumento no definido' ||
                                !formData?.payment_method_id.trim()
                                    ? ''
                                    : formData?.payment_method_id
                            }
                            placeholder="Seleccionar"
                            disabled={disabledInputs}
                            required={validate && !formData?.payment_method_id}
                            titleTooltip={(TOOLTIP_DATA[FieldName.PaymentMethod] as ITooltipFieldData)?.titleTooltip || ''}
                            descTooltip={
                                typeof (TOOLTIP_DATA[FieldName.PaymentMethod] as ITooltipFieldData)?.descTooltip === 'string'
                                    ? ((TOOLTIP_DATA[FieldName.PaymentMethod] as ITooltipFieldData)?.descTooltip as string)
                                    : ''
                            }
                        />
                    </div>
                    <div className="input-style">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `generate-foreign-exchange`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="*Divisa:"
                            optionSelect={foreign_exchange?.map((item: IPaymentConfigData) => ({
                                name: item.name || item.value,
                                value: item.id,
                            }))}
                            classesWrapper="form-field"
                            valueSelect={formData?.[FieldName.ForeignExchangeId]}
                            onChangeSelect={(option, nameData): void =>
                                handleForeignExchangeChange(option, nameData, formData, updateFormDataGeneric)
                            }
                            required={validate && !formData?.[FieldName.ForeignExchangeId]}
                            disabled={disabledInputs}
                            placeholder="Seleccionar"
                            titleTooltip={(TOOLTIP_DATA[FieldName.ForeignExchangeId] as ITooltipFieldData)?.titleTooltip || ''}
                            descTooltip={
                                typeof (TOOLTIP_DATA[FieldName.ForeignExchangeId] as ITooltipFieldData)?.descTooltip === 'string'
                                    ? ((TOOLTIP_DATA[FieldName.ForeignExchangeId] as ITooltipFieldData)?.descTooltip as string)
                                    : ''
                            }
                        />
                    </div>
                </div>
                {formData?.[FieldName.ForeignExchangeId] &&
                    formData[FieldName.ForeignExchangeId] !== QUOTE_CONSTANTS.COLOMBIAN_CURRENCY_ID && (
                        <div className="flex flex-col lg:flex-row gap-x-7 gap-y-6">
                            <div className="flex-1">
                                <MoneyInput
                                    id={generateId({
                                        module: ModuleApp.QUOTES,
                                        submodule: `generate-exchange-rate`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    handleChange={({ target: { value } }): void =>
                                        handleExchangeRateChange(value, formData, updateFormData)
                                    }
                                    required={validate && !formData?.[FieldName.ForeignExchangeRate]}
                                    value={formData?.[FieldName.ForeignExchangeRate]}
                                    name={FieldName.ForeignExchangeRate}
                                    labelText="*Tasa de cambio:"
                                    classesWrapper="form-field"
                                    disabled={disabledInputs}
                                    maxLength={20}
                                />
                            </div>
                            <div className="flex-1"></div>
                        </div>
                    )}
            </fieldset>

            <CollapseJsx
                title="Información opcional"
                wrapperClass="margin-8 mt-8"
                startsOpen={validate && (!formData.sales_manager || !formData.manager_document_type || !formData.manager_document_number)}
                data={
                    <div className="quote-generate__optional-fields quote-generate__optional-fields--active">
                        <div className="quote-generate__invoice-form quote-generate__invoice-form--group">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-purchase-order`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Número de orden de compra:"
                                value={formData.purchase_order_number || ''}
                                onChange={({ target }): void =>
                                    updateFormData({ ...formData, purchase_order_number: target.value })
                                }
                                disabled={disabledInputs}
                                classesWrapper="form-field"
                                placeholder="..."
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-sales-manager`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText={!formData.sales_manager ? '*Encargado de la venta:' : 'Encargado de la venta:'}
                                value={formData.sales_manager || ''}
                                onChange={({ target }): void => updateFormData({ ...formData, sales_manager: target.value })}
                                disabled={disabledInputs}
                                required={validate && !formData.sales_manager}
                                classesWrapper="form-field"
                            />
                        </div>
                        <div className="quote-generate__invoice-form quote-generate__invoice-form--group">
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-manager-document-type`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                name="manager_document_type"
                                labelText={
                                    !formData.manager_document_type
                                        ? '*Tipo de documento encargado de la venta:'
                                        : 'Tipo de documento encargado de la venta:'
                                }
                                optionSelect={buildOptions(
                                    document_types?.slice(0, QUOTE_MAGIC_NUMBERS.MAX_DOCUMENT_TYPES_DISPLAYED)
                                ).map(item => ({
                                    ...item,
                                    name: item.value,
                                }))}
                                onChangeSelect={(_value, optionData): void =>
                                    updateFormData({
                                        ...formData,
                                        manager_document_type: optionData?.value || '',
                                        manager_document_type_id: optionData?.id || '',
                                        document_type_sales_manager: optionData?.id || '',
                                    })
                                }
                                valueSelect={formData.manager_document_type || ''}
                                disabled={disabledInputs}
                                required={validate && !formData.manager_document_type}
                                classesWrapper="form-field"
                                placeholder="Seleccionar"
                                isTableSearch
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-manager-document-number`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText={
                                    !formData.manager_document_number
                                        ? '*Número de documento del encargado de la venta:'
                                        : 'Número de documento del encargado de la venta:'
                                }
                                value={formData.manager_document_number || ''}
                                onChange={({ target }): void =>
                                    updateFormData({
                                        ...formData,
                                        manager_document_number: target.value,
                                        document_number_sales_manager: target.value,
                                    })
                                }
                                disabled={disabledInputs}
                                required={validate && !formData.manager_document_number}
                                classesWrapper="form-field"
                                placeholder="..."
                            />
                        </div>
                    </div>
                }
            />
        </Form>
    );
};
