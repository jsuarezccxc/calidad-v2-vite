import { IMembership, IModulesMembership, IDataTablePurchase, IUserPlans, ISubModules } from '@models/Membership';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, MembershipActions } from './types';

interface IMembershipState {
    membership?: IMembership;
    history?: IMembership[];
    membership_selected?: IGenericRecord[];
    modules?: IModulesMembership[];
    membership_to_pay?: IGenericRecord;
    users_to_pay?: number;
    is_from_membership?: boolean;
    additional_page?: number;
    tablePurchasePayment: IDataTablePurchase[];
    tablePurchaseBillsUsers: IDataTablePurchase[];
    deletePurchase?: string;
    error?: string;
    planWebsiteActive?: string;
    showModalInactivity?: boolean;
    userPlans: IUserPlans;
    plansToBuy: Record<string, ISubModules>;
    showModalFreePlanResponse: {
        approved: boolean;
        rejected: boolean;
        planAlreadyActive: boolean;
        planAlreadyPurchasedThisYear: boolean;
    };
}

const initialState: IMembershipState = {
    membership_selected: [],
    modules: [
        {
            id: 0,
            name: '',
            description: '',
            price_month: 0,
            price_year: 0,
            sub_modules: [],
            price_semester: 0,
            price_semester_month: 0,
            type: '',
        },
    ],
    membership_to_pay: {},
    users_to_pay: 0,
    is_from_membership: false,
    additional_page: 0,
    tablePurchasePayment: [],
    tablePurchaseBillsUsers: [],
    deletePurchase: '',
    error: '',
    planWebsiteActive: '',
    showModalInactivity: false,
    userPlans: { website: [], electronicDocuments: [] },
    plansToBuy: {},
    showModalFreePlanResponse: {
        approved: false,
        rejected: false,
        planAlreadyActive: false,
        planAlreadyPurchasedThisYear: false,
    },
};

export const reducer = (state: IMembershipState = initialState, action: MembershipActions): IMembershipState => {
    switch (action.type) {
        case ActionKeys.SET_HISTORY:
            return {
                ...state,
                membership: action.membership,
                history: action.history,
            };
        case ActionKeys.SET_MEMBERSHIP_SELECTED:
            return {
                ...state,
                membership_selected: action.membership_selected,
            };
        case ActionKeys.SET_MODULES_MEMBERSHIP:
            return {
                ...state,
                modules: action.modules,
            };
        case ActionKeys.SET_MEMBERSHIP_TO_PAY:
            return {
                ...state,
                membership_to_pay: action.membership_to_pay,
            };
        case ActionKeys.SET_USERS_TO_PAY:
            return {
                ...state,
                users_to_pay: action.users_to_pay,
                is_from_membership: action.is_from_membership,
            };
        case ActionKeys.SET_ADDITIONAL_PAGE:
            return {
                ...state,
                additional_page: action.additional_page,
            };
        case ActionKeys.SET_DATA_TABLE_PURCHASE:
            return {
                ...state,
                tablePurchasePayment: action.data,
                deletePurchase: action.deletePurchase,
            };
        case ActionKeys.SET_DATA_TABLE_BILLS_USERS:
            return {
                ...state,
                tablePurchaseBillsUsers: action.data,
                deletePurchase: action.deletePurchase,
            };
        case ActionKeys.FAILED_MEMBERSHIP:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_SHOW_MODAL_INACTIVITY:
            return {
                ...state,
                showModalInactivity: action.showModalInactivity,
            };
        case ActionKeys.SET_PLAN_WEBSITE_ACTIVE:
            return {
                ...state,
                planWebsiteActive: action.data,
            };
        case ActionKeys.SET_USER_PLANS:
            return {
                ...state,
                userPlans: action.payload,
            };
        case ActionKeys.SET_PLANS_TO_BUY:
            return {
                ...state,
                plansToBuy: action.payload,
            };
        case ActionKeys.SET_SHOW_MODAL_FREE_PLAN_RESPONSE:
            return {
                ...state,
                showModalFreePlanResponse: {
                    ...state.showModalFreePlanResponse,
                    ...action.showModalFreePlanResponse,
                },
            };
        default:
            return state;
    }
};
