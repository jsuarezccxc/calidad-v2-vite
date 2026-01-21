import { IGenericRecord } from '@models/GenericRecord';
import { IDataTablePurchase, IMembership, IModulesMembership, ISubModules, IUserPlans } from '@models/Membership';

export enum ActionKeys {
    SET_HISTORY = 'SET_HISTORY',
    SET_MEMBERSHIP_SELECTED = 'SET_MEMBERSHIP_SELECTED',
    SET_MODULES_MEMBERSHIP = 'SET_MODULES_MEMBERSHIP',
    FAILED_MEMBERSHIP = 'FAILED_MEMBERSHIP',
    SET_MEMBERSHIP_TO_PAY = 'SET_MEMBERSHIP_TO_PAY',
    SET_USERS_TO_PAY = 'SET_USERS_TO_PAY',
    SET_ADDITIONAL_PAGE = 'SET_ADDITIONAL_PAGE',
    SET_DATA_TABLE_PURCHASE = 'SET_DATA_TABLE_PURCHASE',
    SET_DATA_TABLE_BILLS_USERS = 'SET_DATA_TABLE_BILLS_USERS',
    SET_SHOW_MODAL_INACTIVITY = 'SET_SHOW_MODAL_INACTIVITY',
    SET_PLAN_WEBSITE_ACTIVE = 'SET_PLAN_WEBSITE_ACTIVE',
    SET_USER_PLANS = 'SET_USER_PLANS',
    SET_PLANS_TO_BUY = 'SET_PLANS_TO_BUY',
    CREATE_PURCHASE_PROCESS = 'CREATE_PURCHASE_PROCESS',
    GET_PURCHASE_PROCESS = 'GET_PURCHASE_PROCESS',
    SET_SHOW_MODAL_FREE_PLAN_RESPONSE = 'SET_SHOW_MODAL_FREE_PLAN_RESPONSE',
}

export interface ISetHistory {
    type: ActionKeys.SET_HISTORY;
    membership: IMembership;
    history: IMembership[];
}

export interface ISetMembershipSelected {
    type: ActionKeys.SET_MEMBERSHIP_SELECTED;
    membership_selected: IGenericRecord[];
}

export interface ISetModulesMembership {
    type: ActionKeys.SET_MODULES_MEMBERSHIP;
    modules: IModulesMembership[];
}

export interface ISetMembershipToPay {
    type: ActionKeys.SET_MEMBERSHIP_TO_PAY;
    membership_to_pay: IGenericRecord;
}

export interface ISetUsersToPay {
    type: ActionKeys.SET_USERS_TO_PAY;
    users_to_pay: number;
    is_from_membership: boolean;
}

export interface IFailedMembership {
    type: ActionKeys.FAILED_MEMBERSHIP;
    error: string;
}

export interface ISetAdditionalPageSelected {
    type: ActionKeys.SET_ADDITIONAL_PAGE;
    additional_page: number;
}

export interface ISetDataTablePurchase {
    type: ActionKeys.SET_DATA_TABLE_PURCHASE;
    data: IDataTablePurchase[];
    deletePurchase?: string;
}

export interface ISetDataTableBillsUsers {
    type: ActionKeys.SET_DATA_TABLE_BILLS_USERS;
    data: IDataTablePurchase[];
    deletePurchase?: string;
}

export interface ISetShowModalInactivity {
    type: ActionKeys.SET_SHOW_MODAL_INACTIVITY;
    showModalInactivity: boolean;
}

export interface ISetPlanWebsiteActive {
    type: ActionKeys.SET_PLAN_WEBSITE_ACTIVE;
    data: string;
}

export interface ISetUserPlans {
    type: ActionKeys.SET_USER_PLANS;
    payload: IUserPlans;
}

export interface ISetPlansToBuy {
    type: ActionKeys.SET_PLANS_TO_BUY;
    payload: Record<string, ISubModules>;
}

export interface IGetPurchaseProcess {
    type: ActionKeys.GET_PURCHASE_PROCESS;
    payload: IGenericRecord;
}

export interface ICreatePurchaseProcess {
    type: ActionKeys.CREATE_PURCHASE_PROCESS;
    payload: IGenericRecord;
}

export interface ISetShowModalFreePlanResponse {
    type: ActionKeys.SET_SHOW_MODAL_FREE_PLAN_RESPONSE;
    showModalFreePlanResponse: {
        approved: boolean;
        rejected: boolean;
        planAlreadyActive: boolean;
        planAlreadyPurchasedThisYear: boolean;
    };
}

export type MembershipActions =
    | ISetHistory
    | ISetMembershipSelected
    | ISetModulesMembership
    | ISetMembershipToPay
    | ISetUsersToPay
    | IFailedMembership
    | ISetAdditionalPageSelected
    | ISetDataTablePurchase
    | ISetDataTableBillsUsers
    | ISetShowModalInactivity
    | ISetPlanWebsiteActive
    | ISetUserPlans
    | ISetPlansToBuy
    | IGetPurchaseProcess
    | ICreatePurchaseProcess
    | ISetShowModalFreePlanResponse;
