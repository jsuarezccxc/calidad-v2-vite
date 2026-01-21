import { IGenericRecord } from '@models/GenericRecord';
export * from './table/Table';

/**
 * This interface describes the props of the control minimum level resupply warehouses table
 *
 * @typeParam dataTable: IGenericRecord[] - Table data
 * @typeParam translate: (key: string) => string - Hook to translate text
 */
export interface IHistoryModifications {
    dataTable: IGenericRecord[];
    translate: (key: string) => string;
}
