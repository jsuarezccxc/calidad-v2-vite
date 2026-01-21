import { IGenericRecord } from '@models/GenericRecord';

export { default } from './WarehouseRow';

/**
 * This describes the structure for a warehouse row in the inventory system
 *
 * @typeParam idBatch: string - Unique identifier for the batch associated with this warehouse row
 * @typeParam warehouse: IGenericRecord - The warehouse record detailing specific warehouse information
 */
export interface IWarehouseRow {
    idBatch: string;
    warehouse: IGenericRecord;
}
