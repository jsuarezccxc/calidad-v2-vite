import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getClients } from '@redux/clients/actions';
import { getSuppliers } from '@redux/suppliers/actions';
import { getClientById } from '@redux/client-portal/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { closeTimePicker } from '@utils/TimePicker';
import { getRoute, getRouteName } from '@utils/Paths';
import { getDateAnyFormat, getHourValue } from '@utils/Date';
import { changeUltimateItem } from '@utils/ElectronicInvoice';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { validateLettersWithAccentAndSpecialCharacters } from '@utils/Validation';
import { buildClientOptions, buildOptions, buildOptionsPrefixes, buildOptionsSearch, buildSupplierOptions } from '@utils/Company';
import { ZERO } from '@pages/website-editor';
import { EMPTY, getTypeInvoice } from '@pages/correction-business-document';
import { addDaysDate, getPreviousDays } from '@utils/ElectronicInvoice';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import {
    CREDIT_PAYMENT,
    INVOICE_TYPES,
    MANDATE_ID,
    valueTitles,
} from '@pages/correction-documents-client-employer/components/electronic-document-correction';
import { CREDIT, DEBIT } from '@pages/correction-documents-client-employer/components/visualization-correction-document';
import { TableCorrection } from '@pages/correction-documents-client-employer/components/electronic-document-correction/TableCorrection';
import { TotalInvoiceTables } from '@pages/correction-documents-client-employer/components/electronic-document-correction/TotalInvoiceTable';
import usePermissions from '@hooks/usePermissions';
import useRadioButton from '@hooks/useRadioButton';
import useInvoiceHeader from '@hooks/useInvoiceHeader';
import useDigitVerification from '@hooks/useDigitVerification';
import { IValueTotals, useCorrection } from '@hooks/useCorrection';
import useFiscalResponsibilities from '@hooks/useFiscalResponsibility';
import { radioClientOptions } from '@information-texts/CreateElectronicInvoice';
import { PAGE_INFORMATION } from '@information-texts/CorrectCancelElectronicDocument';
import {
    CONSUMER_CLIENT_DOCUMENT,
    CUSTOMER_CONSUMER_DEFAULT,
    defaultStateSelectedTimepicker,
    radioButtonList,
    RadioButtonName,
    VALUE_ZERO,
    EMPTY_TABLE,
    RadioDaysCollectionType,
    INVOICE,
    COLOMBIAN_CURRENCY_ID,
} from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { NO, YES } from '@constants/RadioButtonOptions';
import { CURRENCY_TEXT } from '@constants/FieldsValidation';
import { FormNameInputs } from '@constants/CancellationElectronic';
import { LEGAL_PERSON, NATURAL_PERSON } from '@constants/DynamicRequest';
import {
    ChangeEvent,
    DEFAULT_REQUIRED_TEXT,
    DatePickerDayInput,
    MoneyInput,
    SelectInput,
    SelectSearchInput,
    TextInput,
    TimePicker,
} from '@components/input';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { Link, LinkColor } from '@components/button';
import { TableError } from '@components/table-error';
import { RadioButton } from '@components/radiobutton';
import InvoiceHeader from '@components/Invoice-header';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { TextNameTotals } from '@components/electronic-invoice';
import { dataFake, dataTaxes, initFields, initFieldsTaxTable, IElectronicDocumentProps } from '@components/electronic-document';
import '@components/electronic-document/ElectronicDocument.scss';
import { headersTable } from '../invoice-correction';
import {
    assignCustomerFields,
    assignValuesRadioButton,
    handleChangeClientOrSupplier,
    handleChangeSelect,
    handleChangeSelectMandate,
    handleErrorStock,
} from '.';
import './DocumentCorrection.scss';

const DocumentCorrection: React.FC<IElectronicDocumentProps> = ({
    addProductService = false,
    annulation = false,
    consecutive = 0,
    currentError = [],
    data_main_table = dataFake,
    data_taxes = dataTaxes,
    dataWithHoldings = [],
    editableTotals = false,
    fieldInputs = {},
    fields = initFields,
    fields_tax_table = initFieldsTaxTable,
    fileLinkView,
    handleChangeBatchAndDate = (): void => {},
    handleDelete,
    handleTotals = (): void => {},
    ids = [],
    isAdjustmentNote = false,
    isClientNote = false,
    isInfoView = false,
    isInvoice = false,
    isSupportDocument = false,
    isSupportOrAdjustment = false,
    isViewTableTotals = false,
    onChangeProductTable = (): void => {},
    onChangeSelect = (): void => {},
    onChangeTaxes = (): void => {},
    onChangeWarehouse = (): void => {},
    oneProductTable = false,
    optionsWithHoldings = [],
    route = '#',
    routeOnClick = (): void => {},
    selectFile = {},
    sendInvoice = false,
    setCurrentError = (): void => {},
    setFieldInputs = (): void => {},
    setSelectedId = [],
    setSelectFile = (): void => {},
    setTableData,
    tableErrors = [],
    textRoute = '',
    totalValues = false,
    typeNote = '',
    validateClickTimePicker = false,
    valuesTotal,
    valueTotals = [],
    symbol,
}) => {
    const [location, { handleChangeTime, handleChangeDate, formatPreviousDate, handleChange, formatValueTitles }] = [
        useLocation(),
        useCorrection(),
    ];
    const {
        centerColumn,
        leftColumn,
        propsInput: { valueSelect, ...propsInput },
    } = useInvoiceHeader();

    const { AuthorizedInformation, InvoiceEmail, IsElectronicCustomer, SendProducts } = RadioButtonName;
    const {
        products,
        storePrefix: prefixes,
        utilsData,
        currentErrors,
        document: invoiceCorrection,
        clients: { data: clients },
        suppliers: { data: suppliers },
        clientSelected,
    } = useSelector(
        ({
            suppliers,
            electronicInvoice,
            correctionBusinessDocument,
            cancellationElectronicDocuments,
            clients,
            clientPortal,
        }: RootState) => ({
            ...clients,
            ...suppliers,
            ...electronicInvoice,
            ...correctionBusinessDocument,
            ...cancellationElectronicDocuments,
            clientSelected: clientPortal.clientSelected,
        })
    );

    const dispatch = useDispatch();
    const history = useHistory();

    const [timePicker, setTimePicker] = useState<boolean>(false);
    const [clickTimePicker, setClickTimePicker] = useState(defaultStateSelectedTimepicker);
    const [dataTotals, setDataTotals] = useState<IValueTotals[]>([]);
    const { setTaxpayerSelected } = useFiscalResponsibilities(fieldInputs?.fiscal_responsibility?.value || []);
    const { getPermissions, disabledInputs } = usePermissions();
    const DoYouHaveWarehouse = getPermissions(getRouteName(Routes.HOME), getRouteName(Routes.HOME));
    const { radioButtons, changeRadioButton, handleRadioButton, setRadioButtons } = useRadioButton(radioButtonList);
    const authorizedInformation = radioButtons[AuthorizedInformation];
    const {
        multiDigitVerification,
        handleInitMulti,
        handleChangeSelect: handleChangeOption,
        handleChangeText,
    } = useDigitVerification('', '', {
        customer: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldInputs?.customer_document_type?.value,
            numberDocument: fieldInputs?.customer_document_number?.value,
        },
        seller: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldInputs?.seller_type_document?.value,
            numberDocument: fieldInputs?.seller_document_number?.value,
        },
    });

    const { isDebitNote, isCreditNote } = useMemo(
        () => ({ isDebitNote: typeNote === DEBIT, isCreditNote: typeNote === CREDIT }),
        [typeNote]
    );
    const isPaymentCredit = useMemo(() => fieldInputs?.payment_type?.id === CREDIT_PAYMENT, [fieldInputs?.payment_type?.id]);
    const isElectronicCustomer = useMemo(() => radioButtons[IsElectronicCustomer] === YES, [radioButtons[IsElectronicCustomer]]);
    const isNaturalPerson = useMemo(() => fieldInputs?.type_taxpayer?.value === NATURAL_PERSON, [
        fieldInputs?.type_taxpayer?.value,
    ]);
    const validateReasonRejection = useMemo((): string => {
        const rejectedInvoice = invoiceCorrection?.rejected_invoices ?? {};
        if (Array.isArray(rejectedInvoice) && lengthGreaterThanZero(rejectedInvoice)) {
            const [firstRejectedInvoice] = rejectedInvoice;
            return firstRejectedInvoice.reason_rejection_description ?? '';
        }
        return rejectedInvoice.reason_rejection_description ?? '';
    }, [invoiceCorrection?.rejected_invoices]);

    useEffect(() => {
        dispatch(getClients());
        dispatch(getSuppliers(true));
        closeTimePicker(setTimePicker);
        return (): void => {
            closeTimePicker(setTimePicker);
        };
    }, []);

    useEffect(() => {
        handleInitMulti();
    }, [fieldInputs]);

    useEffect(() => {
        if (!isClientNote && fieldInputs.reload) {
            setRadioButtons({
                ...radioButtons,
                [AuthorizedInformation]: fieldInputs?.is_authorization_information ? YES : NO,
                [IsElectronicCustomer]: fieldInputs?.electronic_biller ? YES : NO,
                [InvoiceEmail]: fieldInputs?.electronic_biller ? (fieldInputs?.receive_email ? YES : NO) : NO,
                [SendProducts]: fieldInputs?.receive_products ? YES : NO,
            });
            setTaxpayerSelected(fieldInputs?.type_taxpayer?.value);
        }
    }, [isClientNote, fieldInputs?.reload]);

    useEffect(() => {
        assignValuesRadioButton(radioButtons, changeRadioButton, setFieldInputs, fieldInputs);
    }, [radioButtons]);

    useEffect(() => {
        if (!isClientNote && !isSupportOrAdjustment) {
            if (!fieldInputs?.is_authorization_information) {
                setFieldInputs({
                    ...fieldInputs,
                    customer_document_type: {
                        ...fieldInputs.customer_document_type,
                        id: CUSTOMER_CONSUMER_DEFAULT.person.document_type,
                        value: CUSTOMER_CONSUMER_DEFAULT.person.document_name,
                    },
                    customer_name: {
                        ...fieldInputs.customer_name,
                        value: CUSTOMER_CONSUMER_DEFAULT.name,
                    },
                    customer_document_number: {
                        ...fieldInputs.customer_document_number,
                        value: CUSTOMER_CONSUMER_DEFAULT.person.document_number,
                    },
                    tax_detail: {
                        ...fieldInputs.tax_detail,
                        id: CUSTOMER_CONSUMER_DEFAULT.tax_details_code,
                        value: CUSTOMER_CONSUMER_DEFAULT.tax_details_name,
                    },
                    fiscal_responsibility: {
                        value: CUSTOMER_CONSUMER_DEFAULT.person.fiscal_resposibilities,
                    },
                });
            } else {
                assignCustomerFields(invoiceCorrection, setFieldInputs, fieldInputs);
            }
        }
    }, [fieldInputs?.is_authorization_information]);

    useEffect(() => {
        if (
            fieldInputs?.customer_document_number?.value === CONSUMER_CLIENT_DOCUMENT &&
            fieldInputs?.type_taxpayer?.value === LEGAL_PERSON
        ) {
            assignCustomerFields(invoiceCorrection, setFieldInputs, fieldInputs);
        }
    }, [fieldInputs?.type_taxpayer?.value, fieldInputs?.customer_document_number?.value]);

    useEffect(() => {
        setFieldInputs({
            ...fieldInputs,
            collection_days: {
                ...fieldInputs.collection_days,
                value: isPaymentCredit ? fieldInputs.collection_days?.value : '',
                required: isPaymentCredit && lengthEqualToZero(fieldInputs.collection_days?.value),
            },
            days_collection_type: {
                ...fieldInputs.days_collection_type,
                value: isPaymentCredit ? fieldInputs.days_collection_type?.value : '',
            },
        });
    }, [fieldInputs?.payment_type?.id, isPaymentCredit]);

    useEffect(() => {
        fieldInputs?.seller_type_document?.value &&
            setFieldInputs({
                ...fieldInputs,
                seller_document_number: {
                    ...fieldInputs.seller_document_number,
                    required: true,
                },
            });
    }, [fieldInputs?.seller_type_document?.value]);

    useEffect(() => {
        setFieldInputs({
            ...fieldInputs,
            invoice_number: consecutive || '',
        });
    }, [consecutive]);

    useEffect(() => {
        const withoutReteica = valueTitles?.filter(item => item.field !== TextNameTotals.RETE_ICA) ?? [];
        const currentTitles = isSupportDocument || isAdjustmentNote ? withoutReteica : valueTitles;
        setDataTotals(formatValueTitles(currentTitles, valueTotals));
    }, [valueTotals]);

    useEffect(() => {
        if (isElectronicCustomer && radioButtons[InvoiceEmail] === NO) {
            setFieldInputs({ ...fieldInputs, receive_email: true });
            handleRadioButton(InvoiceEmail, YES);
        }
    }, [radioButtons[IsElectronicCustomer], isElectronicCustomer]);

    useEffect(() => {
        setFieldInputs({ ...fieldInputs, lang: valueSelect });
    }, [valueSelect]);

    useEffect(() => {
        if (fieldInputs?.is_authorization_information && fieldInputs?.client_id) dispatch(getClientById(fieldInputs?.client_id));
    }, [fieldInputs?.client_id]);

    useEffect(() => {
        if (fieldInputs?.is_authorization_information && clientSelected)
            setFieldInputs({ ...fieldInputs, person: clientSelected?.customer?.person });
    }, [clientSelected]);

    return (
        <>
            <div className="wrapper-errors-table">
                <Table
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `document-correction`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isNew
                    headersTable={headersTable}
                    data={[]}
                    className="text-sm"
                    customTable
                >
                    {currentErrors
                        ?.filter((error: IGenericRecord) => !error.corrected)
                        .map((correction: IGenericRecord, index: number) => (
                            <tr
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-${index}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={index}
                            >
                                <td
                                    className={`border-b h-10 border-gray ${
                                        (index + 1) % 2 === 0 ? 'bg-gray-light' : 'bg-white'
                                    }`}
                                >
                                    <Text
                                        text={
                                            correction?.code
                                                ? `${correction.code} - ${correction.description}`
                                                : correction.description
                                        }
                                        type="text"
                                        editTable={false}
                                        disabled
                                        onChange={(): void => {}}
                                        className="px-2 lg:h-10"
                                    />
                                </td>
                            </tr>
                        ))}
                </Table>
            </div>
            {(isClientNote || isAdjustmentNote) && (
                <div className="flex flex-wrap lg:w-175 w-76 mb-7">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `document-correction-type-note`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        value={getTypeInvoice(invoiceCorrection?.invoice_type).type}
                        classesWrapper="w-73 xs:w-full lg:mr-7 mb-4.5"
                        classesWrapperInput="border-none"
                        labelText="Tipo de nota:"
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `document-correction-rejected`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="w-73 xs:w-full mb-4.5"
                        value={invoiceCorrection?.number}
                        classesWrapperInput="border-none"
                        labelText="Documento rechazado"
                        disabled
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `document-correction-reason`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        descTooltip={PAGE_INFORMATION[invoiceCorrection?.invoice_type].REASON}
                        classesWrapperInput="border-none"
                        value={validateReasonRejection}
                        classesWrapper="w-73 xs:w-full"
                        titleTooltip="Motivo:"
                        labelText="*Motivo:"
                        tooltipInfo
                        disabled
                    />
                </div>
            )}
            <InvoiceHeader
                propsInput={{ ...propsInput, valueSelect }}
                centerColumn={centerColumn({ documentType: invoiceCorrection?.invoice_type })}
                leftColumn={leftColumn()}
                cardFile={{ file: selectFile.logo, updateFile: (logo): void => setSelectFile({ logo, urlLogo: '' }) }}
                dates={{
                    transmission: getDateAnyFormat(invoiceCorrection?.date),
                    hour: invoiceCorrection?.time_issue,
                    expiration: getDateAnyFormat(invoiceCorrection?.date_limit),
                }}
                invoiceType={invoiceCorrection?.invoice_type}
            />
            <p className="mt-2 mb-4.5 text-tiny text-blue">
                La fecha y hora de transmisión de la factura electrónica se genera al momento de hacer click en Guardar al final
                de esta pantalla.
            </p>
            <div className="document-correction-body">
                <h3 className="font-bold font-allerbold text-blue">{getTypeInvoice(invoiceCorrection?.invoice_type).type}</h3>
                <div className={`mt-4.5 flex flex-col justify-between w-full electronic-document ${isInfoView && '-mb-4.5'}`}>
                    <Form>
                        <>
                            <div className="section-content">
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction-prefix`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    disabled
                                    selectIconType="arrowDownGreen"
                                    classesWrapper="w-73"
                                    options={buildOptionsPrefixes(prefixes)}
                                    value={fieldInputs?.prefix?.value}
                                    placeholder="Seleccionar"
                                    labelText={`*Prefijo ${
                                        isClientNote || isAdjustmentNote
                                            ? isDebitNote
                                                ? 'nota débito:'
                                                : isCreditNote
                                                ? 'nota crédito:'
                                                : 'nota de ajuste'
                                            : ''
                                    } `}
                                    optionSelected={(option): void =>
                                        handleChangeSelect(
                                            option,
                                            fieldInputs,
                                            setFieldInputs,
                                            utilsData,
                                            isDebitNote,
                                            setTaxpayerSelected,
                                            FormNameInputs.PREFIX
                                        )
                                    }
                                    required={sendInvoice && fieldInputs?.prefix?.required}
                                    tooltipInfo
                                    titleTooltip="Prefijo:"
                                    descTooltip="es un identificador de documentos de cuatro caracteres alfanuméricos."
                                />
                                {isInvoice ? (
                                    <SelectInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `document-correction-type-invoice`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        disabled={disabledInputs}
                                        labelText="*Tipo de factura"
                                        value={
                                            INVOICE_TYPES.find(type => type.id === fieldInputs?.operation_type_id?.value)?.value
                                        }
                                        options={INVOICE_TYPES}
                                        selectIconType="arrowDownGreen"
                                        classesWrapper="w-73"
                                        optionSelected={(option): void =>
                                            handleChangeSelectMandate(option, fieldInputs, setFieldInputs, 'operation_type_id')
                                        }
                                        tooltipInfo
                                        titleTooltip="Tipo de factura:"
                                        descTooltip={
                                            <>
                                                <p className="mt-0.5 mb-1 text-blue text-sm">
                                                    <span className="font-allerbold">Estándar:</span>&nbsp; Documento comercial
                                                    generado por un vendedor como prueba de la venta de bienes o servicios a un
                                                    comprador.
                                                </p>
                                                <p className="text-sm text-blue">
                                                    <span className="font-allerbold">Mandato: </span>&nbsp; Documento que se
                                                    transmite cuando una persona o empresa realiza una compra o contrata un
                                                    servicio en nombre de otra.
                                                </p>
                                            </>
                                        }
                                    />
                                ) : (
                                    isClientNote && (
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-type-invoice`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            disabled
                                            classesWrapperInput="border-none"
                                            labelText="*Tipo de factura"
                                            value={
                                                INVOICE_TYPES.find(type => type.id === fieldInputs?.operation_type_id?.value)
                                                    ?.value
                                            }
                                            tooltipInfo
                                            titleTooltip="Tipo de factura:"
                                            descTooltip={
                                                <>
                                                    <p className="mt-0.5 mb-1 text-blue text-sm">
                                                        <span className="font-allerbold">Estándar:</span>&nbsp; Documento
                                                        comercial generado por un vendedor como prueba de la venta de bienes o
                                                        servicios a un comprador.
                                                    </p>
                                                    <p className="text-sm text-blue">
                                                        <span className="font-allerbold">Mandato: </span>&nbsp; Documento que se
                                                        transmite cuando una persona o empresa realiza una compra o contrata un
                                                        servicio en nombre de otra.
                                                    </p>
                                                </>
                                            }
                                        />
                                    )
                                )}
                                {(isClientNote || isAdjustmentNote) && (
                                    <TextInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `document-correction-prefix-invoice-document-support`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        value={fieldInputs.associated_document_prefix}
                                        labelText={
                                            isAdjustmentNote
                                                ? 'Prefijo documento soporte asociado:'
                                                : 'Prefijo factura electrónica asociada:'
                                        }
                                        classesWrapperInput="border-none"
                                        name="associated_document_prefix"
                                        classesWrapper="xs:w-full w-73"
                                        placeholder="Input default"
                                        disabled
                                        tooltipInfo
                                        titleTooltip="Prefijo documento soporte asociado:"
                                        descTooltip={
                                            isAdjustmentNote
                                                ? 'es un identificador de documento soporte de cuatro caracteres alfanuméricos.'
                                                : 'es un identificador de facturas electrónicas de venta de cuatro caracteres alfanuméricos.'
                                        }
                                    />
                                )}

                                {!isSupportOrAdjustment && (
                                    <div className="group-inputs">
                                        <div className="flex flex-col">
                                            <p className="mb-2 font-bold font-allerbold text-gray-dark">
                                                *Seleccione la opción que aplique para su cliente:
                                            </p>
                                            {isNaturalPerson && (
                                                <div className="content-group-checkbox">
                                                    <RadioButton
                                                        moduleId={ModuleApp.ELECTRONIC_DOCUMENTS}
                                                        classesContainer="content-radio-input__direction"
                                                        classesLabel="content-radio-input__input-size-auto"
                                                        classesRadioButton="not-margin"
                                                        setSelected={(e): void => handleRadioButton(AuthorizedInformation, e)}
                                                        entities={radioClientOptions}
                                                        selected={authorizedInformation}
                                                        linkerId={AuthorizedInformation}
                                                        sizeLabel="xs"
                                                        disabled={disabledInputs}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(isClientNote || isAdjustmentNote) && (
                                    <div className="group-inputs-date">
                                        <DatePickerDayInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-date-issue`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            classesWrapper="w-44.27 xs:w-full"
                                            labelText="Fecha de transmisión de la factura electrónica:"
                                            classesWrapperInput="border-none"
                                            selected={fieldInputs?.date_issue}
                                            onChangeDate={(e): void =>
                                                handleChangeDate(e, FormNameInputs.DATE_ISSUE, setFieldInputs, fieldInputs)
                                            }
                                            name={FormNameInputs.DATE_ISSUE}
                                            minDate={getPreviousDays()}
                                            maxDate={addDaysDate(9)}
                                            disabled
                                        />
                                        <div className="relative hidden flex-col w-44.27 xs:w-full">
                                            <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">
                                                *Hora de emisión de la nota:
                                            </label>
                                            <div
                                                className={`relative flex justify-center h-full p-1 border cursor-pointer rounded-md border-gray timepicker-handler ${
                                                    fields?.broadcast_time?.disabled
                                                        ? 'bg-gray-light border-none items-center'
                                                        : 'input--container'
                                                }`}
                                                onClick={
                                                    !fields?.broadcast_time?.disabled
                                                        ? (): void => setTimePicker(!timePicker)
                                                        : (): void => {}
                                                }
                                            >
                                                <span className="relative mr-2 text-sm text-gray-dark timepicker-handler right-1">
                                                    {getHourValue(fieldInputs?.broadcast_time?.hour || 0)}:
                                                    {getHourValue(fieldInputs?.broadcast_time?.minutes || 0)}:
                                                    {getHourValue(fieldInputs?.broadcast_time?.seconds || 0)} &nbsp;
                                                    {fieldInputs?.broadcast_time?.schedule}
                                                </span>

                                                <Icon
                                                    name="arrowDownGray"
                                                    className={`transition duration-200 transform cursor-pointer timepicker-handler absolute right-0 ${
                                                        validateClickTimePicker || timePicker ? 'rotate-180' : 'rotate-0'
                                                    }`}
                                                />
                                            </div>
                                            <TimePicker
                                                className={`transition duration-200 absolute notifications-top -right-6 xs:-right-0 ${
                                                    validateClickTimePicker || !timePicker ? 'hidden' : 'block'
                                                } z-50`}
                                                time={fieldInputs?.broadcast_time}
                                                setTime={(e): void =>
                                                    handleChangeTime(e, 'broadcast_time', setFieldInputs, fieldInputs)
                                                }
                                                setClickTimePicker={setClickTimePicker}
                                                clickTimePicker={clickTimePicker}
                                                showSeconds
                                            />
                                        </div>

                                        <DatePickerDayInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-date-due`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            classesWrapper="w-38 xs:w-full"
                                            labelText="Fecha de vencimiento de la factura electrónica:"
                                            classesWrapperInput="border-none"
                                            selected={fieldInputs?.due_date}
                                            onChangeDate={(e): void =>
                                                handleChangeDate(e, FormNameInputs.DUE_DATE, setFieldInputs, fieldInputs)
                                            }
                                            minDate={formatPreviousDate(fieldInputs.date_issue)}
                                            showPlaceHolderDate
                                            disabled
                                        />
                                    </div>
                                )}
                                <div className="section-content">
                                    <div className="group-inputs">
                                        {isClientNote || isAdjustmentNote ? (
                                            <TextInput
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `document-correction-customer-supplier`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                classesWrapper="w-73 xs:w-full"
                                                labelText={isAdjustmentNote ? '*Proveedor:' : 'Nombre del cliente o empresa:'}
                                                classesWrapperInput="border-none"
                                                value={
                                                    isAdjustmentNote
                                                        ? fieldInputs?.supplier_name?.value
                                                        : fieldInputs?.customer_name?.value
                                                }
                                                name="customer_name"
                                                disabled
                                                tooltipInfo
                                                titleTooltip={isAdjustmentNote ? 'Proveedor:' : 'Cliente:'}
                                                descTooltip={
                                                    isAdjustmentNote
                                                        ? 'es el nombre del proveedor que le genera la factura de compra.'
                                                        : 'es el nombre del cliente.'
                                                }
                                            />
                                        ) : (
                                            <div className="flex flex-col">
                                                <SelectInput
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `document-correction-supplier-customer`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.DRP,
                                                    })}
                                                    classesWrapper="w-73 xs:w-full"
                                                    labelText={isSupportDocument ? '*Proveedor:' : '*Cliente:'}
                                                    placeholder="Seleccionar"
                                                    options={
                                                        isSupportOrAdjustment
                                                            ? buildSupplierOptions(suppliers)
                                                            : buildClientOptions(clients)
                                                    }
                                                    optionSelected={(option): void =>
                                                        handleChangeClientOrSupplier(
                                                            option,
                                                            setFieldInputs,
                                                            isSupportDocument ? suppliers : clients,
                                                            fieldInputs,
                                                            isSupportDocument
                                                        )
                                                    }
                                                    classesWrapperInput={authorizedInformation === NO ? 'border-none' : ''}
                                                    value={
                                                        isSupportDocument
                                                            ? fieldInputs?.supplier_name?.value
                                                            : fieldInputs?.customer_name?.value
                                                    }
                                                    onChange={(e): void => handleChange(e, setFieldInputs, fieldInputs, true)}
                                                    onKeyDown={(e): void => validateLettersWithAccentAndSpecialCharacters(e)}
                                                    name={isSupportDocument ? 'supplier_name' : 'customer_name'}
                                                    disabled={authorizedInformation === NO || disabledInputs}
                                                    tooltipInfo
                                                    titleTooltip={isSupportDocument ? 'Proveedor:' : 'Cliente:'}
                                                    descTooltip={
                                                        isSupportDocument
                                                            ? 'es el nombre del proveedor que le genera la factura de compra.'
                                                            : 'es el nombre del cliente.'
                                                    }
                                                    selectIconType="arrowDownGreen"
                                                />
                                                {(isSupportDocument || isInvoice) && (
                                                    <p
                                                        className="mt-2 underline cursor-pointer text-green"
                                                        onClick={(): void =>
                                                            history.push(
                                                                isSupportDocument
                                                                    ? `${getRoute(Routes.GENERATE_SUPPORT_DOCUMENT)}?view=true`
                                                                    : `${getRoute(Routes.GENERATE_SALES_INVOICE)}?form=client`
                                                            )
                                                        }
                                                    >
                                                        {isSupportDocument ? '+Agregar proveedor' : '+Agregar cliente'}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-type-document`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="*Tipo de documento:"
                                            placeholder="Seleccionar"
                                            classesWrapperInput="border-none"
                                            options={buildOptions(utilsData?.document_types)}
                                            value={fieldInputs?.customer_document_type?.value}
                                            classesWrapper="w-73 xs:w-full"
                                            name="customer_document_type"
                                            disabled
                                            tooltipInfo
                                            titleTooltip="Tipo de documento:"
                                            descTooltip="es el tipo de identificación del cliente."
                                        />
                                    </div>
                                    <div className="group-inputs">
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-number-document`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="*Número de documento:"
                                            classesWrapperInput="border-none"
                                            placeholder="..."
                                            value={fieldInputs?.customer_document_number?.value}
                                            classesWrapper="w-73 xs:w-full"
                                            name="customer_document_number"
                                            required={fieldInputs?.customer_document_number?.required}
                                            disabled
                                            tooltipInfo
                                            titleTooltip="Número de documento:"
                                            descTooltip="es el número de identificación del proveedor. "
                                        />
                                        <div className={!isClientNote ? '' : 'hidden'}>
                                            <TextInput
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `document-correction-type-taxpayer`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                labelText="*Tipo de contribuyente:"
                                                classesWrapperInput="border-none"
                                                disabled
                                                value={fieldInputs?.type_taxpayer?.value}
                                                classesWrapper="w-73 xs:w-full"
                                                placeholder="Seleccionar"
                                                name="type_taxpayer"
                                                tooltipInfo
                                                titleTooltip="Tipo de contribuyente:"
                                                descTooltip={
                                                    <ul className="ml-4 list-disc">
                                                        <li className="mb-2 text-blue">
                                                            <span className="font-allerbold ">Persona natural:</span> cuando el
                                                            proveedor actúa a título personal.
                                                        </li>
                                                        <li className="text-blue">
                                                            <span className="font-allerbold">Persona jurídica:</span> cuando el
                                                            proveedor actúa en representación de una sociedad conformada por una o
                                                            mas personas.
                                                        </li>
                                                    </ul>
                                                }
                                            />
                                        </div>
                                    </div>
                                    {isSupportOrAdjustment && (
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-invoice-number-supplier`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="Número de la cuenta de cobro o documento equivalente por el proveedor:"
                                            classesWrapperInput={isAdjustmentNote ? 'border-none' : ''}
                                            disabled={isAdjustmentNote || disabledInputs}
                                            value={fieldInputs?.invoice_number_supplier?.value}
                                            classesWrapper="w-73 xs:w-full invoice--number__supplier"
                                            placeholder="Seleccionar"
                                            name="invoice_number_supplier"
                                            onChange={(e): void => handleChange(e, setFieldInputs, fieldInputs, true)}
                                            tooltipInfo
                                            titleTooltip="Número de la cuenta de cobro o documento equivalente por el proveedor:"
                                            descTooltip="es el consecutivo de la factura que le emitió su proveedor por los servicios/productos adquiridos."
                                        />
                                    )}
                                    {isClientNote && (
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `document-correction-name-legal-representative`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            value={fieldInputs?.name_legal_representative}
                                            labelText="Nombre del representante legal:"
                                            classesWrapper="w-73 xs:w-full"
                                            placeholder="..."
                                            disabled
                                        />
                                    )}
                                    <div className="section-content">
                                        <div className="group-inputs">
                                            <SelectInput
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `document-correction-payment-types`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                classesWrapper="w-73 xs:w-full"
                                                classesWrapperInput={isClientNote || isAdjustmentNote ? 'border-none' : ''}
                                                labelText="*Forma de pago:"
                                                placeholder="Crédito"
                                                options={buildOptions(utilsData?.payment_types)}
                                                value={fieldInputs?.payment_type?.value}
                                                optionSelected={(option): void =>
                                                    handleChangeSelect(
                                                        option,
                                                        fieldInputs,
                                                        setFieldInputs,
                                                        utilsData,
                                                        isDebitNote,
                                                        setTaxpayerSelected,
                                                        'payment_type'
                                                    )
                                                }
                                                name="payment_type"
                                                required={fieldInputs?.payment_type?.required}
                                                disabled={disabledInputs || annulation || isClientNote || isAdjustmentNote}
                                                selectIconType={
                                                    isClientNote || isAdjustmentNote ? 'arrowDownGray' : 'arrowDownGreen'
                                                }
                                                tooltipInfo
                                                titleTooltip="Forma de pago:"
                                                descTooltip={
                                                    <ul className="ml-4 list-disc">
                                                        <li className="mb-2 text-blue">
                                                            <span className="font-allerbold ">Crédito:</span> es la modalidad de
                                                            pago que se hace efectivo en un periodo de tiempo diferente al día en
                                                            el que se realiza la compra.
                                                        </li>
                                                        <li className="text-blue">
                                                            <span className="font-allerbold">Contado:</span> es la modalidad de
                                                            pago que se hace efectivo en el mismo instante que se realiza la
                                                            compra.
                                                        </li>
                                                    </ul>
                                                }
                                            />
                                            {isPaymentCredit && !isClientNote && !isAdjustmentNote && (
                                                <div className="flex gap-x-7">
                                                    <TextInput
                                                        id={generateId({
                                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                            submodule: `document-correction-collection-days`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        labelText="*Días de cobro:"
                                                        placeholder="Seleccionar"
                                                        value={fieldInputs?.collection_days?.value}
                                                        onChange={(e): void => handleChange(e, setFieldInputs, fieldInputs, true)}
                                                        required={
                                                            isPaymentCredit &&
                                                            sendInvoice &&
                                                            fieldInputs?.collection_days?.required
                                                        }
                                                        disabled={disabledInputs}
                                                        classesWrapper="w-36 xs:w-full"
                                                        name="collection_days"
                                                    />
                                                    <div className="flex flex-col justify-end">
                                                        <RadioButton
                                                            moduleId={ModuleApp.ELECTRONIC_DOCUMENTS}
                                                            entities={RadioDaysCollectionType}
                                                            selected={fieldInputs?.days_collection_type?.value}
                                                            setSelected={(value): void =>
                                                                handleChange(
                                                                    {
                                                                        target: { value, name: 'days_collection_type' },
                                                                    } as ChangeEvent,
                                                                    setFieldInputs,
                                                                    fieldInputs,
                                                                    true
                                                                )
                                                            }
                                                            linkerId="days_collection_type"
                                                            disabled={disabledInputs}
                                                        />
                                                        {sendInvoice && fieldInputs?.days_collection_type?.required && (
                                                            <span className="text-tiny text-purple font-aller mt-1 mr-1.5 text-right">
                                                                {DEFAULT_REQUIRED_TEXT}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="group-inputs">
                                            <SelectInput
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `document-correction-payment-methods`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                labelText="Medio de pago:"
                                                options={buildOptions(changeUltimateItem(utilsData?.payment_methods))}
                                                value={fieldInputs?.way_pay?.value}
                                                optionSelected={(option): void =>
                                                    handleChangeSelect(
                                                        option,
                                                        fieldInputs,
                                                        setFieldInputs,
                                                        utilsData,
                                                        isDebitNote,
                                                        setTaxpayerSelected,
                                                        'way_pay'
                                                    )
                                                }
                                                classesWrapper="w-73 xs:w-full"
                                                classesWrapperInput={isClientNote || isAdjustmentNote ? 'border-none' : ''}
                                                disabled={disabledInputs || annulation || isClientNote || isAdjustmentNote}
                                                name="way_pay"
                                                selectIconType={
                                                    isClientNote || isAdjustmentNote ? 'arrowDownGray' : 'arrowDownGreen'
                                                }
                                                tooltipInfo
                                                titleTooltip="Medio de pago:"
                                                descTooltip="es el medio que se utiliza para pagar la factura."
                                            />
                                            <SelectSearchInput
                                                id={generateId({
                                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                    submodule: `document-correction-foreign-exchange`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                labelText="Divisa:"
                                                onChangeSelect={(option, item): void =>
                                                    handleChangeSelect(
                                                        option,
                                                        fieldInputs,
                                                        setFieldInputs,
                                                        utilsData,
                                                        isDebitNote,
                                                        setTaxpayerSelected,
                                                        'badge',
                                                        item
                                                    )
                                                }
                                                disabled={disabledInputs || isClientNote || isAdjustmentNote}
                                                optionSelect={
                                                    utilsData?.foreign_exchange
                                                        ? buildOptionsSearch(utilsData?.foreign_exchange)
                                                        : [{ name: fieldInputs?.badge?.name, value: fieldInputs?.badge?.value }]
                                                }
                                                classesWrapper="w-73 xs:w-full"
                                                classesWrapperInput={isClientNote || isAdjustmentNote ? 'border-none' : ''}
                                                valueSelect={fieldInputs?.badge?.value}
                                                name="badge"
                                                selectIconType="arrowDownGreen"
                                                tooltipInfo
                                                titleTooltip="*Divisa:"
                                                descTooltip="es la moneda con la que se va a expedir la factura de venta."
                                            />
                                        </div>
                                        {fieldInputs?.badge?.value !== COLOMBIAN_CURRENCY_ID && (
                                            <fieldset className="foreach-rate">
                                                <MoneyInput
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `document-correction-foreign-exchange-rate`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.TXT,
                                                    })}
                                                    required={sendInvoice && !fieldInputs?.foreign_exchange_rate}
                                                    value={fieldInputs?.foreign_exchange_rate || ''}
                                                    onChange={({ floatValue }): void =>
                                                        handleChange(
                                                            {
                                                                target: {
                                                                    name: 'foreign_exchange_rate',
                                                                    value: floatValue ?? '',
                                                                },
                                                            } as ChangeEvent,
                                                            setFieldInputs,
                                                            fieldInputs
                                                        )
                                                    }
                                                    labelText="*Tasa de cambio:"
                                                    classesWrapper=""
                                                    withIcon={false}
                                                />
                                                <span className="foreach-rate__message">{CURRENCY_TEXT}</span>
                                            </fieldset>
                                        )}
                                    </div>
                                </div>
                                <CollapseJsx
                                    title="Información opcional"
                                    wrapperClass="margin-8"
                                    data={
                                        <div className="sale-section-content -mt-4.5">
                                            <div className="group-inputs mb-4.5">
                                                <TextInput
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `document-correction-order-sales-manager`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.TXT,
                                                    })}
                                                    classesWrapper="w-73 xs:w-full"
                                                    labelText="Número de orden de compra:"
                                                    placeholder="..."
                                                    value={fieldInputs?.sales_manager}
                                                    onChange={(e): void => handleChange(e, setFieldInputs, fieldInputs, false)}
                                                    disabled={disabledInputs || fields?.sales_manager?.disabled}
                                                    name="sales_manager"
                                                />
                                                <TextInput
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `document-correction-sales-manager`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.TXT,
                                                    })}
                                                    classesWrapper="w-73 xs:w-full"
                                                    labelText="Encargado de la venta:"
                                                    placeholder="..."
                                                    value={fieldInputs?.sales_manager}
                                                    onChange={(e): void => handleChange(e, setFieldInputs, fieldInputs, false)}
                                                    disabled={disabledInputs || fields?.sales_manager?.disabled}
                                                    name="sales_manager"
                                                />
                                            </div>
                                            <div className="group-inputs">
                                                <SelectInput
                                                    id={generateId({
                                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                        submodule: `document-correction-seller-type-document`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.DRP,
                                                    })}
                                                    labelText="Tipo de documento encargado de venta:"
                                                    options={[
                                                        { key: EMPTY, value: EMPTY },
                                                        ...buildOptions(utilsData.document_types),
                                                    ]}
                                                    value={fieldInputs?.seller_type_document?.value}
                                                    optionSelected={(option): void => {
                                                        handleChangeSelect(
                                                            option,
                                                            fieldInputs,
                                                            setFieldInputs,
                                                            utilsData,
                                                            isDebitNote,
                                                            setTaxpayerSelected,
                                                            'seller_type_document'
                                                        );
                                                        handleChangeOption(option.value, 'seller');
                                                    }}
                                                    classesWrapper="xs:w-full w-73"
                                                    name="seller_type_document"
                                                    disabled={disabledInputs || fields?.seller_type_document?.disabled}
                                                    selectIconType="arrowDownGreen"
                                                />
                                                <div className="flex flex-row items-end">
                                                    <TextInput
                                                        id={generateId({
                                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                            submodule: `document-correction-seller-document-number`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        labelText="Número de documento encargado de la venta:"
                                                        placeholder="..."
                                                        value={fieldInputs?.seller_document_number?.value}
                                                        onChange={(e): void => {
                                                            handleChange(e, setFieldInputs, fieldInputs, true);
                                                            handleChangeText(e.target.value, 'seller');
                                                        }}
                                                        classesWrapper={`${
                                                            multiDigitVerification.seller.isTypeNit ? 'w-52.5' : 'w-73'
                                                        } xs:w-full`}
                                                        name="seller_document_number"
                                                        required={sendInvoice && fieldInputs?.seller_document_number?.required}
                                                        disabled={disabledInputs}
                                                    />
                                                    {multiDigitVerification.seller.isTypeNit && (
                                                        <TextInput
                                                            id={generateId({
                                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                                submodule: `document-correction-seller-dv`,
                                                                action: ActionElementType.INPUT,
                                                                elementType: ElementType.TXT,
                                                            })}
                                                            classesWrapper="ml-4.5 w-11.2"
                                                            labelText="DV:"
                                                            disabled
                                                            value={multiDigitVerification.seller.digitVerification}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        </>
                    </Form>
                    <p className="text-tiny text-blue mb-4.5">
                        La información puede ser editada ubicándose en el campo requerido. Si necesita eliminar un producto o
                        servicio, selecciónelo en las casillas ubicadas al lado izquierdo de la tabla y utilice el ícono de la
                        caneca.
                    </p>
                    <div className="flex flex-col">
                        {!annulation && !disabledInputs && (
                            <Icon name="trashBlue" hoverIcon="trashGreen" className="self-end mb-2" onClick={handleDelete} />
                        )}
                        <TableCorrection
                            symbol={symbol}
                            handleChangeBatchAndDate={handleChangeBatchAndDate}
                            handleChangeWarehouse={onChangeWarehouse}
                            handleChangeSelect={onChangeSelect}
                            handleChange={onChangeProductTable}
                            setSelected={setSelectedId}
                            optionsProducts={products}
                            sendInvoice={sendInvoice}
                            annulation={annulation}
                            data={data_main_table}
                            typeNote={typeNote}
                            selected={ids}
                            isInvoice={!isClientNote}
                            isCreditNote={isCreditNote}
                            invoiceDetails={invoiceCorrection?.invoice_details}
                            setTableData={setTableData}
                            isMandate={fieldInputs?.operation_type_id?.value === MANDATE_ID}
                        />
                        {sendInvoice && lengthEqualToZero(data_main_table) && <TableError customText={EMPTY_TABLE} />}
                        {oneProductTable && (
                            <TableError
                                customText={`*La ${
                                    typeNote !== INVOICE ? 'nota crédito/debito' : 'factura de venta'
                                } debe contener al menos un producto/servicio`}
                            />
                        )}
                        {sendInvoice && tableErrors && lengthGreaterThanZero(tableErrors) && (
                            <>{tableErrors[ZERO]?.error && <TableError customText={tableErrors[ZERO]?.error} />}</>
                        )}
                        {DoYouHaveWarehouse &&
                            handleErrorStock(data_main_table, products).map((message: string, index: number) => (
                                <TableError key={index + 'errorStock'} customText={message} />
                            ))}
                    </div>
                    {addProductService && (
                        <div className="mt-2 mb-4.5">
                            <Link
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-product-service`,
                                    action: ActionElementType.ADD,
                                    elementType: ElementType.LNK,
                                })}
                                href={`${location.pathname}${location.search}`}
                                text="+Agregar producto/servicio"
                                classes="text-base"
                                onClick={routeOnClick}
                                disabled={disabledInputs}
                            />
                        </div>
                    )}
                    <p className="text-blue">
                        Si no ha agregado un producto/servicio a su catálogo,{' '}
                        <span
                            onClick={(): void => history.push(getRoute(Routes.HOME))}
                            className="underline cursor-pointer text-purple"
                        >
                            haga click aquí.
                        </span>
                    </p>
                    <TotalInvoiceTables
                        symbol={symbol}
                        dataTaxes={data_taxes}
                        dataTotals={dataTotals}
                        fields_tax_table={fields_tax_table}
                        totalValues={totalValues}
                        handleTotals={handleTotals}
                        editableTotals={editableTotals}
                        onChangeProductTable={onChangeProductTable}
                        onChangeTaxes={onChangeTaxes}
                        annulation={annulation}
                        typeNote={typeNote}
                        dataWithholdings={dataWithHoldings}
                        isView={isViewTableTotals}
                        currentCountry={fieldInputs?.country?.name}
                        setCurrentError={setCurrentError}
                        currentError={currentError}
                        totalsValues={valuesTotal}
                        optionsWithHoldings={optionsWithHoldings}
                        fieldsInputs={fieldInputs}
                        setFieldInputs={setFieldInputs}
                        handleChange={handleChange}
                        fields={fields}
                    />
                    {fileLinkView && (
                        <div className="my-4">
                            <span className=" text-gray-dark">
                                Para visualizar el registro de sus archivos importados anteriormente,
                                <Link
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction`,
                                        action: ActionElementType.PREVIEW,
                                        elementType: ElementType.LNK,
                                    })}
                                    href={route}
                                    text="haga click aquí."
                                    classes="text-base"
                                    linkColor={LinkColor.PURPLE}
                                />
                            </span>
                        </div>
                    )}
                    {textRoute && (
                        <div className="my-4">
                            <span className=" text-gray-dark">
                                {textRoute}, &nbsp;
                                <Link
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction`,
                                        action: ActionElementType.REDIRECT,
                                        elementType: ElementType.LNK,
                                    })}
                                    href={route}
                                    onClick={routeOnClick}
                                    text="haga click aquí."
                                    classes="text-base"
                                    linkColor={LinkColor.PURPLE}
                                />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DocumentCorrection;
