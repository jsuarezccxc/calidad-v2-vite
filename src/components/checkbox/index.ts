import { ChangeEvent } from '@components/input';

export * from './Checkbox';

/**
 * Determines the checkbox input className based on value and variant
 *
 * @typeParam value: boolean - Checkbox checked state
 * @typeParam className: string - Optional className containing variant information
 * @returns string - Appropriate className for checkbox styling
 */
export const getCheckboxInputClassName = (value: boolean, className?: string): string => {
    if (className?.includes('--table')) {
        return '';
    }

    return value ? 'bg-blue border-transparent' : 'bg-gray-light border-gray';
};

/**
 * This interface describes that properties the checkbox component receives
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam label: string | JSX.Element - Optional label name from checkbox
 * @typeParam checked: boolean - checked state from checkbox
 * @typeParam disabled: boolean - Optional prop checkbox disabled;
 * @typeParam onChange: FormEventHandler - action to change state checked from checkbox
 * @typeParam classBox: string - Optional class to change styles in class container box
 * @typeParam classContainer: string - Optional class to change styles in class container
 * @typeParam classCheck: string - Optional class to change styles in check component
 * @typeParam requiredText: boolean - it's used if input is required field
 * @typeParam validate: string - it's used for changing text when field is being validated
 * @typeParam value: string | number - input's value
 * @typeParam onChange: FormEventHandler - action to change state checked from checkbox
 * @typeParam classContainer: string - Optional class to change styles in class container
 * @typeParam classCheck: string - Optional class to change styles in check component
 * @typeParam requiredText: boolean - Optional prop this is used if input is required field
 * @typeParam validate: string - Optional prop to changing text when field is being validated
 * @typeParam name: string - Optional checkbox name
 * @typeParam actions: boolean - Optional state to show actions in checkbox
 * @typeParam handleEdit: () => void - Optional action to edit
 * @typeParam handleDelete: () => void - Optional action to delete
 * @typeParam editModule: boolean - Optional state to active actions
 * @typeParam classSubcategory: string - Optional prop for classes subcategory check;
 * @typeParam isFather: boolean - Optional prop for defining when checkbox is father
 */
export interface ICheckboxProps {
    id?: string;
    label?: string | JSX.Element;
    classLabel?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (e: ChangeEvent) => void;
    classBox?: string;
    classContainer?: string;
    classCheck?: string;
    requiredText?: string;
    validate?: boolean;
    name?: string;
    value?: string | number;
    actions?: boolean;
    handleEdit?: () => void;
    handleDelete?: () => void;
    editModule?: boolean;
    classSubcategory?: string;
    isFather?: boolean;
}
