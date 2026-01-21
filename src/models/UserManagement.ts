import { IGenericRecord } from './GenericRecord';

/**
 * This interface describes data of add user
 * @typeParam email: string - Optional value is user email
 * @typeParam company_id: string - Optional value is id company identification
 * @typeParam name: string - Optional value name of user
 * @typeParam password: string - Optional value password of user
 * @typeParam roles: IGenericRecord - Optional data of roles and permissions
 * @typeParam accept_policy: boolean - Policy of company
 * @typeParam accept_terms: boolean - Terms of company
 */
export interface IAddUser {
    email?: string;
    company_id?: string;
    name?: string;
    password?: string;
    roles?: IGenericRecord;
    accept_policy: boolean;
    accept_terms: boolean;
}

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
    password?: string;
}
