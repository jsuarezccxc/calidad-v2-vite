import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_MODIFICATIONS = 'SET_MODIFICATIONS',
    FAILED_MODIFICATIONS = 'FAILED_MODIFICATIONS',
}

export interface ISetModifications {
    type: ActionKeys.SET_MODIFICATIONS;
    modifications: IGenericRecord[];
}

export interface IFailedModifications {
    type: ActionKeys.FAILED_MODIFICATIONS;
    error: string;
}

export type LatestModificationsActions =
    | ISetModifications
    | IFailedModifications;
