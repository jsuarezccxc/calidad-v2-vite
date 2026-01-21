import { ZERO } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';

export { default } from './PaymentPlan';

/**
 * Names of the module that should be excluded from certain UI operations or logic.
 * @typeParam number - Document package quantity allowed for exclusion logic.
 */
export const EXCLUDED_MODULE = 'documentos electrónicos';
export const UNLIMITED_SUBMODULE = 'ilimitados';
export const QUANTITY_ALLOWED_DE_MODULE: number[] = [15, 60, 120, 300];

/**
 * This returns the modules of each plan
 *
 * @param memberships: IGenericRecord[] - Membership list
 * @returns IGenericRecord[]
 */
export const getModules = (memberships: IGenericRecord[] = []): IGenericRecord[] => {
    const modules: IGenericRecord[] = [];

    memberships
        .flatMap((item: IGenericRecord) => item.modules)
        .forEach(
            ({
                expiration_date,
                initial_date,
                membership_modules_id,
                name: moduleName,
                has_action_cancellation,
                netPrice,
                discount,
                membership_submodules,
            }) => {
                if (membership_submodules.length > ZERO) {
                    membership_submodules.forEach(({ name, ...submodule }: IGenericRecord) => {
                        modules.push({
                            ...submodule,
                            name: `${moduleName} - ${name}`,
                            expiration_date,
                            initial_date,
                            has_action_cancellation,
                            membership_modules_id,
                        });
                    });
                    return;
                }

                modules.push({
                    name: moduleName,
                    expiration_date,
                    initial_date,
                    has_action_cancellation,
                    membership_modules_id,
                    netPrice: netPrice || ZERO,
                    discount: discount || ZERO,
                });
            }
        );

    return modules;
};

/**
 * This returns the submodules of each plan
 *
 * @param memberships: IGenericRecord[] - Membership list
 * @returns IGenericRecord[]
 */
export const getSubmodules = (memberships: IGenericRecord[] = []): IGenericRecord[] => {
    const submodules: IGenericRecord[] = [];

    memberships
        .flatMap((item: IGenericRecord) => item.modules)
        .forEach(
            ({
                expiration_date,
                initial_date,
                membership_submodules,
                name: moduleName,
                has_action_cancellation,
                membership_modules_id,
            }) =>
                membership_submodules.forEach(({ name, ...submodule }: IGenericRecord) => {
                    submodules.push({
                        ...submodule,
                        name: `${moduleName} - ${name}`,
                        expiration_date,
                        initial_date,
                        has_action_cancellation,
                        membership_modules_id,
                    });
                })
        );

    return sortSubmodules(submodules);
};

/**
 * This sorts the submodules from newest to oldest.
 *
 * @param submodules: IGenericRecord[] - Submodules
 * @returns IGenericRecord[]
 */
export const sortSubmodules = (submodules: IGenericRecord[]): IGenericRecord[] => {
    return [...submodules]?.sort((previousValue, nextValue) => nextValue.initial_date - previousValue.initial_date);
};

/**
 * Interface modal props from payment plan
 *
 * @typeParam show: boolean - State to show modal
 * @typeParam showModal: () => void - Action to open modal
 * @typeParam handleMainButton: () => void - Optional handle action from main button
 * @typeParam handleLeftButton: () => void - Handle action from left button
 * @typeParam handleCenterButton: () => void - Handle action from center button
 * @typeParam data: IGenericRecord - Optional data plan in modal
 */
export interface IModalPaymentPlan {
    show: boolean;
    showModal: () => void;
    handleMainButton: () => void;
    handleLeftButton?: () => void;
    handleCenterButton?: () => void;
    data?: IGenericRecord;
}

/**
 * Interface props from acitve plans table
 *
 * @typeParam plans: IGenericRecord[] - Data table plans
 * @typeParam handleRedirect: (route: string) => void - Action to redirect screen
 * @typeParam handleCancelPlan: (planId: string) => void - Action to cancel plan
 * @typeParam handleCancelRenovation: (planId: string) => void - Action to cancel renovation plan
 * @typeParam handleActivateRenewal: (planId: string) => void - Action to active renewal
 * @typeParam handleReactivatePlan: (planId: string) => void - Action to reactivate plan
 * * @typeParam isLoadingTable?: Boolean - Optional prop indicating when loading data for render skeleton
 */
export interface IActivePlansProps {
    plans: IGenericRecord[];
    handleRedirect: (route: string) => void;
    handleCancelPlan: (planId: string) => void;
    handleCancelRenovation: (planId: string) => void;
    handleActivateRenewal: (planId: string) => void;
    handleReactivatePlan: (planId: string) => void;
    isLoadingTable?: boolean;
}

export type IModalType = {
    confirm: boolean;
    success: boolean;
    done: boolean;
};

export enum IModalCancelPlan {
    CONFIRM = 'confirm',
    SUCCESS = 'success',
    DONE = 'done',
}

export enum IModalNotificationPlanState {
    REMEMBER_RENEWAL = 'rememberRenewal',
    REMEMBER_AUTORENEWAL = 'rememberAutorenewal',
    CONFIRM_RENEWAL = 'confirmRenewal',
    COUNT_EXPIRATION = 'countExpiration',
    EXPIRATION_TODAY = 'expirationToday',
    EXPIRED_PLAN = 'expiredPlan',
    ACTIVATE_RENEWAL = 'activateRenewal',
    SUCCESS_ACTIVE_RENEWAL = 'successActiveRenewal',
}

export const WEBSITE_ID = 2;
