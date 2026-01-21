import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IBanks, IPayment, IStatus, ITransactionPse } from '@models/Payment';
import {
    ActionKeys,
    IFailed,
    IGetPseBanks,
    IGetStatus,
    IMakePayment,
    ISelectPaymentMethod,
    PaymentActions,
    PaymentMethods,
} from '@redux/gateway-payment/type';
import { PSE } from '@constants/Login';
import { FetchRequest } from '@models/Request';
import { urls } from '@api/urls';
import { apiGetPayment, apiPayment } from '@api/payment';

const START_STATUS_CODE = 200;
const FINISH_STATUS_CODE = 299;

export const makePayment = (payment: IPayment): ThunkAction<Promise<void>, RootState, unknown, PaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, PaymentActions>, getState): Promise<void> => {
        try {
            const url = getState().payment.paymentMethod === PSE ? urls.payment.pseMethod : urls.payment.cashMethod;
            const request = new FetchRequest(url, payment);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPayment(request);
            if (statusCode >= START_STATUS_CODE && statusCode <= FINISH_STATUS_CODE && data.error === null) {
                dispatch(setTransaction(data));
                return data;
            }
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const setTransaction = (transaction: ITransactionPse): IMakePayment => ({
    type: ActionKeys.MAKE_PAYMENT,
    transaction,
});

export const getStatusTransaction = (transaction: string): ThunkAction<Promise<void>, RootState, unknown, PaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, PaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payment.status(transaction), []);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPayment(request);
            if (statusCode >= START_STATUS_CODE && statusCode <= FINISH_STATUS_CODE && data.error === null) {
                dispatch(setStatus(data));
            }
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const setStatus = (status: IStatus): IGetStatus => ({
    type: ActionKeys.GET_STATUS,
    status,
});

export const updatePaymentMethod = (method: PaymentMethods): ThunkAction<Promise<void>, RootState, unknown, PaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, PaymentActions>): Promise<void> => {
        dispatch(setPaymentMethod(method));
    };
};

export const setPaymentMethod = (paymentMethod: PaymentMethods): ISelectPaymentMethod => ({
    type: ActionKeys.SELECT_PAYMENT_METHOD,
    paymentMethod,
});

export const getPseBanks = (): ThunkAction<Promise<void>, RootState, unknown, PaymentActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, PaymentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payment.pseBanks);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiGetPayment(request);
            if (statusCode >= START_STATUS_CODE && statusCode <= FINISH_STATUS_CODE) {
                dispatch(setBanks(data));
            }
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};

export const setBanks = (banks: IBanks[]): IGetPseBanks => ({
    type: ActionKeys.GET_PSE_BANKS,
    banks,
});

export const setFailedError = (error: string): IFailed => ({
    type: ActionKeys.FAILED,
    error,
});
