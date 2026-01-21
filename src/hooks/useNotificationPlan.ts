import { IGenericRecord } from "@models/GenericRecord";
import { IModalNotificationPlanState } from "@pages/payment-plan";

export const useNotificationPlan = (): { getCurrentNotification: (plan: IGenericRecord, lastNotification: IGenericRecord) => { modal: string, data: IGenericRecord } | null } => {
    const calculateRemainingDays = (expirationDate: number): number => {
        const currentDate = Math.floor(Date.now() / 1000);
        const timeDifferenceSeconds = expirationDate - currentDate;
        const daysRemaining = Math.floor(timeDifferenceSeconds / (60 * 60 * 24));
        return daysRemaining;
    };

    const getCurrentNotification = (plan: IGenericRecord, lastNotification: IGenericRecord): { modal: string, data: IGenericRecord } | null => {
        const daysRemaining = calculateRemainingDays(plan.expiration_date);
        const currentDate = new Date().toISOString().split('T')[0];

        if (shouldConfirmRenewal(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.CONFIRM_RENEWAL,
                data: { ...lastNotification, confirm_renewal: currentDate }
            };
        }
        if (shouldNotifyExpirationToday(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.EXPIRATION_TODAY,
                data: { ...lastNotification, expiration_today: currentDate }
            };
        }
        if (shouldNotifyExpiredPlan(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.EXPIRED_PLAN,
                data: { ...lastNotification, expired_plan: currentDate }
            };
        }

        if (shouldRememberRenewal(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.REMEMBER_RENEWAL,
                data: { ...lastNotification, remember_renewal: currentDate }
            };
        }

        if (shouldRememberAutorenewal(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.REMEMBER_AUTORENEWAL,
                data: { ...lastNotification, remember_autorenewal: currentDate }
            };
        }

        if (shouldCountExpiration(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.COUNT_EXPIRATION,
                data: { ...lastNotification, count_expiration: currentDate }
            };
        }

        if (shouldActivateRenewal(plan, daysRemaining, currentDate, lastNotification)) {
            return {
                modal: IModalNotificationPlanState.ACTIVATE_RENEWAL,
                data: { ...lastNotification, activate_renewal: currentDate }
            };
        }

        return null;
    }

    const shouldConfirmRenewal = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            plan.is_frequent_payment &&
            daysRemaining === 0 &&
            lastNotification?.confirm_renewal !== currentDate
        );
    };
      
    const shouldNotifyExpirationToday = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            !plan.is_frequent_payment &&
            daysRemaining === 0 &&
            lastNotification?.expiration_today !== currentDate
        );
    };
      
    const shouldNotifyExpiredPlan = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            !plan.is_frequent_payment &&
            daysRemaining === -1 &&
            lastNotification?.expired_plan !== currentDate
        );
    };
      
    const shouldRememberRenewal = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            daysRemaining <= 5 &&
            daysRemaining > 0 &&
            plan.is_cancel &&
            !plan.is_frequent_payment &&
            lastNotification?.remember_renewal !== currentDate
        );
    };
      
    const shouldRememberAutorenewal = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            daysRemaining <= 5 &&
            daysRemaining > 0 &&
            plan.is_frequent_payment &&
            lastNotification?.remember_autorenewal !== currentDate
        );
    };
      
    const shouldCountExpiration = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            daysRemaining <= 5 &&
            daysRemaining > 0 &&
            !plan.is_cancel &&
            !plan.is_frequent_payment &&
            lastNotification?.count_expiration !== currentDate
        );
    };
      
    const shouldActivateRenewal = (
        plan: IGenericRecord,
        daysRemaining: number,
        currentDate: string,
        lastNotification: IGenericRecord
    ): boolean => {
        return (
            daysRemaining <= 30 &&
            daysRemaining > 0 &&
            !plan.is_cancel &&
            !plan.is_frequent_payment &&
            lastNotification?.activate_renewal !== currentDate
        );
    };

    return {
        getCurrentNotification
    }
}
