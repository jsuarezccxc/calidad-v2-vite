/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, ReactElement, SetStateAction, Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SharedModal } from '@components/modal';
import { IconTitle, PageTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import Footer from '@components/footer';
import { BreadCrumb } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { PAYMENT_DATA } from '@constants/Plans';
import useModal from '@hooks/useModal';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import { INFORMATION } from '@information-texts/PaymentPlans';
import { IGenericRecord } from '@models/GenericRecord';
import { Modal, View, PaymentMethod as PaymentType } from '@models/PaymentPlans';
import { SummaryTable } from '@pages/purchasing-process/components';
import { YEAR_IN_MONTHS } from '@pages/purchasing-process/components/summary-table';
import { DELETE_VARIABLE, PlanType, PSE_RESPONSE } from '@pages/purchasing-process';
import { getActiveModules } from '@redux/company/actions';
import { validateEmailDocumentClient as validateClient } from '@redux/electronic-invoice/actions';
import { createPurchaseProcess, getModulesMembership, setMembershipToPay, setUserPlans } from '@redux/membership/actions';
import {
    deleteCardToken,
    getBanks,
    getCardPayU,
    postPayMembershipsOrUsers,
    postPayMembershipsOrUsersByPse,
} from '@redux/payments/actions';
import { RootState } from '@redux/rootReducer';
import { getInflation } from '@redux/utils/actions';
import { clearSession, setLoginModal } from '@redux/session/actions';
import { buttonsFooterProps } from '@utils/Button';
import { validateEmptyFields } from '@utils/Fields';
import { getRoute } from '@utils/Paths';
import { isExistingCard } from '@utils/Plans';
import { isCorrectResponse } from '@utils/Response';
import LocalStorage from '@utils/LocalStorage';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { APPROVED } from './components/purchase-summary';
import { PaymentMethod, PaymentForm, PurchaseSummary, Plans } from './components';
import {
    getPaymentRequest,
    getRequestForOldCard,
    getRequiredFields,
    DEFAULT_DATA,
    MODALS,
    MODAL_PROPS,
    PAYMENT_METHOD,
    MODALS_WITHOUT_ACTION,
    TransactionResponse,
    ZERO,
    getRoutes,
} from '.';
import './PaymentPlans.scss';

const PaymentPlans: React.FC<{
    plansData?: IGenericRecord;
    setContinuePayment?: Dispatch<SetStateAction<boolean>>;
    continuePayment?: boolean;
    redirectToSummaryPayPse?: boolean;
    setRedirectToSummaryPayPse?: Dispatch<SetStateAction<boolean>>;
    setTransactionId?: Dispatch<SetStateAction<string | null>>;
}> = ({
    plansData,
    setContinuePayment,
    continuePayment,
    redirectToSummaryPayPse,
    setRedirectToSummaryPayPse,
    setTransactionId,
}) => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const {
        cardInfo = {},
        information,
        user,
        modules,
        activeMemberships,
        comesAccountCreated,
        comesCreateAccount,
        accessToken,
    } = useSelector(({ company, session, payments, membership }: RootState) => ({
        ...company,
        ...session,
        ...payments,
        ...membership,
    }));
    const [activeView, setActiveView] = useState<View>(View.Method);
    const [data, setData] = useState<IGenericRecord>({
        ...DEFAULT_DATA,
        documentPlan: { ...DEFAULT_DATA.documentPlan, ...plansData?.documentPlan },
        websitePlan: { ...DEFAULT_DATA.websitePlan, ...plansData?.websitePlan },
        diggitalSeller: { ...DEFAULT_DATA.diggitalSeller, ...plansData?.diggitalSeller },
        organizationPlanning: { ...DEFAULT_DATA.organizationPlanning, ...plansData?.organizationPlanning },
        crm: { ...DEFAULT_DATA.crm, ...plansData?.crm },
    });

    const [showPlans, setShowPlans] = useState<boolean>(true);
    const [validate, setValidate] = useState<boolean>(false);

    const { activeModal, toggleModal } = useModal(MODALS);
    const { queryParam, search } = useParam(PAYMENT_METHOD);

    const { disabledInputs } = usePermissions();

    useEffect(() => {
        if (!comesAccountCreated && !comesCreateAccount && showPlans) {
            history.push(getRoute(Routes.HOME));
        } else {
            getData();
        }
    }, []);

    useEffect(() => {
        validateView();
    }, [search, redirectToSummaryPayPse]);

    useEffect(() => {
        dispatch(setUserPlans(modules, activeMemberships));
    }, [modules, activeMemberships]);

    const validateView = (): void => {
        if (redirectToSummaryPayPse) {
            setActiveView(View.Summary);
            setShowPlans(false);
        }
    };

    const getData = async (): Promise<void> => {
        await Promise.all([
            dispatch(getCardPayU()),
            dispatch(getBanks()),
            dispatch(getActiveModules()),
            dispatch(getInflation()),
            dispatch(getModulesMembership()),
        ]);
    };

    const activateView = (view: View): void => setActiveView(view);

    const togglePlanView = (): void => setShowPlans(!showPlans);

    const routes = getRoutes(activeView, { activateView, togglePlanView, queryParam });

    const executeNextAction = (): void | Promise<void> => {
        if (activeView === View.Information && !disabledInputs) {
            if (!data.paymentMethod) return;
            return makePayment();
        }
        if (activeView === View.Summary) {
            return togglePlanView();
        }
        if (data.paymentMethod === PaymentType.CardSaved) return payWithSavedCard();
        if (!data.paymentMethod) return;

        setActiveView(View.Information);
        history.push(`?payment-method=${data?.queryParam}`);
    };

    const planToDelete = Object.values(PlanType).find(key => data[key]?.delete) ?? '';

    const closeModal = (): void => {
        toggleModal('');

        if (planToDelete) {
            updateData({
                ...data,
                [planToDelete]: Object.fromEntries(Object.entries(data[planToDelete]).filter(([key]) => key !== DELETE_VARIABLE)),
            });
        }
    };

    const deletePlan = (): void => {
        if (planToDelete) {
            setData({ ...data, [planToDelete]: null });
            toggleModal('');
        }
    };

    const goToPayment = async (): Promise<void> => {
        await dispatch(getCardPayU());
        setActiveView(View.Method);
        togglePlanView();
    };

    const handleInactivity = (): void => {
        toggleModal(Modal.Inactivity);
        setTimeout(() => {
            togglePlanView();
            if (setContinuePayment) setContinuePayment(!continuePayment);
            history.push(getRoute(Routes.PURCHASING_PROCESS));
        }, 2000);
    };

    const preventSaving = (): boolean => validateEmptyFields(getRequiredFields(data), data);

    const payWithSavedCard = async (): Promise<void> => {
        const status: any = await dispatch(postPayMembershipsOrUsers(getRequestForOldCard({ data, information, user }), true));
        toggleModal(status ? (status === TransactionResponse.Approved ? Modal.Approved : Modal.Declined) : Modal.Wrong);
    };

    const payWithNewCard = async (request: IGenericRecord): Promise<void> => {
        const isNewCard = !isExistingCard(cardInfo);
        if (data?.deleteCard) await dispatch(deleteCardToken());
        const status: any = await dispatch(postPayMembershipsOrUsers(request, false, data?.deleteCard || isNewCard));
        toggleModal(status ? (status === TransactionResponse.Approved ? Modal.Approved : Modal.Declined) : Modal.Wrong);
    };

    const makePayment = async (): Promise<any> => {
        if (preventSaving()) return setValidate(true);

        const request = getPaymentRequest({ data, information, user });
        localStorage.setItem(PAYMENT_DATA, JSON.stringify({ request, data }));
        sendTransaction({ request, data });
    };

    const sendTransaction = async ({ request, data }: IGenericRecord): Promise<any> => {
        if (data.paymentMethod === PaymentType.Pse) {
            await dispatch(postPayMembershipsOrUsersByPse(request, true));
            if (setContinuePayment) setContinuePayment(!continuePayment);
        }
        const { statusCode }: any = await dispatch(validateClient({ document_number: data.document_number, email: data.email }));
        if (isCorrectResponse(statusCode)) await payWithNewCard(request);
    };

    const convertToModulesFormat = (data: IGenericRecord): { modules: IGenericRecord } => {
        const plans = [
            { key: PlanType.DocumentPlan, idKey: 'modules_id', subModules: true },
            { key: PlanType.WebsitePlan, idKey: 'modules_id', subModules: true },
            { key: PlanType.DiggitalSeller, idKey: 'id', subModules: false },
            { key: PlanType.OrganizationPlanning, idKey: 'id', subModules: false },
            { key: PlanType.CrmPlan, idKey: 'id', subModules: false },
        ];

        const modules = plans
            .filter(({ key }) => data[key] && Object.keys(data[key]).length > ZERO)
            .map(({ key, idKey, subModules }) => ({
                id: data[key][idKey],
                sub_modules: subModules ? [{ id: data[key].id, expiration_date: YEAR_IN_MONTHS }] : [],
                expiration_date: YEAR_IN_MONTHS,
            }));

        return { modules };
    };

    const saveDataInBD = (): void => {
        dispatch(createPurchaseProcess(convertToModulesFormat(data)));
        dispatch(setMembershipToPay(convertToModulesFormat(data)));
    };

    const returnPage = (): void => {
        if (activeView === View.Method) {
            if (setContinuePayment) setContinuePayment(!continuePayment);
            togglePlanView();
            return;
        }
        setActiveView(View.Method);
        history.push('#');
    };

    const updateData = (data: IGenericRecord): void => {
        if (activeView === View.Information && preventSaving()) {
            setValidate(true);
        }
        setData(data);
    };

    const retryTransaction = (): void => {
        setActiveView(View.Method);
        LocalStorage.clearKey(PSE_RESPONSE);
        if (setTransactionId) setTransactionId(null);
        if (setContinuePayment) setContinuePayment(false);
        if (setRedirectToSummaryPayPse) setRedirectToSummaryPayPse(false);
        history.push(getRoute(Routes.HOME));
    };

    const acceptModal = async (message?: string): Promise<void> => {
        await dispatch(getActiveModules());
        if (MODALS_WITHOUT_ACTION.includes(activeModal)) return closeModal();

        if (activeModal === Modal.Wrong || activeModal === Modal.Declined) {
            closeModal();
            togglePlanView();
            if (setContinuePayment) setContinuePayment(!continuePayment);
            return;
        }

        if (activeModal === Modal.Approved || activeView === View.Summary) {
            closeModal();
            togglePlanView();
            setData(DEFAULT_DATA);
            setValidate(false);
            history.push(getRoute(Routes.HOME));
            dispatch(clearSession());
            const elementHeader = document.querySelector('*');
            elementHeader?.classList.remove('screen-scroll-smooth');
            elementHeader?.classList.add('screen-smooth-logout');
            if (setContinuePayment) setContinuePayment(!continuePayment);

            if (activeModal === Modal.Approved || message === APPROVED) {
                setTimeout(() => {
                    dispatch(setLoginModal());
                }, 1500);
            }

            return makePayment();
        }

        togglePlanView();
        setValidate(false);
    };

    const view: { [key in View]: ReactElement } = {
        [View.Method]: <PaymentMethod activateView={activateView} data={data} updateData={updateData} />,
        [View.Information]: (
            <PaymentForm data={data} updateData={updateData} handleInactivity={handleInactivity} validate={validate} />
        ),
        [View.Summary]: (
            <PurchaseSummary
                finalizeTransaction={acceptModal}
                retryTransaction={retryTransaction}
                handleInactivity={handleInactivity}
            />
        ),
    };

    return (
        <div className="payment-plans">
            <main className="flex-1 payment-plans__container">
                {comesAccountCreated ||
                    (comesCreateAccount && (
                        <IconTitle
                            id={generateId({
                                module: ModuleApp.PAYMENT_PLANS,
                                submodule: 'purchasing-process',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            label="Proceso de compra"
                            icon="purchasingProcess"
                            size="large"
                            classContainer="mt-7 mb-2"
                        />
                    ))}

                {!comesAccountCreated && !comesCreateAccount && accessToken && showPlans && (
                    <>
                        <PageTitle title="Planes de pago" />
                        <BreadCrumb routes={routes} />
                        <Plans data={data} updateData={updateData} />
                    </>
                )}

                {INFORMATION.INDICATIONS(activeView)}
                {view[activeView]}

                {activeView === View.Information && (
                    <>
                        <IconTitle
                            id={generateId({
                                module: ModuleApp.PAYMENT_PLANS,
                                submodule: 'purchasing-process-resume',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            label="Visualice su resumen de compra"
                            icon="purchaseResume"
                            size="medium"
                        />
                        <SummaryTable
                            data={data}
                            saveData={saveDataInBD}
                            continueToPay={goToPayment}
                            toggleModal={toggleModal}
                            updateData={updateData}
                            viewPlans={false}
                        />
                    </>
                )}
                {activeModal && (
                    <SharedModal
                        moduleId={ModuleApp.PAYMENT_PLANS}
                        open
                        handleClosed={closeModal}
                        finalAction={acceptModal}
                        {...MODAL_PROPS[activeModal](data, { deletePlan, planToDelete, closeModal })}
                    />
                )}
            </main>
            {activeView !== View.Summary && (
                <div className="payment-plans__buttons-footer">
                    <PageButtonsFooter
                        {...buttonsFooterProps(ModuleApp.PAYMENT_PLANS, history, executeNextAction, {
                            name: '',
                            moduleName: '',
                        })}
                        disabledRight={activeView === View.Information && disabledInputs}
                        onClickButtonLeft={returnPage}
                        classButton="xs:w-30.2"
                    />
                </div>
            )}
            {(comesAccountCreated || comesCreateAccount) && <Footer className="text-center bg-gray-background" />}
        </div>
    );
};

export default PaymentPlans;
