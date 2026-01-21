import React from 'react';
import { getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { IModalNotificationPlanState, IModalPaymentPlan } from '@pages/payment-plan';
import {
    RememberRenewal,
    RememberAutoRenewalPlan,
    ConfirmRenewalPlan,
    RememberExpirationDays,
    RememberExpirationToday,
    ExpiredPlan,
    ActivateRenewal,
    SuccessActivationRenewal,
} from '@pages/payment-plan/components';
import { IPlanNotifcation } from '.';

export const PlanNotifications: React.FC<IPlanNotifcation> = ({
    notifyPlanState,
    handleShowNotificationPlanState,
    handleRedirect,
    activePlans,
    idPlanSelected,
    handleReactivatePlanUser,
}) => {
    const renderNotification = (stateKey: string, NotificationComponent: React.FC<IModalPaymentPlan>): React.ReactElement => {
        const plan = activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected);
        const currentRoute =
            stateKey === IModalNotificationPlanState.REMEMBER_RENEWAL
                ? getRoute(Routes.PAYMENT_PLANS_MENU)
                : getRoute(Routes.PAYMENT_PLAN);

        return (
            <NotificationComponent
                show={notifyPlanState[stateKey]}
                showModal={(): void => handleShowNotificationPlanState(stateKey)}
                handleMainButton={
                    stateKey === IModalNotificationPlanState.ACTIVATE_RENEWAL
                        ? (): Promise<void> => handleReactivatePlanUser()
                        : (): void => handleRedirect(currentRoute)
                }
                {...(stateKey !== IModalNotificationPlanState.ACTIVATE_RENEWAL && { data: plan })}
                {...(stateKey !== IModalNotificationPlanState.SUCCESS_ACTIVE_RENEWAL && {
                    handleLeftButton: (): void => handleShowNotificationPlanState(stateKey),
                })}
            />
        );
    };

    return (
        <>
            {renderNotification(IModalNotificationPlanState.REMEMBER_RENEWAL, RememberRenewal)}
            {renderNotification(IModalNotificationPlanState.REMEMBER_AUTORENEWAL, RememberAutoRenewalPlan)}
            {renderNotification(IModalNotificationPlanState.CONFIRM_RENEWAL, ConfirmRenewalPlan)}
            {renderNotification(IModalNotificationPlanState.COUNT_EXPIRATION, RememberExpirationDays)}
            {renderNotification(IModalNotificationPlanState.EXPIRATION_TODAY, RememberExpirationToday)}
            {renderNotification(IModalNotificationPlanState.EXPIRED_PLAN, ExpiredPlan)}
            {renderNotification(IModalNotificationPlanState.ACTIVATE_RENEWAL, ActivateRenewal)}
            {renderNotification(IModalNotificationPlanState.SUCCESS_ACTIVE_RENEWAL, SuccessActivationRenewal)}
        </>
    );
};
