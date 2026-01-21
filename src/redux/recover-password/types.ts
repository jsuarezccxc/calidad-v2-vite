export enum ActionKeys {
    RECOVER_PASSWORD = 'RECOVER_PASSWORD',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    FAILED = 'FAILED',
    CLEAR_ERRORS = 'CLEAR_ERRORS',
}

export interface IRecoverPassword {
    type: ActionKeys.RECOVER_PASSWORD;
    response: number;
}

export interface IChangePassword {
    type: ActionKeys.CHANGE_PASSWORD;
    changePassword: boolean;
}

export interface IFailed {
    type: ActionKeys.FAILED;
    error: string;
}

export interface IClearErrors {
    type: ActionKeys.CLEAR_ERRORS;
}

export type RecoverPasswordActions = IRecoverPassword | IChangePassword | IFailed | IClearErrors;