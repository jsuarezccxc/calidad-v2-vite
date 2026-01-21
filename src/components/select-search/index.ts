import { KeyboardEvent } from 'react';
import { IconsNames } from '@components/icon';

/* eslint-disable @typescript-eslint/no-explicit-any */
export * from './SelectSearch';

/**
 * This interface describes each option
 *
 * @typeParam name: string - Option name
 * @typeParam value: string - Option value
 * @typeParam [key: string]: any - Dynamic prop that gives the option to add any property
 */
export interface IOption {
    name: string;
    value: string;
    [key: string]: any;
}

/**
 * This interface describes the select search
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam onChange: (...args: any) => void - This is used to handle the option change
 * @typeParam options: IOption - Options to select
 * @typeParam value: string - Search value
 * @typeParam allOptions: IOption[] - Optional prop with all options
 * @typeParam disabled: boolean - Optional prop to disable the component
 * @typeParam name: string - Optional component name
 * @typeParam showList: { [name: string]: boolean } - Optional list with the component to render
 * @typeParam toggleSelectSearch: (show: boolean, name: string) => void - Optional function to toggle showList state
 * @typeParam iconName: IconsNames - Optional prop with a name of the icon
 * @typeParam selectIconType : IconsNames - Optional prop change the select icon
 * @typeParam onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void - Optional prop function for keyboard event
 * @typeParam className: string - Optional prop style wrapper
 * @typeParam inputClass: string - Optional prop style input
 * @typeParam disableSearch: boolean - Optional prop that indicates when to block the search
 * @typeParam placeholder: string - Optional prop that is displayed inside the input when it is empty.
 */
export interface ISelectSearchProps {
    id?: string;
    onChange: (...args: any) => void;
    options: IOption[];
    value: string;
    allOptions?: IOption[];
    disabled?: boolean;
    name?: string;
    showList?: { [name: string]: boolean };
    toggleSelectSearch?: (show: boolean, name: string) => void;
    iconName?: IconsNames;
    selectIconType?: IconsNames;
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    inputClass?: string;
    disableSearch?: boolean;
    deleteTag?: (...args: any) => void;
    placeholder?: string;
}

/**
 * Default option
 */
export const defaultOption = { value: '', name: '' };
