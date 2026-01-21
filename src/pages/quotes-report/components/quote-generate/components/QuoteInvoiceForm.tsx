import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from '@utils/Dayjs';
import { buildOptions } from '@utils/Company';
import { getDateAnyFormat, getDateISO8601ToDate } from '@utils/Date';
import { getDocumentType } from '@utils/ElectronicInvoice';
import { lengthGreaterThanZero } from '@utils/Length';
import { getUserData } from '@utils/User';
import {
    getDocumentTypeValue,
    handleExchangeRateChange,
    handleOptionChange,
    updatePersonalFields,
} from '@utils/quoteCalculations';
import { generateQuoteNumber, getCurrentDateFormatted } from '@utils/quoteHelpers';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { CardFile } from '@components/card-file';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { CreditCollection } from '@components/credit-collection';
import { Form } from '@components/form';
import { DatePickerDayInput, MoneyInput, SelectInput, SelectSearchInput, TextInput, WrapperInput } from '@components/input';
import { SelectSearch } from '@components/select-search';
import { Tooltip } from '@components/tooltip';
import { QUOTE_MAGIC_NUMBERS, TAXPAYER_TYPE_IDS } from '@constants/QuoteViewLabels';
import { CREDIT } from '@constants/Invoice';
import {
    COLOMBIAN_CURRENCY_ID,
    DATE_BACK_FORMAT,
    DOCUMENT_LANGUAGES,
    MaxLengthFields,
    TypeFile,
} from '@constants/ElectronicInvoice';
import { TOOLTIP_DATA } from '@information-texts/GenerateSalesInvoice';
import { Form as FormQuery } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName } from '@models/SalesInvoice';
import { setClientSelected, getClientById } from '@redux/client-portal/actions';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getQuotes } from '@redux/quotes/actions';
import { RootState } from '@redux/rootReducer';
import usePermissions from '@hooks/usePermissions';
import usePopper from '@hooks/usePopper';
import informationIcon from '@assets/images/info-green.svg';
import { ConditionalFieldInput } from './ConditionalFieldInput';
import { IQuoteInformationFormProps } from '..';
import {
    formatQuotePrefixes,
    getTooltipData,
    INVOICE_TYPES,
    QUOTE_PERSONAL_DATA_OPTIONS,
    QUOTE_AUTHORIZED_DATA,
    QUOTE_UNAUTHORIZED_DATA,
} from '.';

interface ICompanyFields {
    department_name: string;
    country_name: string;
    phone: string;
    domain: string;
}

interface IClientInfo {
    name: string;
    documentType: string;
    documentTypeId: string | number;
    documentNumber: string;
    email: string;
    phone: string;
    address: string;
    taxpayerType: number | null;
    taxpayerTypeName: string | null;
    fiscal_responsibilities: IGenericRecord[];
    country_id: number;
    country_name: string;
    department_id: number;
    department_name: string;
    city_id: number;
    city_name: string;
    postal_code: string;
}

interface ISalesManagerInfo {
    sales_manager: string;
    manager_document_number: string;
    manager_document_type: string;
    manager_document_type_id: string;
}

const extractCompanyFields = (company: IGenericRecord): ICompanyFields => ({
    department_name: company.department_name || '',
    country_name: company.country_name || '',
    phone: company.phone || '',
    domain: company.domain || '',
});

const TAXPAYER_TYPE_KEYWORDS = {
    NATURAL: ['natural'],
    JURIDICA: ['jurídica', 'juridica'],
} as const;

const getTaxpayerTypeId = (taxpayerTypeName: string | null, defaultId: number | null = null): number | null => {
    if (!taxpayerTypeName) return defaultId;

    const normalizedTypeName = taxpayerTypeName.toLowerCase();

    if (TAXPAYER_TYPE_KEYWORDS.NATURAL.some(keyword => normalizedTypeName.includes(keyword))) {
        return TAXPAYER_TYPE_IDS.NATURAL;
    }

    if (TAXPAYER_TYPE_KEYWORDS.JURIDICA.some(keyword => normalizedTypeName.includes(keyword))) {
        return TAXPAYER_TYPE_IDS.JURIDICA;
    }

    return defaultId;
};

const CLIENT_FIELD_MAPPING = {
    NAME_FIELDS: ['name', 'name_legal_representative'],
    DOCUMENT_TYPE_ID_FIELDS: ['document_type_id', 'document_type'],
    FISCAL_RESPONSIBILITY_FIELDS: ['fiscal_responsibilities', 'person_fiscal_responsibilities'],
    DEFAULTS: {
        NAME: 'Cliente',
        EMPTY_STRING: '',
        NUMERIC_ZERO: 0,
        EMPTY_ARRAY: [] as unknown[],
    },
} as const;

const getFieldWithFallback = <T extends unknown>(data: IGenericRecord, field: string, fallback: T): T => {
    return data[field] !== undefined && data[field] !== null ? data[field] : fallback;
};

const getFieldFromMultipleSources = <T extends unknown>(data: IGenericRecord, fields: readonly string[], fallback: T): T => {
    for (const field of fields) {
        if (data[field] !== undefined && data[field] !== null) {
            return data[field];
        }
    }
    return fallback;
};

const buildClientInfo = (client: IGenericRecord): IClientInfo => {
    const taxpayerTypeName = client.type_taxpayer_name || null;
    const taxpayerTypeId = getTaxpayerTypeId(taxpayerTypeName, client.type_taxpayer_id);

    return {
        name: getFieldFromMultipleSources(client, CLIENT_FIELD_MAPPING.NAME_FIELDS, CLIENT_FIELD_MAPPING.DEFAULTS.NAME),
        documentType: getFieldWithFallback(client, 'document_type', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        documentTypeId: getFieldFromMultipleSources(
            client,
            CLIENT_FIELD_MAPPING.DOCUMENT_TYPE_ID_FIELDS,
            CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING
        ),
        documentNumber: getFieldWithFallback(client, 'document_number', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        email: getFieldWithFallback(client, 'email', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        phone: getFieldWithFallback(client, 'phone', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        address: getFieldWithFallback(client, 'address', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        taxpayerType: taxpayerTypeId,
        taxpayerTypeName: taxpayerTypeName,
        fiscal_responsibilities: getFieldFromMultipleSources(
            client,
            CLIENT_FIELD_MAPPING.FISCAL_RESPONSIBILITY_FIELDS,
            CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_ARRAY
        ),
        country_id: getFieldWithFallback(client, 'country_id', CLIENT_FIELD_MAPPING.DEFAULTS.NUMERIC_ZERO),
        country_name: getFieldWithFallback(client, 'country_name', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        department_id: getFieldWithFallback(client, 'department_id', CLIENT_FIELD_MAPPING.DEFAULTS.NUMERIC_ZERO),
        department_name: getFieldWithFallback(client, 'department_name', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        city_id: getFieldWithFallback(client, 'city_id', CLIENT_FIELD_MAPPING.DEFAULTS.NUMERIC_ZERO),
        city_name: getFieldWithFallback(client, 'city_name', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
        postal_code: getFieldWithFallback(client, 'postal_code', CLIENT_FIELD_MAPPING.DEFAULTS.EMPTY_STRING),
    };
};

const buildSalesManagerInfo = (userData: IGenericRecord): ISalesManagerInfo => {
    const documentTypeValue = getDocumentTypeValue(userData);

    return {
        sales_manager: userData.name || userData.full_name || userData.username || 'Encargado de la venta',
        manager_document_number:
            userData.document_number || userData.document || userData.identification || userData.id_number || '',
        manager_document_type: documentTypeValue || '',
        manager_document_type_id: userData.document_type_id || userData.type_document_id || '',
    };
};

const createButtonHoverHandlers = (
    primaryColor = 'var(--primary-green)',
    hoverColor = 'var(--primary-green-hover)'
): {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
} => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.currentTarget.style.color = hoverColor;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.currentTarget.style.color = primaryColor;
    },
});

const handleLanguageChange = (value: string, formData: IGenericRecord, updateFormData: (data: IGenericRecord) => void): void => {
    updateFormData({ ...formData, document_language: value });
};

const handleClientSelection = (value: string, formData: IGenericRecord, updateFormData: (data: IGenericRecord) => void): void => {
    updateFormData({ ...formData, client_id: value });
};

const handlePaymentMethodChange = (
    option: IGenericRecord,
    { name }: { name: string },
    formData: IGenericRecord,
    updateFormData: (data: IGenericRecord) => void
): void => {
    updateFormData({
        ...formData,
        [name]: option?.name || '',
    });
};

const handleForeignExchangeChange = (
    option: IGenericRecord,
    { name }: { name: string },
    formData: IGenericRecord,
    updateFormData: (data: IGenericRecord) => void
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
            clientsThin: clients.clientsThin,

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
        company,
        file,
        quotesData,
        utils,
    } = reduxState;

    const handleLogoUpdate = (file: IGenericRecord): void => {
        updateFormData({ logo: file });
    };

    const companyData = company
        ? {
              name: company.name,
              document_type_name: company.document_type_name || 'NIT',
              document_number: company.document_number,
              address: company.address,
              city_name: company.city_name,
              ...extractCompanyFields(company),
          }
        : {
              name: 'Centro de Consultoría para la Competitividad CCxC - 1',
              document_type_name: 'NIT',
              document_number: '901084754',
              address: 'Cra 16 # 93-78 Of. 807',
              city_name: 'Bogotá',
              department_name: 'D.C.',
              country_name: 'Colombia',
              phone: '7943044',
              domain: 'pruebadelsitio-web-v2.diggipymes.co',
          };

    useEffect(() => {
        dispatch(getFilesCompanyAction(TypeFile.LOGO_INVOICE));
        dispatch(getQuotes({ per_page: 9999, page: 1 }));
    }, [dispatch]);

    useEffect(() => {
        const userData = getUserData();

        if (userData && !formData.sales_manager) {
            const salesManagerInfo = buildSalesManagerInfo(userData);
            updateFormData({
                ...formData,
                ...salesManagerInfo,
            });
        }
    }, []);

    const authorizePersonalData = formData?.not_information_customer;

    const { disabledInputs } = usePermissions();

    const buttonHoverHandlers = createButtonHoverHandlers();
    const client = clientSelected?.customer?.person;

    const documentType = useMemo(() => {
        const utilsWithDocTypes = {
            ...utils,
            document_types: document_types,
        };

        if (formData.not_information_customer && formData.clientInfo?.documentType) {
            return getDocumentType(utilsWithDocTypes, formData.clientInfo.documentType);
        }
        return getDocumentType(utilsWithDocTypes, client?.document_type);
    }, [utils, client, formData.not_information_customer, formData.clientInfo?.documentType, document_types]);

    const prefixes = useMemo(() => formatQuotePrefixes(storePrefix, isContingency), [storePrefix]);

    const { activePopper, anchorEl, mouseProps } = usePopper();
    const tooltipData = getTooltipData(QUOTE_PERSONAL_DATA_OPTIONS, activePopper);

    useEffect(() => {
        if (isContingency && lengthGreaterThanZero(prefixes)) {
            const [{ value, id }] = prefixes;
            updateFormData({ ...formData, prefix_id: id, prefix_name: value });
        }
    }, [prefixes]);

    useEffect(() => {
        if (formData.client_id && formData.not_information_customer) {
            dispatch(getClientById(formData.client_id));
        }
    }, [formData.client_id, formData.not_information_customer, dispatch]);

    useEffect(() => {
        if (client && formData.not_information_customer) {
            const clientInfo = buildClientInfo(client);
            updateFormData({
                ...formData,
                clientInfo,
            });
        }
    }, [client, formData.not_information_customer]);

    return (
        <Form className="mb-6">
            <SelectSearchInput
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `invoice-language`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                classesWrapper="w-37 xs:w-full mb-2 quote-language-select"
                labelText="Idioma del documento:"
                valueSelect={formData.document_language || 'es'}
                placeholder="Seleccionar"
                optionSelect={DOCUMENT_LANGUAGES}
                onChangeSelect={({ value }): void => handleLanguageChange(value, formData, updateFormData)}
                disabled={false}
            />

            <div className="mb-6 quote-generate__cards">
                <div className="quote-generate__cards--logo-card">
                    {file || formData.logo ? (
                        <CardFile
                            className="w-full"
                            file={formData.logo || file || {}}
                            url={(formData.logo || file)?.url}
                            updateFile={handleLogoUpdate}
                        />
                    ) : (
                        <div className="text-center">
                            <span className="quote-generate__text--green">+Agregar logo</span>
                            <span className="quote-generate__text--green">(jpg,png,jpeg)</span>
                        </div>
                    )}
                </div>

                <div className="quote-generate__cards--company-card">
                    <p>
                        <span className="quote-generate__text--blue">{companyData.name}</span>
                        <span className="quote-generate__text--blue">
                            {companyData.document_type_name} {companyData.document_number}
                        </span>
                        <span className="quote-generate__text--blue">{companyData.address}</span>
                        <span className="quote-generate__text--blue">
                            {companyData.city_name ? `${companyData.city_name}, ` : ''}
                            {companyData.country_name}
                        </span>
                        <span className="quote-generate__text--blue">{companyData.phone}</span>
                        <span className="quote-generate__text--blue">{companyData.domain}</span>
                    </p>
                </div>

                <div className="quote-generate__cards--date-card">
                    <p>
                        <span className="quote-generate__text--blue">Fecha cotización:</span>
                        <span className="quote-generate__text--blue">{getCurrentDateFormatted()}</span>
                        <span className="quote-generate__text--blue">No. cotización:</span>
                        <span className="quote-generate__text--blue">{generateQuoteNumber(quotesData)}</span>
                    </p>
                </div>
            </div>

            {isContingency && (
                <DatePickerDayInput
                    id={generateId({
                        module: ModuleApp.QUOTES,
                        submodule: `invoice-transmission-date`,
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
            <SelectInput
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `invoice-operation-type`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                options={INVOICE_TYPES}
                optionSelected={(option: IGenericRecord): void =>
                    handleOptionChange(option, FieldName.OperationType, formData, updateFormData)
                }
                labelText="*Tipo de cotización:"
                classesWrapper="form-field"
                name={FieldName.OperationType}
                value={formData?.[FieldName.OperationType]}
                required={validate && !formData?.[FieldName.OperationType]}
                disabled={disabledInputs}
                {...TOOLTIP_DATA[FieldName.OperationType]}
            />
            <div className="mt-6 quote-generate__radio-buttons">
                <h3 className="mb-2 font-allerbold text-gray-dark">*Seleccione la opción que aplique para su cliente:</h3>
                <fieldset className="flex flex-col gap-7 lg:flex-row">
                    {QUOTE_PERSONAL_DATA_OPTIONS.map(({ id, label, value }) => (
                        <div key={id} className="radio-button">
                            <input
                                disabled={disabledInputs}
                                checked={formData?.not_information_customer === value}
                                id={label}
                                onChange={(): void =>
                                    updatePersonalFields(
                                        value,
                                        formData,
                                        updateFormData,
                                        dispatch,
                                        setClientSelected,
                                        QUOTE_AUTHORIZED_DATA,
                                        QUOTE_UNAUTHORIZED_DATA
                                    )
                                }
                                type="radio"
                            />
                            <label className="border radio-button__option" htmlFor={label}>
                                {label}
                                <img
                                    id={id}
                                    className="w-5.5 h-5.5 cursor-pointer"
                                    src={informationIcon}
                                    alt="Information"
                                    {...mouseProps}
                                />
                            </label>
                        </div>
                    ))}
                </fieldset>
                <Tooltip
                    anchorEl={anchorEl}
                    iconName="infoBlue"
                    title={`${tooltipData?.label}:`}
                    description={tooltipData?.description}
                />
            </div>
            <fieldset className="flex flex-col gap-y-4.5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                        {authorizePersonalData ? (
                            <>
                                <WrapperInput
                                    id={generateId({
                                        module: ModuleApp.QUOTES,
                                        submodule: `invoice-client-name`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
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
                                        onChange={({ value }): void => handleClientSelection(value, formData, updateFormData)}
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
                                    submodule: `invoice-client-name`,
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
                                module: ModuleApp.QUOTES,
                                submodule: `invoice-client`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.BTN,
                            })}
                            type="button"
                            className="p-0 mt-2 transition-colors bg-transparent border-0 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed quote-form-client-button"
                            onClick={(): void => openForm(FormQuery.Client)}
                            disabled={!authorizePersonalData || disabledInputs}
                            {...buttonHoverHandlers}
                        >
                            +Agregar cliente
                        </button>
                    </div>
                    <div>
                        <ConditionalFieldInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `invoice-document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            condition={authorizePersonalData}
                            labelText="Tipo de documento:"
                            classesWrapper="form-field"
                            disabled
                            tooltipData={TOOLTIP_DATA[FieldName.DocumentType]}
                            selectProps={{
                                value: documentType,
                            }}
                            textProps={{
                                value: formData?.[FieldName.DocumentType],
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                        <ConditionalFieldInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `invoice-document-number`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            condition={authorizePersonalData}
                            labelText="Número de documento:"
                            classesWrapper="form-field"
                            disabled
                            tooltipData={TOOLTIP_DATA[FieldName.DocumentNumber]}
                            selectProps={{
                                value: client?.document_number || '',
                            }}
                            textProps={{
                                value: formData?.[FieldName.DocumentNumber],
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <ConditionalFieldInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `invoice-taxpayer-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            condition={authorizePersonalData}
                            labelText="Tipo de contribuyente:"
                            classesWrapper="form-field"
                            disabled
                            tooltipData={TOOLTIP_DATA[FieldName.PersonType]}
                            selectProps={{
                                value: formData?.clientInfo?.taxpayerTypeName || client?.type_taxpayer_name || '',
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
                            submodule: `invoice-payment-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="*Forma de pago:"
                        options={payment_types}
                        classesWrapper="form-field"
                        optionSelected={(option: IGenericRecord): void =>
                            handleOptionChange(option, FieldName.PaymentType, formData, updateFormData)
                        }
                        name={FieldName.PaymentType}
                        value={formData?.[FieldName.PaymentType]}
                        required={validate && !formData?.[FieldName.PaymentType]}
                        disabled={disabledInputs}
                        {...TOOLTIP_DATA[FieldName.PaymentType]}
                    />
                    {formData?.[FieldName.PaymentType] === CREDIT && (
                        <CreditCollection data={formData} updateData={updateFormData} validate={validate} />
                    )}
                </div>
                <div className="flex flex-col lg:flex-row gap-x-7 gap-y-6">
                    <div className="flex-1">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `invoice-payment-method`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Medio de pago:"
                            optionSelect={payment_methods?.map((item: IGenericRecord) => ({ ...item, value: item.id }))}
                            classesWrapper="form-field"
                            onChangeSelect={(option, nameData): void =>
                                handlePaymentMethodChange(option, nameData, formData, updateFormData)
                            }
                            name={FieldName.PaymentMethod}
                            valueSelect={
                                formData?.[FieldName.PaymentMethod] === 'Instrumento no definido' ||
                                !formData?.[FieldName.PaymentMethod]?.trim()
                                    ? ''
                                    : formData?.[FieldName.PaymentMethod]
                            }
                            placeholder="Seleccionar"
                            disabled={disabledInputs}
                            disableSearch
                            {...TOOLTIP_DATA[FieldName.PaymentMethod]}
                        />
                    </div>
                    <div className="flex-1">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.QUOTES,
                                submodule: `invoice-foreign-exchange`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="*Divisa:"
                            optionSelect={foreign_exchange?.map((item: IGenericRecord) => ({ ...item, value: item.id }))}
                            classesWrapper="form-field"
                            valueSelect={formData?.[FieldName.ForeignExchangeId]}
                            onChangeSelect={(option, nameData): void =>
                                handleForeignExchangeChange(option, nameData, formData, updateFormData)
                            }
                            required={validate && !formData?.[FieldName.ForeignExchangeId]}
                            disabled={disabledInputs}
                            placeholder="Seleccionar"
                            {...TOOLTIP_DATA[FieldName.ForeignExchangeId]}
                        />
                    </div>
                </div>
                {formData?.[FieldName.ForeignExchangeId] && formData[FieldName.ForeignExchangeId] !== COLOMBIAN_CURRENCY_ID && (
                    <div className="flex flex-col lg:flex-row gap-x-7 gap-y-6">
                        <div className="flex-1">
                            <MoneyInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `invoice-foreign-exchange-rate`,
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
                                maxLength={MaxLengthFields.FOREIGN_EXCHANGE_RATE}
                            />
                        </div>
                        <div className="flex-1"></div>
                    </div>
                )}
            </fieldset>

            <CollapseJsx
                title="Información opcional"
                wrapperClass="margin-8 mt-8"
                data={
                    <div className="quote-generate__optional-fields quote-generate__optional-fields--active">
                        <div className="quote-generate__invoice-form quote-generate__invoice-form--group">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `invoice-purchase-order`,
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
                                    submodule: `invoice-sales-manager`,
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
                                    submodule: `invoice-sales-manager-document-type`,
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
                                onChangeSelect={(_, e): void =>
                                    updateFormData({
                                        ...formData,
                                        manager_document_type: e?.value || '',
                                        manager_document_type_id: e?.id || '',
                                    })
                                }
                                valueSelect={formData.manager_document_type || ''}
                                disabled={disabledInputs}
                                required={validate && !formData.manager_document_type}
                                classesWrapper="form-field"
                                placeholder="Seleccionar"
                                disableSearch
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `invoice-sales-manager-document-number`,
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
                                    updateFormData({ ...formData, manager_document_number: target.value })
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
