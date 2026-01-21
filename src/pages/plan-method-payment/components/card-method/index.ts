import { IGenericRecord } from '@models/GenericRecord';

export * from './CardMethod';

/**
 * Interface props card methods
 * 
 * @typeParam cardInfo: IGenericRecord - Card information user
 * @typeParam handleUpdate: () => void - Action to update plan method payment
 */
export interface ICardMethod {
    cardInfo: IGenericRecord;
    handleUpdate: () => void;
}
