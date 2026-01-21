import { BOOLEAN } from '@constants/DataTypes';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * This function validates empty fields
 *
 * @param data: IGenericRecord - Company data
 * @returns boolean
 */
export const validateEmptyFields = (requiredFields: string[], data: IGenericRecord): boolean => {
    return requiredFields.some(field => {
        const value = data[field];
        if (typeof value === BOOLEAN) return !value;
        return !String(value ?? '');
    });
};
