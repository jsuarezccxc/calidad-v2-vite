import { IGenericRecord } from './GenericRecord';

/**
 * This interface describes data of user
 * @typeParam id: string - Optional value is an identifier user
 * @typeParam email: string - Optional value email of user
 * @typeParam name: string - Optional value name of user
 * @typeParam roles: IGenericRecord - Optional data of roles and permissions
 */
export interface IEditUser {
    id?: string;
    email?: string;
    name?: string;
    roles?: IGenericRecord;
}

/**
 * This interface describes required properties
 * 
 * @typeParam required: boolean - Indicates if the field is required
 * @typeParam requiredText: string - Text to display when the field is required
 */
export interface IRequiredProps {
    required: boolean;
    requiredText: string;
}
