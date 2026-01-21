import { IGenericRecord } from '@models/GenericRecord';

export { CardUser } from './CardUser';

/**
 * This interface describe the element props
 *
 * @typeParam toggleOptions: (option: string) => void - Require function toggle options
 * @typeParam user: IGenericRecord - Require user card
 * @typeParam showToggle: string - Require show toggle
 * @typeParam showOptions: (option: string) => Require function show options
 * @typeParam logOut: (item: string) => void - Require function log out
 */
export interface ICardUserProps {
    toggleOptions: (option: string) => void;
    user: IGenericRecord;
    showToggle: string;
    showOptions: (option: string) => void;
    logOut: (item: string) => void;
}

/**
 * Constant first letter profile
 */
export const LETTER_PROFILE = 0;
