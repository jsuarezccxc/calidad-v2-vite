import { RootState } from '@redux/rootReducer';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { apiPostInvoice } from '@api/invoice';
import { urls } from '@api/urls';
import { WEBSITE } from '@constants/website';
import { ActionKeys, ISetError, VirtualStoreSalesActions } from './types';

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const postMultiEmail = (
    dataEmail: IGenericRecord
): ThunkAction<Promise<IGenericRecord>, RootState, unknown, VirtualStoreSalesActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, VirtualStoreSalesActions>): Promise<IGenericRecord> => {
        try {
            const dataRequest = {
                id: dataEmail?.id,
                subject: dataEmail?.subject,
                body_content: dataEmail?.body_content,
                invoice_type: dataEmail?.invoice_type,
                email: dataEmail?.email,
                invoice_pdf_url: dataEmail?.pdfUrl,
                name: WEBSITE,
            };
            const formData = new FormData();
            Object.entries(dataRequest).forEach(([key, value]) => {
                formData.append(key, value ?? '');
            });
            const request = new FetchRequest(urls.invoice.sendEmail, formData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            return data?.statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
            return { url: '', error: String(error) };
        }
    };
};
