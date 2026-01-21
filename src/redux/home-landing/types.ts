import { IGenericRecord } from '@models/GenericRecord';

/* Defining the type of the action. */
export enum ActionKeys {
    SET_ECONOMIC_DETAILS = 'SET_ECONOMIC_DETAILS',
    SET_FAILED_ERROR = 'SET_FAILED_ERROR',
    SET_TRM_DATA = 'SET_TRM_DATA',
    SET_USER_DATA = 'SET_USER_DATA',
}

/* Defining the type of the action. */
export interface ISetUserData {
    type: ActionKeys.SET_USER_DATA;
    userData: IGenericRecord;
}

/* Defining the type of the action. */
export interface ISetEconomicDetails {
    type: ActionKeys.SET_ECONOMIC_DETAILS;
    economicDetails: IGenericRecord;
}

/* Defining the type of the action. */
export interface ISetTrmData {
    type: ActionKeys.SET_TRM_DATA;
    trm: IGenericRecord;
}

/* Defining the type of the action. */
export interface ISetFailedError {
    type: ActionKeys.SET_FAILED_ERROR;
    error: string;
}

export type HomeLandingActions = ISetEconomicDetails | ISetFailedError | ISetTrmData | ISetUserData;
