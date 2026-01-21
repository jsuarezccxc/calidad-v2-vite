import { SelectSearchOption } from 'react-select-search';
import { IOptionSelect } from '@components/input';
import { IRequiredFieldsTable } from '@components/table-invoice';
import { IElectronicNote } from './ElectronicNote';
import { IAdjustmentNote } from './AdjustmentNote';

export type TypeNote = 'DEBIT_NOTE' | 'CREDIT_NOTE' | 'ADJUSTMENT_NOTE';

/**
 * This interface is note type form
 * 
 * @typeParam typeNote: string - Type note
 * @typeParam associatedDocument: string - Document electronic Id
 * @typePara idReason: string - Reason reject id
 * @typeParam reason: string - Reason reject
 */
export interface INoteTypeForm {
    typeNote: string;
    associatedDocument: string;
    idReason: string;
    reason: string;
}

/**
 * This interface is validate note
 * 
 * @typeParam form: string[] - Error form key
 * @typeParam details: IRequiredFieldsTable - Details errors
 * @typeParam retentions: string[] - Retentions error
 */
export interface IValidateNote {
    form: string[];
    details: IRequiredFieldsTable;
    retentions: string[];
}

/**
 * This interface is validate in function
 * 
 * @typeParam form: boolean - Form validation
 * @typeParam details: boolean - Table invoice validation
 * @typeParam retentions: boolean - Retention validation
 */
export interface IValidateInFunction {
    form: boolean;
    details: boolean;
    retentions: boolean;
}

/**
 * This interface is note reducer
 * 
 * @typeParam submit: boolean - Submit form
 * @typeParam note: IElectronicNote | IAdjustmentNote - Note to create
 * @typeParam typeNote: TypeNote - Type note
 * @typeParam mainForm: INoteTypeForm - Main form
 */
export interface INotesReducer {
    submit: boolean;
    note: IElectronicNote | IAdjustmentNote;
    typeNote: TypeNote;
    mainForm: INoteTypeForm;
}

/**
 * This interface is electronic document
 * 
 * @typeParam id: string - ID electronic document
 * @typeParam invoice_type: string - Type electronic document
 * @typeParam date: number - Date create electronic document
 * @typeParam number_purchase_order: string - Number purchase order
 * @typeParam invoice_state: string - Invoice state 
 * @typeParam number: string - Number
 * @typeParam time_issue: string - time_issue
 * @typeParam sale_channel: string - Sale channel
 * @typeParam total: number - Total
 * @typeParam invoice_id: string | null - Invoice ID
 * @typeParam aggregation_method: string - Aggregation method
 * @typeParam answer_dian: string - Response DIAN
 * @typeParam answer_client: string - Response client
 * @typeParam information_invoice: string | null - Information invoice
 * @typeParam company_name: string | null - Company name
 * @typeParam person: IPerson - Person electronic document
 * @typeParam consecutive: IConsecutive - Consecutive electronic document
 */
export interface IElectronicDocument {
    id: string;
    invoice_type: string;
    date: number;
    number_purchase_order: string;
    invoice_state: string;
    number: string;
    time_issue: string;
    sale_channel: string;
    total: number;
    invoice_id: string | null;
    aggregation_method: string;
    answer_dian: string;
    answer_client: string;
    information_invoice: string | null;
    company_name: string | null;
    person: IPerson;
    consecutive: IConsecutive;
}

/**
 * This interface is person information
 * 
 * @typeParam email: string - Email
 * @typeParam company_id: string - Company id
 * @typeParam customer: ICustomer - Customer information
 */
export interface IPerson {
    email: string;
    company_id: string;
    customer: ICustomer;
}

/**
 * This interface customer information
 * 
 * @typeParam name: string - Name
 * @typeParam last_name: string - Last name
 * @typeParam client_id: string - Client id
 */
export interface ICustomer {
    name: string;
    last_name: string;
    client_id: string;
}

/**
 * This interface is consecutive information 
 * 
 * @typeParam prefix_id: string - Prefix id
 * @typeParam name: string - Name prefix
 * @typeParam number: number - Number prefix
 */
export interface IConsecutive {
    prefix_id: string;
    name: string;
    number: number;
}

/**
 * This type is select search option
 */
export type ISelectSearchOption = SelectSearchOption;

/**
 * This interface is options form note
 * 
 * @typeParam fiscalResponsibilities: IOptionSelect[] - Fiscal responsibilities options
 * @typeParam foreignExchange: SelectSearchOption[] - Foreign exchange options
 * @typeParam paymentMethods: IOptionSelect[] - Payment methods options
 * @typeParam documentTypes: IOptionSelect[] - Document types options
 * @typeParam paymentTypes: IOptionSelect[] - Payment types options
 * @typeParam withholdings: IOptionSelect[] - Withholdings options
 * @typeParam typeTaxPayer: IOptionSelect[] - Type taxpayer options
 * @typeParam taxDetails: IOptionSelect[] - Tax details options
 * @typeParam prefix: IOptionSelect[] - Prefix options
 */
export interface IOptionsForm {
    fiscalResponsibilities: IOptionSelect[];
    foreignExchange: SelectSearchOption[];
    paymentMethods: IOptionSelect[];
    documentTypes: IOptionSelect[];
    paymentTypes: IOptionSelect[];
    withholdings: IOptionSelect[];
    typeTaxPayer: IOptionSelect[];
    taxDetails: IOptionSelect[];
    prefix: IOptionSelect[];
}

/**
 * This interface is validation all state
 * 
 * @typeParam validationMainForm: string[] - Validate main form
 * @typeParam validateNote: IValidateNote - Validate note
 */
export interface IValidations {
    validationMainForm: string[];
    validateNote: IValidateNote;
}

/**
 * This enum is for action type useReducer
 */
export enum ActionType {
    SET_NOTE = 'SET_NOTE',
    SET_SUBMIT = 'SET_SUBMIT',
    SET_TYPE_NOTE = 'SET_TYPE_NOTE',
    SET_MAIN_FORM = 'SET_MAIN_FORM',
    SET_VALIDATE_NOTE = 'SET_VALIDATE_NOTE',
    SET_ADJUSTMENT_NOTE = 'SET_ADJUSTMENT_NOTE',
    SET_VALIDATE_ADJUSTMENT_NOTE = 'SET_VALIDATE_ADJUSTMENT_NOTE',
}
