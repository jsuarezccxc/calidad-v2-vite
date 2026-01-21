import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { apiPostInvoice, apiPutInvoice, apiUploadRejectSupport } from '@api/invoice';
import { urls } from '@api/urls';
import { apiGetReasonRejections } from '@api/utils';
import { lengthGreaterThanZero } from '@utils/Length';
import { ActionKeys, IGetTypeRejection, InvoiceSummaryActions, ISetError } from './types';
import { IFile } from '@components/input';

const typesRejection = (payload: IGenericRecord[]): IGetTypeRejection => ({
    type: ActionKeys.GET_TYPE_REJECTION,
    payload,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const postFileRejection = (
    rejectId: string,
    files: IFile,

): ThunkAction<Promise<void>, RootState, unknown, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InvoiceSummaryActions>): Promise<void> => {
        try {
            if (lengthGreaterThanZero(files[0].files)) {
                const formData = new FormData();
                const request = new FetchRequest(urls.invoice.support);
                for (const file of files[0].files) {
                    formData.append('id', rejectId);
                    formData.append('file', file);
                    request.data = formData;
                    await apiUploadRejectSupport(request);
                }
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const rejectedInvoice = (
    dataRequest: IGenericRecord,
    files: IFile,
): ThunkAction<Promise<void>, RootState, unknown, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InvoiceSummaryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.setAgreement, dataRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, statusCode }: any = await apiPostInvoice(request);
            if (statusCode === 200) {
                await dispatch(postFileRejection(data.id, files));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const acceptInvoice = (
    invoiceId: string,
): ThunkAction<Promise<void>, RootState, unknown, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InvoiceSummaryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.acceptInvoice, {
                id: invoiceId,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await apiPutInvoice(request);
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getTypesRejections = (): ThunkAction<Promise<void>, RootState, unknown, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, InvoiceSummaryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getReasonRejections);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetReasonRejections(request);
            dispatch(typesRejection(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
