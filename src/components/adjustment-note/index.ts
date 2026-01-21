import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IAdjustmentNoteForm } from '@models/AdjustmentNote';
import { IOptionsForm } from '@models/CorrectCancelElectronicDocument';
import { IErrorsTableRetention, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IDataTableTotals } from '@components/table-totals';
import { IRequiredFieldsTable } from '@components/table-invoice';

export * from './AdjustmentNote';

/**
 * This interface is for props component
 * 
 * @typeParam form: IAdjustmentNoteForm - Form state
 * @typeParam setForm: Dispatch<SetStateAction<IAdjustmentNoteForm>> - Dispatch form state
 * @typeParam originalData: IGenericRecord - Support document data
 * @typeParam tableAdjustmentNote: IInvoiceDetails[] - Table detail
 * @typeParam setTableAdjustmentNote: Dispatch<SetStateAction<IInvoiceDetails[]>> - Dispatch state table detail
 * @typeParam tableRetentions: ITableTaxesAndRetention[] - Table retention
 * @typeParam setTableRetentions: Dispatch<SetStateAction<ITableTaxesAndRetention[]>> - Dispatch state table retention
 * @typeParam setTableTaxes: Dispatch<SetStateAction<ITableTaxesAndRetention[]>> - Dispatch state table taxes
 * @typeParam tableTotals: IDataTableTotals[] - Table totals
 * @typeParam setTableTotals: Dispatch<SetStateAction<IDataTableTotals[]>> - Dispatch state table totals
 * @typeParam productsStock: IGenericRecord[] - Products by company
 * @typeParam requiredFormFields: string[] - Errors for form
 * @typeParam requiredFieldsTable: IRequiredFieldsTable -  Errors for table invoice
 * @typeParam optionsForm: IOptionsForm - Options for table invoice
 * @typeParam errorRetentions: IErrorsTableRetention - Errors in table retentions
 * @typeParam submit?: boolean - If is submit event
*/
export interface IAdjustmentNoteProps {
    form: IAdjustmentNoteForm;
    setForm: Dispatch<SetStateAction<IAdjustmentNoteForm>>;
    originalData: IGenericRecord;
    tableAdjustmentNote: IInvoiceDetails[];
    setTableAdjustmentNote: Dispatch<SetStateAction<IInvoiceDetails[]>>;
    tableRetentions: ITableTaxesAndRetention[];
    setTableRetentions: Dispatch<SetStateAction<ITableTaxesAndRetention[]>>;
    setTableTaxes: Dispatch<SetStateAction<ITableTaxesAndRetention[]>>;
    tableTotals: IDataTableTotals[];
    setTableTotals: Dispatch<SetStateAction<IDataTableTotals[]>>;
    productsStock: IGenericRecord[];
    requiredFormFields: string[];
    requiredFieldsTable: IRequiredFieldsTable;
    optionsForm: IOptionsForm;
    errorRetentions: IErrorsTableRetention;
    submit?: boolean;
}

/**
 * Constant to validate total value
 */
export const TOTAL = 'Total';
