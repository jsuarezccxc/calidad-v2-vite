export enum ActionKeys {
    SET_ERROR = 'ERROR',
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type VirtualStoreSalesActions =
    | ISetError
