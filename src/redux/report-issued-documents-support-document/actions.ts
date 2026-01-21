import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { ActionKeys, ReportIssuedDocumentsSupportDocumentActions } from './types';
import { FetchRequest } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { apiPostInvoice } from '@api/invoice';
import { urls } from '@api/urls';

export const setReportIssuedDocumentsSupportDocumentData = (
    data: IGenericRecord[]
): ReportIssuedDocumentsSupportDocumentActions => ({
    type: ActionKeys.SET_SUPPORT_DOCUMENT_REPORT,
    data,
});

export const setError = (error: string): ReportIssuedDocumentsSupportDocumentActions => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const getReportIssuedDocumentsSupportDocument = (
    dates: IGenericRecord
): ThunkAction<Promise<void>, RootState, null, ReportIssuedDocumentsSupportDocumentActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, ReportIssuedDocumentsSupportDocumentActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.supportDocument.reportIssuedDocuments, dates);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiPostInvoice(request);
            dispatch(setReportIssuedDocumentsSupportDocumentData(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
