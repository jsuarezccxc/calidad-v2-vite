export * from './ColorPicker';

/**
 * This describes the props of the color picker
 *
 * @typeParam id: String - Id for recognize the color picker
 * @typeParam handleChange: (value: string) => void - Function to handle color change
 * @typeParam labelText: string - Optional label text
 * @typeParam value: string - Optional value with the color
 * @typeParam wrapperClassName: string - Optional wrapper className
 */
export interface IColorPickerProps {
    id: string;
    handleChange?: (value: string) => void;
    labelText?: string;
    value?: string;
    wrapperClassName?: string;
}

/**
 * Initial color used to fix loop when initializing color
 */
export const INITIAL_COLOR = '#cCcccc';
