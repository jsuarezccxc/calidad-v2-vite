import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';
import { IconTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer/PageButtonsFooter';
import { Information } from '@components/information/Information';
import { DatePickerMonthInput, IOptionSelect, PasswordInput, SelectInput, SelectSearchInput, TextInput } from '@components/input';
import { ModalType } from '@components/modal-custom';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import Footer from '@components/footer';
import { Tooltip } from '@components/tooltip';
import { Routes } from '@constants/Paths';
import { APPROVED, DECLINED, CREDIT_DEBIT_CARD, ItemsPay, PSE, PENDING } from '@constants/PaymentMethods';
import {
    CITIES,
    COUNTRIES,
    DEPARTMENTS,
    DOCUMENT_TYPES,
    TYPE_TAX_PAYER,
    TAX_DETAIL,
    FISCAL_RESPONSIBILITIES,
    NATURAL_PERSON,
    SIMPLE_REGIMEN,
} from '@constants/DynamicRequest';
import { PRODUCT_NAME } from '@constants/ProductName';
import { TitleButtons } from '@constants/Buttons';
import { COLOMBIA_ID } from '@constants/Location';
import { CONFLICT, SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { getDateFromUnix, getUnix } from '@utils/Date';
import { getRoute } from '@utils/Paths';
import { cardType } from '@utils/CreditCard';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { validateEmail } from '@utils/Validation';
import { lengthEqualToZero } from '@utils/Length';
import { IGenericRecord } from '@models/GenericRecord';
import { ModuleApp } from '@utils/GenerateId';
import { IDataTablePurchase } from '@models/Membership';
import { RootState } from '@redux/rootReducer';
import {
    deleteCardToken,
    getBanks,
    getCardPayU,
    postPayMembershipsOrUsers,
    postPayMembershipsOrUsersByPse,
    setShowResponseModal,
} from '@redux/payments/actions';
import { getDynamicRequest } from '@redux/dynamic-data/actions';
import { getActiveMembership, setTablePurchase, setTableBillsUsers, setShowModalInactivity } from '@redux/membership/actions';
import { updateEmailFromCustomer, validateEmailDocumentClient } from '@redux/electronic-invoice/actions';
import { getActiveModules, getInformationCompany } from '@redux/company/actions';
import { clearSession, setLoginModal } from '@redux/session/actions';
import { ModalValidateEmail } from './components';
import usePopper from '@hooks/usePopper';
import InactivityDetector from './components/InactivityDetector';
import {
    INITIAL_DATA,
    INITIAL_DATA_CARD_OPTIONS,
    REQUIRED_FIELDS,
    CARD_TYPES,
    MAX_NUMBER_POSTAL_CODE,
    MAX_NUMBER_SECURITY_CODE,
    SINGLE_USER,
    ZERO,
    MAX_LENGTH_ALPHANUMERIC,
    MAX_LENGTH_NUMERIC,
    MAX_LENGTH_EMAIL,
    URL_PARAM_INFO_PAYMENT,
} from '.';
import './PaymentMethods.scss';

const PaymentMethods: React.FC<{
    setContinuePayment?: Dispatch<SetStateAction<boolean>>;
    continuePayment?: boolean;
}> = ({ setContinuePayment, continuePayment }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { search } = useLocation();
    const UTILS = [COUNTRIES, CITIES, DEPARTMENTS, DOCUMENT_TYPES, TYPE_TAX_PAYER, TAX_DETAIL, FISCAL_RESPONSIBILITIES];

    const {
        validateClient,
        information,
        user,
        accessToken,
        banks,
        cardInfo = {},
        itemToPay,
        response,
        showResponseModal,
        tablePurchasePayment,
        tablePurchaseBillsUsers,
        membership_to_pay,
        users_to_pay,
        dynamicData,
    } = useSelector(({ session, company, membership, electronicInvoice, dynamicData, payments }: RootState) => ({
        ...session,
        ...company,
        ...membership,
        ...electronicInvoice,
        ...dynamicData,
        ...payments,
    }));

    const { anchorEl, mouseProps } = usePopper();

    const [option, setOption] = useState<string>(CREDIT_DEBIT_CARD);
    const [infoPayment, setInfoPayment] = useState<IGenericRecord>(INITIAL_DATA);
    const [requiredFields, setRequiredFields] = useState<IGenericRecord>(REQUIRED_FIELDS);
    const [countries, setCountries] = useState<SelectSearchOption[]>([]);
    const [departments, setDepartments] = useState<SelectSearchOption[]>([]);
    const [cities, setCities] = useState<SelectSearchOption[]>([]);
    const [isNewPayCard, setIsNewPayCard] = useState<boolean>(false);
    const [showModalEmail, setShowModalEmail] = useState<boolean>(false);
    const [cardOptions, setCardOptions] = useState<IGenericRecord[]>(INITIAL_DATA_CARD_OPTIONS);
    const [validate, setValidate] = useState<boolean>(false);
    const [, setHaveMembership] = useState<boolean>(lengthEqualToZero(information?.active_memberships || []));
    const [showModalDeleteCard, setShowModalDeleteCard] = useState(false);

    /* ONLY FOR PSE */
    const [selectedBank, setSelectedBank] = useState<IGenericRecord>({});
    const [requiredBank, setRequiredBank] = useState<boolean>(false);

    const selectPaymentMethod = (method: string): void => {
        setOption(method);
        setCardOptions(
            method === PSE
                ? INITIAL_DATA_CARD_OPTIONS.map((item: IGenericRecord) => ({ ...item, isSelect: false }))
                : INITIAL_DATA_CARD_OPTIONS
        );
    };

    const [responsibilities, selectedResponsibilities] = [dynamicData.fiscal_responsibilities, infoPayment.responsibilities];

    useEffect(() => {
        dispatch(getCardPayU());
        dispatch(getDynamicRequest(UTILS));
        setHaveMembership(lengthEqualToZero(information?.active_memberships || []));
        history.replace({ search: '' });
    }, []);

    useEffect(() => {
        if (search && option === PSE) dispatch(getBanks());

        if (!search) {
            setRequiredFields(REQUIRED_FIELDS);
            setInfoPayment(INITIAL_DATA);
            setRequiredBank(false);
            setSelectedBank({});
        }
    }, [search]);

    useEffect(() => {
        if (dynamicData) {
            setCountries(buildOptionsSearch(dynamicData?.countries || []));
            setDepartments(buildOptionsSearch(dynamicData?.departments || []));
        }
    }, [dynamicData]);

    useEffect(() => {
        if (response?.error) dispatch(setShowResponseModal());
    }, [response]);

    useEffect(() => {
        if (infoPayment.departmentId) {
            setCities(
                buildOptionsSearch(
                    dynamicData?.cities?.filter((city: IGenericRecord) => city.department_id === String(infoPayment.departmentId))
                )
            );
        }
    }, [infoPayment.departmentId]);

    useEffect(() => {
        setIsNewPayCard(!Object.values(cardInfo).length);
    }, [cardInfo]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onChangeValue = (e: any, name = ''): void => {
        if (name) {
            setRequiredFields({
                ...requiredFields,
                [name]: !e,
            });

            setInfoPayment({
                ...infoPayment,
                [name]: name === 'expirationDate' ? getUnix(e) : e,
                responsibilities: name === 'taxPayerType' ? [''] : infoPayment.responsibilities,
            });
        } else {
            setRequiredFields({
                ...requiredFields,
                [e.target.name]: !e.target.value,
                validEmail:
                    e.target.name === 'email' && e.target.value ? !validateEmail(e.target.value) : requiredFields.validEmail,
                postalCodeLength:
                    e.target.name === 'postalCode' && e.target.value
                        ? e.target.value.length < MAX_NUMBER_POSTAL_CODE
                        : requiredFields.postalCodeLength,
                securityCodeLessDigits:
                    e.target.name === 'securityCode' && e.target.value
                        ? e.target.value.length < MAX_NUMBER_SECURITY_CODE
                        : requiredFields.securityCodeLessDigits,
            });

            setInfoPayment({
                ...infoPayment,
                [e.target.name]: e.target.value,
            });
        }
    };

    const onChangeDepartment = (departmentOption: SelectSearchOption): void => {
        setRequiredFields({ ...requiredFields, department: false });
        setInfoPayment({ ...infoPayment, department: departmentOption.name, departmentId: departmentOption.value, city: '' });
    };

    const onChangeBank = (bankId: string): void => {
        const bankSelected = banks.find((bank: IGenericRecord) => bank.id === bankId);
        bankSelected && setRequiredBank(false);
        bankSelected &&
            setSelectedBank({
                code: bankSelected.pseCode,
                value: bankSelected.id,
                name: bankSelected.description,
            });
    };

    const selectedCard = (field: string): void => {
        setOption(CREDIT_DEBIT_CARD);
        setCardOptions(
            cardOptions.map((option: IGenericRecord) => {
                if (option.name === field) return { ...option, isSelect: !option.selected };
                return { ...option, isSelect: false };
            })
        );
    };

    const validateDescriptionInPay = (): string => {
        const bills = [...tablePurchaseBillsUsers, ...tablePurchasePayment];
        const descriptions = bills.map((bill: IDataTablePurchase) => bill.description).join(' / ');
        if (itemToPay === ItemsPay.MEMBERSHIPS) return `Pago de membresía en ${PRODUCT_NAME}: ${descriptions}`;
        return `Pago de ${users_to_pay} usuario${users_to_pay === SINGLE_USER ? '' : 's'} en ${PRODUCT_NAME}.`;
    };

    const getOptionValue = (options: IGenericRecord[] = [], { value, key = 'id' }: IGenericRecord): string => {
        return options?.find(({ name }: IGenericRecord) => name === value)?.[key] || '';
    };

    const saveInfoPayment = async (): Promise<void> => {
        const hastEmptyFields = !infoPayment.taxPayerType || !responsibilities[ZERO];
        const { taxPayerType, tax, documentType, departmentId, city, documentNumber, email } = infoPayment;
        const baseData = {
            company_id: user?.company_id || '',
            is_immediate_purchase: false,
            users_quantity: ZERO,
            pages_quantity: ZERO,
            ...membership_to_pay,
            additional_customer_data: {
                type_taxpayer_id: getOptionValue(dynamicData.type_tax_payer, { value: taxPayerType }),
                type_taxpayer_name: taxPayerType,
                tax_details_code: getOptionValue(dynamicData.tax_details, { value: tax, key: 'code' }),
                tax_details_name: tax,
                document_type: getOptionValue(dynamicData.document_types, { value: documentType }),
                department_id: departmentId,
                country_id: COLOMBIA_ID,
                city_id: cities?.find(({ name }) => name === city)?.value,
                fiscal_responsibilities: selectedResponsibilities.map((item: string) => ({
                    id: responsibilities?.find(({ name }: IGenericRecord) => name === item)?.id || '',
                })),
                card_type: CARD_TYPES.find(item => item.value === infoPayment.cardType)?.name,
            },
            payu_data: {
                transaction: {
                    order: {
                        description: validateDescriptionInPay(),
                        notifyUrl: process.env.REACT_APP_FRONT_BASE_URL,
                        buyer: {
                            fullName: infoPayment.nameClient,
                            emailAddress: infoPayment.email,
                            contactPhone: infoPayment.phone,
                            dniNumber: infoPayment.documentNumber,
                            shippingAddress: {
                                street1: infoPayment.address,
                                street2: infoPayment.address,
                                city: infoPayment.city,
                                state: infoPayment.department,
                                country: 'CO',
                                postalCode: infoPayment.postalCode,
                                phone: infoPayment.phone,
                            },
                        },
                    },
                    payer: {
                        fullName: infoPayment.name,
                        emailAddress: infoPayment.email,
                        contactPhone: infoPayment.phone,
                        dniNumber: infoPayment.documentNumber,
                        billingAddress: {
                            street1: infoPayment.address,
                            street2: infoPayment.address,
                            city: infoPayment.city,
                            state: infoPayment.department,
                            country: 'CO',
                            postalCode: infoPayment.postalCode,
                            phone: infoPayment.phone,
                        },
                    },
                    paymentMethod: cardType(infoPayment.number),
                    userAgent: window.navigator.userAgent,
                },
            },
        };
        const response: IGenericRecord = await dispatch(validateEmailDocumentClient({ document_number: documentNumber, email }));
        if (CONFLICT.includes(Number(response['statusCode'])) && cardOptions.length && !cardOptions[0].isSelect) {
            if (response['message'].includes('document')) {
                setShowModalEmail(true);
                return;
            }
        }
        if (option === PSE) {
            if (
                Object.entries(infoPayment).some(
                    ([key, value]) =>
                        key !== 'number' && key !== 'securityCode' && key !== 'expirationDate' && key !== 'name' && !value
                ) ||
                lengthEqualToZero(Object.values(selectedBank))
            ) {
                const newRequiredFields = {
                    ...requiredFields,
                };

                Object.entries(infoPayment).forEach(([key, value]) => {
                    if (
                        !value &&
                        key !== 'departmentId' &&
                        key !== 'number' &&
                        key !== 'securityCode' &&
                        key !== 'expirationDate' &&
                        key !== 'name'
                    )
                        newRequiredFields[key] = !value;
                });

                setRequiredBank(lengthEqualToZero(Object.keys(selectedBank)));
                setRequiredFields(newRequiredFields);
                return;
            }

            if (
                Object.entries(requiredFields).some(
                    ([key, value]) =>
                        key !== 'number' && key !== 'securityCode' && key !== 'expirationDate' && key !== 'name' && value
                )
            )
                return;

            if (selectedBank.code === '0') return;

            const dataForSend = {
                ...baseData,
                payu_data: {
                    ...baseData.payu_data,
                    transaction: {
                        ...baseData.payu_data.transaction,
                        extraParameters: {
                            RESPONSE_URL: `${process.env.REACT_APP_FRONT_BASE_URL}${getRoute(Routes.HOME)}`,
                            PSE_REFERENCE1: '127.0.0.1',
                            FINANCIAL_INSTITUTION_CODE: selectedBank.code,
                            USER_TYPE: infoPayment.taxPayerType === NATURAL_PERSON ? 'N' : 'J',
                            PSE_REFERENCE2: infoPayment.documentType,
                            PSE_REFERENCE3: infoPayment.documentNumber,
                        },
                        paymentMethod: PSE,
                    },
                },
            };
            if (hastEmptyFields) return setValidate(true);

            dispatch(postPayMembershipsOrUsersByPse(dataForSend, itemToPay === ItemsPay.MEMBERSHIPS));
        } else {
            if (
                cardInfo &&
                Object.values(cardInfo).length &&
                cardOptions.find((option: IGenericRecord) => option.name === 'selectedCard')?.isSelect
            ) {
                dispatch(postPayMembershipsOrUsers({ ...baseData, payu_data: {} }, true));
                return;
            }

            if (Object.entries(infoPayment).some(([, value]) => !value)) {
                const newRequiredFields = {
                    ...requiredFields,
                };

                Object.entries(infoPayment).forEach(([key, value]) => {
                    if (!value) newRequiredFields[key] = !value;
                });

                setRequiredFields(newRequiredFields);
                return;
            }

            if (Object.values(requiredFields).some(value => value)) return;

            const creditCardBase = {
                name: infoPayment.name || '',
                number: infoPayment.number,
                expirationDate: getDateFromUnix(infoPayment.expirationDate, 'yyyy/MM').dateFormat,
                securityCode: infoPayment.securityCode,
            };
            const creditCardDataCreateToken = {
                ...creditCardBase,
                payerId: user?.id || '',
                paymentMethod: cardType(infoPayment.number),
                identificationNumber: infoPayment.documentNumber,
            };

            const dataForSend = {
                ...baseData,
                payu_data: {
                    ...baseData.payu_data,
                    transaction: {
                        ...baseData.payu_data.transaction,
                        creditCard: { ...creditCardDataCreateToken },
                        paymentMethod: cardType(infoPayment.number),
                    },
                },
            };
            if (hastEmptyFields) return setValidate(true);

            dispatch(postPayMembershipsOrUsers(dataForSend, false, isNewPayCard));
        }
    };

    const validateNextButton = (): void => {
        if (search) {
            saveInfoPayment();
            return;
        }

        if (
            cardInfo &&
            Object.values(cardInfo).length &&
            cardOptions.find((option: IGenericRecord) => option.name === 'selectedCard')?.isSelect
        ) {
            saveInfoPayment();
            return;
        }

        history.push({ search: URL_PARAM_INFO_PAYMENT });
    };

    const validateBackButton = (): void => {
        if (search === URL_PARAM_INFO_PAYMENT) {
            history.push(getRoute(Routes.PAYMENT_PLANS_MENU));
            return;
        }

        if (setContinuePayment) setContinuePayment(!continuePayment);
    };

    const validateDescriptionTransactionModal = (): React.ReactElement => {
        if (response && Object.values(response).length) {
            if (response?.state === APPROVED || response?.payment_status === APPROVED)
                return (
                    <p>
                        Su transacción ha sido <span className="font-allerbold">aprobada</span>.
                    </p>
                );
            if (response?.state === DECLINED)
                return (
                    <p className="w-97">
                        Su transacción ha sido <span className="font-allerbold">Rechazada</span>. Inténtelo de nuevo más tarde.
                    </p>
                );
            if (response?.state === PENDING)
                return (
                    <p>
                        Su transacción se encuentra <span className="font-allerbold">Pendiente</span> de aprobación.
                    </p>
                );
            return <p className="w-97">Inténtelo de nuevo más tarde.</p>;
        }
        return <p className="w-97">No se pudo completar el pago. Inténtelo de nuevo.</p>;
    };

    const getAvailableResponsibilities = (): IGenericRecord[] => {
        const options = infoPayment.taxPayerType === NATURAL_PERSON ? responsibilities.slice(3, 5) : responsibilities;
        return options.filter(({ name }: IGenericRecord) => selectedResponsibilities.every((item: string) => item !== name));
    };

    const changeResponsibility = (id: number, value: string): void => {
        setInfoPayment({
            ...infoPayment,
            responsibilities:
                value === SIMPLE_REGIMEN
                    ? [SIMPLE_REGIMEN]
                    : selectedResponsibilities.map((item: string, index: number) => (index === id ? value : item)),
        });
    };

    const addResponsibility = (): void => {
        if (selectedResponsibilities.length < responsibilities.length) {
            setInfoPayment({
                ...infoPayment,
                responsibilities: [...selectedResponsibilities, ''],
            });
        }
    };

    const deleteResponsibility = (id: number): void => {
        setInfoPayment({
            ...infoPayment,
            responsibilities: infoPayment.responsibilities.filter((item: string, index: number) => index !== id),
        });
    };

    const onValidateEmailSubmit = async (data: IGenericRecord): Promise<void> => {
        const status = await dispatch(updateEmailFromCustomer(validateClient?.id, { ...data }));
        if (SUCCESS_RESPONSE.includes(Number(status))) {
            setInfoPayment({ ...infoPayment, ...data });
            await saveInfoPayment();
        }
    };

    const handleDeleteCard = async (): Promise<void> => {
        const statusCode = await dispatch(deleteCardToken());
        if (SUCCESS_RESPONSE.includes(Number(statusCode))) {
            dispatch(getCardPayU());
            setShowModalDeleteCard(!showModalDeleteCard);
        }
    };

    const handleInactive = (): void => {
        dispatch(setShowModalInactivity(true));
        setTimeout(() => {
            history.push(getRoute(Routes.PAYMENT_PLANS_MENU));
        }, 2000);
    };

    const handleModalResponse = async (): Promise<void> => {
        if (response?.state === APPROVED || response?.payment_status === APPROVED) {
            dispatch(setTablePurchase([]));
            dispatch(setTableBillsUsers([]));
            if (accessToken) {
                history.push(getRoute(Routes.HOME));
                dispatch(clearSession());
                const elementHeader = document.querySelector('*');
                elementHeader?.classList.remove('screen-scroll-smooth');
                elementHeader?.classList.add('screen-smooth-logout');
            }

            await Promise.all([dispatch(getInformationCompany()), dispatch(getActiveMembership()), dispatch(getActiveModules())]);
            setTimeout(() => {
                dispatch(setLoginModal());
            }, 2500);
        }

        if (response?.state === DECLINED || response?.payment_status === DECLINED) {
            if (search === URL_PARAM_INFO_PAYMENT) {
                if (setContinuePayment) setContinuePayment(!continuePayment);
                history.push(getRoute(Routes.PURCHASING_PROCESS));
                dispatch(setShowResponseModal());
                return;
            }
        }

        dispatch(setShowResponseModal());
    };

    return (
        <>
            <ModalType
                show={showResponseModal}
                showModal={handleModalResponse}
                type="info"
                title="Información"
                text={validateDescriptionTransactionModal()}
                otherAction={handleModalResponse}
                backBtnText={
                    response?.state === APPROVED || response?.payment_status === APPROVED
                        ? TitleButtons.LOGIN
                        : TitleButtons.ACCEPT
                }
                isHiddenButton={false}
            />
            <ModalValidateEmail
                showModalSave={showModalEmail}
                setShowModalSave={setShowModalEmail}
                onValidateEmailSubmit={onValidateEmailSubmit}
                currentEmail={infoPayment.email}
                previousEmail={validateClient?.email}
            />
            <ModalType
                show={showModalDeleteCard}
                showModal={(): void => {
                    setShowModalDeleteCard(!showModalDeleteCard);
                }}
                type="delete"
                title="Eliminar"
                text="¿Está seguro de eliminar el elemento seleccionado?"
                mainAction={handleDeleteCard}
                classesWrapper={'h-51.75'}
            />
            {search && <InactivityDetector onInactive={handleInactive} />}
            <div className="bg-gray-background px-28">
                <IconTitle label="Proceso de compra" icon="purchasingProcess" size="large" classContainer="mt-7 mb-2" />
                <IconTitle label={`${search ? 'Información de pago' : 'Método de pago'}`} size="medium" classContainer="my-4" />
                <div className="flex flex-col flex-1 payment-methods">
                    <div className="flex flex-col flex-1 mb-5 payment-methods__body">
                        <Information
                            title=""
                            description={`${
                                search
                                    ? 'Agregue la información para facturar y la información de su tarjeta. Si permanece 10 minutos inactivo será redireccionado a Planes de pago.'
                                    : 'Seleccione el método de pago que desea utilizar. '
                            }`}
                            classNameContainer="text-2lg mb-4 text-justify"
                        />
                        {search ? (
                            <>
                                <div className="info-credit-debit-card">
                                    {option === PSE && (
                                        <>
                                            <Information
                                                title="Información del banco"
                                                separator
                                                color="blue"
                                                classNameContainer="mb-4.5"
                                            />

                                            <div className="mt-4.5 mb-6">
                                                <SelectSearchInput
                                                    labelText="*Seleccione el banco:"
                                                    valueSelect={selectedBank?.value || ''}
                                                    optionSelect={buildOptionsSearch(banks, false, false, true)}
                                                    onChangeSelect={(bankId: string): void => onChangeBank(bankId)}
                                                    required={requiredBank || selectedBank?.code === '0'}
                                                    requiredText={
                                                        selectedBank?.code === '0' ? '*Seleccione su banco' : '*Campo obligatorio'
                                                    }
                                                    placeholder="Seleccione"
                                                />
                                            </div>
                                        </>
                                    )}
                                    <Information
                                        title="Información para facturar"
                                        separator
                                        color="blue"
                                        classNameContainer="mb-4.5"
                                    />
                                    <Form
                                        className={`flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-y-3 gap-x-7 ${
                                            option === PSE ? 'mb-2' : ''
                                        }`}
                                    >
                                        <TextInput
                                            name="nameClient"
                                            labelText="*Nombre del cliente:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="Nombre"
                                            value={infoPayment.nameClient || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                            required={requiredFields.nameClient}
                                            maxLength={MAX_LENGTH_ALPHANUMERIC}
                                        />
                                        <SelectInput
                                            name="documentType"
                                            labelText="*Tipo de documento del cliente:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="CC/CE/NIT"
                                            value={infoPayment.documentType || ''}
                                            optionSelected={(option: IOptionSelect): void =>
                                                onChangeValue(option.value, 'documentType')
                                            }
                                            options={buildOptions(dynamicData?.document_types).filter(
                                                (document: IGenericRecord) => document.value !== 'PA'
                                            )}
                                            required={requiredFields.documentType}
                                        />
                                        <div className="hidden xl:block" />
                                        <TextInput
                                            name="documentNumber"
                                            labelText="*Número de documento del cliente:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="000000000"
                                            value={infoPayment.documentNumber || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                            required={requiredFields.documentNumber}
                                            onlyNumbers
                                            maxLength={MAX_LENGTH_NUMERIC}
                                        />
                                        <TextInput
                                            name="email"
                                            labelText="*Correo electrónico:"
                                            classesWrapper="w-full sm:w-73"
                                            placeholder="correo@gmail.com"
                                            value={infoPayment.email || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                            required={requiredFields.email || requiredFields.validEmail}
                                            requiredText={
                                                requiredFields.validEmail
                                                    ? '*Ingrese un correo electrónico válido'
                                                    : '*Campo obligatorio'
                                            }
                                            limitCharacters={false}
                                        />
                                        <div className="hidden xl:block" />
                                        <TextInput
                                            name="address"
                                            labelText="*Dirección:"
                                            classesWrapper="w-full sm:w-73"
                                            placeholder="Cra xx #00-00"
                                            value={infoPayment.address || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                            required={requiredFields.address}
                                            maxLength={MAX_LENGTH_ALPHANUMERIC}
                                        />
                                        <SelectSearchInput
                                            name="country"
                                            labelText="*País:"
                                            classesWrapper="w-full relative sm:w-73 mb-2"
                                            placeholder="xxxxxxxxx"
                                            valueSelect={
                                                countries.find((country: IGenericRecord) => country.name === 'Colombia')?.value
                                            }
                                            optionSelect={countries}
                                            onChangeSelect={(): void => {}}
                                            disabled
                                        />
                                        <div className="hidden xl:block" />
                                        <SelectSearchInput
                                            name="deparment"
                                            labelText="*Departamento:"
                                            classesWrapper="w-full relative sm:w-73 mb-2"
                                            placeholder="*Cundinamarca"
                                            valueSelect={
                                                departments.find(
                                                    (department: SelectSearchOption) => department.name === infoPayment.department
                                                )?.value || ''
                                            }
                                            optionSelect={departments}
                                            onChangeSelect={(selectedValue, selectedOption): void =>
                                                onChangeDepartment(selectedOption)
                                            }
                                            required={requiredFields.department}
                                        />
                                        <SelectSearchInput
                                            name="city"
                                            labelText="*Ciudad:"
                                            classesWrapper="w-full relative sm:w-73 mb-2"
                                            placeholder="*Bogotá"
                                            valueSelect={
                                                cities.find((city: SelectSearchOption) => city.name === infoPayment.city)
                                                    ?.value || ''
                                            }
                                            optionSelect={cities}
                                            onChangeSelect={(selectedValue, selectedOption): void =>
                                                onChangeValue(selectedOption.name, 'city')
                                            }
                                            required={requiredFields.city}
                                        />
                                        <div className="hidden xl:block" />
                                        <TextInput
                                            name="postalCode"
                                            labelText="*Código postal:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="111111"
                                            value={infoPayment.postalCode || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                            required={requiredFields.postalCode || requiredFields.postalCodeLength}
                                            requiredText={
                                                requiredFields.postalCodeLength
                                                    ? '*El código postal debe ser de 6 digitos'
                                                    : '*Campo obligatorio'
                                            }
                                            onlyNumbers
                                            maxLength={MAX_NUMBER_POSTAL_CODE}
                                        />
                                        <TextInput
                                            name="phone"
                                            labelText="*Teléfono:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="111111"
                                            value={infoPayment.phone || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                            required={requiredFields.phone}
                                            onlyNumbers
                                            maxLength={MAX_LENGTH_NUMERIC}
                                        />
                                        <div className="hidden xl:block" />
                                        <SelectInput
                                            name="tax"
                                            labelText="*Detalle de impuesto:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="Seleccionar"
                                            value={infoPayment.tax}
                                            optionSelected={(option: IOptionSelect): void => onChangeValue(option.value, 'tax')}
                                            options={buildOptions(dynamicData?.tax_details)}
                                            required={requiredFields.tax}
                                        />
                                        <SelectInput
                                            name="taxPayerType"
                                            labelText="*Tipo de contribuyente:"
                                            classesWrapper="w-full sm:w-73 mb-2"
                                            placeholder="Seleccionar"
                                            value={infoPayment.taxPayerType}
                                            optionSelected={(option: IOptionSelect): void => {
                                                onChangeValue(option.value, 'taxPayerType');
                                            }}
                                            options={buildOptions(dynamicData?.type_tax_payer)}
                                            required={requiredFields.taxPayerType}
                                        />
                                        <br />
                                        <div className="flex flex-col gap-4">
                                            {infoPayment.responsibilities.map((value: string, index: number) => (
                                                <div key={`responsibility${index}`} className="flex items-center gap-2">
                                                    <SelectInput
                                                        labelText="*Responsabilidad fiscal:"
                                                        classesWrapper="w-full sm:w-73"
                                                        placeholder="Seleccionar"
                                                        value={value}
                                                        optionSelected={({ value }: IOptionSelect): void =>
                                                            changeResponsibility(index, value)
                                                        }
                                                        options={buildOptions(getAvailableResponsibilities())}
                                                        disabled={!index ? !infoPayment.taxPayerType : false}
                                                        required={!index && (!value || validate) && infoPayment.taxPayerType}
                                                    />
                                                    {!!index && (
                                                        <Icon
                                                            name="trashBlue"
                                                            className="relative top-2.5 cursor-pointer"
                                                            onClick={(): void => deleteResponsibility(index)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="hidden xl:block" />
                                        <div className="hidden xl:block" />
                                        <p
                                            className={`block underline  ${
                                                selectedResponsibilities.length < responsibilities.length &&
                                                infoPayment.taxPayerType
                                                    ? 'text-green cursor-pointer'
                                                    : 'text-gray cursor-default'
                                            }`}
                                            onClick={addResponsibility}
                                        >
                                            + Agregar responsabilidad fiscal
                                        </p>
                                    </Form>

                                    {option === CREDIT_DEBIT_CARD && (
                                        <Form>
                                            <Information
                                                title="Información de la tarjeta"
                                                separator
                                                color="blue"
                                                classNameContainer="mt-7 mb-4.5"
                                            />
                                            <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-y-3 gap-x-7">
                                                <TextInput
                                                    name="number"
                                                    labelText="*Número de tarjeta:"
                                                    classesWrapper="w-full sm:w-73 mb-2"
                                                    placeholder="000000000"
                                                    value={infoPayment.number || ''}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                                    required={requiredFields.number}
                                                    onlyNumbers
                                                    maxLength={MAX_LENGTH_EMAIL}
                                                />
                                                <PasswordInput
                                                    name="securityCode"
                                                    labelText="*Código de seguridad:"
                                                    classesWrapper="w-full sm:w-73 mb-2"
                                                    placeholder="000"
                                                    value={infoPayment.securityCode || ''}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                                    required={
                                                        requiredFields.securityCode || requiredFields.securityCodeLessDigits
                                                    }
                                                    requiredText={
                                                        requiredFields.securityCodeLessDigits
                                                            ? '*El código de seguridad debe tener al menos 3 digitos'
                                                            : '*Campo obligatorio'
                                                    }
                                                    onlyNumbers
                                                    maxLength={MAX_NUMBER_SECURITY_CODE}
                                                />
                                                <div className="hidden xl:block" />
                                                <DatePickerMonthInput
                                                    placeholder="mm/yyyy"
                                                    labelText="*Fecha de vencimiento:"
                                                    name="expirationDate"
                                                    onChangeDate={(date: Date): void => onChangeValue(date, 'expirationDate')}
                                                    selected={infoPayment.expirationDate || ''}
                                                    required={requiredFields.expirationDate}
                                                    minDate={new Date()}
                                                    maxDate={new Date(2100, 11, 31)}
                                                    classesWrapper="w-full sm:w-73 mb-2"
                                                />
                                                <TextInput
                                                    name="name"
                                                    labelText="*Nombre del titular:"
                                                    classesWrapper="w-full sm:w-73"
                                                    placeholder="Nombre del titular"
                                                    value={infoPayment.name || ''}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeValue(e)}
                                                    required={requiredFields.name}
                                                    maxLength={MAX_LENGTH_ALPHANUMERIC}
                                                />
                                            </div>
                                            <SelectInput
                                                name="cardType"
                                                labelText="*Tipo de tarjeta:"
                                                classesWrapper="w-full sm:w-73 mt-2"
                                                placeholder="Seleccionar"
                                                value={infoPayment.cardType}
                                                optionSelected={(option: IOptionSelect): void =>
                                                    onChangeValue(option.value, 'cardType')
                                                }
                                                options={CARD_TYPES}
                                                required={requiredFields.cardType}
                                            />
                                        </Form>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col mt-2">
                                    <p className="flex text-base underline text-purple" {...mouseProps}>
                                        <Icon alt="Información" name="lightPurple" className="l-1.5 cursor-pointer w-5" />{' '}
                                        ¿Información sobre cargo de tarjeta?
                                    </p>
                                    <Tooltip
                                        placement="bottom-start"
                                        anchorEl={anchorEl}
                                        iconName="lightPurple"
                                        description={
                                            <p className="mb-4.5 text-base font-aller leading-5 xs:text-lg text-gray-dark">
                                                En caso de que PayU cargue su tarjeta antes de finalizar su período de prueba
                                                comuníquese con nuestra directora comercial a este email&nbsp;{' '}
                                                <span className="underline text-purple">tmolina@ccxc.us</span> para corregir el
                                                cargo.
                                            </p>
                                        }
                                        wrapperClassName="rounded"
                                    />

                                    <div className="p-4 my-4 bg-white rounded-lg">
                                        <p className="mb-4 text-base text-green font-allerbold">Método de pago</p>
                                        <div className="flex flex-row gap-4">
                                            <div className="flex h-8">
                                                <div
                                                    className={`flex flex-shrink-0 items-center justify-center w-4.5 h-4.5 border rounded-full my-auto cursor-pointer ${
                                                        option === CREDIT_DEBIT_CARD
                                                            ? 'border-blue hover:bg-blue bg-blue'
                                                            : 'hover:bg-gray-softLight border-gray'
                                                    }`}
                                                    onClick={(): void => selectPaymentMethod(CREDIT_DEBIT_CARD)}
                                                />

                                                <div className="flex flex-col px-3 ml-6 text-center rounded-md md:items-center md:flex-row justify-left bg-gray-background">
                                                    <p className="text-sm text-left text-allerbold text-blue">
                                                        Tarjeta crédito/débito
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex h-8">
                                                <div
                                                    className={`flex items-center justify-center w-4.5 h-4.5 border rounded-full my-auto cursor-pointer ${
                                                        option === PSE
                                                            ? 'border-blue hover:bg-blue bg-blue'
                                                            : 'hover:bg-gray-softLight border-gray'
                                                    }`}
                                                    onClick={(): void => selectPaymentMethod(PSE)}
                                                />
                                                <div className="flex items-center justify-center px-3 ml-6 text-center rounded-md bg-gray-background w-25">
                                                    <p className="text-sm text-allerbold text-blue">PSE</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {cardInfo && Object.values(cardInfo).length ? (
                                        <div className="flex flex-col mt-3.5 ml-7">
                                            <div className="flex">
                                                <div
                                                    className={`flex flex-shrink-0 items-center justify-center w-4.5 h-4.5 border rounded-full my-auto cursor-pointer ${
                                                        cardOptions.find(
                                                            (option: IGenericRecord) => option.name === 'selectedCard'
                                                        )?.isSelect
                                                            ? 'border-blue hover:bg-blue bg-blue'
                                                            : 'hover:bg-gray-softLight border-gray'
                                                    }`}
                                                    onClick={(): void => selectedCard('selectedCard')}
                                                />
                                                <div className="flex items-center ml-6">
                                                    <p className="text-sm lowercase text-blue">{`${
                                                        cardInfo.paymentMethod
                                                    } **** **** **** ${cardInfo.maskedNumber.slice(-4)}`}</p>
                                                </div>
                                                <Icon
                                                    name="trashBlue"
                                                    hoverIcon="trashGreen"
                                                    onClick={(): void => {
                                                        setShowModalDeleteCard(true);
                                                    }}
                                                    className="w-5.5 h-5.5 ml-2 my-auto"
                                                />
                                            </div>
                                            <div className="flex mt-5">
                                                <div
                                                    className={`flex flex-shrink-0 items-center justify-center w-4.5 h-4.5 border rounded-full my-auto cursor-pointer ${
                                                        cardOptions.find((option: IGenericRecord) => option.name === 'otherCard')
                                                            ?.isSelect
                                                            ? 'border-blue hover:bg-blue bg-blue'
                                                            : 'hover:bg-gray-softLight border-gray'
                                                    }`}
                                                    onClick={(): void => selectedCard('otherCard')}
                                                />
                                                <p className="ml-6 text-sm text-blue">Otra tarjeta</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-20">
                        <div className="mb-2">
                            <PageButtonsFooter
                                moduleId={ModuleApp.PAYMENT_METHODS}
                                titleButtonLeft={TitleButtons.BACK}
                                titleButtonRight={TitleButtons.NEXT}
                                onClickButtonLeft={validateBackButton}
                                onClickButtonRight={validateNextButton}
                            />
                        </div>
                        <Footer className="text-center bg-gray-background" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentMethods;
