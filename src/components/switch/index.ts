import { ChangeEvent } from '@components/input';

export * from './Switch';

/**
 * This interface describes the form event props
 *
 * @typeParam checked: boolean - This indicates if the field is checked
 * @typeParam handleChange: (e: ChangeEvent) => void - Function to handle value change
 * @typeParam labelText: string - Optional label text
 * @typeParam wrapperClassName: string - Optional wrapper className
 * @typeParam includeOptions: boolean - This optional property indicates whether to display the yes and no options.
 */
export interface ISwitchProps {
    checked: boolean;
    handleChange: (e: ChangeEvent) => void;
    labelText?: string;
    wrapperClassName?: string;
    includeOptions?: boolean;
}
