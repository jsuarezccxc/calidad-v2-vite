import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
    apiGetActiveMembership,
    apiGetHistory,
    apiGetLandingMemberships,
    apiGetStatusTransaction,
    apiPostLandingMemberships,
    apiPostMembershipFreeDocuments,
    apiPostReactivePaymeny,
} from '@api/membership';
import { urls } from '@api/urls';
import { apiGetUtils } from '@api/utils';
import { RootState } from '@redux/rootReducer';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { IDataTablePurchase, IMembership, IModulesMembership, ISubModules } from '@models/Membership';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { getUserData } from '@utils/User';
import { getUserPlans } from '@utils/Plans';
import { getDateFromUnix } from '@utils/Date';
import { IFreeMembershipResponse } from '@pages/purchasing-process';
import {
    ISetHistory,
    ISetModulesMembership,
    IFailedMembership,
    ActionKeys,
    MembershipActions,
    ISetMembershipSelected,
    ISetMembershipToPay,
    ISetUsersToPay,
    ISetAdditionalPageSelected,
    ISetDataTablePurchase,
    ISetDataTableBillsUsers,
    ISetShowModalInactivity,
    ISetPlanWebsiteActive,
    ISetUserPlans,
    ISetPlansToBuy,
    ISetShowModalFreePlanResponse,
} from './types';

export const setHistory = (membership: IMembership, history: IMembership[]): ISetHistory => ({
    type: ActionKeys.SET_HISTORY,
    membership,
    history,
});

export const setMembershipSelected = (membership_selected: IGenericRecord[]): ISetMembershipSelected => ({
    type: ActionKeys.SET_MEMBERSHIP_SELECTED,
    membership_selected,
});

export const setModulesMembership = (modules: IModulesMembership[]): ISetModulesMembership => ({
    type: ActionKeys.SET_MODULES_MEMBERSHIP,
    modules,
});

export const setMembershipToPay = (membership_to_pay: IGenericRecord): ISetMembershipToPay => ({
    type: ActionKeys.SET_MEMBERSHIP_TO_PAY,
    membership_to_pay,
});

export const setUsersToPay = (users_to_pay: number, is_from_membership = false): ISetUsersToPay => ({
    type: ActionKeys.SET_USERS_TO_PAY,
    users_to_pay,
    is_from_membership,
});

export const failedMembership = (error: string): IFailedMembership => ({
    type: ActionKeys.FAILED_MEMBERSHIP,
    error,
});

export const setPageAdditionalSelected = (additional_page: number): ISetAdditionalPageSelected => ({
    type: ActionKeys.SET_ADDITIONAL_PAGE,
    additional_page,
});

export const setTablePurchase = (data: IDataTablePurchase[], deletePurchase?: string): ISetDataTablePurchase => ({
    type: ActionKeys.SET_DATA_TABLE_PURCHASE,
    data,
    deletePurchase,
});

export const setTableBillsUsers = (data: IDataTablePurchase[], deletePurchase?: string): ISetDataTableBillsUsers => ({
    type: ActionKeys.SET_DATA_TABLE_BILLS_USERS,
    data,
    deletePurchase,
});

export const setShowModalInactivity = (showModalInactivity: boolean): ISetShowModalInactivity => ({
    type: ActionKeys.SET_SHOW_MODAL_INACTIVITY,
    showModalInactivity,
});

export const setPlanWebsiteActive = (data: string): ISetPlanWebsiteActive => ({
    type: ActionKeys.SET_PLAN_WEBSITE_ACTIVE,
    data,
});

export const setUserPlans = (modules: IModulesMembership[] = [], activeMemberships: IGenericRecord[]): ISetUserPlans => ({
    type: ActionKeys.SET_USER_PLANS,
    payload: getUserPlans(modules, activeMemberships),
});

export const setPlansToPay = (modules: Record<string, ISubModules> = {}): ISetPlansToBuy => ({
    type: ActionKeys.SET_PLANS_TO_BUY,
    payload: modules,
});

export const setShowModalFreePlanResponse = (showModalFreePlanResponse: {
    approved: boolean;
    rejected: boolean;
    planAlreadyActive: boolean;
    planAlreadyPurchasedThisYear: boolean;
}): ISetShowModalFreePlanResponse => ({
    type: ActionKeys.SET_SHOW_MODAL_FREE_PLAN_RESPONSE,
    showModalFreePlanResponse,
});

export const getMembershipData = (companyId: string): ThunkAction<Promise<void>, RootState, unknown, MembershipActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.membership.history(companyId));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiGetHistory(request);
            if (response.statusCode === 200) {
                const membership = response.data.active_membership;
                const { date: purchase_date } = getDateFromUnix(membership.purchase_date);
                const { dateFormat: begin_date } = getDateFromUnix(membership.initial_date);
                const { dateFormat: ends_date } = getDateFromUnix(membership.expiration_date);
                const period_membership = `${begin_date} - ${ends_date}`;

                const membershipActive: IMembership = {
                    ...membership,
                    purchase_date,
                    begin_date,
                    ends_date,
                    period_membership,
                };
                const history = response.data.company_memberships.map((item: IMembership) => {
                    const { date: purchase_date } = getDateFromUnix(item.purchase_date);
                    const { dateFormat: begin_date } = getDateFromUnix(item.initial_date);
                    const { dateFormat: ends_date } = getDateFromUnix(item.expiration_date);
                    const period_membership = `${begin_date} - ${ends_date}`;
                    return {
                        ...item,
                        begin_date,
                        ends_date,
                        period_membership,
                        purchase_date,
                    };
                });
                dispatch(setHistory(membershipActive, history));
            }
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
        }
    };
};

export const getActiveMembership = (): ThunkAction<Promise<void>, RootState, unknown, MembershipActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            const request = new FetchRequest(urls.membership.activeMemberships(company_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetActiveMembership(request);

            dispatch(setMembershipSelected(data));
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
        }
    };
};

export const getModulesMembership = (): ThunkAction<Promise<void>, RootState, unknown, MembershipActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.membership_modules);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiGetUtils(request);
            if (SUCCESS_RESPONSE.includes(response.statusCode)) {
                dispatch(setModulesMembership(response.data.modules));
            }
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
        }
    };
};

export const getStatusTransaction = (): ThunkAction<Promise<void>, RootState, unknown, MembershipActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetStatusTransaction(company_id);
            return data;
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
        }
    };
};

export const postFreeMembership = (
    data: IGenericRecord
): ThunkAction<Promise<IFreeMembershipResponse>, RootState, unknown, MembershipActions> => {
    return async (dispatch): Promise<IFreeMembershipResponse> => {
        try {
            const request = new FetchRequest(urls.membership.freeSupportDocuments, data);
            const response = (await apiPostMembershipFreeDocuments(request)) as IFreeMembershipResponse;
            return response;
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
            throw error;
        }
    };
};

export const postReactivePayment = (
    data: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, unknown, MembershipActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.company.reactivePayment, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostReactivePaymeny(request);
            return SUCCESS_RESPONSE.includes(response.statusCode);
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
            return false;
        }
    };
};

export const createPurchaseProcess = (
    data: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, MembershipActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.membership.createPurchaseProcess, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await apiPostLandingMemberships(request);
            if (SUCCESS_RESPONSE.includes(response.statusCode)) {
                return response.statusCode;
            }
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
        }
    };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPurchaseProcess = (): ThunkAction<Promise<any>, RootState, unknown, MembershipActions> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (dispatch: ThunkDispatch<RootState, unknown, MembershipActions>): Promise<any> => {
        try {
            const request = new FetchRequest(urls.membership.createPurchaseProcess);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetLandingMemberships(request);
            dispatch(setPlansToPay(data));
            return data;
        } catch (error) {
            dispatch(failedMembership('Fallo interno del servidor'));
            return null;
        }
    };
};
