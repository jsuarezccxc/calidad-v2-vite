import { getTodaysTime } from '@utils/Date';
import { IContingencyActivation } from '@models/ContingencyActivation';

/**
 * This const is default data
 */
export const DEFAULT_DATA: IContingencyActivation = {
    start_date: new Date().toString(),
    end_date: new Date().toString(),
    start_time: getTodaysTime(),
    end_time: getTodaysTime(),
    description: '',
    file: undefined,
};

/**
 * This enum is keys form
 */
export enum FormKeys {
    startDate = 'start_date',
    StartTime = 'start_time',
    EndDate = 'end_date',
    Description = 'description',
    EndTime = 'end_time',
    File = 'file',
}

/**
 * This enum is state contingency
 */
export enum ContingencyState {
    Completed = 'COMPLETED',
    InProgress = 'IN_PROGRESS',
}

/**
 * This const is label contingency state
 */
export const CONTINGENCY_STATE: { [key: string]: string } = {
    [ContingencyState.Completed]: 'Finalizada',
    [ContingencyState.InProgress]: 'En progreso',
};
