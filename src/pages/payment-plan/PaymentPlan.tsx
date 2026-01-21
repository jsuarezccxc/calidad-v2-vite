import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '@redux/rootReducer';
import { postReactivePayment } from '@redux/membership/actions';
import { cancelMembership, getActiveModules, getPlanHistory } from '@redux/company/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { generateId, ActionElementType, ElementType, ModuleApp } from '@utils/GenerateId';
import { PageTitle } from '@components/page-title';
import {
    ActivateRenewal,
    ActivePlans,
    ConfirmCancelAutoRenewalPlan,
    ConfirmCancelPlan,
    ContinueAutoRenewalPlan,
    ContinuePlan,
    PlansHistory,
    RememberReactivatePlan,
    SuccessActivationRenewal,
    SuccessCancelAutoRenewalPlan,
    SuccessCancelPlan,
    SuccessReactivatePlan,
} from './components';
import { getModules, IModalCancelPlan, IModalType } from '.';
import './PaymentPlan.scss';

const PaymentPlan: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        company: {
            activeMemberships,
            planHistory: { data: planHistory = [] },
        },
        loader: { loader: loaderState },
    } = useSelector(({ company, loader }: RootState) => ({
        company,
        loader,
    }));

    const [idPlanSelected, setIdPlanSelected] = useState<string>('');
    const [cancelPlanModal, setCancelPlanModal] = useState<IModalType>({
        confirm: false,
        success: false,
        done: false,
    });
    const [renovationPlanModal, setRenovationPlanModal] = useState<IModalType>({
        confirm: false,
        success: false,
        done: false,
    });
    const [activateRenewal, setActivateRenewal] = useState<Omit<IModalType, 'done'>>({
        confirm: false,
        success: false,
    });
    const [reactivatePlan, setReactivatePlan] = useState<Omit<IModalType, 'done'>>({
        confirm: false,
        success: false,
    });

    const activePlans = useMemo(() => getModules(activeMemberships), [activeMemberships]);

    const plansHistory = useMemo(() => getModules(planHistory), [planHistory]);

    const handleShowCancelPlanModal = (type: keyof IModalType): void => {
        setCancelPlanModal(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleShowRenovationPlanModal = (type: keyof IModalType): void => {
        setRenovationPlanModal(prevState => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    };

    const handleShowActivationRenewal = (type: keyof Omit<IModalType, 'done'>): void => {
        setActivateRenewal(prevState => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    };

    const handleShowReactivatePlan = (type: keyof Omit<IModalType, 'done'>): void => {
        setReactivatePlan(prevState => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    };

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getActiveModules()), dispatch(getPlanHistory())]);
        })();
    }, []);

    const handleRedirect = (route: string): void => {
        history.push(route);
    };

    const handleShowCancelPlan = (planId: string): void => {
        setIdPlanSelected(planId);
        handleShowCancelPlanModal(IModalCancelPlan.CONFIRM);
    };

    const handleActivateRenewal = (planId: string): void => {
        setIdPlanSelected(planId);
        handleShowActivationRenewal(IModalCancelPlan.CONFIRM);
    };

    const handleReactivatePlan = (planId: string): void => {
        setIdPlanSelected(planId);
        handleShowReactivatePlan(IModalCancelPlan.CONFIRM);
    };

    const handleCancelPlan = async (cancel = true): Promise<void> => {
        const moduleId = activePlans?.find(plan => plan.id === idPlanSelected)?.membership_has_modules_id || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await dispatch(cancelMembership({ modules_id: [moduleId], is_cancel: cancel }));
        if (response && cancel) {
            handleShowCancelPlanModal(IModalCancelPlan.CONFIRM);
            handleShowCancelPlanModal(IModalCancelPlan.SUCCESS);
            return;
        }
        if (response && !cancel) {
            handleShowRenovationPlanModal(IModalCancelPlan.CONFIRM);
            handleShowRenovationPlanModal(IModalCancelPlan.SUCCESS);
        }
    };

    const handleContinuePlan = (): void => {
        handleShowCancelPlanModal(IModalCancelPlan.CONFIRM);
        handleShowCancelPlanModal(IModalCancelPlan.DONE);
    };

    const handleShowCancelRenovation = (planId: string): void => {
        setIdPlanSelected(planId);
        handleShowRenovationPlanModal(IModalCancelPlan.CONFIRM);
    };

    const handleUpdateAction = async (cancel = true): Promise<void> => {
        await dispatch(getActiveModules());
        if (cancel) return handleShowCancelPlanModal(IModalCancelPlan.SUCCESS);
        return handleShowRenovationPlanModal(IModalCancelPlan.SUCCESS);
    };

    const handleRenovatePlan = (): void => {
        handleShowRenovationPlanModal(IModalCancelPlan.CONFIRM);
        handleShowRenovationPlanModal(IModalCancelPlan.DONE);
    };

    const handleReactivatePlanUser = async (is_cancel = true): Promise<void> => {
        const moduleId = activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)?.membership_has_modules_id || '';
        if (!moduleId) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await dispatch(
            postReactivePayment({
                module_id: moduleId,
            })
        );
        if (response) {
            await dispatch(getActiveModules());
            if (is_cancel) {
                handleShowActivationRenewal(IModalCancelPlan.CONFIRM);
                handleShowActivationRenewal(IModalCancelPlan.SUCCESS);
            } else {
                handleShowReactivatePlan(IModalCancelPlan.CONFIRM);
                handleShowReactivatePlan(IModalCancelPlan.SUCCESS);
            }
        }
    };

    return (
        <div className="payment-plan">
            <main className="flex-1">
                <ConfirmCancelPlan
                    show={cancelPlanModal.confirm}
                    showModal={(): void => handleShowCancelPlanModal(IModalCancelPlan.CONFIRM)}
                    handleMainButton={(): void => handleContinuePlan()}
                    handleLeftButton={(): Promise<void> => handleCancelPlan()}
                    data={activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)}
                />
                <ContinuePlan
                    show={cancelPlanModal.done}
                    showModal={(): void => handleShowCancelPlanModal(IModalCancelPlan.DONE)}
                    handleMainButton={(): void => handleShowCancelPlanModal(IModalCancelPlan.DONE)}
                />
                <SuccessCancelPlan
                    show={cancelPlanModal.success}
                    showModal={(): void => handleShowCancelPlanModal(IModalCancelPlan.SUCCESS)}
                    handleMainButton={(): Promise<void> => handleUpdateAction()}
                    data={activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)}
                />
                <ConfirmCancelAutoRenewalPlan
                    show={renovationPlanModal.confirm}
                    showModal={(): void => handleShowRenovationPlanModal(IModalCancelPlan.CONFIRM)}
                    handleMainButton={(): void => handleRenovatePlan()}
                    handleLeftButton={(): Promise<void> => handleCancelPlan(false)}
                />
                <SuccessCancelAutoRenewalPlan
                    show={renovationPlanModal.success}
                    showModal={(): void => handleShowRenovationPlanModal(IModalCancelPlan.SUCCESS)}
                    handleMainButton={(): Promise<void> => handleUpdateAction(false)}
                />
                <ContinueAutoRenewalPlan
                    show={renovationPlanModal.done}
                    showModal={(): void => handleShowRenovationPlanModal(IModalCancelPlan.DONE)}
                    handleMainButton={(): void => handleShowRenovationPlanModal(IModalCancelPlan.DONE)}
                />
                <ActivateRenewal
                    show={activateRenewal.confirm}
                    showModal={(): void => handleShowActivationRenewal(IModalCancelPlan.CONFIRM)}
                    handleMainButton={(): Promise<void> => handleReactivatePlanUser()}
                    handleLeftButton={(): void => handleShowActivationRenewal(IModalCancelPlan.CONFIRM)}
                />
                <SuccessActivationRenewal
                    show={activateRenewal.success}
                    showModal={(): void => handleShowActivationRenewal(IModalCancelPlan.SUCCESS)}
                    handleMainButton={(): void => handleShowActivationRenewal(IModalCancelPlan.SUCCESS)}
                    data={activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)}
                />
                <RememberReactivatePlan
                    show={reactivatePlan.confirm}
                    showModal={(): void => handleShowReactivatePlan(IModalCancelPlan.CONFIRM)}
                    handleMainButton={(): Promise<void> => handleReactivatePlanUser(false)}
                    handleLeftButton={(): void => handleShowReactivatePlan(IModalCancelPlan.CONFIRM)}
                    data={activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)}
                />
                <SuccessReactivatePlan
                    show={reactivatePlan.success}
                    showModal={(): void => handleShowReactivatePlan(IModalCancelPlan.SUCCESS)}
                    handleMainButton={(): void => handleShowReactivatePlan(IModalCancelPlan.SUCCESS)}
                    data={activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)}
                />
                <PageTitle title="Mi plan de compras" />
                <h2 className="page-subtitle mt-4.5 mb-7">Mi plan de compras</h2>
                <h3 className="payment-plan__table-title">Planes de compras activos</h3>
                <ActivePlans
                    plans={activePlans}
                    handleRedirect={handleRedirect}
                    handleCancelPlan={handleShowCancelPlan}
                    handleCancelRenovation={handleShowCancelRenovation}
                    handleActivateRenewal={handleActivateRenewal}
                    handleReactivatePlan={handleReactivatePlan}
                    isLoadingTable={loaderState}
                />
                <h3 className="payment-plan__table-title">Historial de Planes de compras</h3>
                <PlansHistory plans={plansHistory} isLoadingTable={loaderState} />
            </main>
            <button
                id={generateId({
                    module: ModuleApp.PAYMENT_PLANS,
                    action: ActionElementType.BACK,
                    elementType: ElementType.BTN,
                })}
                className="payment-plan__button"
                onClick={(): void => history.goBack()}
            >
                Atrás
            </button>
        </div>
    );
};

export default PaymentPlan;
