import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import {
    ActionKeys,
    IError,
    IIsInstructions,
    ISetStatusCode,
    IStoreCompanyPaymentInformation,
    PaymentGatewayActions,
} from '@redux/payment-gateway/types';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { IDataPaymentGateway } from '@models/PaymentGateway';
import { apiGetPayment, apiPayment } from '@api/payment';
import { urls } from '@api/urls';
import { lengthGreaterThanZero } from '@utils/Length';
import { isCorrectResponse } from '@utils/Response';

export const setError = (error: string): IError => ({
    type: ActionKeys.ERROR,
    error,
});

export const setStatusCode = (statusCode: number): ISetStatusCode => ({
    type: ActionKeys.SET_STATUS_CODE,
    statusCode,
});

export const setCompanyPaymentGateway = (payload: IDataPaymentGateway[]): IStoreCompanyPaymentInformation => ({
    type: ActionKeys.STORE_COMPANY_PAYMENT_GATEWAY,
    payload,
});

export const changeIsInstructions = (payload: boolean): IIsInstructions => ({
    type: ActionKeys.CHANGE_IS_INSTRUCTIONS,
    payload,
});

export const storeCompanyPaymentGateway = (
    store: IGenericRecord
): ThunkAction<Promise<boolean>, RootState, null, IStoreCompanyPaymentInformation> => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentGatewayActions>): Promise<boolean> => {
        try {
            const request = new FetchRequest(urls.payment.companyPayment, store);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { statusCode }: any = await apiPayment(request);
            dispatch(setStatusCode(statusCode));
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const getCompanyPaymentGateway = (): ThunkAction<void, RootState, null, IStoreCompanyPaymentInformation> => {
    return async (dispatch: ThunkDispatch<RootState, null, PaymentGatewayActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.payment.companyPayment);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPayment(request);
            if (data && lengthGreaterThanZero(data)) {
                dispatch(setCompanyPaymentGateway(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
