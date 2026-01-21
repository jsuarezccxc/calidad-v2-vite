import { IGenericRecord } from '@models/GenericRecord';
import { createContext } from 'react';

/**
 * This interface describes the properties and methods provided by the NumberRange context.
 *
 * @typeParam storePrefix: IGenericRecord[] - Array of records related to the store's prefix.
 * @typeParam electronicInvoiceRanges: IGenericRecord[] - Array of records related to electronic invoices.
 * @typeParam unssignedRange: IGenericRecord[] - Array of records related to unssidned prefix.
 * @typeParam supportDocumentRange: IGenericRecord[] - Array of records related to support documents.
 * @typeParam getSynchronizeNumberRanges: (showModal?: boolean) => void - Function to synchronize number ranges.
 * @typeParam handleModalSync: (state: boolean, isConfirm?: boolean) => void - Function to handle the sync modal state.
 * @typeParam handleModalSynchronize: (state: boolean) => void - Function to handle the synchronize modal state.
 * @typeParam handleSetTypeUnssignedPrefix: (option: IGenericRecord, row: IGenericRecord) => void - Function to handle the unsigned type prefix.
 * @typeParam syncModal: boolean - State of the sync modal visibility.
 * @typeParam synchronizeModal: boolean - State of the synchronize modal visibility.
 * @typeParam saveTypePrefix:  () => Promise<boolean> - Function to handle save updated prefix.
 *
 */
export interface INumberRangeContext {
    storePrefix: IGenericRecord[];
    electronicInvoiceRanges: IGenericRecord[];
    unssignedRange: IGenericRecord[];
    supportDocumentRange: IGenericRecord[];
    getSynchronizeNumberRanges: (showModal?: boolean) => void;
    handleModalSync: (state: boolean, isConfirm?: boolean) => void;
    handleModalSynchronize: (state: boolean) => void;
    handleSetTypeUnssignedPrefix: (option: IGenericRecord, row: IGenericRecord) => void;
    syncModal: boolean;
    synchronizeModal: boolean;
    saveTypePrefix: () => Promise<boolean>;
}

/**
 * Website Inventory context
 */
export const NumberRangeContext = createContext<INumberRangeContext>({
    storePrefix: [],
    electronicInvoiceRanges: [],
    unssignedRange: [],
    supportDocumentRange: [],
    getSynchronizeNumberRanges: () => {},
    handleModalSync: () => {},
    handleModalSynchronize: () => {},
    handleSetTypeUnssignedPrefix: () => {},
    syncModal: false,
    synchronizeModal: false,
    saveTypePrefix: async () => false,
});
