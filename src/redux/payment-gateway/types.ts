import { IDataPaymentGateway } from '@models/PaymentGateway';

export enum ActionKeys {
    STORE_COMPANY_PAYMENT_GATEWAY = 'STORE_COMPANY_PAYMENT_GATEWAY',
    SET_STATUS_CODE = 'SET_STATUS_CODE',
    ERROR = 'ERROR',
    CHANGE_IS_INSTRUCTIONS = 'CHANGE_IS_INSTRUCTIONS',
}

export interface IStoreCompanyPaymentInformation {
    type: ActionKeys.STORE_COMPANY_PAYMENT_GATEWAY;
    payload: IDataPaymentGateway[];
}

export interface ISetStatusCode {
    type: ActionKeys.SET_STATUS_CODE;
    statusCode: number;
}

export interface IError {
    type: ActionKeys.ERROR;
    error: string;
}

export interface IIsInstructions {
    type: ActionKeys.CHANGE_IS_INSTRUCTIONS;
    payload: boolean;
}

export type PaymentGatewayActions = IStoreCompanyPaymentInformation | ISetStatusCode | IError | IIsInstructions;
