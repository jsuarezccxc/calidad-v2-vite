import { SubStepSelection } from '@constants/Domain';
import { IGenericRecord } from '@models/GenericRecord';

export enum ActionKeys {
    SET_STEPS_COMPLETED = 'SET_STEPS_COMPLETED',
    SET_TYPE_DOMAIN = 'SET_TYPE_DOMAIN',
    SET_ERROR = 'SET_ERROR',
}

export interface ISetStepsCompletes {
    type: ActionKeys.SET_STEPS_COMPLETED,
    payload: SubStepSelection[],
}

export interface ISetTypeDomain {
    type: ActionKeys.SET_TYPE_DOMAIN,
    payload: string,
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    payload: IGenericRecord;
}

export type DomainActions = ISetStepsCompletes | ISetTypeDomain | ISetError;
