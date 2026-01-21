import { IGenericRecord } from '@models/GenericRecord';

/**
 * This interfaces describe user data
 *
 * @typeParam id: string - user's id
 * @typeParam email: string - user's email
 * @typeParam name: string - user's name
 * @typeParam document_number: string - user's document number
 * @typeParam document_type: string - user's document type
 * @typeParam company_id: string - user's company id
 * @typeParam user_privacy_acceptation_date: number - user's privacy acceptation date
 * @typeParam roles?: IGenericRecord[] - Optional prop user's roles
 */
export interface IUser {
    id: string;
    email: string;
    name: string;
    document_number: string;
    document_type: string;
    company_id: string;
    user_privacy_acceptation_date: number;
    roles?: IGenericRecord[];
}

/**
 * This interface describes the properties required for creating an account.
 *
 * @typeParam document_type: string - Specifies the user's document type.
 * @typeParam nit: string - Specifies the user's NIT (tax identification number).
 * @typeParam name: string - Specifies the name of the user's company.
 * @typeParam company_representative_name: string - Specifies the name of the primary contact person.
 * @typeParam email: string - Specifies the user's email address.
 * @typeParam password: string - Specifies the user's new password.
 * @typeParam password_confirmation: string - Confirms the user's new password.
 * @typeParam phone: string - Specifies the user's phone number.
 * @typeParam accept_policy: boolean - Indicates whether the user accepts the policies.
 * @typeParam accept_terms: boolean - Indicates whether the user accepts the terms and conditions.
 */
export interface ICreateAccount {
    document_type: string;
    nit: string;
    name: string;
    company_representative_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    accept_policy: boolean;
    accept_terms: boolean;
}

/**
 * This interface describes send data to update password user
 *
 * @typeParam id: string - User's id
 * @typeParam password: string - User's password
 * @typeParam password_confirmation: string - User's password confirmation
 */
export interface IUpdatePassword {
    id: string;
    password: string;
    password_confirmation: string;
}

/**
 * This interface describes data to get company area
 *
 * @typeParam id: string - User's id
 * @typeParam area: string - Name area
 * @typeParam name_director: String - name director area
 * @typeParam email: string - Email director area
 */
export interface IArea {
    id: string;
    area: string;
    name_director: string;
    email: string;
}

/**
 * This interface describes data to get notification
 *
 * @typeParam name_user: Optional string - User's id
 * @typeParam company_name: Optional string - company name
 * @typeParam area: string - Name area
 * @typeParam media: string - Network media to contact
 * @typeParam contact: string - Telephone number or mail to contact
 */
export interface INotificationData {
    name_user?: string;
    company_name?: string;
    area: string;
    media: string;
    contact: string;
}
