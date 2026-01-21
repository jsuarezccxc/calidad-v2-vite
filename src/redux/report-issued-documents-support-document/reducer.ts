import { ActionKeys, ReportIssuedDocumentsSupportDocumentActions } from "./types"
import { IGenericRecord } from '@models/GenericRecord';

interface IReportIssuedDocumentsSupportDocumentActions {
    data: IGenericRecord[],
    error: string,
}

const initialState =  {
    data: [],
    error: '',
}

export const reducer = (state:IReportIssuedDocumentsSupportDocumentActions = initialState, action:ReportIssuedDocumentsSupportDocumentActions):IReportIssuedDocumentsSupportDocumentActions => {
    switch (action.type) {
        case ActionKeys.SET_SUPPORT_DOCUMENT_REPORT:
            return {
                ...state,
                data: action.data,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
}
