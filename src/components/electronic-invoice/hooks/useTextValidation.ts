import { DEFAULT_REQUIRED_TEXT } from "@components/input";
import { IGenericRecord } from "@models/GenericRecord";
import { validateEmail } from "@utils/Validation";
import { CUSTOMER_VALIDATION, DATE_VALIDATION, EMAIL_VALIDATION, INVOICE_VALIDATION, POSTAL_CODE_VALIDATION, searchNameInput, SEND_ADDRESS, SEND_PRODUCTS, VALID_EMAIL_VALIDATION, validateDocumentNumberClient } from "..";

export const useTextValidation = (): {
    textInvoice: (registerInvoice: boolean, error?: string) => string
    textDateValidation: (date: IGenericRecord, inputValidation: string[]) => string
    textEmailValidation: (date_limit: IGenericRecord) => string
    textCustomerValidation: (isWantedCustomer: boolean, existingCustomer: boolean, document_number: string) => string | undefined
    textValidEmail: (email: string) => string
    textQuote: (isQuote: boolean, questionElectronicInvoice: string) => string
    textAddressQuote: (isQuote: boolean, address: string) => string
    textPostalCode: (postal_code: IGenericRecord[]) => string
} => {
    const textInvoice = (registerInvoice: boolean, error?: string): string => registerInvoice && error ? INVOICE_VALIDATION : DEFAULT_REQUIRED_TEXT;
    const textDateValidation = (date: IGenericRecord, inputValidation: string[]): string => date && searchNameInput('date', inputValidation) ? DATE_VALIDATION : DEFAULT_REQUIRED_TEXT;
    const textEmailValidation = (date_limit: IGenericRecord): string => date_limit ? EMAIL_VALIDATION : DEFAULT_REQUIRED_TEXT;
    const textCustomerValidation = (isWantedCustomer: boolean, existingCustomer: boolean, document_number: string): string | undefined => isWantedCustomer && existingCustomer ? CUSTOMER_VALIDATION : validateDocumentNumberClient('', document_number);
    const textValidEmail = (email: string): string => email && !validateEmail(email) ? VALID_EMAIL_VALIDATION : DEFAULT_REQUIRED_TEXT;
    const textQuote = (isQuote: boolean, questionElectronicInvoice: string): string => isQuote ? SEND_PRODUCTS : questionElectronicInvoice;
    const textAddressQuote = (isQuote: boolean, address: string): string => isQuote ? SEND_ADDRESS : address;
    const textPostalCode = (postal_code: IGenericRecord[]): string => postal_code?.length < 6 ? POSTAL_CODE_VALIDATION : DEFAULT_REQUIRED_TEXT;

    return {
        textInvoice,
        textDateValidation,
        textEmailValidation,
        textCustomerValidation,
        textValidEmail,
        textQuote,
        textAddressQuote,
        textPostalCode,
    }
};
