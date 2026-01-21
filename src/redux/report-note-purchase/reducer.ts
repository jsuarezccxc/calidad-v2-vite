import { ActionKeys, ReportNotesPurchaseActions } from "./types"
import { IGenericRecord } from '@models/GenericRecord';

interface IReportNotesPurchaseState {
    notes: IGenericRecord[],
    invoice: IGenericRecord,
    note: IGenericRecord,
    error: string,
    statusCode: number,
}

const initialState =  {
    notes: [],
    invoice: {},
    note: {},
    error: '',
    statusCode: 0
}


export const reducer = (state:IReportNotesPurchaseState = initialState, action:ReportNotesPurchaseActions):IReportNotesPurchaseState => {
    switch (action.type) {
        case ActionKeys.SET_NOTES_PURCHASE:
            return {
                ...state,
                notes: action.notes,
            };
        case ActionKeys.SET_INVOICE_PURCHASE:
            return {
                ...state,
                invoice: action.invoice
            }
        case ActionKeys.SET_NOTE_PURCHASE:
            return {
                ...state,
                note: action.note
            }
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error
            }
        case ActionKeys.SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.statusCode
            }
        default:
            return state;
    }
}