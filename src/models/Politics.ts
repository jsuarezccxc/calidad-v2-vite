import { IGenericRecord } from './GenericRecord';

/**
 * This interface defines structure when get politics
 *
 * @typeParam id: string - Politics' id
 * @typeParam type: string - Politics' type
 * @typeParam url: string - Politics' url saved
 * @typeParam name: string - Politics' file name
 */
export interface IPolitics {
    id: string;
    type: string;
    url: string;
    name: string;
}

/**
 * This interface defines structure when create a politic
 *
 * @typeParam name: string - Politic's name
 * @typeParam type_document: string - Politic's type document
 * @typeParam number_document: string - Politic's number document
 * @typeParam address: string - Politic's address
 * @typeParam city: string - Politic's city
 * @typeParam email: string - Politic's email
 * @typeParam commissioned_area_email: string | null -  Optional prop for politic's commissioned area email
 * @typeParam commissioned_address: string | null - Optional prop for politic's commissioned address
 * @typeParam phone: string - Politic's phone
 * @typeParam day: string - Politic's day
 * @typeParam month: string - Politic's month
 * @typeParam year: string - Politic's year
 * @typeParam company_id: string - Company's id
 */
export interface ICreatePolitic {
    name: string;
    type_document: string;
    number_document: string;
    address: string;
    city: string;
    email: string;
    commissioned_area_email?: string | null;
    commissioned_address?: string | null;
    phone: string;
    day: string;
    month: string;
    year: string;
    company_id: string;
}

/**
 * This interface defines structure when create a politic
 *
 * @typeParam id: string -  Optional - Purpose identification
 * @typeParam description: string - Purpose description
 */
export interface ICreatePurpose {
    id?: string;
    description: string;
}
