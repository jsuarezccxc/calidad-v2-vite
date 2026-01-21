import React, { useEffect, useMemo, useState } from 'react';
import { SelectedOption } from 'react-select-search';
import { useDispatch, useSelector } from 'react-redux';
import { NumberFormatValues } from 'react-number-format';
import { ModalUpdateCustomer, ModalUpdateDocumentNumber, TableInvoice } from './components';
import {
    ChangeEvent,
    DEFAULT_REQUIRED_TEXT,
    DatePickerDayInput,
    IOptionSelect,
    MoneyInput,
    SelectInput,
    SelectSearchInput,
    TextArea,
    TextInput,
    TimePicker,
} from '@components/input';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { Paginator } from '@components/paginator';
import { IOption } from '@components/select-search';
import { Link, LinkColor } from '@components/button';
import { ModalType } from '@components/modal-custom';
import { TableError } from '@components/table-error';
import { RadioButton } from '@components/radiobutton';
import { TableTotals } from '@components/table-totals';
import { NotFindElements } from '@components/not-find-elements';
import { TableTaxRetention } from '@components/table-tax-retention';
import { typeRadioButtonBuy } from '@components/support-document-and-buy';
import { IProductDetail, getTimeIssue, quantityMaxProduct } from '@components/electronic-note';
import {
    MODAL_CONSECUTIVE_RESOLUTION,
    MODAL_RESOLUTION_EXPIRATION,
    PARAGRAPHS,
    TITLES_MODALS_RESOLUTION,
    authorizationInformation,
    instructionsForInvoice,
    questionsRadioButtonInvoice,
} from '@information-texts/CreateElectronicInvoice';
import { messageHour } from '@information-texts/ElectronicInvoice';
import { PRODUCT_SHIPPING } from '@information-texts/ProductShippingCost';
import { IGenericRecord } from '@models/GenericRecord';
import {
    IInvoiceDetails,
    ICalculateInvoice,
    KeysInvoiceCalculates,
    ITableTaxesAndRetention,
    IChangePercentageDiscount,
} from '@models/ElectronicInvoice';
import { RootState } from '@redux/rootReducer';
import { getClients } from '@redux/clients/actions';
import { getDynamicData } from '@redux/warehouses/actions';
import { getPaymentMethodsByType } from '@redux/report-document-payment/actions';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { getDepartmentsForCountry, getInformationCompany } from '@redux/company/actions';
import {
    getPrefixCompany,
    getUniqueProductStock,
    setCustomerByDocument,
    getInvoiceCalculations,
    setInvoiceCalculations,
    getInformationByIdentification,
} from '@redux/electronic-invoice/actions';
import { addDaysDate, getPreviousDays } from '@utils/ElectronicInvoice';
import {
    stringToFloat,
    assignDocument,
    discardUntaxed,
    updateTableTaxes,
    validateDateLimit,
    changeUltimateItem,
    validateTypeProduct,
    updateTableRetentions,
    getTotalsByInvoiceDetails,
    validateErrorStock,
} from '@utils/ElectronicInvoice';
import { assignValue } from '@utils/Json';
import { getRouteName } from '@utils/Paths';
import { getCurrency } from '@utils/ForeignExchange';
import { validateChangePercentage } from '@utils/Input';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { someArrayObject, sortArrayAlphabetically } from '@utils/Array';
import { lettersNumerics, numericsInput } from '@utils/SpecialCharacters';
import { formatInitialNumber } from '@utils/Decimals';
import { lengthEqualOne, lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { calculateVerificationDigit, discountOfValue, ivaDiscount } from '@utils/Number';
import { closeTimePicker, getTime, initTimeByTimePicker, ITime } from '@utils/TimePicker';
import { getDateFormatUnix, getDateFromUnix, getDaysFromTwoDates, getHourValue, getUnix, getUnixFromDate } from '@utils/Date';
import { validateLettersWithAccent, validateLettersWithAccentAndSpecialCharacters } from '@utils/Validation';
import {
    CIIU_ID_TWO,
    CLIENT,
    CONSUMER_CLIENT_DOCUMENT,
    DATA_TAXES,
    DATA_TOTAL_VALUES,
    dataRadioButton,
    defaultStateSelectedTimepicker,
    initialStateFiscalResponsibilities,
    MaxLengthFields,
    NA,
    QuoteToInvoiceKeys,
    radioButtonList,
    RadioButtonName,
    RadioDaysCollectionType,
    THREE_ZERO,
    TYPE_TAXPAYER,
    VALUE_ZERO,
    MAXIMUM_DIGITS,
    INVOICE_CALCULATES,
    TAXES_INVOICE,
} from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { PERCENTAGE } from '@constants/Tax';
import { PA } from '@constants/DocumentType';
import { COLOMBIA_ID } from '@constants/Location';
import { NO } from '@constants/RadioButtonOptions';
import { keysCustomerInvoice } from '@constants/Customer';
import { FOREIGN_EXCHANGE } from '@constants/UtilsConstants';
import { CONSUMPTION, ID, INC, IVA, TypeTransaction } from '@constants/BuildProduct';
import { LEGAL_PERSON, NATURAL_PERSON, OTHERS, SIMPLE_REGIMEN } from '@constants/DynamicRequest';
import useModal from '@hooks/useModal';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import useRadioButton, { IRadioButtons } from '@hooks/useRadioButton';
import useDigitVerification, { NIT } from '@hooks/useDigitVerification';
import useFiscalResponsibilities from '@hooks/useFiscalResponsibility';
import { useTextValidation } from './hooks/useTextValidation';
import {
    dynamicData,
    formatOptionsPrefix,
    IElectronicInvoiceProps,
    fieldsBody,
    initialDataTable,
    TypeNamesInputs,
    getDocumentTypeName,
    validateFieldsInputs,
    validateFormInputs,
    searchNameInput,
    getTotalBuy,
    TextPaymentTypes,
    TextNameTotals,
    formatTaxDetails,
    showMessageTableProducts,
    validatePercentageWithHoldings,
    namesSelectDepCityCountry,
    validateDocumentNumber,
    consecutiveValidation,
    IPrefixNextToExpire,
    createOptionsInTableInvoice,
    modalInfoProps,
    defaultDepartmentAndCity,
    findPercentage,
    PARAMETER_GET_PREFIX_TYPES,
    compareInformation,
    radioButtonsKeys,
    formatItemProduct,
    findProductTax,
    assignTotalValues,
    ResponseNA,
    IModals,
    ModalOpen,
    DOCUMENT_NIT,
    typePrefixNotes,
    SIMPLE_INFORMATION,
} from '.';
import './ElectronicInvoice.scss';

export const ElectronicInvoice: React.FC<IElectronicInvoiceProps> = ({
    fieldInputs,
    paginator,
    idInvoice = '',
    route = '#',
    textRoute = '',
    isView = false,
    isExcel = false,
    fileLinkView = false,
    registerInvoice = false,
    onSubmitForm = false,
    routeOnClick = (): void => {},
    setFieldInputs = (): void => {},
    setShowModalSearchClient,
    isQuote = false,
    isModalResolution = false,
    modalUpdateCustomer = false,
    setModalUpdateCustomer = (): void => {},
    isWantedCustomer = false,
    resetData = false,
    existingCustomer = false,
    setExistingCustomer = (): void => {},
    modalUpdateDocumentNumber = false,
    setModalUpdateDocumentNumber = (): void => {},
    setValidateEditedField = (): void => {},
}) => {
    const { DAYS_TYPE } = TypeNamesInputs;
    const { RETE_FUENTE, RETE_ICA, RETE_IVA } = TextNameTotals;
    const { YES } = typeRadioButtonBuy;
    const { AuthorizedInformation, InvoiceEmail, IsElectronicCustomer, SendProducts } = RadioButtonName;
    const validateClickTimePicker = false;
    const [dispatch, { getPermissions, disabledInputs }, { queryParam: quoteId }] = [
        useDispatch(),
        usePermissions(),
        useParam(ID),
    ];
    const DoYouHaveWarehouse = getPermissions(getRouteName(Routes.HOME), getRouteName(Routes.HOME));
    const {
        company: { information },
        warehouses: { getDynamicRequest },
        notifications: { parameterization },
        reportDocumentPayment: { paymentMethods },
        cancellationElectronicDocuments: { document: quote },
        electronicInvoice: { customer, invoice, products, storePrefix, error, invoiceCalculations },
    } = useSelector((state: RootState) => state);

    const [timePicker, setTimePicker] = useState<boolean>(false);
    const [isClearOption, setIsClearOption] = useState(false);
    const [storeTime, setStoreTime] = useState<ITime>(initTimeByTimePicker(true));
    const times = getTime(storeTime, setStoreTime);
    const [clickTimePicker, setClickTimePicker] = useState(defaultStateSelectedTimepicker);
    const [fiscalResponsibilities, setFiscalResponsibilities] = useState<IGenericRecord[]>([initialStateFiscalResponsibilities]);
    const [modalsErrors, setModalsErrors] = useState<IModals>({
        delete: false,
        validateTable: false,
    });
    const [inputValidation, setInputValidation] = useState<Array<string>>([]);
    const [isPrimeCurrency, setIsPrimeCurrency] = useState<boolean>(true);
    const [tableTaxes, setTableTaxes] = useState([...DATA_TAXES]);
    const [tableWithholdings, setTableWithholdings] = useState([...DATA_WITHHOLDINGS]);
    const [tableTotals, setTableTotals] = useState([...DATA_TABLE_TOTALS(!isQuote)]);
    const [totalValues, setTotalValues] = useState({
        ...DATA_TOTAL_VALUES,
    });
    const [listProducts, setListProducts] = useState<IGenericRecord[]>([]);
    const [listOptionsTable, setListOptionsTable] = useState<IGenericRecord>({
        sku: [],
        warehouse: [],
        batch: [],
        companyDevices: [],
        fiscalResponsibilities: [],
        expirationDates: [],
        foreignExchanges: [],
        reteIVA: [],
    });
    const [productOptions, setProductOptions] = useState<IOption[]>([]);
    const [tooltip, setTooltip] = useState<string>('');

    const {
        textInvoice,
        textDateValidation,
        textEmailValidation,
        textCustomerValidation,
        textValidEmail,
        textQuote,
        textAddressQuote,
        textPostalCode,
    } = useTextValidation();
    const { fiscalResponsibilitiesOptions, taxpayerSelected, setTaxpayerSelected } = useFiscalResponsibilities(
        fieldInputs.fiscal_responsibilities
    );
    const {
        handleChangeSelect: handleChangeOption,
        handleChangeText,
        multiDigitVerification,
        handleInitMulti,
        setMultiDigitVerification,
    } = useDigitVerification('', '', {
        client: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldInputs?.document_type_name?.name || fieldInputs?.document_type_name || '',
            numberDocument: fieldInputs?.document_number || '',
        },
        sales_manager: {
            isTypeNit: false,
            digitVerification: VALUE_ZERO,
            typeDocument: fieldInputs?.document_type_sales_manager_name || '',
            numberDocument: fieldInputs?.document_number_sales_manager || '',
        },
    });

    const validationPerson = (): boolean =>
        fieldInputs.document_number === customer?.person?.document_number && fieldInputs.person_id === '';

    useEffect(() => {
        closeTimePicker(setTimePicker);
        return (): void => {
            closeTimePicker(setTimePicker);
        };
    }, []);

    useEffect(() => {
        handleInitMulti();
        return (): void => {
            dispatch(setInvoiceCalculations({ ...INVOICE_CALCULATES }));
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatch(getClients()),
                dispatch(getDynamicData(dynamicData)),
                dispatch(getDepartmentsForCountry('46')),
                dispatch(getUniqueProductStock()),
                dispatch(getPrefixCompany(PARAMETER_GET_PREFIX_TYPES)),
                dispatch(setCustomerByDocument({})),
                dispatch(getPaymentMethodsByType()),
                dispatch(getInformationCompany()),
                quoteId && dispatch(getSpecificDocument(quoteId)),
            ]);
        })();
        setTableTaxes([...DATA_TAXES]);
        setClickTimePicker(defaultStateSelectedTimepicker);
    }, [registerInvoice]);

    useEffect(() => {
        const timeInput = getTimeIssue(storeTime);
        setFieldInputs({ ...fieldInputs, time_issue: timeInput });
    }, [storeTime]);

    const prefixInvoice = useMemo(
        () =>
            formatOptionsPrefix(
                storePrefix?.filter(({ physical_store, type }) => type === typePrefixNotes.INVOICE && physical_store) || []
            ),
        [storePrefix]
    );
    const isDisabledTotalWithholdings = useMemo(() => !someArrayObject(listProducts, TypeNamesInputs.SKU), [listProducts]);
    const isColombia = useMemo(() => fieldInputs.country_id === COLOMBIA_ID || !fieldInputs.country_id, [fieldInputs.country_id]);
    const prefixesNextToExpire = useMemo(() => {
        if (lengthGreaterThanZero(storePrefix) && lengthGreaterThanZero(prefixInvoice)) {
            const prefixes: IPrefixNextToExpire[] = [];
            prefixInvoice.forEach(({ id }) => {
                const prefix = storePrefix.find(prefix => prefix.id === id);
                if (prefix) {
                    const resolutionExpire = consecutiveValidation(prefix, parameterization, false);
                    const consecutiveAvailable = consecutiveValidation(prefix, parameterization, false, false);
                    if (resolutionExpire) prefixes.push(resolutionExpire);
                    if (consecutiveAvailable) prefixes.push(consecutiveAvailable);
                }
            });
            return prefixes;
        }
        return [];
    }, [prefixInvoice, storePrefix]);
    const [messageReteFuente, messageReteICA, messageReteIVA] = useMemo(
        () => [
            validatePercentageWithHoldings(findPercentage(RETE_FUENTE, tableWithholdings), fieldInputs?.country_name, 33),
            validatePercentageWithHoldings(findPercentage(RETE_ICA, tableWithholdings), fieldInputs?.country_name, 2),
            validatePercentageWithHoldings(findPercentage(RETE_IVA, tableWithholdings), fieldInputs?.country_name, 100),
        ],
        [tableWithholdings, fieldInputs]
    );

    const { modals, toggleModal } = useModal(prefixesNextToExpire.reduce((itemA, itemB, index) => ({ [`${index}`]: false }), {}));
    const { radioButtons, changeRadioButton, handleRadioButton, setRadioButtons } = useRadioButton(radioButtonList);

    const IsElectronicInvoice = useMemo(() => radioButtons[IsElectronicCustomer] === YES, [radioButtons[IsElectronicCustomer]]);
    const IsNaturalPerson = useMemo(
        () => getDocumentTypeName(getDynamicRequest?.type_tax_payer, fieldInputs.type_taxpayer_id) === NATURAL_PERSON,
        [fieldInputs.type_taxpayer_id]
    );
    const isFinalCustomer = useMemo(
        () =>
            fieldInputs.document_number === CONSUMER_CLIENT_DOCUMENT &&
            radioButtons[AuthorizedInformation] === NO &&
            IsNaturalPerson,
        [fieldInputs.type_taxpayer_id, radioButtons[AuthorizedInformation], fieldInputs.document_number]
    );
    const { notRequired, labels } = useMemo(
        () => ({
            notRequired: isQuote ? '' : '*',
            labels: isQuote ? 'cotización' : 'venta',
        }),
        [isQuote]
    );
    const initialCustomerData = useMemo<IGenericRecord>(() => {
        if (DOCUMENT_NIT === customer?.person?.document_type) {
            setMultiDigitVerification({
                ...multiDigitVerification,
                client: {
                    isTypeNit: true,
                    digitVerification: String(calculateVerificationDigit(customer?.person?.document_number)),
                    typeDocument: NIT,
                    numberDocument: customer?.person?.document_number,
                },
            });
        }
        if (!Object.keys(customer).length) return {};
        return {
            ...assignValue(keysCustomerInvoice, customer),
            tax_details_name: `${customer?.tax_details_code} - ${customer?.tax_details_name}`,
        };
    }, [customer]);
    const disabledFiscal = useMemo(
        () =>
            fiscalResponsibilities?.some(
                (item: IGenericRecord) => (item.name || item.fiscal_responsibility_name) === SIMPLE_REGIMEN
            ) ||
            fiscalResponsibilities?.every((item: IGenericRecord) => !item.id) ||
            taxpayerSelected !== LEGAL_PERSON ||
            fieldInputs?.type_taxpayer_name !== LEGAL_PERSON,
        [fiscalResponsibilities, taxpayerSelected, fieldInputs?.type_taxpayer_name]
    );

    useEffect(() => {
        setExistingCustomer(false);
    }, [customer]);

    useEffect(() => {
        if (
            quoteId &&
            quote &&
            lengthGreaterThanZero(Object.keys(quote)) &&
            lengthGreaterThanZero(products) &&
            !fieldInputs.onSubmit
        ) {
            const { invoice_details, fiscal_responsibilities, payment_type_name, ...form } = assignValue(
                QuoteToInvoiceKeys,
                quote
            );
            const fiscalResponsibilities = lengthGreaterThanZero(fiscal_responsibilities)
                ? fiscal_responsibilities
                : [initialStateFiscalResponsibilities];
            setFiscalResponsibilities(fiscalResponsibilities);
            const date = getDateFromUnix(getUnixFromDate(quote.date)).formatYearMonthDay;
            const { taxes, tableTotals, withholdings } = assignDocument(quote, true);
            const dateValue =
                payment_type_name === TextPaymentTypes.COUNTED
                    ? date
                    : getDateFromUnix(getUnix(quote.date_limit)).formatYearMonthDay;
            setTableTaxes([...taxes]);
            setTableWithholdings([...withholdings]);
            setTableTotals([...tableTotals]);
            setFieldInputs({
                ...fieldInputs,
                ...form,
                date,
                payment_type_name,
                date_limit: payment_type_name ? dateValue : null,
                tax_details_name: form.tax_details_name ? `${form.tax_details_code} - ${form.tax_details_name}` : '',
                fiscal_responsibilities: fiscalResponsibilities,
                reload: true,
            });
            setTotalValues({ ...totalValues, total_charge_amount: form.sending_charge });
            setListProducts([...formatItemProduct(invoice_details, products)]);
        }
    }, [quoteId, quote, products]);

    useEffect(() => {
        fieldInputs?.foreign_exchange_id &&
            setIsPrimeCurrency(fieldInputs?.foreign_exchange_id === information?.foreign_exchange_id);
    }, [fieldInputs?.foreign_exchange_id]);

    const getRadioValue = (condition: boolean | undefined, defaultValue: string): string => {
        if (fieldInputs.not_information_customer) {
            return '';
        }
        return condition ? defaultValue : NO;
    };

    useEffect(() => {
        if (fieldInputs?.reload) {
            const receiveEmail = fieldInputs?.receive_email ? YES : NO;
            const changeRadioButton: IRadioButtons = {
                [IsElectronicCustomer]: getRadioValue(fieldInputs?.electronic_biller, YES),
                [InvoiceEmail]: getRadioValue(fieldInputs?.electronic_biller, receiveEmail),
                [SendProducts]: getRadioValue(fieldInputs?.receive_products, YES),
            };
            setRadioButtons({ ...radioButtons, ...changeRadioButton });
            setFieldInputs({ ...fieldInputs, reload: false });
        }
    }, [fieldInputs?.reload]);

    useEffect(() => {
        if (IsElectronicInvoice && radioButtons[InvoiceEmail] === NO && fieldInputs?.email) {
            setFieldInputs({ ...fieldInputs, receive_email: true });
            handleRadioButton(InvoiceEmail, YES);
        }
    }, [radioButtons[IsElectronicCustomer], IsElectronicInvoice]);

    useEffect(() => {
        assignValuesRadioButton();
    }, [changeRadioButton, radioButtons]);

    useEffect(() => {
        setFieldInputs({ ...fieldInputs, ...defaultDepartmentAndCity });
    }, [isColombia]);

    useEffect(() => {
        if (isModalResolution) toggleModal(VALUE_ZERO);
    }, [isModalResolution]);

    useEffect(() => {
        if (onSubmitForm) {
            const fiscalState = fieldInputs.fiscal_responsibilities.map((item: IGenericRecord) => ({
                id: item.id,
                name: item.name ?? item.fiscal_responsibility_name,
            }));
            setFiscalResponsibilities(lengthEqualToZero(fiscalState) ? [initialStateFiscalResponsibilities] : fiscalState);
        }
    }, [onSubmitForm]);

    useEffect(() => {
        onSubmitForm && setInputValidation(validateFormInputs(fieldInputs, registerInvoice, isQuote));
    }, [fieldInputs]);

    useEffect(() => {
        if (invoice?.person && idInvoice) {
            const invoiceQuery = {
                person_id: invoice?.person?.id,
                customer_id: invoice?.person?.customer?.id,
                client_id: invoice?.person?.customer?.client_id,
                number_max: 2000,
                number: invoice?.number,
                foreign_exchange_id: invoice?.foreign_exchange_id,
                foreign_exchange_name: invoice?.foreign_exchange_name,
                date: getDateFromUnix(getUnix(invoice?.date)).formatYearMonthDay,
                date_limit: getDateFromUnix(getUnix(invoice?.date_limit)).formatYearMonthDay,
                time_issue: invoice?.time_issue,
                number_purchase_order: invoice?.number_purchase_order,
                document_type: invoice?.person?.document_type,
                document_number: invoice?.person?.document_number,
                name: invoice?.person?.customer?.name,
                email: invoice?.person?.email,
                address: invoice?.person?.address,
                department_id: invoice?.department_id,
                department_name: getDynamicRequest?.departments?.find(
                    (department: IGenericRecord) => department.id === invoice.department_id
                )?.name,
                city_id: String(invoice.city_id),
                city_name: String(invoice.city_name),
                country_id: String(invoice.country_id),
                country_name: String(invoice.country_name),
                postal_code: invoice?.postal_code,
                phone: invoice?.person.phone,
                purchasing_manager: invoice?.purchasing_manager,
                document_number_purchasing_manager: invoice?.document_number_purchasing_manager,
                document_type_purchasing_manager: invoice?.document_type_purchasing_manager,
                sales_manager: invoice?.sales_manager,
                document_number_sales_manager: invoice?.document_number_sales_manager,
                document_type_sales_manager: invoice?.document_type_sales_manager,
                payment_method_id: invoice?.payment_method_id,
                type_taxpayer_id: invoice?.person.type_taxpayer_id,
                type_taxpayer_name: invoice?.person.type_taxpayer_name,
                fiscal_responsibilities: invoice?.person.fiscal_responsibilities.map((responsibilities: IGenericRecord) => ({
                    ...responsibilities,
                    id: String(responsibilities.id),
                    fiscal_responsibility_name: responsibilities.name,
                })),
                note: invoice?.note,
                total_sale: invoice?.total_sale,
                total_discount: invoice?.total_discount,
                sending_charge: invoice?.sending_charge,
                total_sale_value: invoice?.total_sale_value,
                total_iva: invoice?.total_iva,
                total_impoconsumption: invoice?.total_impoconsumption,
                retefuente: invoice?.retefuente,
                send_address: invoice?.send_address,
                reteica: invoice?.reteica,
                reteiva: invoice?.reteiva,
                total: invoice?.total,
                sale_channel: invoice?.sale_channel,
                total_invoice: invoice?.total_invoice,
                is_paid: invoice?.is_paid,
                is_electronic_invoice: false,
                apply_deductible: invoice?.apply_deductible,
                payment_type_id: invoice?.payment_type_id,
                payment_type_name: invoice?.payment_type_name,
                days_collection: invoice?.days_collection,
                products: invoice?.invoice_details,
                source_type: invoice?.source_type,
                aggregation_method: invoice?.aggregation_method,
                invoice_state: invoice?.invoice_state,
                invoice_type: invoice?.invoice_type,
                company_address: invoice?.company_address,
                tax_details_name: invoice?.person?.customer?.tax_details_name,
                tax_details_code: invoice?.person?.customer?.tax_details_code,
                apply_electronic_invoice: false,
                electronic_billing: true,
            };
            setListProducts(
                invoice?.invoice_details?.map((details: IGenericRecord, index: number) => {
                    const product = details.sku_internal
                        ? products.find(product => product.sku_internal === details.sku_internal)
                        : null;
                    const productDetails =
                        product &&
                        validateTypeProduct(product, {
                            batch_number: details.batch_number,
                            date_expiration: details.date_expiration
                                ? getDateFormatUnix(details.date_expiration).dateFormat
                                : details.date_expiration,
                            warehouse_name: details.warehouse_name,
                        });
                    return {
                        ...details,
                        ...productDetails,
                        ciiu_id: details.ciiu_id || CIIU_ID_TWO,
                        number: formatInitialNumber(index + 1),
                        measurement: details.unit_measurement_name,
                        date_expiration: productDetails?.date_expiration,
                        percentage:
                            product?.product.product_taxes?.find((tax: IGenericRecord) => tax.tax_type === CONSUMPTION)
                                ?.tax_name || PERCENTAGE.ZERO,
                        iva:
                            product?.product.product_taxes?.find((tax: IGenericRecord) => tax.tax_type === IVA)?.tax_name ||
                            PERCENTAGE.ZERO,
                    };
                })
            );
            lengthGreaterThanZero(invoice?.person?.fiscal_responsibilities) &&
                setFiscalResponsibilities(
                    invoice?.person?.fiscal_responsibilities?.map((responsibility: IGenericRecord) => ({
                        ...responsibility,
                        id: String(responsibility.fiscal_responsibility_id || responsibility.id),
                        key: String(responsibility.id),
                        value: responsibility.name,
                        fiscal_responsibility_name: responsibility.name,
                    }))
                );
            setTaxpayerSelected(fieldInputs?.type_taxpayer_name);
            setFieldInputs({ ...invoiceQuery, onSubmit: false });
        }
    }, [invoice]);

    useEffect(() => {
        if (fieldInputs?.onSubmit) {
            (async (): Promise<void> => {
                await Promise.all([
                    setIsClearOption(true),
                    setTableTaxes([...DATA_TAXES]),
                    setStoreTime(initTimeByTimePicker(true)),
                    dispatch(setCustomerByDocument({})),
                    setListProducts([]),
                    setTotalValues({ ...totalValues, total_charge_amount: 0 }),
                    setFiscalResponsibilities([{ ...initialStateFiscalResponsibilities }]),
                    setRadioButtons({ ...radioButtonList }),
                ]);
            })();
        } else {
            lengthGreaterThanZero(customer?.person?.fiscalResposibilities) &&
            !idInvoice &&
            customer?.person?.fiscalResposibilities?.some((responsibility: IGenericRecord) => responsibility)
                ? setFiscalResponsibilities(
                      customer?.person?.fiscalResposibilities?.map((responsibility: IGenericRecord) => {
                          return {
                              ...responsibility,
                              id: String(responsibility.id),
                              fiscal_responsibility_name: responsibility.name,
                          };
                      })
                  )
                : !idInvoice &&
                  !fieldInputs?.fiscal_responsibilities?.some((responsibility: IGenericRecord) => responsibility.id) &&
                  setFiscalResponsibilities([initialStateFiscalResponsibilities]);
            setTaxpayerSelected(fieldInputs?.type_taxpayer_name);
            if (!isExcel && fieldInputs?.number !== invoice?.number) {
                setFieldInputs({
                    ...fieldInputs,
                    apply_electronic_invoice: !registerInvoice,
                    onSubmit: false,
                });
            }
            onSubmitForm && setInputValidation(validateFormInputs(fieldInputs, registerInvoice, isQuote));
        }
    }, [
        fieldInputs?.number,
        fieldInputs?.type_taxpayer_name,
        fieldInputs?.onSubmit,
        customer?.person?.fiscalResposibilities,
        registerInvoice,
        isClearOption,
        resetData,
    ]);

    useEffect(() => {
        setIsClearOption(true);
        handleExcel(isExcel);
        setIsClearOption(false);
    }, [products, fieldInputs?.number, customer?.id]);

    useEffect(() => {
        const { errorTable } = validateFieldsInputs(listProducts, setListProducts);
        setModalsErrors({ ...modalsErrors, validateTable: errorTable });
        if (onSubmitForm) {
            setRadioButtons({
                ...radioButtons,
                [InvoiceEmail]: !radioButtons[InvoiceEmail] ? NO : radioButtons[InvoiceEmail],
                [SendProducts]: !radioButtons[SendProducts] ? NO : radioButtons[SendProducts],
                [IsElectronicCustomer]: !radioButtons[IsElectronicCustomer] ? NO : radioButtons[IsElectronicCustomer],
            });
        }
    }, [onSubmitForm]);

    useEffect(() => {
        const options: IGenericRecord = {
            sku: [],
            products: [],
            fiscalResponsibilities: [],
            companyDevices: buildOptions(information?.company_devices || []),
            foreignExchanges: buildOptionsSearch(getDynamicRequest?.foreign_exchange || []),
            reteIVA: buildOptionsSearch(getDynamicRequest?.withholdings || []),
            ...createOptionsInTableInvoice(listProducts, products),
        };
        products.forEach((product: IGenericRecord) => {
            if (isItAPurchaseProduct(product)) {
                options.products = sortArrayAlphabetically([
                    ...options.products,
                    {
                        name: product.name,
                        value: product.id,
                    },
                ]);
                options.sku = sortArrayAlphabetically([
                    ...options.sku,
                    {
                        value: product.sku_internal,
                        name: product.sku_internal,
                    },
                ]);
            }
        });
        getDynamicRequest?.fiscal_responsibilities?.forEach((responsibility: IGenericRecord) => {
            const item = fiscalResponsibilities.find(fiscal => fiscal?.id === responsibility?.id) ? null : responsibility;
            item && options.fiscalResponsibilities.push(item);
        });
        setListOptionsTable({
            ...listOptionsTable,
            ...options,
        });
        const { productValidation } = validateFieldsInputs(listProducts);
        const totals = { ...DATA_TOTAL_VALUES };
        tableTotals.forEach(({ field, value }) => {
            totals[field as keyof KeysInvoiceCalculates] = value;
        });
        setFieldInputs({
            ...fieldInputs,
            ...assignTotalValues(tableWithholdings),
            taxes: [...tableTaxes],
            withholdings: [...tableWithholdings],
            total_sale: totals.subtotal,
            total_discount: totals.total_discount,
            sending_charge: stringToFloat(totals.total_charge_amount),
            total_invoice: totals.total_gross,
            total_iva: totals.total_iva,
            total_icui: totals.total_icui,
            total_ibua: totals.total_ibua,
            total_impoconsumption: totals.total_inc,
            total_sale_value: totals.total_payable,
            total: totals.total,
            products: onSubmitForm ? productValidation : listProducts,
            company_address: information?.address,
            company_postal_code: information?.postal_code,
            ...(lengthGreaterThanZero(listOptionsTable.foreignExchanges)
                ? {
                      foreign_exchange_id: fieldInputs.foreign_exchange_id ?? information?.foreign_exchange_id,
                      foreign_exchange_name:
                          fieldInputs.foreign_exchange_name ??
                          getCurrency(information?.foreign_exchange_id ?? '', options.foreignExchanges),
                  }
                : {}),
            fiscal_responsibilities: fiscalResponsibilities.filter(fiscal => fiscal.id),
            loaded_inventory: false,
            onSubmit: false,
        });
    }, [
        listProducts,
        products,
        fiscalResponsibilities,
        getDynamicRequest,
        information,
        totalValues,
        tableTotals,
        tableTaxes,
        tableWithholdings,
    ]);

    useEffect(() => {
        const { foreign_exchange_rate, ...fields } = fieldInputs;
        setFieldInputs({
            ...fields,
            ...(isPrimeCurrency ? {} : { foreign_exchange_rate }),
        });
    }, [isPrimeCurrency]);

    useEffect(() => {
        setProductOptions(getProductOptions());
    }, [products]);

    useEffect(() => {
        if (onSubmitForm && error && registerInvoice) {
            const fieldsErrors: string[] = [];
            Object.keys(JSON.parse(error)).forEach(key => {
                if (key.includes(TypeNamesInputs.NUMBER)) fieldsErrors.push(TypeNamesInputs.NUMBER);
                fieldsErrors.push(key);
            });
            setInputValidation([...inputValidation, ...fieldsErrors]);
        }
    }, [error]);

    useEffect(() => {
        handleTables();
    }, [invoiceCalculations, listProducts]);

    const handleDataPerson = (): IGenericRecord | null =>
        validationPerson()
            ? {
                  person_id: customer?.person?.id,
                  customer_id: customer?.id,
                  client_id: customer?.client_id,
                  document_type: customer?.person?.document_type,
                  document_number: customer?.person?.document_number,
                  name: customer?.name,
                  email: customer?.person?.email,
                  address: customer?.person?.address,
                  department_id: customer?.person?.department_id,
                  department_name: customer?.person?.department_name,
                  city_id: customer?.person?.city_id,
                  city_name: customer?.person?.city_name,
                  postal_code: customer?.person?.postal_code,
                  phone: customer?.person?.phone,
              }
            : null;

    const filterProduct = (product: IGenericRecord): IGenericRecord | null =>
        product
            ? products.find((productLocal: IGenericRecord) => productLocal.sku_internal === product.sku_internal) || null
            : null;

    const getBatchProduct = (product: IGenericRecord, productFiltered: IGenericRecord): IGenericRecord | null =>
        product?.batch_id
            ? productFiltered?.purchase_details
                  ?.filter((detail: IGenericRecord) => detail?.batch_detail?.date_expired)
                  .find((batch: IGenericRecord) => batch?.batch_detail?.batch?.id === product?.batch_id) || null
            : null;

    const getDataTable = (product: IGenericRecord, index: number, productFiltered: IGenericRecord | null): IGenericRecord => {
        if (productFiltered) {
            const batch = getBatchProduct(product, productFiltered);
            const { impoconsumo, vat, cost, totalBuyParams } = getTotalBuy(productFiltered, product);
            const warehouse_name = product?.warehouse_id
                ? getDocumentTypeName(productFiltered?.stock, product?.warehouse_id)
                : ' ';
            const batch_data = batch ? batch?.batch_detail?.batch?.number : NA;
            const input_date_expiration = batch ? getUnixFromDate(String(batch?.batch_detail?.date_expired)) : NA;
            const ciiu_id = productFiltered.product.ciiu_id || CIIU_ID_TWO;
            return {
                ...initialDataTable(product.number, onSubmitForm),
                ...product,
                number: index + 1,
                warehouse_name,
                batch: batch_data,
                input_date_expiration,
                ciiu_id,
                reference: productFiltered.reference,
                unique_product_name: productFiltered.name,
                unique_products_id: productFiltered.id,
                measurement: productFiltered.unit_measurement_name,
                unit_measurements_id: productFiltered.unit_measurement_id,
                unit_cost: productFiltered.unit_value,
                unit_value: Number(cost).toFixed(0),
                percentage: impoconsumo,
                iva: vat,
                total_buy: totalBuyParams,
            };
        }
        return {
            ...initialDataTable(product.number, onSubmitForm),
        };
    };

    const handleExcel = (excel: boolean): void => {
        if (excel) {
            const person = handleDataPerson();
            setFiscalResponsibilities(fieldInputs.fiscal_responsibilities);
            if (products.length) {
                const product = fieldInputs.products.map((product: IGenericRecord, index: number) => {
                    const productFilter = filterProduct(product);
                    return getDataTable(product, index, productFilter);
                });
                setListProducts(product);
                if (onSubmitForm) validateFieldsInputs(product, setListProducts);
                setFieldInputs({ ...fieldInputs, ...person, products: product });
            }
        }
    };

    const handleTables = (): void => {
        setTableTaxes(updateTableTaxes(listProducts, invoiceCalculations, TAXES_INVOICE));
        setTableWithholdings(
            updateTableRetentions(tableWithholdings, {
                totalBuy: invoiceCalculations.total_gross - invoiceCalculations.total_charge_amount,
                totalIVA: invoiceCalculations.total_iva,
            })
        );
        setTableTotals(
            tableTotals.map(item => ({
                ...item,
                value: invoiceCalculations[item.field as keyof KeysInvoiceCalculates],
            }))
        );
    };

    const getProductOptions = (): IOption[] => {
        const options: IOption[] = [];
        products?.forEach(
            ({ name, id, ...product }: IGenericRecord) => isItAPurchaseProduct(product) && options.push({ name, value: id })
        );
        return sortArrayAlphabetically(options);
    };

    const isItAPurchaseProduct = (product: IGenericRecord): boolean => {
        return !(
            (!product?.purchase_details && !!listProducts.find(item => item.sku_internal === product.sku_internal)) ||
            product.product.type_transaction === TypeTransaction.Buy
        );
    };

    const handleShowModal = (type: string): void => {
        setModalsErrors({
            ...modalsErrors,
            [type]: !modalsErrors[type],
        });
    };

    const handleChange = (name: string, value: string): void => {
        if (TypeNamesInputs.NUMBER === name && String(value).substring(0, 3) === THREE_ZERO) {
            return;
        }
        if (TypeNamesInputs.ADDRESS === name) {
            setFieldInputs({
                ...fieldInputs,
                send_address: value,
                [name]: value,
            });
        } else if (TypeNamesInputs.DAYS === name) {
            setFieldInputs({
                ...fieldInputs,
                date_limit: validateDateLimit(Number(value), fieldInputs.days_collection_type),
                [name]: value,
            });
        } else {
            setFieldInputs({
                ...fieldInputs,
                [name]: value,
            });
        }
        const index = Object.keys(multiDigitVerification)?.find(key => name.includes(key)) ?? CLIENT;
        if (index) handleChangeText(value, index);
    };

    const handleChangeSelectName = (option: IOptionSelect, name: string): void => {
        if (option.id && option.value) {
            switch (name) {
                case TypeNamesInputs.DOCUMENT_TYPE_SALES:
                    setFieldInputs({
                        ...fieldInputs,
                        document_number_sales_manager: '',
                        [name]: option.id,
                        [`${name}_name`]: option.value,
                    });
                    break;
                case TypeNamesInputs.DOCUMENT_TYPE_PURCHASING:
                    setFieldInputs({
                        ...fieldInputs,
                        document_number_purchasing_manager: '',
                        [name]: option.id,
                        [`${name}_name`]: option.value,
                    });
                    break;
                case TypeNamesInputs.DOCUMENT_TYPE:
                    setFieldInputs({
                        ...fieldInputs,
                        document_number: '',
                        [name]: option.id,
                        [`${name}_name`]: option.value,
                    });
                    break;
                case TypeNamesInputs.PREFIX:
                    setFieldInputs({
                        ...fieldInputs,
                        [name]: option.id,
                        [`${name}_name`]: option.value,
                    });
                    break;
                case TypeNamesInputs.COMPANY_DEVICE:
                    setFieldInputs({
                        ...fieldInputs,
                        [`${name}_id`]: option.id,
                        [`${name}_name`]: option.value,
                    });
                    break;
                default:
                    break;
            }
            const index = Object.keys(multiDigitVerification)?.find(key => name.includes(key)) ?? CLIENT;
            handleChangeOption(option.value, index);
        } else {
            setFieldInputs({
                ...fieldInputs,
                document_number_purchasing_manager:
                    name === TypeNamesInputs.DOCUMENT_TYPE_PURCHASING ? '' : fieldInputs?.document_number_purchasing_manager,
                document_number_sales_manager:
                    name === TypeNamesInputs.DOCUMENT_TYPE_SALES ? '' : fieldInputs?.document_number_sales_manager,
                [name]: '',
                [`${name}_name`]: '',
            });
        }
    };

    const handleChangeFiscalResponsibilities = (selectedValue: IOptionSelect, index: number): void => {
        let updateFiscalResponsibilities: IGenericRecord[] = [];

        if (selectedValue.value === SIMPLE_REGIMEN) {
            updateFiscalResponsibilities = [{ id: String(selectedValue?.id), fiscal_responsibility_name: selectedValue.value }];
        } else {
            updateFiscalResponsibilities = fiscalResponsibilities.map((fiscal: IGenericRecord, localIndex: number) => {
                if (index === localIndex) {
                    fiscal = selectedValue;
                    fiscal.id = String(selectedValue?.id);
                    fiscal.fiscal_responsibility_name = selectedValue?.value;
                }
                return fiscal;
            });
        }

        setFiscalResponsibilities(updateFiscalResponsibilities);
    };

    const handleChangeSelect = (selectedValue: IOptionSelect, inputName: string): void => {
        const { value, name, id }: IGenericRecord = selectedValue;
        let emptyFields = {};

        if (namesSelectDepCityCountry.includes(inputName)) {
            emptyFields = handleSpecialFields(inputName);
        }

        if (inputName === TYPE_TAXPAYER) {
            handleTaxpayerSelect(selectedValue);
            return;
        }

        if (inputName === DAYS_TYPE) {
            handleDaysType(value);
            return;
        }

        if (inputName === FOREIGN_EXCHANGE) {
            handleForeignExchange(value, emptyFields);
            return;
        }

        if (name) {
            updateFieldInputs(value, selectedValue, name, id, inputName, emptyFields);
        } else {
            handleResetFields(value, selectedValue, id, inputName, emptyFields);
        }
    };

    const handleSpecialFields = (inputName: string): IGenericRecord => {
        switch (inputName) {
            case TypeNamesInputs.COUNTRY:
                return {
                    department_id: '',
                    department_name: '',
                    city_id: '',
                    city_name: '',
                };
            case TypeNamesInputs.DEPARTMENT:
                return {
                    city_id: '',
                    city_name: '',
                };
            default:
                return {};
        }
    };

    const handleTaxpayerSelect = (selectedValue: IOptionSelect): void => {
        const isNaturalPerson = selectedValue.value === NATURAL_PERSON;
        const fiscalResponsibilitiesByNatural = isNaturalPerson
            ? fiscalResponsibilities.filter(item =>
                  [SIMPLE_REGIMEN, OTHERS].includes(item.name ?? item.fiscal_responsibility_name)
              )
            : [];
        const responsabilities = isNaturalPerson ? [initialStateFiscalResponsibilities] : fiscalResponsibilities;

        setTaxpayerSelected(selectedValue.value);
        setFiscalResponsibilities(
            lengthEqualOne(fiscalResponsibilitiesByNatural) ? fiscalResponsibilitiesByNatural : responsabilities
        );
    };

    const handleDaysType = (value: string): void => {
        setFieldInputs({
            ...fieldInputs,
            [DAYS_TYPE]: value,
            date_limit: validateDateLimit(Number(fieldInputs.days_collection), value),
        });
    };

    const handleForeignExchange = (value: string, emptyFields: IGenericRecord): void => {
        const code = getDynamicRequest?.foreign_exchange?.find((foreing: IGenericRecord) => foreing?.id === value)?.code;
        setFieldInputs({
            ...fieldInputs,
            ...emptyFields,
            [`${FOREIGN_EXCHANGE}_name`]: code,
            [`${FOREIGN_EXCHANGE}_id`]: value,
            [`${FOREIGN_EXCHANGE}_code`]: code,
        });
    };

    const updateFieldInputs = (
        value: string,
        selectedValue: IOptionSelect,
        name: string,
        id: string,
        inputName: string,
        emptyFields: IGenericRecord
    ): void => {
        setFieldInputs({
            ...fieldInputs,
            ...emptyFields,
            [`${inputName}_name`]: name,
            [`${inputName}_id`]: value,
            [`${inputName}_code`]:
                TypeNamesInputs.TAX_DETAILS === inputName
                    ? selectedValue?.code
                    : id || getDynamicRequest?.foreign_exchange?.find((foreing: IGenericRecord) => foreing?.id === value)?.code,
        });
    };

    const handleResetFields = (
        value: string,
        selectedValue: IOptionSelect,
        id: string,
        inputName: string,
        emptyFields: IGenericRecord
    ): void => {
        const resetFields = selectedValue.value !== NATURAL_PERSON && fieldInputs.document_number === CONSUMER_CLIENT_DOCUMENT;

        setFieldInputs({
            ...fieldInputs,
            ...emptyFields,
            ...(resetFields && SIMPLE_INFORMATION),
            [`${inputName}_name`]: value,
            [`${inputName}_id`]: id,
            [`${inputName}_code`]: TypeNamesInputs.TAX_DETAILS === inputName ? selectedValue?.code : id,
            days_collection:
                TypeNamesInputs.PAYMENT_TYPE === inputName && value === TextPaymentTypes.COUNTED
                    ? ''
                    : fieldInputs?.days_collection,
            date_limit:
                TypeNamesInputs.PAYMENT_TYPE === inputName && value === TextPaymentTypes.COUNTED
                    ? fieldInputs?.date
                    : fieldInputs?.date_limit,
        });

        if (resetFields) setRadioButtons({ ...radioButtons, [AuthorizedInformation]: '' });
    };

    const handleGetDataEvent = (event: ChangeEvent | IChangePercentageDiscount): { name: string; value: string } => {
        const name = validateChangePercentage(event) ? event.name : event.target.name;
        const value = validateChangePercentage(event) ? '0' : event.target.value;

        return { name, value };
    };

    const formatDataByProduct = (
        product: IGenericRecord,
        productFiltered: IGenericRecord,
        name: string,
        value: string,
        parseValue: number,
        event: ChangeEvent | IChangePercentageDiscount,
        isDescription: boolean
    ): IGenericRecord => {
        if (name === TypeNamesInputs.QUANTITY) {
            return {
                ...product,
                percentage_discount: 0,
                discount: 0,
                unit_value: product.unit_cost * parseValue,
                total_buy: getTotalBuy(productFiltered, product, {
                    quantity: parseValue,
                    discount: 0,
                    delivery_cost: product?.delivery_cost,
                }).totalBuyParams,
                [name]: parseValue ?? '',
            };
        }
        if (name === TypeNamesInputs.PERCENTAGE_DISCOUNT && validateChangePercentage(event)) {
            const discount = discountOfValue(product.unit_value ?? 0, event.values.floatValue ?? 0);
            return {
                ...product,
                discount,
                [name]: event.values.floatValue,
                total_buy: getTotalBuy(productFiltered, product, {
                    quantity: stringToFloat(product?.quantity),
                    discount,
                    delivery_cost: product?.delivery_cost,
                }).totalBuyParams,
            };
        }
        return {
            ...product,
            [name]: isDescription ? value : parseValue,
        };
    };

    const filterProductByUniqueId = (product: IGenericRecord): IGenericRecord =>
        products?.find(productFil => productFil.id === product.unique_products_id) ?? {};

    const existProduct = (item: IGenericRecord, product: IGenericRecord): boolean => item.number === product.number;

    const onChangeProductTable = (event: ChangeEvent | IChangePercentageDiscount, item: IGenericRecord): void => {
        const { name, value } = handleGetDataEvent(event);
        const parseValue = stringToFloat(value);
        const isDescription = TypeNamesInputs.DESCRIPTION === name;
        const invoiceDetails = listProducts.map(product => {
            const productFilter = filterProductByUniqueId(product);
            if (existProduct(item, product)) {
                return formatDataByProduct(product, productFilter, name, value, parseValue, event, isDescription);
            }
            return product;
        });
        if (!isDescription)
            getCalculate({
                products: invoiceDetails,
                sending_charge: totalValues.total_charge_amount,
                withholdings: updateTableRetentions(
                    tableWithholdings,
                    getTotalsByInvoiceDetails(
                        invoiceDetails.map(({ total_buy, taxes_invoice: product_taxes }) => ({
                            total_buy,
                            product_taxes,
                        })) as IInvoiceDetails[]
                    )
                ),
            });
        setListProducts(invoiceDetails);
    };

    const getCalculate = (forCalculate: ICalculateInvoice): void => {
        dispatch(getInvoiceCalculations(forCalculate));
    };

    const onChangeProductTableEditInput = (e: IGenericRecord, item: IGenericRecord, keyName: string): void => {
        setListProducts(
            listProducts.map(product => {
                if (item && item.number === product.number) {
                    switch (keyName) {
                        case TypeNamesInputs.WAREHOUSE_INPUT:
                        case TypeNamesInputs.BATCH:
                            return {
                                ...product,
                                text_fields: {
                                    ...product.text_fields,
                                    [keyName]: e.target.value,
                                },
                            };
                        case TypeNamesInputs.DATE_INPUT:
                            return {
                                ...product,
                                text_fields: {
                                    ...product.text_fields,
                                    [keyName]: getUnixFromDate(`${e}`),
                                },
                            };
                    }
                }
                return product;
            })
        );
    };

    const handleChangeSelectSearch = (
        option: SelectedOption,
        item?: IGenericRecord | undefined,
        nameInput?: string | undefined
    ): void => {
        const { name, value }: IGenericRecord = option || { name: '', value: '' };

        switch (nameInput) {
            case TypeNamesInputs.SKU:
            case TypeNamesInputs.UNIQUE_PRODUCTS_ID:
                setListOptionsTable({
                    ...listOptionsTable,
                    products: [],
                    warehouse: [],
                    batch: [],
                });
                setListProducts(
                    listProducts.map(product => {
                        const productFilter = getProductFilter(products, nameInput, name, value);
                        if (!productFilter) return product;

                        const { is_mandate = false } = productFilter || {};
                        const batchDataService = productFilter && validateTypeProduct(productFilter);

                        if (item && productFilter && item.number === product.number) {
                            return {
                                ...initialDataTable(product.number, onSubmitForm),
                                ...batchDataService,
                                ...getProductDetails(product, productFilter, is_mandate),
                            };
                        }
                        return product;
                    })
                );
                break;
            default:
                break;
        }
    };

    const getProductFilter = (
        products: IGenericRecord[],
        nameInput: string,
        name: string,
        value: string
    ): IGenericRecord | null => {
        if (nameInput === TypeNamesInputs.UNIQUE_PRODUCTS_ID) {
            return name ? products.find(p => p.id === value) || null : null;
        }
        return name ? products.find(p => p.sku_internal === value) || null : null;
    };

    const getProductDetails = (product: IGenericRecord, productFilter: IGenericRecord, is_mandate: boolean): IGenericRecord => {
        const quote = isQuote ? null : NA;
        const uniqueProductTaxes = discardUntaxed(productFilter.unique_product_taxes);
        const ivaObject = findProductTax(uniqueProductTaxes, IVA);
        const percentageObject = findProductTax(uniqueProductTaxes, INC);
        const unit_cost = productFilter.is_include_tax
            ? ivaDiscount(productFilter.unit_value, ivaObject.tax_rate)
            : productFilter.unit_value;
        return {
            sku_internal: productFilter.sku_internal,
            ciiu_id: productFilter.product.ciiu_id || CIIU_ID_TWO,
            reference: productFilter.reference,
            unique_product_name: productFilter.name,
            unique_products_id: productFilter.id,
            measurement: productFilter.unit_measurement_name,
            unit_measurements_id: productFilter.unit_measurement_id,
            unit_cost,
            unit_value: unit_cost,
            discount: 0,
            delivery_cost: 0,
            total_buy: getTotalBuy(productFilter, product, {
                quantity: 0,
                discount: 0,
                delivery_cost: 0,
            }).totalBuyParams,
            is_product: productFilter?.product?.is_product,
            is_inventoriable: productFilter?.is_inventoriable,
            taxes: uniqueProductTaxes.map(({ company_tax_id, tax_value }) => ({
                company_tax_id,
                tax_value,
            })),
            is_mandate: isQuote ? false : is_mandate,
            mandate_id: !is_mandate ? quote : productFilter.mandate_id,
            mandate: !is_mandate ? quote : productFilter.mandate,
            unit_measure_milliliters: productFilter.unit_measure_milliliters,
            taxes_invoice: uniqueProductTaxes,
            percentage: percentageObject.is_customized
                ? percentageObject.tax_rate_name ?? PERCENTAGE.ZERO
                : `${percentageObject.tax_rate}%`,
            iva: ivaObject.is_customized ? ivaObject.tax_rate_name ?? PERCENTAGE.ZERO : `${ivaObject.tax_rate}%`,
        };
    };

    const getNameInputId = (nameInput?: string): string =>
        nameInput === TypeNamesInputs.WAREHOUSE ? TypeNamesInputs.WAREHOUSE_ID : TypeNamesInputs.BATCH_ID;

    const handleValidateField = (
        product: IGenericRecord,
        option: IOptionSelect,
        item?: IGenericRecord
    ): {
        product: boolean;
        batch_detail: boolean;
        expiration_detail: boolean;
    } => {
        return {
            product: !!item && item.number === product.number,
            batch_detail: !!item && item.number === product.number && TypeNamesInputs.BATCH_DETAIL_ID in option,
            expiration_detail: !!item && item.number === product.number && TypeNamesInputs.DATE_EXPIRED in option,
        };
    };

    const getResponseByNA = (isNA: boolean, type?: ResponseNA): string | null => {
        if (type === ResponseNA.NULL_STRING) return isNA ? null : '';
        if (type === ResponseNA.NA_NULL) return isNA ? NA : null;
        return isNA ? NA : '';
    };

    const getListProducts = (
        key: string,
        value: string,
        isNA: boolean,
        option: IOptionSelect,
        item?: IGenericRecord,
        nameInput?: string
    ): void => {
        const batchDetailId = option?.batch_detail_id ?? '';

        if (nameInput === TypeNamesInputs.WAREHOUSE) {
            setListProducts(
                listProducts.map(product => {
                    if (handleValidateField(product, option, item).product) {
                        return {
                            ...product,
                            warehouse_id: key ?? '',
                            warehouse_name: value ?? '',
                            batch_id: '',
                            batch: getResponseByNA(isNA),
                            input_date_expiration: getResponseByNA(isNA),
                            date_expiration: getResponseByNA(isNA, ResponseNA.NULL_STRING),
                            quantityMax: quantityMaxProduct(products, { ...item, warehouse_id: key } as IProductDetail),
                        };
                    }
                    return product;
                })
            );
        }
        if (nameInput === TypeNamesInputs.BATCH) {
            setListProducts(
                listProducts.map(product => {
                    if (handleValidateField(product, option, item).batch_detail) {
                        return {
                            ...product,
                            batch: value,
                            batch_id: key,
                            batch_detail_id: batchDetailId,
                            date_expiration: getResponseByNA(isNA, ResponseNA.NA_NULL),
                            input_date_expiration: getResponseByNA(isNA),
                            quantityMax: quantityMaxProduct(products, {
                                ...item,
                                batch_detail_id: batchDetailId,
                            } as IProductDetail),
                        };
                    }
                    return product;
                })
            );
        }
        if (nameInput === TypeNamesInputs.DATE_EXPIRED_INPUT) {
            setListProducts(
                listProducts.map(product => {
                    if (handleValidateField(product, option, item).expiration_detail) {
                        return {
                            ...product,
                            input_date_expiration: value,
                            date_expiration: option?.date_expired,
                        };
                    }
                    return product;
                })
            );
        }
    };

    const handleChangeSelectTable = (
        option: IOptionSelect,
        item?: IGenericRecord | undefined,
        nameInput?: string | undefined
    ): void => {
        const { key, value }: IGenericRecord = option;
        const product = products.filter(({ sku_internal }: IGenericRecord) => sku_internal === item?.sku_internal);
        const nameInputId = getNameInputId(nameInput);
        const listItems = item ? [{ ...item, [nameInputId]: key }] : [];
        const dataProduct = !lengthEqualToZero(product) ? product : [];

        const { batch, expirationDates } = createOptionsInTableInvoice(listItems, dataProduct);
        const isNA =
            nameInput === TypeNamesInputs.WAREHOUSE
                ? lengthEqualToZero(batch || batch[0])
                : lengthEqualToZero(expirationDates || batch[0]);
        getListProducts(key, value, isNA, option, item, nameInput);
    };

    const handleChangeDate = (date: Date, name: string): void => {
        const dateSelected = getUnixFromDate(date);
        setFieldInputs({
            ...fieldInputs,
            [TypeNamesInputs.DAYS]:
                name === TypeNamesInputs.DATE_LIMIT && fieldInputs?.payment_type_name !== TextPaymentTypes.COUNTED
                    ? getDaysFromTwoDates(fieldInputs.date, date)
                    : fieldInputs.days_collection,
            [name]: getDateFromUnix(dateSelected).formatYearMonthDay,
        });
    };

    const addProductTable = (): void => {
        setListProducts([...listProducts, initialDataTable(listProducts.length + 1, onSubmitForm)]);
        setListOptionsTable({
            ...listOptionsTable,
            warehouse: [...listOptionsTable.warehouse, []],
        });
    };

    const onChangeTableRetention = (
        { floatValue = NaN }: NumberFormatValues,
        nameField: string,
        item: ITableTaxesAndRetention,
        id = ''
    ): void => {
        const withholdings = tableWithholdings.map(withholding => {
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
        getCalculate({ products: listProducts, sending_charge: totalValues.total_charge_amount, withholdings });
        setTableWithholdings([...withholdings]);
    };

    const setSelectedCheckbox = (item: IGenericRecord): void => {
        setListProducts(
            listProducts.map(product => {
                if (product.id === item[0]?.id) {
                    return { ...product, check: !product.check };
                }
                return product;
            })
        );
    };

    const onDeleteTableProducts = (): void => {
        const items = listProducts.filter(product => !product.check);
        setListProducts(
            items.map((item, index) => {
                return {
                    ...item,
                    number: index + 1,
                };
            })
        );
        getCalculate({
            products: items,
            withholdings: tableWithholdings,
            sending_charge: totalValues.total_charge_amount,
        });
        handleShowModal(ModalOpen.DELETE);
    };

    const handleTotals = ({ floatValue = 0 }: NumberFormatValues, name: string): void => {
        setTotalValues({
            ...totalValues,
            [name]: floatValue,
        });
        getCalculate({
            products: listProducts,
            withholdings: tableWithholdings,
            sending_charge: floatValue,
        });
    };

    const assignValuesRadioButton = async (): Promise<void> => {
        const isActive = radioButtons[changeRadioButton] === YES;
        setFieldInputs({
            ...fieldInputs,
            [radioButtonsKeys[changeRadioButton]]: AuthorizedInformation === changeRadioButton ? !isActive : isActive,
        });
    };

    const searchCustomer = async (documentNumber: string): Promise<void> => {
        if (isWantedCustomer && customer && customer.person.document_number !== documentNumber) {
            const data: IGenericRecord = await dispatch(getInformationByIdentification(documentNumber, false));
            setExistingCustomer(!Array.isArray(data) && lengthGreaterThanZero(Object.keys(data)));
            return;
        }
        setExistingCustomer(false);
    };

    const discardChanges = (isDiscardDocument = false): void => {
        setFieldInputs({
            ...fieldInputs,
            ...(isDiscardDocument ? { document_number: customer.person.document_number } : initialCustomerData),
        });
        if (isDiscardDocument) {
            setExistingCustomer(false);
            setModalUpdateDocumentNumber(!modalUpdateDocumentNumber);
            return;
        }
        setFiscalResponsibilities(
            initialCustomerData.fiscal_responsibilities.map((item: IGenericRecord) => ({
                id: item.id,
                name: item.name ?? item.fiscal_responsibility_name,
            }))
        );
        setModalUpdateCustomer(!modalUpdateCustomer);
    };

    const saveAndSend = (isModalDocument = false): void => {
        if (isModalDocument) setModalUpdateDocumentNumber(false);
        else setModalUpdateCustomer(false);
        setValidateEditedField(true);
    };

    const addFiscalResponsibility = (): void => {
        setFiscalResponsibilities([...fiscalResponsibilities, { id: '', key: '', value: '' }]);
    };

    const handleSelectedProducts = (): void => {
        if (lengthGreaterThanZero(listProducts.filter(product => product.check === true))) handleShowModal(ModalOpen.DELETE);
    };

    const questionElectronicInvoice = IsElectronicInvoice
        ? questionsRadioButtonInvoice.onlyProducts
        : questionsRadioButtonInvoice.productsInvoice;

    const updateFieldsInModal = (validation: boolean): string[] => {
        return validation ? compareInformation(fieldInputs, customer) : [];
    };

    const textTableInvoice = PARAGRAPHS.DESCRIPTION_TABLE_INVOICE(registerInvoice && !isQuote, isView, isQuote);

    const handleTimer = (condition: boolean): void => {
        if (!condition) setTimePicker(!timePicker);
    };

    const handleShowSearchClient = (): boolean =>
        (fieldInputs.type_taxpayer_id && (!IsNaturalPerson || radioButtons[AuthorizedInformation] === YES)) || isQuote;

    const renderInvoicePrefix = (fieldInputs: IGenericRecord): React.ReactElement => {
        return (
            <div className="content-section not-margin">
                <div className="content-group-input not-margin">
                    {!registerInvoice && (
                        <div className="flex flex-col">
                            <SelectInput
                                clearOption={isClearOption}
                                labelText="*Prefijo:"
                                placeholder="Seleccionar"
                                options={buildOptions(prefixInvoice)}
                                value={fieldInputs?.prefix_id_name}
                                optionSelected={(option): void => handleChangeSelectName(option, 'prefix_id')}
                                disabled={disabledInputs || isView}
                                classesWrapper="input-style"
                                required={onSubmitForm && searchNameInput('prefix_id', inputValidation)}
                                name="prefix_id"
                                messagesCustom="Actualmente no cuenta con resoluciones vigentes"
                                icons={lengthEqualToZero(prefixInvoice)}
                            />
                            {fieldInputs?.prefix_id && (
                                <span className="text-tiny text-green input-style">
                                    {
                                        consecutiveValidation(
                                            storePrefix.find(({ id }) => id === fieldInputs?.prefix_id) || {},
                                            parameterization,
                                            true
                                        )?.currentConsecutive
                                    }
                                </span>
                            )}
                        </div>
                    )}
                    {registerInvoice && !isQuote && (
                        <TextInput
                            onlyNumbers
                            classesInput="text-number-format"
                            labelText="*Número de factura de venta:"
                            placeholder="00000"
                            classesWrapper="input-style"
                            value={fieldInputs?.number ?? ''}
                            required={onSubmitForm && searchNameInput('number', inputValidation)}
                            requiredText={textInvoice(registerInvoice, error)}
                            onChange={(e): void => handleChange(e.target.name, numericsInput(e.target.value))}
                            name="number"
                            disabled={disabledInputs || isView}
                        />
                    )}
                </div>
                {!isQuote && <p className="paragraph-tiny mb-4.5 -mt-2.5">{instructionsForInvoice.prefix}</p>}
            </div>
        );
    };

    const renderInvoiceEmission = (fieldInputs: IGenericRecord): React.ReactElement => {
        return (
            <div className="row-gap-8 content-section">
                <div className="content-group-date-input">
                    <DatePickerDayInput
                        id="dp-electronic-invoice-cesi-issue-date-calendar"
                        required={onSubmitForm && searchNameInput('date', inputValidation)}
                        classesWrapper="input-style"
                        labelText="Fecha de emisión:"
                        selected={getUnixFromDate(fieldInputs?.date)}
                        requiredText={textDateValidation(fieldInputs.date, inputValidation)}
                        onChangeDate={(e): void => handleChangeDate(e, 'date')}
                        disabled={disabledInputs || !isQuote}
                        name="date"
                        showPlaceHolderDate
                        minDate={getPreviousDays()}
                        maxDate={addDaysDate(9)}
                    />
                    <div className="relative flex-col hidden input-style">
                        <label htmlFor="hour" className="ml-1.5 mb-1 font-allerbold paragraph-tiny">
                            Hora de emisión:
                        </label>
                        <div
                            className={`relative flex justify-start h-full p-1 border cursor-pointer rounded-md ${
                                onSubmitForm && searchNameInput('time_issue', inputValidation) ? 'border-purple' : 'border-gray'
                            }  timepicker-handler ${isView ? 'bg-gray-light border-none items-center' : 'input--container'}`}
                            onClick={(): void => handleTimer(isView)}
                        >
                            <span className="relative mr-2 text-sm text-gray-dark timepicker-handler">
                                {getHourValue(times.time.hour)}:{getHourValue(times.time.minutes)}:
                                {getHourValue(times.time.seconds ?? 0)}
                                {times?.time?.schedule}
                            </span>
                            <Icon
                                name="arrowDownGray"
                                className={`transition duration-200 transform cursor-pointer timepicker-handler absolute right-0 ${
                                    validateClickTimePicker || timePicker ? 'rotate-180' : 'rotate-0'
                                }`}
                            />
                        </div>
                        <TimePicker
                            id="dp-electronic-invoice-cesi-hour-issue-time"
                            className={`transition duration-200 absolute mt-14 -right-6 xs:-right-0 ${
                                validateClickTimePicker || !timePicker ? 'hidden' : 'block'
                            } z-50`}
                            time={times.time}
                            setTime={times?.setTime || ((): void => {})}
                            setClickTimePicker={setClickTimePicker}
                            setTimePicker={setTimePicker}
                            clickTimePicker={clickTimePicker}
                            showSeconds
                        />
                    </div>
                    <DatePickerDayInput
                        id="dp-electronic-invoice-cesi-expiration-date-calendar"
                        required={onSubmitForm && searchNameInput('date_limit', inputValidation)}
                        requiredText={textEmailValidation(fieldInputs?.date_limit)}
                        classesWrapper="input-style"
                        labelText="Fecha de vencimiento:"
                        selected={getUnixFromDate(fieldInputs?.date_limit)}
                        onChangeDate={(e): void => handleChangeDate(e, 'date_limit')}
                        disabled
                        minDate={new Date(getDateFormatUnix(fieldInputs.date).date)}
                        showPlaceHolderDate
                    />
                </div>
                <p className="text-blue text-tiny">{messageHour(false)}</p>
            </div>
        );
    };

    const renderQuote = (fieldInputs: IGenericRecord): React.ReactElement => {
        return (
            <div className={isQuote ? 'content-section' : 'content-section-sale'}>
                {!isQuote && <p className="pl-0.75 paragraph-tiny">{instructionsForInvoice.sale}</p>}
                <div className="content-group-input not-margin">
                    {!isQuote && (
                        <TextInput
                            id="dp-electronic-invoice-cesi-purchase-order-number-text-box"
                            integerNumbers
                            required={onSubmitForm && searchNameInput('number_purchase_order', inputValidation)}
                            classesInput="text-number-format"
                            labelText="Número de orden de compra:"
                            placeholder="..."
                            value={fieldInputs.number_purchase_order}
                            classesWrapper="input-style"
                            onChange={(e): void => handleChange(e.target.name, numericsInput(e.target.value))}
                            disabled={disabledInputs || isView}
                            name="number_purchase_order"
                            maxLength={MaxLengthFields.ORDER}
                        />
                    )}
                    <TextInput
                        id="dp-electronic-invoice-cesi-sales-manager-text-box"
                        required={onSubmitForm && searchNameInput('sales_manager', inputValidation)}
                        labelText={`Encargado de la ${labels}:`}
                        placeholder="..."
                        value={fieldInputs.sales_manager}
                        classesWrapper="input-style"
                        onChange={(e): void => handleChange(e.target.name, lettersNumerics(e.target.value))}
                        onKeyDown={(e): void => validateLettersWithAccent(e)}
                        disabled={disabledInputs || isView}
                        name="sales_manager"
                    />
                    <SelectInput
                        id="dp-electronic-invoice-cesi-document-type-sales-manager-select"
                        required={onSubmitForm && searchNameInput('document_type_sales_manager', inputValidation)}
                        clearOption={isClearOption}
                        labelText={`Tipo de documento encargado de la ${labels}:`}
                        placeholder="Seleccionar"
                        options={buildOptions(
                            getDynamicRequest?.document_types
                                ? [
                                      { code: '', name: 'Seleccione tipo de documento', id: '' },
                                      ...(getDynamicRequest?.document_types || []),
                                  ]
                                : []
                        )}
                        value={getDocumentTypeName(getDynamicRequest?.document_types, fieldInputs?.document_type_sales_manager)}
                        optionSelected={(option): void => handleChangeSelectName(option, 'document_type_sales_manager')}
                        disabled={disabledInputs || isView}
                        classesWrapper="input-style"
                        name="document_type_sales_manager"
                    />
                    <div className="flex flex-row items-end">
                        <TextInput
                            id="dp-electronic-invoice-cesi-document-number-sales-manager-text-box"
                            onlyNumbers={fieldInputs?.document_type_sales_manager_name !== PA}
                            alphanumeric={fieldInputs?.document_type_sales_manager_name === PA}
                            classesInput="text-number-format"
                            labelText={`Número de documento encargado de la ${labels}:`}
                            placeholder="..."
                            value={fieldInputs.document_number_sales_manager}
                            onChange={(e): void => handleChange(e.target.name, lettersNumerics(e.target.value))}
                            disabled={disabledInputs || isView}
                            classesWrapper={`${
                                multiDigitVerification.sales_manager.isTypeNit ? 'w-52.5' : 'w-73'
                            } mt-0 xs:w-full`}
                            name="document_number_sales_manager"
                            maxLength={MaxLengthFields.DOCUMENT}
                            required={onSubmitForm && searchNameInput('document_number_sales_manager', inputValidation)}
                            requiredText={validateDocumentNumber(fieldInputs.document_number_sales_manager)}
                        />
                        {multiDigitVerification.sales_manager.isTypeNit && (
                            <TextInput
                                id="dp-electronic-invoice-cesi-document-dv-sales-manager-text-box"
                                classesWrapper="ml-4.5 w-11.2 xs:w-1/5"
                                labelText="DV:"
                                disabled
                                value={multiDigitVerification.sales_manager.digitVerification}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderPaymentInforamtion = (fieldInputs: IGenericRecord): React.ReactElement => {
        return (
            <div className="content-section">
                <h3 className="title-section">Información de pago</h3>
                <div className="content-group-input not-margin content-group-input-width-864">
                    <SelectInput
                        id="dp-electronic-invoice-cesi-tax-detail-select"
                        clearOption={isClearOption}
                        labelText="Detalle de impuestos:"
                        placeholder="Seleccionar"
                        options={formatTaxDetails(buildOptions(getDynamicRequest?.tax_details))}
                        value={fieldInputs.tax_details_name}
                        required={onSubmitForm && searchNameInput('tax_details_name', inputValidation)}
                        optionSelected={(option): void => handleChangeSelect(option, 'tax_details')}
                        disabled={isView || isFinalCustomer || disabledInputs}
                        classesWrapper="input-style"
                        name="tax_details"
                    />
                    <div className="flex flex-col h-auto">
                        {fiscalResponsibilities?.map((fiscalResponsibility, index) => (
                            <div
                                key={Symbol(fiscalResponsibility.name).toString()}
                                className="flex flex-wrap w-full xs:flex-col lg:gap-x-7 xs:w-full"
                            >
                                <SelectInput
                                    id="dp-electronic-invoice-cesi-fiscal-responsibility-select"
                                    clearOption={isClearOption}
                                    labelText="Responsabilidad fiscal:"
                                    placeholder="Seleccionar"
                                    options={buildOptions(fiscalResponsibilitiesOptions)}
                                    value={fiscalResponsibility.fiscal_responsibility_name ?? fiscalResponsibility.name}
                                    required={onSubmitForm && searchNameInput('fiscal_responsibilities', inputValidation)}
                                    requiredText={
                                        !fieldInputs?.type_taxpayer_code
                                            ? 'Es necesario que seleccione el tipo de contribuyente para continuar'
                                            : 'Es necesario que seleccione por lo menos 1 responsabilidad fiscal'
                                    }
                                    optionSelected={(option): void => handleChangeFiscalResponsibilities(option, index)}
                                    classesWrapper={`first:mb-0 relative input-style ${index ? 'mt-3' : ''}`}
                                    disabled={isView || isFinalCustomer || disabledInputs}
                                    name="fiscal_responsibility"
                                />
                                {!!index && (
                                    <Icon
                                        name="trashBlue"
                                        hoverIcon="trashGreen"
                                        className="self-end mb-2"
                                        onClick={(): void =>
                                            setFiscalResponsibilities(
                                                fiscalResponsibilities.filter((_, localIndex) => localIndex !== index)
                                            )
                                        }
                                    />
                                )}
                            </div>
                        ))}
                        {!isView && (
                            <Link
                                id="dp-electronic-invoice-cesi-add-fiscal-responsibility-button"
                                href="#"
                                text="+Agregar responsabilidad fiscal"
                                onClick={addFiscalResponsibility}
                                classes="text-base mt-2"
                                disabled={disabledFiscal || disabledInputs}
                            />
                        )}
                    </div>
                    <SelectInput
                        id="dp-electronic-invoice-cesi-payment-type-select"
                        clearOption={isClearOption}
                        classesWrapper="input-style"
                        labelText={`${notRequired}Forma de pago:`}
                        placeholder="Seleccionar"
                        options={buildOptions(getDynamicRequest?.payment_types)}
                        value={fieldInputs.payment_type_name}
                        required={onSubmitForm && searchNameInput('payment_type_id', inputValidation)}
                        optionSelected={(option): void => handleChangeSelect(option, 'payment_type')}
                        disabled={isView || disabledInputs}
                        name="payment_type"
                    />
                    {fieldInputs?.payment_type_name === TextPaymentTypes.CREDIT && (
                        <div className="flex gap-x-7 xs:flex-col xs:gap-y-4.5">
                            <TextInput
                                id="dp-electronic-invoice-cesi-payable-days-text-box"
                                integerNumbers
                                classesInput="text-number-format"
                                labelText={`${notRequired}Días de cobro:`}
                                placeholder="..."
                                value={fieldInputs.days_collection}
                                onChange={(e): void => handleChange(e.target.name, numericsInput(e.target.value))}
                                required={onSubmitForm && searchNameInput('days_collection', inputValidation)}
                                disabled={isView || disabledInputs}
                                classesWrapper="input-style__input-days"
                                name="days_collection"
                                maxLength={MaxLengthFields.PHONE_DAYS}
                            />
                            <div className="flex flex-col justify-end">
                                <RadioButton
                                    entities={RadioDaysCollectionType}
                                    selected={fieldInputs.days_collection_type}
                                    setSelected={(value): void => handleChangeSelect({ value, key: '' }, DAYS_TYPE)}
                                    linkerId={DAYS_TYPE}
                                />
                                {onSubmitForm && searchNameInput(DAYS_TYPE, inputValidation) && (
                                    <span className="text-tiny text-purple font-aller mt-1 mr-1.5 text-right">
                                        {DEFAULT_REQUIRED_TEXT}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    <SelectInput
                        id="dp-electronic-invoice-cesi-payment-method-select"
                        clearOption={isClearOption}
                        labelText="Medio de pago:"
                        placeholder="Seleccionar"
                        options={buildOptions(changeUltimateItem(paymentMethods))}
                        value={getDocumentTypeName(paymentMethods, fieldInputs.payment_method_id)}
                        required={onSubmitForm && searchNameInput('payment_method_id', inputValidation)}
                        optionSelected={(option): void => handleChangeSelect(option, 'payment_method')}
                        disabled={isView || disabledInputs}
                        classesWrapper="input-style"
                        name="payment_method"
                    />
                </div>
            </div>
        );
    };

    const renderCustomerInformation = (fieldInputs: IGenericRecord): React.ReactElement => {
        return (
            <div className="content-section">
                <h3 className="title-section">Información del cliente</h3>
                <div className="content-group-input not-margin">
                    <SelectInput
                        id="dp-electronic-invoice-cesi-taxpayer-type-select"
                        clearOption={isClearOption}
                        labelText={`${!isQuote ? '*' : ''}Tipo de contribuyente (Adquiriente):`}
                        placeholder="Seleccionar"
                        required={onSubmitForm && searchNameInput('type_taxpayer_id', inputValidation)}
                        options={buildOptions(getDynamicRequest?.type_tax_payer)}
                        value={getDocumentTypeName(getDynamicRequest?.type_tax_payer, fieldInputs.type_taxpayer_id)}
                        optionSelected={(option): void => handleChangeSelect(option, 'type_taxpayer')}
                        disabled={isView || disabledInputs}
                        classesWrapper="input-style"
                        name="type_taxpayer_name"
                    />
                </div>
                {!isQuote && (
                    <>
                        <p className="text-blue font-allerbold text-15px">{instructionsForInvoice.typeTaxpayer}</p>
                        {IsNaturalPerson && (
                            <div className="content-group-checkbox">
                                <RadioButton
                                    classesContainer="content-radio-input__direction"
                                    classesLabel="content-radio-input__input-size-auto"
                                    classesRadioButton="not-margin"
                                    setSelected={(e): void => handleRadioButton(AuthorizedInformation, e)}
                                    entities={authorizationInformation(tooltip, setTooltip)}
                                    selected={radioButtons[AuthorizedInformation]}
                                    linkerId={AuthorizedInformation}
                                    sizeLabel="xs"
                                    disabled={disabledInputs}
                                />
                            </div>
                        )}
                    </>
                )}
                <div className="content-group-input not-margin">
                    <div className="flex flex-col">
                        <TextInput
                            id="dp-electronic-invoice-cesi-customer-name-text-box"
                            required={onSubmitForm && searchNameInput('name', inputValidation)}
                            classesWrapper="input-style"
                            labelText={`${notRequired}Nombre cliente:`}
                            placeholder="..."
                            value={fieldInputs.name}
                            onChange={(e): void => handleChange(e.target.name, e.target.value)}
                            onKeyDown={(e): void => validateLettersWithAccentAndSpecialCharacters(e)}
                            disabled={isView || isFinalCustomer || disabledInputs}
                            name="name"
                        />
                        {handleShowSearchClient() && setShowModalSearchClient && (
                            <Link
                                id="dp-electronic-invoice-cesi-search-customer-button"
                                href="#"
                                text="Buscar cliente"
                                onClick={(): void => setShowModalSearchClient(true)}
                                classes="text-base mt-2"
                                disabled={disabledInputs}
                            />
                        )}
                    </div>
                    <div className="content-group-input not-margin">
                        <SelectInput
                            id="dp-electronic-invoice-cesi-document-type-customer-select"
                            placeholder="Seleccionar"
                            clearOption={isClearOption}
                            labelText={`${notRequired}Tipo de documento:`}
                            options={buildOptions(getDynamicRequest?.document_types)}
                            value={getDocumentTypeName(getDynamicRequest?.document_types, fieldInputs?.document_type)}
                            optionSelected={(option): void => handleChangeSelectName(option, 'document_type')}
                            disabled={isView || isFinalCustomer || disabledInputs}
                            classesWrapper="input-style"
                            name="document_type"
                            required={onSubmitForm && searchNameInput('document_type', inputValidation)}
                        />
                        <div className="content-document-number">
                            <TextInput
                                id="dp-electronic-invoice-cesi-document-number-customer-text-box"
                                alphanumeric={fieldInputs?.document_type_name === PA}
                                onlyNumbers={fieldInputs?.document_type_name !== PA}
                                classesInput="text-number-format"
                                labelText={`${notRequired}Número de documento:`}
                                placeholder="..."
                                value={fieldInputs.document_number}
                                required={
                                    (onSubmitForm && searchNameInput('document_number', inputValidation)) || existingCustomer
                                }
                                onBlur={(e): void => {
                                    if (isWantedCustomer) searchCustomer(e.target.value);
                                }}
                                requiredText={textCustomerValidation(
                                    isWantedCustomer,
                                    existingCustomer,
                                    fieldInputs.document_number
                                )}
                                onChange={(e): void => handleChange(e.target.name, lettersNumerics(e.target.value))}
                                disabled={isView || isFinalCustomer || disabledInputs}
                                classesWrapper={`${
                                    multiDigitVerification.client.isTypeNit ? 'input-style__document-number' : 'input-style'
                                }`}
                                name="document_number"
                                maxLength={MaxLengthFields.DOCUMENT}
                            />
                            {multiDigitVerification.client.isTypeNit && (
                                <TextInput
                                    id="dp-electronic-invoice-cesi-document-dv-customer-text-box"
                                    classesWrapper="input-style__digit-number"
                                    labelText="DV:"
                                    disabled
                                    value={multiDigitVerification.client.digitVerification}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {!isQuote && !isExcel && (
                    <>
                        <div className="content-radio-input">
                            <h3 className="title-radio">{questionsRadioButtonInvoice.electronicCustomer}</h3>
                            <RadioButton
                                classesLabel="radio-custom"
                                setSelected={(e): void => handleRadioButton(IsElectronicCustomer, e)}
                                selected={radioButtons[IsElectronicCustomer]}
                                entities={dataRadioButton}
                                linkerId={IsElectronicCustomer}
                                sizeLabel="xs"
                                disabled={disabledInputs}
                            />
                        </div>
                        {IsElectronicInvoice && (
                            <div className="content-radio-input">
                                <h3 className="title-radio">{questionsRadioButtonInvoice.emailCustomer}</h3>
                                <RadioButton
                                    classesLabel="radio-custom"
                                    setSelected={(e): void => handleRadioButton(InvoiceEmail, e)}
                                    selected={radioButtons[InvoiceEmail]}
                                    entities={dataRadioButton}
                                    linkerId={InvoiceEmail}
                                    sizeLabel="xs"
                                    disabled={disabledInputs}
                                />
                            </div>
                        )}
                    </>
                )}
                {((IsElectronicInvoice && radioButtons[InvoiceEmail] === YES) || isQuote) && (
                    <div className="content-group-input not-margin">
                        <TextInput
                            id="dp-electronic-invoice-cesi-customer-email-text-box"
                            labelText={`${notRequired}Correo electrónico:`}
                            placeholder="..."
                            value={fieldInputs.email}
                            required={onSubmitForm && searchNameInput('email', inputValidation)}
                            requiredText={textValidEmail(fieldInputs?.email)}
                            onChange={(e): void => handleChange(e.target.name, e.target.value)}
                            disabled={isView || disabledInputs}
                            classesWrapper="input-style"
                            name="email"
                            limitCharacters={false}
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderViewRadioButton = (fieldInputs: IGenericRecord): React.ReactElement => {
        return (
            <div className="content-section">
                <div className="content-radio-input">
                    <h3 className={`title-radio ${isQuote ? 'font-allerbold' : ''}`}>
                        {textQuote(isQuote, questionElectronicInvoice)}
                    </h3>
                    <RadioButton
                        classesLabel="radio-custom"
                        setSelected={(e): void => handleRadioButton(SendProducts, e)}
                        selected={radioButtons[SendProducts]}
                        entities={dataRadioButton}
                        linkerId={SendProducts}
                        sizeLabel="xs"
                        disabled={disabledInputs}
                    />
                </div>
                {radioButtons[SendProducts] === YES && (
                    <>
                        <p className="paragraph-tiny">{textAddressQuote(isQuote, instructionsForInvoice.address)}</p>
                        <div className="content-group-input not-margin">
                            <SelectSearchInput
                                id="dp-electronic-invoice-cesi-customer-country-text-box"
                                labelText="País:"
                                name={TypeNamesInputs.COUNTRY}
                                placeholder="Seleccionar"
                                classesWrapper="input-style"
                                optionSelect={buildOptionsSearch(
                                    lengthGreaterThanZero(getDynamicRequest?.countries) ? getDynamicRequest?.countries : []
                                )}
                                onChangeSelect={(selectedValue, selectedOption): void => {
                                    handleChangeSelect(selectedOption, TypeNamesInputs.COUNTRY);
                                }}
                                valueSelect={fieldInputs.country_id}
                                requiredText="*Campo a diligenciar"
                                disabled={disabledInputs}
                            />
                            {isColombia ? (
                                <SelectSearchInput
                                    id="dp-electronic-invoice-cesi-customer-state-select-search-input"
                                    classesWrapper="input-style"
                                    labelText="Departamento/Estado:"
                                    placeholder="Seleccionar"
                                    optionSelect={buildOptionsSearch(
                                        fieldInputs.country_id && lengthGreaterThanZero(getDynamicRequest?.departments)
                                            ? getDynamicRequest?.departments?.filter(
                                                  (department: IGenericRecord) =>
                                                      String(department?.country_id) === String(fieldInputs.country_id)
                                              )
                                            : getDynamicRequest?.departments
                                    )}
                                    valueSelect={fieldInputs.department_id}
                                    required={onSubmitForm && searchNameInput('department_name', inputValidation)}
                                    onChangeSelect={(selectedValue, selectedOption): void => {
                                        handleChangeSelect(selectedOption, 'department');
                                    }}
                                    disabled={isView || !fieldInputs.country_id || disabledInputs}
                                    name="department_name"
                                    classesWrapperInput="pl-3"
                                    requiredText="*Campo a diligenciar"
                                />
                            ) : (
                                <TextInput
                                    disabled={isView || disabledInputs}
                                    classesWrapper="input-style"
                                    value={fieldInputs.department_name}
                                    onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                    required={onSubmitForm && searchNameInput('department_name', inputValidation)}
                                    labelText="Departamento/Estado:"
                                    name="department_name"
                                    placeholder="..."
                                    lettersWithAccent
                                    maxLength={MaxLengthFields.STATE_CITY}
                                    requiredText="*Campo a diligenciar"
                                />
                            )}
                            {isColombia ? (
                                <SelectSearchInput
                                    id="dp-electronic-invoice-cesi-customer-city-select-search-input"
                                    name="city"
                                    labelText="Ciudad:"
                                    placeholder="Seleccionar"
                                    optionSelect={buildOptionsSearch(
                                        fieldInputs.department_id &&
                                            lengthGreaterThanZero(getDynamicRequest?.cities) &&
                                            !fieldInputs.city_id
                                            ? getDynamicRequest?.cities?.filter(
                                                  (city: IGenericRecord) =>
                                                      Number(city?.department_id) === Number(fieldInputs.department_id)
                                              )
                                            : getDynamicRequest?.cities
                                    )}
                                    valueSelect={fieldInputs.city_id}
                                    disabled={isView || !fieldInputs.department_id || disabledInputs}
                                    classesWrapper="input-style"
                                    required={onSubmitForm && searchNameInput('city_name', inputValidation)}
                                    onChangeSelect={(selectedValue, selectedOption): void => {
                                        handleChangeSelect(selectedOption, 'city');
                                    }}
                                    classesWrapperInput="pl-3"
                                    requiredText="*Campo a diligenciar"
                                />
                            ) : (
                                <TextInput
                                    disabled={isView || disabledInputs}
                                    classesWrapper="input-style"
                                    value={fieldInputs.city_name}
                                    required={onSubmitForm && searchNameInput('city_name', inputValidation)}
                                    onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                    labelText="Ciudad:"
                                    name="city_name"
                                    placeholder="..."
                                    lettersWithAccent
                                    maxLength={MaxLengthFields.STATE_CITY}
                                    requiredText="*Campo a diligenciar"
                                />
                            )}
                            <TextInput
                                id="dp-electronic-invoice-cesi-customer-postal-code-text-box"
                                integerNumbers
                                classesInput="text-number-format"
                                classesWrapper="input-style"
                                labelText="Código postal:"
                                min={6}
                                placeholder="..."
                                value={fieldInputs.postal_code}
                                requiredText={textPostalCode(fieldInputs?.postal_code)}
                                onChange={(e): void => handleChange(e.target.name, numericsInput(e.target.value))}
                                required={onSubmitForm && searchNameInput('postal_code', inputValidation)}
                                disabled={isView || disabledInputs}
                                name="postal_code"
                                maxLength={MaxLengthFields.POSTAL_CODE}
                            />
                            <TextInput
                                id="dp-electronic-invoice-cesi-customer-address-text-box"
                                labelText="Dirección:"
                                placeholder="..."
                                required={onSubmitForm && searchNameInput('address', inputValidation)}
                                value={fieldInputs.address}
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={isView || disabledInputs}
                                classesWrapper="input-style"
                                name="address"
                                requiredText="*Campo a diligenciar"
                            />
                            <TextInput
                                id="dp-electronic-invoice-cesi-customer-telephone-text-box"
                                integerNumbers
                                classesInput="text-number-format"
                                classesWrapper="w-73 xs:w-full mt-4.5 md:mt-0 hidden"
                                labelText="Teléfono:"
                                placeholder="..."
                                value={fieldInputs.phone}
                                required={onSubmitForm && searchNameInput('phone', inputValidation)}
                                onChange={(e): void => handleChange(e.target.name, numericsInput(e.target.value))}
                                disabled={isView || disabledInputs}
                                maxLength={MaxLengthFields.PHONE_DAYS}
                                name="phone"
                            />
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            {!isQuote &&
                !isExcel &&
                prefixesNextToExpire.map((item, index) => {
                    const isConsecutive = !!item.consecutiveAvailable;
                    return (
                        <ModalType
                            key={Symbol(item.numberPrefix).toString()}
                            {...modalInfoProps(
                                isConsecutive ? TITLES_MODALS_RESOLUTION.CONSECUTIVE : TITLES_MODALS_RESOLUTION.RESOLUTION_EXPIRE,
                                isConsecutive
                                    ? MODAL_CONSECUTIVE_RESOLUTION(item.consecutiveAvailable)
                                    : MODAL_RESOLUTION_EXPIRATION(item),
                                modals[index],
                                (): void => {
                                    toggleModal(String(index + 1));
                                }
                            )}
                        />
                    );
                })}
            <ModalUpdateDocumentNumber
                showModal={modalUpdateDocumentNumber}
                setShowModal={setModalUpdateDocumentNumber}
                documentNumber={fieldInputs.document_number}
                discardChange={(): void => discardChanges(true)}
                saveAndSend={(): void => saveAndSend(true)}
            />
            <ModalUpdateCustomer
                showModal={modalUpdateCustomer}
                setShowModal={setModalUpdateCustomer}
                fieldInput={fieldInputs}
                updateFields={updateFieldsInModal(modalUpdateCustomer)}
                customerInformation={{ name: customer?.name, documentNumber: customer?.person?.document_number }}
                discardChanges={(): void => discardChanges()}
                saveAndSend={(): void => saveAndSend()}
                isQuote={isQuote}
            />
            <ModalType
                type="delete"
                show={modalsErrors.delete}
                showModal={(): void => handleShowModal(ModalOpen.DELETE)}
                title="Eliminar"
                text={PRODUCT_SHIPPING.MODAL_DELETE}
                mainAction={(): void => onDeleteTableProducts()}
            />
            <div className="electronic-invoice">
                {paginator && <Paginator {...paginator} electronicDocument />}
                <Form>
                    <>
                        {renderInvoicePrefix(fieldInputs)}
                        {renderInvoiceEmission(fieldInputs)}
                        {renderQuote(fieldInputs)}
                        {renderPaymentInforamtion(fieldInputs)}
                        {renderCustomerInformation(fieldInputs)}
                        {renderViewRadioButton(fieldInputs)}
                        <div className="content-section">{textTableInvoice}</div>
                        <div className="content-group-input not-margin">
                            <SelectSearchInput
                                id="dp-electronic-invoice-cesi-currency-select-search-input"
                                labelText={`${notRequired}Divisa:`}
                                isTableSearch
                                optionSelect={listOptionsTable.foreignExchanges}
                                valueSelect={fieldInputs?.foreign_exchange_id}
                                onChangeSelect={(selectedValue, selectedOption): void =>
                                    handleChangeSelect(selectedOption, 'foreign_exchange')
                                }
                                required={onSubmitForm && searchNameInput('foreign_exchange_id', inputValidation)}
                                classesWrapper="input-style"
                                name="foreign_exchange"
                                disabled={disabledInputs}
                            />
                            {!isPrimeCurrency && (
                                <MoneyInput
                                    classesInput="text-number-format"
                                    labelText="*Tasa de cambio:"
                                    placeholder="..."
                                    classesWrapper="input-style"
                                    value={fieldInputs?.foreign_exchange_rate}
                                    required={!isPrimeCurrency && searchNameInput('foreign_exchange_rate', inputValidation)}
                                    onChange={(e: IGenericRecord): void =>
                                        setFieldInputs({
                                            ...fieldInputs,
                                            foreign_exchange_rate: e.floatValue,
                                        })
                                    }
                                    disabled={isView || disabledInputs}
                                />
                            )}
                        </div>
                    </>
                </Form>
                <div className="content-section-table">
                    {!isView && (
                        <Icon
                            id="dp-electronic-invoice-delete-product-button"
                            name="trashBlue"
                            hoverIcon="trashGreen"
                            className="self-end mb-2"
                            onClick={(): void => handleSelectedProducts()}
                        />
                    )}
                    <TableInvoice
                        data={onSubmitForm ? validateFieldsInputs(listProducts)?.productValidation : listProducts}
                        setSelected={setSelectedCheckbox}
                        fields={fieldsBody(
                            onChangeProductTable,
                            handleChangeSelectTable,
                            handleChangeSelectSearch,
                            onChangeProductTableEditInput,
                            listOptionsTable,
                            isView
                        )}
                        productOptions={productOptions}
                    />
                    {onSubmitForm &&
                        fieldInputs?.products.some((product: IGenericRecord) =>
                            lengthGreaterThanZero(product.fieldsWithError)
                        ) && (
                            <div className="ml-1">
                                <TableError customText={showMessageTableProducts(fieldInputs?.products)} />
                            </div>
                        )}
                    {DoYouHaveWarehouse &&
                        validateErrorStock(listProducts as IInvoiceDetails[]).map((message: string, index: number) => (
                            <TableError key={index + 'errorStock'} customText={message} />
                        ))}
                    {lengthEqualToZero(listProducts) && (
                        <NotFindElements
                            withoutData
                            customText="Hasta el momento no ha agregado productos/servicios, haga click sobre la opción +Agregar producto/servicio para agregar uno."
                        />
                    )}
                    {!isView && (
                        <div className="mt-2">
                            <Link
                                id="dp-electronic-invoice-cesi-add-product-service-button"
                                href="#"
                                text="+Agregar producto/servicio"
                                onClick={(): void => addProductTable()}
                                classes="text-base"
                                disabled={disabledInputs}
                            />
                        </div>
                    )}
                </div>
                <div className="content-section-table">
                    <div className="content-taxes-withholdings">
                        <div className="content-taxes-withholdings__table-taxes">
                            <TableTaxRetention
                                dataValuesTableTaxes={tableTaxes}
                                dataValuesTableRetention={tableWithholdings}
                                onChangeTableRetention={onChangeTableRetention}
                                errorsTableRetention={{
                                    messageFuente: messageReteFuente,
                                    messageIca: messageReteICA,
                                    messageIva: messageReteIVA,
                                    reteFuente: !!messageReteFuente,
                                    reteIca: !!messageReteICA,
                                    reteIva: !!messageReteIVA,
                                }}
                                isDisabledWithholdings={isDisabledTotalWithholdings}
                                options={{ reteIVA: listOptionsTable.reteIVA }}
                                isElectronicInvoice
                            />
                        </div>
                        <div className="content-taxes-withholdings__table-withholdings">
                            <TableTotals
                                dataTotals={tableTotals}
                                onChange={handleTotals}
                                totalValues={totalValues}
                                isDisabledTotals={isDisabledTotalWithholdings}
                            />
                        </div>
                    </div>
                </div>
                {fileLinkView && (
                    <div className="my-4.5">
                        <span className=" text-gray-dark">
                            Para visualizar el registro de sus archivos importados anteriormente, &nbsp;
                            <Link href={route} text="haga click aquí." classes="text-base" linkColor={LinkColor.PURPLE} />
                        </span>
                    </div>
                )}
                {textRoute && (
                    <p className="text-gray-dark">
                        {textRoute}, &nbsp;
                        <Link
                            id="dp-electronic-invoice-cesi-register-sale-link"
                            href={route}
                            onClick={routeOnClick}
                            text="haga click aquí."
                            classes="text-base"
                            linkColor={LinkColor.PURPLE}
                        />
                    </p>
                )}
                <div className="content-group-input not-margin">
                    <TextArea
                        id="dp-electronic-invoice-cesi-comments-text-area"
                        labelText="Observaciones:"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        value={fieldInputs.note}
                        required={onSubmitForm && searchNameInput('note', inputValidation)}
                        name="note"
                        classesWrapper="input-style"
                        placeholder=""
                        classesInput="px-2"
                        disabled={isView || disabledInputs}
                        maxLength={MaxLengthFields.OBSERVATIONS}
                    />
                </div>
            </div>
        </>
    );
};
