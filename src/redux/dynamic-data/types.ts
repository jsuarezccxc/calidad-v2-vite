import { IGenericRecord } from '@models/GenericRecord';
export enum ActionKeys {
	SET_DYNAMIC_DATA = 'SET_DYNAMIC_DATA',
    ERROR = 'ERROR',
}

export interface ISetDynamicData {
	type: ActionKeys.SET_DYNAMIC_DATA;
	dynamicData: IGenericRecord,
}

export interface ISetError {
	type: ActionKeys.ERROR;
	error: string,
}

export type DynamicDataActions = ISetDynamicData | ISetError;
