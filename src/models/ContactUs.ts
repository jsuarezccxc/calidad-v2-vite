/**
 * Represents the structure of form values.
 *
 * @typeParam name_surname: string - The full name of the user.
 * @typeParam email: string - The email address of the user.
 * @typeParam prefix_number: string - The prefix of contact number of the user.
 * @typeParam phone: string - The contact phone number of the user.
 * @typeParam company_name: string - The name of the user's company.
 * @typeParam affair: string - The subject or affair of the form, defaulting to 'Asunto'.
 * @typeParam description: string - A detailed description or message from the user.
 * @typeParam type: string - The type of form submission, defaulting to 'CCXC'.
 */
export interface IFormatContactData {
    name_surname: string;
    email: string;
    prefix_number: string;
    phone: string;
    company_name: string;
    affair: string;
    description: string;
    type: string;
}
