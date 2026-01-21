import { IContingencyHistory } from '@models/ContingencyHistory';

/**
 * This enum is keys to actions
 */
export enum ActionKeys {
    SetContingencies = 'SET_CONTINGENCIES',
    SetContingency = 'SET_CONTINGENCY',
    SetError = 'SET_ERROR',
}

/**
 * This interface is set error back
 *
 * @typeParam type: ActionKeys.SetError - Action type
 * @typeParam error: string - Back's error
 */
export interface ISetError {
    type: ActionKeys.SetError;
    error: string;
}

/**
 * This interface is set contingency history
 *
 * @typeParam type: ActionKeys.SetContingencies - Action type
 * @typeParam contingencies: IContingencyHistory[] - Contingency History
 */
export interface ISetContingencies {
    type: ActionKeys.SetContingencies;
    contingencies: IContingencyHistory[];
}

/**
 * This interface is set contingency
 *
 * @typeParam type: ActionKeys.SetContingency - Set action type
 * @typeParam contingency: any[] - Contingency
 */
export interface ISetContingency {
    type: ActionKeys.SetContingency;
    contingency: IContingencyHistory;
}

/**
 * This type is action in redux
 */
export type ContingencyActions = ISetContingencies | ISetContingency | ISetError;
