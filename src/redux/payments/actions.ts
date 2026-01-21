/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { urls } from '@api/urls';
import {
    apiGetPayment,
    apiGetStatusPayment,
    apiPayMembershipsOrUsers,
    apiPayMembershipsOrUsersByPse,
    apiPayment,
    apiPayUpdatedCardToken,
    apiSetStatusPayment,
} from '@api/payment';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { ItemsPay } from '@constants/PaymentMethods';
import { ZERO } from '@constants/Numbers';
import { MembershipActions } from '@redux/membership/types';
import { getModulesMembership } from '@redux/membership/actions';
import { isCorrectResponse } from '@utils/Response';
import {
    ISetBanksPse,
    ActionKeys,
    PaymentsActions,
    IGetCardPayU,
    IItemToPay,
    IPayResponse,
    IShowResponseModal,
    ISetUrlBank,
    ISetStatusCancelTransaction,
    ISetStatusValidateModules,
    IError,
    ISetGeolocation,
    ISetStatusPaymentInfo,
} from './types';

export const setBanksPse = (banks: IGenericRecord[]): ISetBanksPse => ({
    type: ActionKeys.SET_BANKS_PSE,
    banks,
});

export const setUserGeolocation = (geolocation: IGenericRecord): ISetGeolocation => ({
    type: ActionKeys.SET_GEOLOCATION,
    geolocation,
});

export const setCardPayUInfo = (cardInfo: IGenericRecord): IGetCardPayU => ({
    type: ActionKeys.GET_CARD_PAYU,
    cardInfo,
});

export const setStatusPaymentInfo = (statusPaymentInfo: IGenericRecord): ISetStatusPaymentInfo => ({
    type: ActionKeys.SET_STATUS_PAYMENT_INFO,
    statusPaymentInfo,
});

export const setItemToPay = (itemToPay: ItemsPay): IItemToPay => ({
    type: ActionKeys.ITEM_TO_PAY,
    itemToPay,
});

export const setPayResponse = (response: IGenericRecord): IPayResponse => ({
    type: ActionKeys.PAY_RESPONSE,
    response,
});

export const setShowResponseModal = (): IShowResponseModal => ({
    type: ActionKeys.SHOW_RESPONSE_MODAL,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setUrlBank = (urlBank: any): ISetUrlBank => ({
    type: ActionKeys.SET_URL_BANK,
    urlBank,
});

export const setStatusTransaction = (statusTransaction: string): ISetStatusCancelTransaction => ({
    type: ActionKeys.SET_STATUS_CANCEL_TRANSACTION,
    statusTransaction,
});

export const setStatusValidateModules = (statusValidateModules: number): ISetStatusValidateModules => ({
    type: ActionKeys.SET_STATUS_VALIDATE_MODULES,
    statusValidateModules,
});

export const setError = (error: string): IError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getBanks = () => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.pays.banks);
            const { data }: any = await apiGetPayment(request);
            dispatch(setBanksPse(data));
        } catch (error) {
            console.error(error);
        }
    };
};

export const getUserGeolocation = () => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const res = await fetch('https://geolocation-db.com/json/');
            const data = await res.json();
            dispatch(setUserGeolocation(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCardPayU = () => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.pays.getCardPayU);
            const { data }: any = await apiGetPayment(request);
            dispatch(setCardPayUInfo(data));
        } catch (error) {
            console.log(error);
        }
    };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const postPayMembershipsOrUsers = (dataRequest: any, withToken = false, createToken = false) => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions | MembershipActions>): Promise<string> => {
        const errorMessage = "It doesn't have transactionResponse property";
        try {
            const { payWithTokenMembership, payAndCreateTokenMembership, payWithoutTokenMembership } = urls.pays;

            const url = withToken
                ? payWithTokenMembership
                : createToken
                ? payAndCreateTokenMembership
                : payWithoutTokenMembership;

            const request = new FetchRequest(url, dataRequest);
            const dataResponse: any = await apiPayMembershipsOrUsers(request);

            dispatch(
                setPayResponse(
                    dataResponse?.data?.transactionResponse ||
                        dataResponse?.data ||
                        dataResponse?.statusCode || { error: errorMessage }
                )
            );

            dispatch(setShowResponseModal());
            await dispatch(getModulesMembership());
            return dataResponse?.data?.transactionResponse?.state;
        } catch (error) {
            dispatch(setPayResponse({ error: errorMessage }));
            dispatch(setShowResponseModal());
            return '';
        }
    };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const postPayMembershipsOrUsersByPse = (dataPse: any, isMembership = false) => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const { payMembershipsPse, payUsersPse } = urls.pays;
            const request = new FetchRequest(isMembership ? payMembershipsPse : payUsersPse, dataPse);
            const { data }: any = await apiPayMembershipsOrUsersByPse(request);

            if (data && data?.transactionResponse && data?.transactionResponse?.extraParameters) {
                dispatch(setUrlBank(data?.transactionResponse?.extraParameters?.BANK_URL || ''));
                window.location = data?.transactionResponse?.extraParameters?.BANK_URL;
            }
        } catch (error) {
            dispatch(setShowResponseModal());
            console.log(error);
        }
    };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const updatePayCardToken = (dataUpdate: any, successModal: () => void, errorModal: () => void) => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const { updateCardToken } = urls.pays;
            const request = new FetchRequest(updateCardToken, dataUpdate);
            const { statusCode }: any = await apiPayUpdatedCardToken(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(getCardPayU());
                return successModal();
            }
            return errorModal();
        } catch (error) {
            console.log(error);
        }
    };
};

export const deleteCardToken = () => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.pays.deleteCardToken, []);
            const { statusCode }: any = await apiPayment(request);
            if (isCorrectResponse(statusCode)) dispatch(setCardPayUInfo({}));
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getInfoPayment = (transaction_id: string) => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.pays.getStatusPayment(transaction_id));
            const { data }: any = await apiGetStatusPayment(request);
            const rawResponse = data[ZERO].json_pse_url_response;
            const parsedResponse = JSON.parse(rawResponse);
            dispatch(setStatusPaymentInfo(parsedResponse));
        } catch (error) {
            console.log(error);
        }
    };
};

export const setInfoPayment = (transaction_id: string, dataPayment: Record<string, unknown>) => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentsActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.pays.setStatusPayment, {
                transaction_id,
                json_pse_url_response: dataPayment,
            });

            await apiSetStatusPayment(request);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
