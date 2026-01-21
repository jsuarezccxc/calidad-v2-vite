import { IGenericRecord } from '@models/GenericRecord';
import { ISelectedSupplier } from '@models/Supplier';

export enum ActionKeys {
    SET_SUPPLIERS = 'SET_SUPPLIERS',
    SET_SUPPLIERS_THIN = 'SET_SUPPLIERS_THIN',
    SET_SUPPLIER_HISTORY = 'SET_SUPPLIER_HISTORY',
    SET_SUPPLIER_INVOICE = 'SET_SUPPLIER_INVOICE',
    SET_ERROR = 'SET_ERROR',
    SET_SELECTED_SUPPLIER = 'SET_SELECTED_SUPPLIER',
}

export interface ISetSuppliers {
    type: ActionKeys.SET_SUPPLIERS;
    suppliers: IGenericRecord;
}

export interface ISetSuppliersThin {
    type: ActionKeys.SET_SUPPLIERS_THIN;
    suppliersThin: IGenericRecord[];
}

export interface ISetSupplierHistory {
    type: ActionKeys.SET_SUPPLIER_HISTORY;
    supplierHistory: IGenericRecord[];
}

export interface ISetSupplierInvoice {
    type: ActionKeys.SET_SUPPLIER_INVOICE;
    invoice: IGenericRecord;
}

export interface ISetSelectedSupplier {
    type: ActionKeys.SET_SELECTED_SUPPLIER;
    selectedSupplier: ISelectedSupplier;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: IGenericRecord;
}

export type SupplierActions =
    | ISetSuppliers
    | ISetSuppliersThin
    | ISetSupplierHistory
    | ISetSupplierInvoice
    | ISetError
    | ISetSelectedSupplier;
