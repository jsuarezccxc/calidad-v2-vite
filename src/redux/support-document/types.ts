import { IGenericRecord } from "@models/GenericRecord";

export enum ActionKeys {
    SET_FORM = "SET_FORM",
    GET_FORM = "GET_FORM",
    GET_PURCHASING_MANAGER = "GET_PURCHASING_MANAGER",
    GET_SUPPORT_DOCUMENT_BY_ID = "GET_SUPPORT_DOCUMENT_BY_ID",
    SET_ERROR = "SET_ERROR",
}

export interface ISetSupportForm {
    type: ActionKeys.SET_FORM,
    form: IGenericRecord,
}

export interface IGetPurchasingManager {
    type: ActionKeys.GET_PURCHASING_MANAGER,
    data: IGenericRecord[];
}

export interface IGetSupportDocumentById {
    type: ActionKeys.GET_SUPPORT_DOCUMENT_BY_ID,
    data: IGenericRecord,
}

export interface IError {
    type: ActionKeys.SET_ERROR,
    error: string;
}

export type SupportDocumentActions = ISetSupportForm | IGetPurchasingManager | IGetSupportDocumentById | IError;
