export * from './ModalConfirmData';
import { IGenericRecord } from '@models/GenericRecord';


/**
 * Interface props from modal success registration
 * 
 * @typeParam show: boolean - State to show modal
 * @typeParam showModal: () => void - Action to show modal
 */
export interface IModalSuccessRegistration {
    show: boolean
    showModal: () => void
}

/**
 * Interface props from modal confirm data
 * 
 * @typeParam handleMainAction: (data: IGenericRecord) => void - Action to save data
 */
export interface IModalConfirmData extends IModalSuccessRegistration {
    handleMainAction: (data: IGenericRecord) => void;
}


export const VALIDATE_NUMBER_ZERO = '0';
export const PREFIX_NUMBER_DEFAULT = '+57';
export const PARAM_MODAL = 'invitation';

export const TEXTS = {
    NAME: {
        field: 'name',
        required: '*Campo requerido'
    },
    EMAIL: {
        field: 'email',
        required: '*Correo electrónico inválido',
    },
    PHONE_NUMBER: {
        field: 'phoneNumber',
        required: '*Número de celular inválido'
    }
}
