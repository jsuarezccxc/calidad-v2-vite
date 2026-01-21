import { IGenericRecord } from '@models/GenericRecord';
import { ILedgerAccount } from '@models/Utils';
import { ActionKeys, UtilsActions } from '@redux/utils/types';

const { SET_CUSTOM_QUERY, SET_UTILS, SET_LEDGER_ACCOUNTS, SET_ERROR, SET_INFLATION } = ActionKeys;

interface IUtils {
    infoCustomQuery: IGenericRecord;
    utils: IGenericRecord;
    ledgerAccounts: ILedgerAccount[];
    error: string;
    inflation: IGenericRecord;
}

const initialState: IUtils = {
    infoCustomQuery: {},
    utils: {},
    ledgerAccounts: [],
    error: '',
    inflation: {},
};

export const reducer = (state: IUtils = initialState, action: UtilsActions): IUtils => {
    switch (action.type) {
        case SET_CUSTOM_QUERY:
            return {
                ...state,
                infoCustomQuery: action.infoCustomQuery,
            };
        case SET_UTILS:
            return {
                ...state,
                utils: action.payload,
            };
        case SET_LEDGER_ACCOUNTS:
            return {
                ...state,
                ledgerAccounts: action.payload,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case SET_INFLATION:
            return {
                ...state,
                inflation: action.payload,
            };
        default:
            return state;
    }
};
