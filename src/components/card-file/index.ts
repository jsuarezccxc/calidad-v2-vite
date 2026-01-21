import { TypeFile } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';

export { CardFile } from './CardFile';

/**
 * This interface describes the props of the card file
 *
 * @typeParam className: string - Optional class to customize the component
 * @typeParam file: IGenericRecord - File data
 * @typeParam updateFile: (file: IGenericRecord) => void - Function to update the file
 * @typeParam url: string - Optional url of the image
 * @typeParam typeLogo: TypeFile - Optional type logo
 */
export interface ICardFileProps {
    className?: string;
    file: IGenericRecord;
    updateFile: (file: IGenericRecord) => void;
    url?: string;
    typeLogo?: TypeFile;
}
