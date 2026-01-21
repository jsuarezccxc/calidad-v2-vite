import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_PERSONALIZED_CONSULTING_OPTION = 'SET_PERSONALIZED_CONSULTING_OPTION',
    SET_TYPE_PERSONALIZED_CONSULTING = 'SET_TYPE_PERSONALIZED_CONSULTING',
    GET_PQR_TYPE = 'GET_PQR_TYPE',
    GET_CONSULTING_TYPE = 'GET_CONSULTING_TYPE',
    ERROR = 'ERROR',
}

export interface ISetPersonalizedConsultingOptions {
    type: ActionKeys.SET_PERSONALIZED_CONSULTING_OPTION | ActionKeys.SET_TYPE_PERSONALIZED_CONSULTING;
    option: IGenericRecord;
}

export interface IGetPersonalizedConsultingOptions {
    type: ActionKeys.GET_PQR_TYPE | ActionKeys.GET_CONSULTING_TYPE;

    data: IGenericRecord[];
}

export interface IError {
    type: ActionKeys.ERROR;
    error: string;
}

export type PersonalizedConsultingActions = ISetPersonalizedConsultingOptions | IError | IGetPersonalizedConsultingOptions;
