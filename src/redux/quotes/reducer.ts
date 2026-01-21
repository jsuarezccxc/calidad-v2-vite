import { IGenericRecord } from '@models/GenericRecord';
import { IGenericPaginationData, paginationDataFormat } from '@constants/PaginationBack';
import { ActionKeys, QuotesActions } from './types';

interface IQuotesState {
    responseList: IGenericPaginationData<IGenericRecord>;
    quoteData: IGenericRecord;
    error: string;
    emailResponse: IGenericRecord;
    consecutive: IGenericRecord;
}

const initialState: IQuotesState = {
    responseList: paginationDataFormat,
    quoteData: {},
    error: '',
    emailResponse: {},
    consecutive: {},
};

export const reducer = (state: IQuotesState = initialState, action: QuotesActions): IQuotesState => {
    switch (action.type) {
        case ActionKeys.SET_QUOTES_LIST:
            return {
                ...state,
                responseList: action.responseList,
                error: '',
            };
        case ActionKeys.SET_QUOTE_DATA:
            return {
                ...state,
                quoteData: action.quoteData,
                error: '',
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.FAILED_MODIFICATIONS:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SEND_EMAIL_TEMPLATE:
            return {
                ...state,
                emailResponse: action.response,
                error: '',
            };
        case ActionKeys.SET_QUOTE_CONSECUTIVE:
            return {
                ...state,
                consecutive: action.consecutive,
                error: '',
            };
        default:
            return state;
    }
};
