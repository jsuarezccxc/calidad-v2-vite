import { IContingencyHistory } from '@models/ContingencyHistory';
import { ActionKeys, ContingencyActions } from './types';

/**
 * This interface is contingency state
 *
 * @typeParam contingencies: IContingencyHistory[] - Contingency history
 * @typeParam error: string - Error back
 */
interface IContingencyState {
    contingencies: IContingencyHistory[];
    contingency: IContingencyHistory;
    error: string;
}

/**
 * This const is to initial state
 */
const initialState: IContingencyState = {
    contingencies: [],
    contingency: {
        created_at: '',
        description: '',
        end_date: '',
        end_time: '',
        file_path: '',
        id: '',
        start_date: '',
        start_time: '',
        status: '',
        updated_at: '',
    },
    error: '',
};

/**
 * This function is for assign state redux
 *
 * @param state: IContingencyState - Initial state
 * @param action: ContingencyActions - Action redux
 * @returns IContingencyState
 */
export const reducer = (state: IContingencyState = initialState, action: ContingencyActions): IContingencyState => {
    switch (action.type) {
        case ActionKeys.SetContingencies:
            return {
                ...state,
                contingencies: action.contingencies,
            };
        case ActionKeys.SetContingency:
            return {
                ...state,
                contingency: action.contingency,
            };
        default:
            return {
                ...state,
                error: action.error,
            };
    }
};
