import { IGenericRecord } from '@models/GenericRecord';
import { ILedgerAccount } from '@models/Utils';

export enum ActionKeys {
    SET_ERROR = 'SET_ERROR',
    SET_CUSTOM_QUERY = 'SET_CUSTOM_QUERY',
    SET_UTILS = 'SET_UTILS',
    SET_LEDGER_ACCOUNTS = 'SET_LEDGER_ACCOUNTS',
    SET_INFLATION = 'SET_INFLATION',
}

/*
 * This interface describes redux error
 *
 * @typeParam type: string - Redux action
 * @typeParam error: string - Redux request error
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

/*
 * This interface describes redux type
 *
 * @typeParam type: string - Redux action
 * @typeParam infoCustomQuery: IGenericRecord - Redux request data
 */
export interface IGetCustomQuery {
    type: ActionKeys.SET_CUSTOM_QUERY;
    infoCustomQuery: IGenericRecord;
}

/*
 * This interface describes a redux action
 *
 * @typeParam type: string - Action type
 * @typeParam payload: IGenericRecord - Payload to change the state
 */
export interface ISetUtils {
    type: ActionKeys.SET_UTILS;
    payload: IGenericRecord;
}

/*
 * This interface describes a redux action
 *
 * @typeParam type: string - Action type
 * @typeParam payload: IGenericRecord[] - Payload to change the state
 */
export interface ISetLedgerAccounts {
    type: ActionKeys.SET_LEDGER_ACCOUNTS;
    payload: ILedgerAccount[];
}

/**
 * This interface describes a redux action
 *
 * @typeParam type: string - Action type
 * @typeParam payload: IGenericRecord - Payload to change the state
 */
export interface ISetInflation {
    type: ActionKeys.SET_INFLATION;
    payload: IGenericRecord;
}

export type UtilsActions = IGetCustomQuery | ISetUtils | ISetLedgerAccounts | ISetError | ISetInflation;
