import { ItemsPay } from '@constants/PaymentMethods';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_BANKS_PSE = 'SET_BANKS_PSE',
    SET_IP_ADDRESS = 'SET_IP_ADDRESS',
    GET_CARD_PAYU = 'GET_CARD_PAYU',
    ITEM_TO_PAY = 'ITEM_TO_PAY',
    PAY_MEMBERSHIPS_OR_USERS = 'PAY_MEMBERSHIPS_OR_USERS',
    PAY_RESPONSE = 'PAY_RESPONSE',
    SHOW_RESPONSE_MODAL = 'SHOW_RESPONSE_MODAL',
    SET_URL_BANK = 'SET_URL_BANK',
    SET_STATUS_CANCEL_TRANSACTION = 'SET_STATUS_CANCEL_TRANSACTION',
    CLEAR_PAY_RESPONSE = 'CLEAR_PAY_RESPONSE',
    SET_STATUS_VALIDATE_MODULES = 'SET_STATUS_VALIDATE_MODULES',
    SET_ERROR = 'SET_ERROR',
    SET_GEOLOCATION = 'SET_GEOLOCATION',
    SET_STATUS_PAYMENT_INFO = 'SET_STATUS_PAYMENT_INFO',
}

export interface ISetBanksPse {
    type: ActionKeys.SET_BANKS_PSE;
    banks: IGenericRecord[];
}

export interface ISetGeolocation {
    type: ActionKeys.SET_GEOLOCATION;
    geolocation: IGenericRecord;
}

export interface IGetCardPayU {
    type: ActionKeys.GET_CARD_PAYU;
    cardInfo: IGenericRecord;
}

export interface ISetStatusPaymentInfo {
    type: ActionKeys.SET_STATUS_PAYMENT_INFO;
    statusPaymentInfo: IGenericRecord;
}

export interface IItemToPay {
    type: ActionKeys.ITEM_TO_PAY;
    itemToPay: ItemsPay;
}

export interface IPayMembershipsOrUsers {
    type: ActionKeys.PAY_MEMBERSHIPS_OR_USERS;
    data: IGenericRecord;
}

export interface IPayResponse {
    type: ActionKeys.PAY_RESPONSE;
    response: IGenericRecord;
}

export interface IShowResponseModal {
    type: ActionKeys.SHOW_RESPONSE_MODAL;
}

export interface ISetUrlBank {
    type: ActionKeys.SET_URL_BANK;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    urlBank: any;
}

export interface ISetStatusCancelTransaction {
    type: ActionKeys.SET_STATUS_CANCEL_TRANSACTION;
    statusTransaction: string;
}

export interface ISetStatusValidateModules {
    type: ActionKeys.SET_STATUS_VALIDATE_MODULES;
    statusValidateModules: number;
}

export interface IError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export type PaymentsActions =
    | ISetBanksPse
    | IGetCardPayU
    | IItemToPay
    | IPayMembershipsOrUsers
    | IPayResponse
    | IShowResponseModal
    | ISetUrlBank
    | ISetStatusCancelTransaction
    | ISetStatusValidateModules
    | ISetGeolocation
    | ISetStatusPaymentInfo
    | IError;
