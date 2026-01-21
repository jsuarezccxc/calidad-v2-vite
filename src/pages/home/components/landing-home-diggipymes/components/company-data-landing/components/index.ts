export * from './FormCompanyData';

export interface IFormCompanyDataProps {
    formData: {
        name: string;
        company_representative_name: string;
        phone: string;
    };
    onInputChange: (key: keyof IFormCompanyDataProps['formData'], value: string) => void;
}

export const MAX_LENGTH_TEXT_COMPANY = 255;
export const MAX_LENGTH_PHONE_COMPANY = 13;

export enum FieldsNamesInputs {
    COMPANY_REPRESENTATIVE_NAME = 'company_representative_name',
    NAME = 'name',
    PHONE = 'phone',
}
