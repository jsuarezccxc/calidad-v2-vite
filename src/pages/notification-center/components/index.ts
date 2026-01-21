import { IPropsInput } from '@components/input';

export * from './inputs/Inputs';
export * from './modal/Modal';

/**
 * This interface describes the inputs props
 *
 * @typeParam data: IPropsInput[] - List with the input props
 * @typeParam translate: (key: string) => string - Hook to translate text
 */
export interface IInputsProps {
    data: IPropsInput[];
    translate: (key: string) => string;
}

/**
 * This interface describes the properties that the modal component receives
 *
 * @typeParam show: boolean - Boolean that show the modal
 * @typeParam showModal: () => void - Function that hide and show the modal
 * @typeParam translate: (key: string) => string - Hook to translate text
 */
export interface IModalProps {
    show: boolean;
    showModal: () => void;
    translate: (key: string) => string;
}

/**
 * Data of the modal
 */
export const dataModal = [
    {
        label: 'id-number',
        text: 'id-description',
    },
    {
        label: 'date',
        text: 'date-description',
    },
    {
        label: 'module',
        text: 'module-description',
    },
    {
        label: 'notification-type',
        text: 'notification-description',
    },
];

export const MODULE = 'module';
