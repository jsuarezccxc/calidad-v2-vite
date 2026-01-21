import { IGenericRecord } from '@models/GenericRecord';
import { IDataForm } from '@pages/plan-method-payment';

export * from './InformationCard';

export const FIELDS = {
    name: '*Nombre del titular:',
    documentType: '*Tipo de documento:',
    documentNumber: '*Número de documento:',
    email: '*Correo electrónico:',
    numberCard: '*Número de la tarjeta:',
    expirationDate: '*Fecha de vencimiento:',
    securityCode: '*Código de seguridad',
    typeCard: '*Tipo de tarjeta:',
    placeholders: {
        dots: '...',
        select: 'Seleccionar',
        date: 'mm/aaaa',
    }
}

/**
 * Interface props from information card
 * 
 * @typeParam dynamicData: IGenericRecord - Data from dynamic request
 * @typeParam formData: IDataForm - Form data card
 * @typeParam errorsData: IDataForm - Errors data card
 * @typeParam handleChange: <T>(value: T, name: string) => void - Handle action to change values form
 */
export interface IInformationCard {
    dynamicData: IGenericRecord
    formData: IDataForm;
    errorsData: IDataForm;
    handleChange: <T>(value: T, name: string) => void
}
