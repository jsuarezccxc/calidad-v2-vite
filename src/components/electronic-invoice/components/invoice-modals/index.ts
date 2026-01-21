import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
export { ModalUpdateCustomer, ModalUpdateDocumentNumber } from './InvoiceModals';

/**
 * Array of objects used to update the first table
 */
export const tableEditCustomer = [
    {
        name: 'Detalle de impuestos',
        value: 'tax_details_code',
        update: 'tax_details_name',
        existingCustomer: 'tax_details_name',
    },
    {
        name: 'Responsabilidad fiscal',
        value: 'fiscal_responsibilities',
        update: 'fiscal_responsibilities',
        existingCustomer: 'fiscal_responsibilities',
    },
    {
        name: 'Tipo de contribuyente',
        value: 'type_taxpayer_name',
        update: 'type_taxpayer_name',
        existingCustomer: 'type_taxpayer_name',
    },
    {
        name: 'Nombre del cliente',
        value: 'name',
        update: 'name',
        existingCustomer: 'name',
    },
    {
        name: 'Tipo de documento',
        value: 'document_type',
        update: 'document_type_name',
        existingCustomer: 'document_type',
    },
    {
        name: 'Número  de  documento',
        value: 'document_number',
        update: 'document_number',
        existingCustomer: 'document_number',
    },
    {
        name: 'Correo electrónico',
        value: 'email',
        update: 'email',
        existingCustomer: 'email',
    },
    {
        name: 'País',
        value: 'country_name',
        update: 'country_name',
        existingCustomer: 'country_name',
    },
    {
        name: 'Departamento/estado',
        value: 'department_name',
        update: 'department_name',
        existingCustomer: 'department_name',
    },
    {
        name: 'Ciudad',
        value: 'city_name',
        update: 'city_name',
        existingCustomer: 'city_name',
    },
    {
        name: 'Código postal',
        value: 'postal_code',
        update: 'postal_code',
        existingCustomer: 'postal_code',
    },
    {
        name: 'Dirección',
        value: 'address',
        update: 'address',
        existingCustomer: 'address',
    },
];

/**
 * This interface is for edited customer information modal
 *
 * @typeParam showModal: boolean - Show modal
 * @typeParam setShowModal: Dispatch<SetStateAction<boolean>> - Set state modal
 * @typeParam updateFields: string[] - Fields update
 * @typeParam fieldInput: IGenericRecord - Data form invoice
 * @typeParam customerInformation?: IGenericRecord - Customer information
 * @typeParam discardChanges: () => void - Function for discard changes
 * @typeParam saveAndSend: () => void - Function save
 * @typeParam isQuote: boolean - If is quote or electronic invoice
 */
export interface IModalUpdateCustomer {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    updateFields: string[];
    fieldInput: IGenericRecord;
    customerInformation: IGenericRecord;
    discardChanges: () => void;
    saveAndSend: () => void;
    isQuote: boolean;
}

/**
 * This interface is for the modal when editing the document number
 *
 * @typeParam showModal: boolean - Show modal
 * @typeParam setShowModal: Dispatch<SetStateAction<boolean>> - Set state modal
 * @typeParam documentNumber: string - Document number
 * @typeParam discardChange: () => void - Function for discard changes
 * @typeParam saveAndSend: () => void - Function save
 */
export interface IModalUpdateDocumentNumber {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    documentNumber: string;
    discardChange: () => void;
    saveAndSend: () => void;
}

/**
 * This const is to validate numbers
 */
export const validateNumber = {
    five: 5,
    six: 6
}
