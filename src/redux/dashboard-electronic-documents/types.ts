import { IDataDashboardElectronicDocuments } from "@models/DashboardElectronicDocuments";

/**
 * This enum action keys
 */
export enum ActionKeys {
    SET_DATA_DASHBOARD = 'SET_DATA_DA',
    SET_ERROR = 'SET_ERROR',
}

/**
 * This interface set data dashboard
 * 
 * @typeParam type: ActionKeys.SET_DATA_DASHBOARD - Key action
 * @typeParam data: IDataDashboardElectronicDocuments - Data dashboard
 */
export interface ISetDataDashboard {
    type: ActionKeys.SET_DATA_DASHBOARD;
    data: IDataDashboardElectronicDocuments;
}

/**
 * This interface set error
 * 
 * @typeParam type: ActionKeys.SET_ERROR - Key action
 * @typeParam error: string - Error message
 */
export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

/**
 * This type is actions redux
 */
export type DashboardElectronicDocumentActions = ISetDataDashboard | ISetError;
