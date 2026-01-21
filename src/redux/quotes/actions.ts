import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IGenericPaginationData } from '@constants/PaginationBack';
import { FetchRequest } from '@models/Request';
import { createFormData } from '@utils/FormData';
import { urls } from '@api/urls';
import { apiGetQuote, apiPostQuote, apiDeleteQuote, apiGetQuoteBlob } from '@api/quotes';
import { apiPostInvoice, apiSendMailInvoice } from '@api/invoice';
import { isCorrectResponse } from '@utils/Response';
import { IFile } from '@components/input';
import { sortQuotesByNumber } from '@utils/quoteHelpers';
import { QUOTES_PAGINATION, QUOTES_DEFAULTS } from '@constants/QuoteViewLabels';
import {
    ActionKeys,
    QuotesActions,
    ISetQuotesList,
    ISetQuoteData,
    ISetError,
    ISetFailedModifications,
    ISetEmailTemplateResponse,
    IQuoteListApiResponse,
    IQuoteApiResponse,
    IQuoteCreateResponse,
    IQuoteDeleteResponse,
} from './types';

export const setQuotesList = (responseList: IGenericPaginationData<IGenericRecord>): ISetQuotesList => ({
    type: ActionKeys.SET_QUOTES_LIST,
    responseList,
});

export const setQuoteData = (quoteData: IGenericRecord): ISetQuoteData => ({
    type: ActionKeys.SET_QUOTE_DATA,
    quoteData,
});

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setFailedModifications = (error: string): ISetFailedModifications => ({
    type: ActionKeys.FAILED_MODIFICATIONS,
    error,
});

export const setEmailTemplateResponse = (response: IGenericRecord): ISetEmailTemplateResponse => ({
    type: ActionKeys.SEND_EMAIL_TEMPLATE,
    response,
});

export const getQuotes = (filters?: IGenericRecord): ThunkAction<Promise<void>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.quotes.report, filters || {});
            const response = await apiPostQuote(request) as IQuoteListApiResponse;
            const responseData = response.data || { data: [], meta: {}, links: {} };
            dispatch(setQuotesList(responseData));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getQuoteById = (quoteId: string): ThunkAction<Promise<IGenericRecord>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IGenericRecord> => {
        try {
            const request = new FetchRequest(urls.invoice.quotes.getById(quoteId));
            const { data } = await apiGetQuote(request) as IQuoteApiResponse;
            dispatch(setQuoteData(data));
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
            throw error;
        }
    };
};

export const createQuoteAction = (quoteData: IGenericRecord): ThunkAction<Promise<IQuoteCreateResponse>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IQuoteCreateResponse> => {
        try {
            const request = new FetchRequest(urls.invoice.quotes.create, quoteData);
            const { statusCode, data } = await apiPostQuote(request) as IQuoteCreateResponse;
            
            if (!isCorrectResponse(statusCode)) {
                dispatch(setError('Error creating quote'));
            }
            return { statusCode, data };
        } catch (error) {
            dispatch(setError(String(error)));
            throw error;
        }
    };
};

export const deleteQuote = (quoteId: string): ThunkAction<Promise<IQuoteDeleteResponse>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IQuoteDeleteResponse> => {
        try {
            const request = new FetchRequest(urls.invoice.quotes.delete(quoteId));
            const response = await apiDeleteQuote(request) as IQuoteDeleteResponse;
            return response || { success: true };
        } catch (error) {
            dispatch(setError(String(error)));
            throw error;
        }
    };
};

export const downloadQuoteReportWithFilters = (
    type: 'pdf' | 'xlsx',
    filters: IGenericRecord,
    startDate?: string,
    endDate?: string
): ThunkAction<Promise<Blob>, RootState, null, QuotesActions> => {
    return async (): Promise<Blob> => {
        const startDateStr = startDate || new Date().toISOString().split('T')[0];
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        
        const allFilters = { 
            page: QUOTES_PAGINATION.INITIAL_PAGE, 
            per_page: QUOTES_PAGINATION.BULK_EXPORT_LIMIT,
            ...(filters.search && { search: filters.search }),
            ...(filters.documentStatus && { is_send_email: filters.documentStatus }),
            ...(filters.startDate && { start_date: Math.floor(new Date(filters.startDate).getTime() / 1000) }),
            ...(filters.endDate && { finish_date: Math.floor(new Date(filters.endDate).getTime() / 1000) })
        };
        
        // Get quotes data with filters
        const request = new FetchRequest(urls.invoice.quotes.report, allFilters);
        const response = await apiPostQuote(request);
        const rawQuotesData = (response as IGenericRecord).data?.data || [];
        
        // Process and transform quotes data (business logic from hook)
        const allQuotesForReport = rawQuotesData.map((quote: IGenericRecord) => ({
            id: quote.id?.toString() || '',
            person_id: quote.person_id || null,
            number: quote.number || '',
            date: quote.date && quote.date > 0 ? new Date(quote.date * 1000).toLocaleDateString('es-CO') : '',
            customer: quote.client_name || '',
            email: quote.client_email || '',
            state: quote.is_send_email === QUOTES_DEFAULTS.DOCUMENT_STATES.SENT ? QUOTES_DEFAULTS.DOCUMENT_STATES.SENT : QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT,
            total: quote.total || 0,
            currency: quote.currency || QUOTES_DEFAULTS.DEFAULT_CURRENCY,
            checked: false,
            timestamp: quote.date || 0,
            client_name: quote.client_name || '',
            client_email: quote.client_email || '',
            is_send_email: quote.is_send_email || QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT
        }));

        // Sort quotes by number (business logic from hook)
        const allQuotesForReportSorted = sortQuotesByNumber(allQuotesForReport);
        
        // Transform data for download API
        const quotesData = allQuotesForReportSorted.map((quote: IGenericRecord) => ({
            id: quote.id,
            person_id: quote.person_id || quote.customer_id || '',
            number: quote.number || '',
            date: quote.timestamp || quote.date || Math.floor(Date.now() / 1000),
            client_name: quote.customer || quote.client_name || '',
            client_email: quote.email || quote.client_email || '',
            is_send_email: quote.state === 'Enviado' ? 'Enviado' : 'Sin enviar'
        }));

        const requestData = {
            type: type,
            module: 'list-document-quote',
            folder: 'electronic-document',
            start_date: Math.floor(new Date(startDateStr).getTime() / 1000),
            finish_date: Math.floor(new Date(endDateStr).getTime() / 1000),
            data: quotesData
        };

        const downloadRequest = new FetchRequest(urls.getFile, requestData);
        const blob = await apiGetQuoteBlob(downloadRequest) as Blob;
        
        // Validate blob response
        if (!blob || !(blob instanceof Blob)) {
            console.error('Invalid response - not a Blob:', typeof blob, blob);
            throw new Error('Invalid response format from server');
        }
        
        if (blob.size === 0) {
            console.error('Empty blob received from server');
            throw new Error('Empty file received from server');
        }
        
        // Fix MIME type if needed
        if (blob.type === 'application/octet-stream' || !blob.type) {
            const mimeType = type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            console.log(`Correcting MIME type from "${blob.type}" to "${mimeType}"`);
            return new Blob([blob], { type: mimeType });
        }
        
        console.log(`Blob received successfully: size=${blob.size}, type="${blob.type}"`);
        return blob;
    };
};

// Keep original function for backward compatibility
export const downloadQuoteDocument = (
    type: string,
    quotes: IGenericRecord[],
    startDate: string,
    endDate: string
): ThunkAction<Promise<Blob>, RootState, null, QuotesActions> => {
    return async (): Promise<Blob> => {
        const startTimestamp = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : Math.floor(Date.now() / 1000);
        const endTimestamp = endDate ? Math.floor(new Date(endDate).getTime() / 1000) : Math.floor(Date.now() / 1000);
        
        const quotesData = quotes.map(quote => ({
            id: quote.id,
            person_id: quote.person_id || quote.customer_id || '',
            number: quote.number || '',
            date: quote.timestamp || quote.date || Math.floor(Date.now() / 1000),
            client_name: quote.customer || quote.client_name || 'No name',
            client_email: quote.email || quote.client_email || 'No email',
            is_send_email: quote.state === 'Sent' ? 'Sent' : 'Not sent',
            total: quote.total || 0,
            currency: quote.currency || 'COP'
        }));
        
        const requestBody = {
            type: type,
            module: 'list-document-quote',
            folder: 'electronic-document',
            start_date: startTimestamp,
            finish_date: endTimestamp,
            data: quotesData
        };
        
        const request = new FetchRequest(urls.getFile, requestBody);
        const blob = await apiGetQuoteBlob(request) as Blob;
        
        // Verify if the blob is valid
        if (!blob || !(blob instanceof Blob)) {
            console.error('Invalid response - not a Blob:', typeof blob, blob);
            throw new Error('Invalid response format from server');
        }
        
        // Verify if the blob has valid content
        if (blob.size === 0) {
            console.error('Empty blob received from server');
            throw new Error('Empty file received from server');
        }
        
        // If it doesn't have a specific MIME type, assign the correct one
        if (blob.type === 'application/octet-stream' || !blob.type) {
            const mimeType = type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            console.log(`Correcting MIME type from "${blob.type}" to "${mimeType}"`);
            return new Blob([blob], { type: mimeType });
        }
        
        console.log(`Blob received successfully: size=${blob.size}, type="${blob.type}"`);
        return blob;
    };
};

export const getQuoteDocumentList = (dates: IGenericRecord): ThunkAction<Promise<void>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.getDocumentList, dates);
            const { data } = await apiPostInvoice(request) as { data: IGenericRecord[] };
            // Convert to pagination format for consistency
            const paginatedData: IGenericPaginationData<IGenericRecord> = {
                data: data || [],
                meta: { total: data?.length || 0 },
                links: {}
            };
            dispatch(setQuotesList(paginatedData));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const sendEmailTemplate = (
    document_id: string,
    subject: string,
    body_content: string,
    type: string,
    image?: FileList | File | IFile,
    client_email?: string
): ThunkAction<Promise<IGenericRecord>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IGenericRecord> => {
        try {
            const formData = createFormData([
                { key: 'id', value: document_id },
                { key: 'subject', value: subject },
                { key: 'client_email', value: client_email },
                { key: 'body_content', value: body_content },
                { key: 'invoice_type', value: type },
                { key: image ? 'file' : '', value: image && (image as FileList | File | IFile) },
            ]);
            const request = new FetchRequest(urls.invoice.sendEmail, formData);
            const { statusCode } = await apiSendMailInvoice(request) as { statusCode: number; };
            const response = { statusCode };
            dispatch(setEmailTemplateResponse(response));
            return response;
        } catch (error) {
            dispatch(setError(String(error)));
            return { url: '', error: String(error) };
        }
    };
};

// Utility selectors (moved from selectors.ts for standard compliance)
export const selectQuotesData = (state: RootState): IGenericRecord[] => state.quotes.responseList.data || [];
export const selectQuotesError = (state: RootState): string => state.quotes.error;
export const selectCurrentQuote = (state: RootState): IGenericRecord => state.quotes.quoteData;
export const selectEmailResponse = (state: RootState): IGenericRecord => state.quotes.emailResponse;
