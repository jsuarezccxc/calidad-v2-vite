export * from './Input';

/**
 * This describes the props of the input
 *
 * @typeParam disabled: boolean - Optional prop that indicates whether to disable the input
 * @typeParam inputClassName: string - Optional class to customize the input
 * @typeParam labelText: string - Optional label text
 * @typeParam placeholder: string - Optional placeholder
 * @typeParam wrapperClassName: string - Optional wrapper class
 * @typeParam required: boolean - Optional prop for indicate required input
 */
export interface IInputProps {
    disabled?: boolean;
    inputClassName?: string;
    labelText?: string;
    placeholder?: string;
    wrapperClassName?: string;
    required?: boolean;
}

/**
 * Icons in header and footer
 */
export const SOCIAL_NETWORK_ICONS = ['instagramWhite', 'facebookWhite', 'xTwitterWhite'];
