import { IGenericRecord } from '@models/GenericRecord';

export { default } from './BatchRow';

/**
 * This describes the structure for a batch row in the inventory system
 *
 * @typeParam batch: IGenericRecord - The batch record detailing specific batch information
 */
export interface IBatchRow {
    batch: IGenericRecord;
}
