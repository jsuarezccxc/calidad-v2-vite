/**
 * This interface describes the contact data
 *
 * @typeParam name: string - Contact name
 * @typeParam email: string - Contact email
 * @typeParam phone: string - Contact phone number
 * @typeParam prefix_number: string - Contact phone prefix
 * @typeParam company_name: string - Company name
 * @typeParam data_processing: boolean - Value that authorizes the processing of personal data
 * @typeParam hour: string - Scheduling time
 * @typeParam date: string - Scheduling date
 */
export interface IData {
    name: string;
    email: string;
    phone: string;
    phone_prefix: string;
    company_name: string;
    data_processing: boolean;
    hour: string;
    date: string;
}

