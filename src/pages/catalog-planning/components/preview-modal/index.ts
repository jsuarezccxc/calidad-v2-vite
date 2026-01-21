import { IGenericRecord } from '@models/GenericRecord';

/**
 * This interface describes the properties of the template component
 *
 * @typeParam params: IGenericRecord - Template params
 * @typeParam styles: IGenericRecord - Template styles
 * @typeParam preview: boolean - optional prop to preview the template in other pages
 */
export interface ICalendarOneProps {
    params: IGenericRecord;
    styles: IGenericRecord;
    preview?: boolean;
}

/**
 * Hexadecimal color of blue
 */
export const BLUE = '#0B2C4C';
