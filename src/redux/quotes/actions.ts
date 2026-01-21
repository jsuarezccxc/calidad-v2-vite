import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { IGenericRecord } from '@models/GenericRecord';
import { IGenericPaginationData } from '@constants/PaginationBack';
import { FetchRequest } from '@models/Request';
import { createFormData } from '@utils/FormData';
import { urls } from '@api/urls';
import { apiGetQuote, apiPostQuote, apiDeleteQuote, apiPostQuoteBlob } from '@api/quotes';
import { apiPostInvoice, apiSendMailInvoice } from '@api/invoice';
import { isCorrectResponse } from '@utils/Response';
import { IFile } from '@components/input';
import { validateBlobResponse } from '@utils/File';
import { QUOTES_DEFAULTS } from '@constants/QuoteViewLabels';
import {
    ActionKeys,
    QuotesActions,
    ISetQuotesList,
    ISetQuoteData,
    ISetError,
    ISetFailedModifications,
    ISetEmailTemplateResponse,
    ISetQuoteConsecutive,
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

export const setQuoteConsecutive = (consecutive: IGenericRecord): ISetQuoteConsecutive => ({
    type: ActionKeys.SET_QUOTE_CONSECUTIVE,
    consecutive,
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

export const getQuoteConsecutive = (): ThunkAction<Promise<IGenericRecord | null>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IGenericRecord | null> => {
        try {
            const request = new FetchRequest(urls.invoice.quotes.consecutive);
            const { data } = await apiGetQuote(request) as IQuoteApiResponse;
            dispatch(setQuoteConsecutive(data));
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
            return null;
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
    filteredQuotes: IGenericRecord[],
    startDate?: Date | null,
    endDate?: Date | null
): ThunkAction<Promise<Blob>, RootState, null, QuotesActions> => {
    return async (): Promise<Blob> => {
        const startDateStr = startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const endDateStr = endDate ? endDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        const quotesData = filteredQuotes.map((quote: IGenericRecord) => ({
            id: quote.id?.toString() || '',
            person_id: quote.person_id || '',
            number: quote.number || '',
            date: quote.timestamp || quote.date || Math.floor(Date.now() / 1000),
            client_name: quote.customer || quote.client_name || '',
            client_email: quote.email || quote.client_email || '',
            is_send_email: quote.state === QUOTES_DEFAULTS.DOCUMENT_STATES.SENT
                ? QUOTES_DEFAULTS.DOCUMENT_STATES.SENT
                : QUOTES_DEFAULTS.DOCUMENT_STATES.NOT_SENT
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
        const blob = await apiPostQuoteBlob(downloadRequest) as Blob;

        return validateBlobResponse(blob, type);
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
        const blob = await apiPostQuoteBlob(request) as Blob;

        return validateBlobResponse(blob, type);
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
                meta: {
                    total: data?.length || 0,
                    current_page: 1,
                    from: 1,
                    last_page: 1,
                    path: '',
                    per_page: data?.length || 0,
                    to: data?.length || 0
                },
                links: {
                    first: '',
                    last: '',
                    next: '',
                    prev: ''
                }
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
            const imageFile = image instanceof FileList ? image[0] : image;
            const formData = createFormData([
                { key: 'id', value: document_id },
                { key: 'subject', value: subject },
                { key: 'client_email', value: client_email || '' },
                { key: 'body_content', value: body_content },
                { key: 'invoice_type', value: type },
                ...(imageFile ? [{ key: 'file', value: imageFile as File }] : []),
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

/**
 * Sends quote email with custom template
 * Uses quote-specific endpoint for email delivery
 *
 * @typeParam document_id: string - Quote document ID
 * @typeParam subject: string - Email subject
 * @typeParam body_content: string - Email HTML content
 * @typeParam type: string - Quote type
 * @typeParam image: FileList | File | IFile - Optional attached image
 * @typeParam client_email: string - Optional client email override
 * @returns Promise with status code response
 */
export const sendQuoteEmail = (
    document_id: string,
    subject: string,
    body_content: string,
    type: string,
    image?: FileList | File | IFile,
    client_email?: string
): ThunkAction<Promise<IGenericRecord>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IGenericRecord> => {
        try {
            const imageFile = image instanceof FileList ? image[0] : image;
            const formData = createFormData([
                { key: 'id', value: document_id },
                { key: 'subject', value: subject },
                { key: 'client_email', value: client_email || '' },
                { key: 'body_content', value: body_content },
                { key: 'invoice_type', value: type },
                ...(imageFile ? [{ key: 'file', value: imageFile as File }] : []),
            ]);
            const request = new FetchRequest(urls.invoice.quotes.sendEmail, formData);
            const response = await apiSendMailInvoice(request) as IGenericRecord;

            const hasErrors = response?.data?.errors && Array.isArray(response.data.errors) && response.data.errors.length > 0;
            const finalStatusCode = hasErrors ? response.data.errors[0].statusCode : response.statusCode;

            const result = { statusCode: finalStatusCode };
            dispatch(setEmailTemplateResponse(result));
            return result;
        } catch (error) {
            dispatch(setError(String(error)));
            return { url: '', error: String(error) };
        }
    };
};

/**
 * Loads quote data for invoice generation from quote ID
 * Fetches quote data and returns formatted data ready for invoice form
 *
 * @typeParam quoteId: string - Quote ID to load
 * @returns Promise with quote data formatted for invoice or null if error
 */
export const loadQuoteForInvoice = (
    quoteId: string
): ThunkAction<Promise<IGenericRecord | null>, RootState, null, QuotesActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, QuotesActions>): Promise<IGenericRecord | null> => {
        try {
            const endpoint = urls.invoice.quotes.getForInvoice(quoteId);
            const response = await apiGetQuote({ resource: endpoint }) as { data?: IGenericRecord };

            if (response?.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            dispatch(setError(String(error)));
            return null;
        }
    };
};

// Utility selectors (moved from selectors.ts for standard compliance)
export const selectQuotesData = (state: RootState): IGenericRecord[] => state.quotes.responseList.data || [];
export const selectQuotesError = (state: RootState): string => state.quotes.error;
export const selectCurrentQuote = (state: RootState): IGenericRecord => state.quotes.quoteData;
export const selectEmailResponse = (state: RootState): IGenericRecord => state.quotes.emailResponse;
