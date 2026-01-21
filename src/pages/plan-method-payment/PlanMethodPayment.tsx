import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ModalType } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import {
    ERROR_UPDATE_METHOD_PAYMENT,
    INFORMATION_METHOD_PAYMENT,
    PLAN_METHOD_PAYMENT,
    SUCCESS_UPDATE_METHOD_PAYMENT,
} from '@information-texts/PaymentPlans';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { DOCUMENT_TYPES } from '@constants/DynamicRequest';
import { CARD_TYPES } from '@constants/PaymentPlans';
import { getRoute } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { getDateFromUnix } from '@utils/Date';
import { validateEmail } from '@utils/Validation';
import { ModuleApp } from '@utils/GenerateId';
import { cardType } from '@utils/CreditCard';
import { RootState } from '@redux/rootReducer';
import { getCardPayU, updatePayCardToken } from '@redux/payments/actions';
import { getDynamicRequest } from '@redux/dynamic-data/actions';
import InactivityDetector from '@pages/payment-methods/components';
import { IGenericRecord } from '@models/GenericRecord';
import { CardMethod, InformationCard } from './components';
import { IDataForm, IModalsScreen, IModalType, initialDataForm, routes } from '.';
import './PlanMethodPayment.scss';

const PlanMethodPayment: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { cardInfo, dynamicData, user } = useSelector(({ payments, dynamicData, session }: RootState) => ({
        ...payments,
        ...dynamicData,
        ...session,
    }));
    const [edit, setEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState<IDataForm>(initialDataForm);
    const [errorsData, setErrorsData] = useState<IDataForm>(initialDataForm);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<IModalsScreen>({
        success: false,
        error: false,
        information: false,
    });

    const { DESCRIPTION, UPDATE_METHOD } = PLAN_METHOD_PAYMENT;

    useEffect(() => {
        getInitialData();
    }, []);

    useEffect(() => {
        submitted && validateForm();
    }, [formData]);

    const getInitialData = (): void => {
        Promise.all([dispatch(getCardPayU()), dispatch(getDynamicRequest([DOCUMENT_TYPES]))]);
    };

    const handleShowModal = (type: keyof IModalsScreen): void => {
        setShowModal(prevState => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    };

    const handleUpdateMethodPayment = (): void => {
        setEdit(true);
    };

    const handleChange = <T,>(value: T, name: string): void => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = (): boolean => {
        let errors: IDataForm | null = null;

        Object.keys(formData).forEach(property => {
            if (!formData[property as keyof IDataForm])
                errors = Object.assign({ ...errors }, errors, { [property]: '*Campo requerido' });
            if (formData.email && !validateEmail(formData.email))
                errors = Object.assign({ ...errors }, errors, { email: '*Correo inválido' });
        });

        errors && setErrorsData(errors);
        return lengthGreaterThanZero(Object.values(errors ?? {}));
    };

    const formatDataCard = (data: IDataForm): IGenericRecord => {
        const { name, email, documentNumber, documentType, numberCard, securityCode, expirationDate, typeCard } = data;
        const formattedDate = getDateFromUnix(Number(expirationDate), 'YYYY/MM').dateFormat;

        return {
            transaction: {
                creditCard: {
                    expirationDate: formattedDate,
                    identificationNumber: documentNumber,
                    name,
                    number: numberCard,
                    payerId: user?.id || '',
                    securityCode: securityCode,
                    paymentMethod: cardType(numberCard),
                },
                order: {
                    buyer: {
                        dniNumber: documentNumber,
                        emailAddress: email,
                        fullName: name,
                    },
                    description: 'update method payment',
                    notifyUrl: process.env.REACT_APP_FRONT_BASE_URL,
                },
                payer: {
                    dniNumber: documentNumber,
                    dniType: documentType,
                    emailAddress: email,
                    fullName: name,
                },
                paymentMethod: cardType(numberCard),
                cardType: CARD_TYPES.find(type => type.value === typeCard)?.id,
                userAgent: window.navigator.userAgent,
            },
        };
    };

    const handleSubmit = (): void => {
        setSubmitted(true);
        if (!validateForm())
            dispatch(
                updatePayCardToken(
                    formatDataCard(formData),
                    (): void => handleShowModal(IModalType.SUCCESS),
                    (): void => handleShowModal(IModalType.ERROR)
                )
            );
    };

    const handleInactive = (): void => {
        handleShowModal(IModalType.INFO);
    };

    return (
        <div className="plan-method-payment">
            <ModalType
                moduleId={`${ModuleApp.PAYMENT_METHODS}-update`}
                iconName="successMulticolor"
                text={{
                    title: SUCCESS_UPDATE_METHOD_PAYMENT.TITLE,
                    description: SUCCESS_UPDATE_METHOD_PAYMENT.DESCRIPTION,
                }}
                open={showModal.success}
                textButton={SUCCESS_UPDATE_METHOD_PAYMENT.BUTTON}
                finalAction={(): void => {
                    handleShowModal(IModalType.SUCCESS);
                    history.push(getRoute(Routes.PAYMENT_PLAN));
                }}
            />
            <ModalType
                moduleId={`${ModuleApp.PAYMENT_METHODS}-error-update`}
                iconName="closeMulticolor"
                text={{
                    title: ERROR_UPDATE_METHOD_PAYMENT.TITLE,
                    description: ERROR_UPDATE_METHOD_PAYMENT.DESCRIPTION,
                }}
                open={showModal.error}
                textButton={ERROR_UPDATE_METHOD_PAYMENT.BUTTON}
                finalAction={(): void => {
                    handleShowModal(IModalType.ERROR);
                }}
            />
            <ModalType
                moduleId={`${ModuleApp.PAYMENT_METHODS}-info`}
                iconName="clockMulticolor"
                text={{
                    title: INFORMATION_METHOD_PAYMENT.TITLE,
                    description: INFORMATION_METHOD_PAYMENT.DESCRIPTION,
                }}
                isChildText
                open={showModal.information}
                textButton={INFORMATION_METHOD_PAYMENT.BUTTON}
                finalAction={(): void => {
                    handleShowModal(IModalType.INFO);
                    history.push(getRoute(Routes.PAYMENT_PLAN));
                }}
            />
            <InactivityDetector onInactive={handleInactive} />
            <main className="flex-1">
                <PageTitle title="Mi plan de compras" />
                <BreadCrumb routes={routes()} />
                <div>
                    <h2 className="page-subtitle mt-4.5 mb-7">Mi plan de compras</h2>
                    <div className="plan-method-payment--description">{!edit ? DESCRIPTION : UPDATE_METHOD}</div>
                    <div className="options__method-payment">
                        {!edit ? (
                            <CardMethod handleUpdate={handleUpdateMethodPayment} cardInfo={cardInfo} />
                        ) : (
                            <InformationCard
                                dynamicData={dynamicData}
                                handleChange={handleChange}
                                formData={formData}
                                errorsData={errorsData}
                            />
                        )}
                    </div>
                </div>
            </main>
            <PageButtonsFooter
                moduleId={ModuleApp.PAYMENT_METHODS}
                titleButtonLeft={TitleButtons.BACK}
                onClickButtonLeft={(): void => {
                    if (!edit) return history.goBack();
                    return setEdit(false);
                }}
                {...(edit && {
                    titleButtonRight: TitleButtons.SAVE,
                    onClickButtonRight: (): void => handleSubmit(),
                    validationPermission: {
                        name: '',
                        moduleName: '',
                    },
                })}
            />
        </div>
    );
};

export default PlanMethodPayment;
