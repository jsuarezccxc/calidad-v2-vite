import { IEntity } from '@components/radiobutton';
import { IGenericRecord } from '@models/GenericRecord';

export { CreditCollection } from './CreditCollection';

/**
 * This interface describes the credit collection props
 *
 * @typeParam data: IGenericRecord - Form data
 * @typeParam updateData: (data: IGenericRecord) => void - Function to update data
 * @typeParam validate: boolean - This indicates the time to validate the fields
 */
export interface ICreditCollectionProps {
    data: IGenericRecord;
    updateData: (data: IGenericRecord) => void;
    validate: boolean;
}

/**
 * This constant is for the aunts radio button type
 */
export const COLLECTION_OPTIONS: IEntity[] = [
    {
        name: 'Días calendario',
        label: 'Días calendario',
        labelClass: 'w-26.4 xs:w-full',
    },
    {
        name: 'Días hábiles',
        label: 'Días hábiles',
        labelClass: 'w-32.4 xs:w-full',
    },
];
