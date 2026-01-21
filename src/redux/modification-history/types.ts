import { ILinksInterface, IMetaInterface } from '@components/paginator-backend';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_MODIFICATION_HISTORY = 'SET_MODIFICATION_HISTORY',
}

/**
 * Generates a file request object for modification history.
 *
 * @param type: ActionKeys.SET_MODIFICATION_HISTORY - Type action.
 * @param modificationsHistory: IModifications[] - Payload to define request.
 *
 */
export interface ISetModificationHistory {
    type: ActionKeys.SET_MODIFICATION_HISTORY;
    modificationsHistory: IModificationInterface;
}

export type ModificationHistoryActions = ISetModificationHistory;

/**
 * Interface for history request.
 *
 * @param user_id?: string - Data to render in document.
 * @param date: number | null - Data to render in document.
 * @parm search?: string - Data to render in document.
 * @returns IHistoryProps.
 */
export interface IHistoryProps {
    user_id?: string;
    date: number | null;
    search?: string;
}

/**
 * Interface for modification history.
 *
 * @param data: IGenericRecord[] - Data to render in document.
 * @param meta: IMetaInterface - Meta data.
 * @param links: ILinksInterface - Links data.
 * @returns IModificationInterface.
 */
export interface IModificationInterface {
    data: IGenericRecord[];
    meta: IMetaInterface;
    links: ILinksInterface;
}

/**
 * Generates a file request object for modification history.
 *
 * @param modificationsHistory: IModifications[] - Data to render in document.
 *
 */
export interface IModificationHistoryState {
    modificationsHistory: IModificationInterface;
}
