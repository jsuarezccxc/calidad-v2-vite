import { IGenericRecord } from '@models/GenericRecord';
import { FormEvent } from 'react';
/**
 * This interface describes the properties of the each form data field
 *
 * @typeParam key: string - Field key
 * @typeParam value: string - Field value
 */
interface IFormDataField {
    key: string;
    value: string | Blob;
}

/**
 * Function that returns new form data
 *
 * @param fields: IFormDataField[] - Form data fields
 * @returns FormData
 */
export const createFormData = (fields: IFormDataField[]): FormData => {
    const formData = new FormData();
    fields.forEach(field => formData.set(field.key, field.value || ''));
    return formData;
};

/**
 * This formats the data to create a form data
 *
 * @param data: IGenericRecord - Unformatted form data
 * @returns IFormDataField[]
 */
export const formatData = (data: IGenericRecord): IFormDataField[] => {
    return Object.entries(data).map(([key, value]) => ({ key, value }));
};

export const avoidReloadingThePage = (event: FormEvent): void => event.preventDefault();
