import { ChangeEvent } from '@components/input';
import { IWompiForm } from '@models/PaymentGateway';

export { FormWompi } from './Form';

/**
 * This interface define structure props to component
 * 
 * @typeParam isSubmit: boolean - If submit form
 * @typeParam fieldValues: IWompiForm - State form
 * @typeParam isInstructionView?: boolean - If show component in PaymentInstructions
 * @typeParam handleText: (event: ChangeEvent) => void - Handle text
 * @typeParam handleSave: () => Promise<void> - Handle save
 */
export interface IFormWompiProps {
    isSubmit: boolean;
    fieldValues: IWompiForm;
    isInstructionView?: boolean;
    handleText: (event: ChangeEvent) => void;
    handleSave: () => Promise<void>;
}

/**
 * This constant define max length field
 */
export const MAX_LENGTH_FIELD = 300;
