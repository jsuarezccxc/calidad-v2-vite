/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericRecord } from '@models/GenericRecord';
import { ReactElement, ChangeEvent, KeyboardEvent } from 'react';
export * from './TableInput';

export type TypeInput = 'text' | 'number';
/**
 @param Colors - 'gray-dark' | 'blue' | 'white' - colors for text color
 */
type Colors = 'gray-dark' | 'blue' | 'white';

/**
 * These interfaces describe a title table
@typeParam id: string - Optional prop for defining element's id
@typeParam text: string - value of titles
@typeParam className: string - Optional prop is used for title styles
@typeParam color: Colors - Optional prop that defines three colors gray-dark, blue and white
@typeParam disabled: boolean - it is unusable input
@typeParam definition: boolean -  Optional table definition. 
@typeParam sectionTooltip: boolean - Optional section name that describe
@typeParam isNew: boolean - optional prop to show the new justify text
 */
export interface ITitleProps {
    id?: string;
    text: string;
    className?: string;
    color?: Colors;
    disabled: boolean;
    showInformation?: boolean;
    sectionTooltip?: string;
    isNew?: boolean;
}

/**
 * These interfaces describe a body table
 *
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam text: string - value of table body
 * @typeParam type: TypeInput - Optional input's type
 * @typeParam className: string - Optional prop is used for text styles
 * @typeParam disabled: boolean - Optional prop that defines if has unusable input
 * @typeParam icon: ReactElement - Optional prop that defines icon calendar
 * @typeParam onChange: (e: ChangeEvent<HTMLInputElement>) => void - Optional prop with input change handling
 * @typeParam editTable: boolean - Optional prop if table is editable
 * @typeParam color: Colors - Optional prop that defines if has three colors gray-dark, blue and white
 * @typeParam name: string - Optional prop with the input name
 * @typeParam integerNumbers: boolean - Optional prop that indicates if the input just receive integer numbers
 * @typeParam alphanumeric: boolean - Optional prop that indicates if the input just receive alphanumerics
 * @typeParam maxLength?: number - Optional select limit the input
 * @typeParam withFinalLink?: boolean - Optional prop to allow a link to the final of the text
 * @typeParam redirectionPathLink?: string - Optional prop to allow a link to the redirection
 * @typeParam textLink?: string - Optional prop to allow a link to the text
 * @typeParam placeholder?: string - Optional placeholder text
 * @typeParam tooltipInfo?: boolean - Optional prop for indicate if have tooltip
 * @typeParam titleTooltip?: string - Optional prop for title tooltip
 * @typeParam descTooltip?: string | JSX.Element - Optional prop for description tooltip
 * @typeParam onClick?: (e: IGenericRecord) => void - Optional function to handle click
 * @typeParam alphanumericNoWhitespace?: boolean - Optional prop for characters and numbers without spaces
 */
export interface ITextProps {
    id?: string;
    text: string;
    type?: TypeInput;
    className?: string;
    disabled?: boolean;
    icon?: ReactElement;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    editTable?: boolean;
    color?: Colors;
    name?: string;
    integerNumbers?: boolean;
    alphanumeric?: boolean;
    maxLength?: number;
    withFinalLink?: boolean;
    redirectionPathLink?: string;
    textLink?: string;
    placeholder?: string;
    tooltipInfo?: boolean;
    titleTooltip?: string;
    descTooltip?: string | JSX.Element;
    handleClick?: (data: IGenericRecord) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    alphanumericNoWhitespace?: boolean;
}

/**
 * These interfaces describe a value input table
 * 
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam value: string | number  - value amount
 * @typeParam className: string -  Optional prop that defines styles for value input
 * @typeParam decimals: number - Optional prop that defines is separated by a decimal point
 * @typeParam suffix: string - Optional prop that defines add a prefix before the number
 * @typeParam thousandSeparator: string - Optional prop that defines thousand separator to number
 * @typeParam decimalSeparator: string - Optional prop that defines if it is character string and add separators on number
 * @typeParam displayType: any - Optional prop that defines if input it renders a input element where formatting happens as you input characters.
 * @typeParam onChange: (e: any) => void - Optional prop that defines if it is an event when the value of an element has been changed
 * @typeParam handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void - Optional prop that defines handleChange event is triggered when values are entered in the input.
 * @typeParam onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void - Optional prop that defines onKeyUp event is triggered when values are entered in the input.
 * @typeParam name: string -  Optional prop that defines input's name
 * @typeParam disabled: boolean - Optional prop that defines it's unusable input
 * @typeParam inputClass: string - Optional prop that defines styles for input class
 * @typeParam containerClass: string - Optional prop that defines styles for container class
 * @typeParam subContainerClass: string - Optional prop that defines styles for subContainerClass class
 * @typeParam placeholder: string - Optional prop that defines string of characters that temporarily takes the place of the final data.
 * @typeParam withIcon: boolean - Optional prop that defines if input has icon.
 * @typeParam allowNegative: boolean - Optional prop allow negative numbers
 * @typeParam allowLeadingZeros: boolean - Optional prop Allow leading zeros at beginning of number
 * @typeParam maxLength: boolean - Optional prop max Length
 * @typeParam symbols: boolean - Optional prop to show symbols
 * @typeParam symbol: string - Optional prop to show symbol
 * @typeParam isCopTxt: boolean - Optional prop for showing COP text
 * @typeParam onBlur?: (e: ChangeEvent<HTMLInputElement>) => void - Optional prop that defines onBlur event is triggered when out of focus in the input
 * @typeParam fixedDecimalScale?: boolean - Optional prop to show zeros of decimals
 * @typeParam customIcon?: JSX.Element - Optional custom icon
 * @typeParam onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void - Optional on key up function
 * @typeParam prefix?: string - Optional prop to add a prefix before the number
 */
export interface IValueFormatProps {
    id: string;
    value: string | number;
    className?: string;
    decimals?: number;
    suffix?: string;
    thousandSeparator?: string;
    decimalSeparator?: string;
    displayType?: any;
    onChange?: (e: any) => void;
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
    name?: string;
    disabled?: boolean;
    inputClass?: string;
    containerClass?: string;
    subContainerClass?: string;
    placeholder?: string;
    withIcon?: boolean;
    allowNegative?: boolean;
    allowLeadingZeros?: boolean;
    maxLength?: number;
    symbols?: boolean;
    symbol?: string;
    isTable?: boolean;
    isCopTxt?: boolean;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    fixedDecimalScale?: boolean;
    customIcon?: JSX.Element;
    onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
    prefix?: string;
}

/**
 * This interface is props date picker input
 *
 * @typeParam dateFormat?: string - Optional prop to date format
 * @typeParam disabled?: boolean - Optional prop to disabled input
 * @typeParam className?: string - Optional prop to container input
 * @typeParam classNameInput?: string - Optional prop to input
 * @typeParam minDate?: Date - Optional prop to min date input
 * @typeParam maxDate?: Date - Optional prop to max date input
 * @typeParam showPlaceHolderDate?: boolean - Optional prop to show placeholder
 * @typeParam onChangeDate?: (date: Date) => void - Optional prop to handle change
 * @typeParam selected?: number - Optional prop to value input
 */
export interface IDatePickerInputProps {
    dateFormat?: string;
    disabled?: boolean;
    className?: string;
    classNameInput?: string;
    minDate?: Date;
    maxDate?: Date;
    showPlaceHolderDate?: boolean;
    onChangeDate?: (date: Date) => void;
    selected?: number;
}

/**
 * This interface describes the properties of the time object when is clicked each one
 *
 * @typeParam hour: boolean - When hour is clicked
 * @typeParam minutes: boolean - When minutes is clicked
 * @typeParam seconds?: boolean - Optional when seconds is clicked
 * @typeParam schedule: boolean - When schedule is clicked
 */
export interface IClickTimePicker {
    hour: boolean;
    minutes: boolean;
    seconds?: boolean;
    schedule: boolean;
}

/**
 * This interface is time picker props
 * 
 * @typeParam value?: string - Optional value time
 * @typeParam className?: string - Optional class style
 * @typeParam disabled?: boolean - Optional disabled input
 * @typeParam onChange?: (event: string) => void - Optional handle state
 */
export interface ITimePickerInputProps {
    value?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (event: string) => void;
}

/**
 * This const is default click time state
 */
export const DEFAULT_CLICK_TIME = {
    hour: false,
    minutes: false,
    seconds: false,
    schedule: false,
};

/**
 * This interface classes date picker
 * 
 * @typeParam container: string - Container custom class input
 * @typeParam input: string - Custom class input
 */
export interface IClassesInput {
    container: string;
    input: string;
}
