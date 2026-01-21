import React, { Dispatch, FocusEvent, SetStateAction, SyntheticEvent, KeyboardEvent, ReactNode } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomProps, OptionSnapshot, SelectedOption, SelectSearchOption, SelectSearchProps } from 'react-select-search';
import { IGenericRecord } from '@models/GenericRecord';
import { IconsNames } from '@components/icon';
import { ITime, SetTime } from '@utils/TimePicker';
import { IClickTimePicker, SetClickTimePicker } from '@pages/notifications-parameterization';
export * from './Input';

/**
 * Defines the type of input
 */
export type InputType = 'number' | 'text' | 'tel' | 'url' | 'email' | 'search' | 'password' | 'file';

/**
 * Text area event
 */
export type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;

/**
 * Change event
 */
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * This interface describes input's properties
 *
 * @typeParam min: number - Optional value min to input number
 * @typeParam labelText: string | JSX.Element - Optional prop labelText defines text for label on input
 * @typeParam value: string - Optional prop input's value
 * @typeParam valueSelect: any - Optional prop with a value select
 * @typeParam name: string -  Optional input's name
 * @typeParam type: InputType - Optional prop input's type according to variable type: InputType
 * @typeParam onChange: (e: React.ChangeEvent<HTMLInputElement>) => void - Optional prop function for when value into input changes
 * @typeParam onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void - Optional prop function for keyboard event
 * @typeParam onChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void - Optional prop function for when value into textarea changes
 * @typeParam onChangeSelect: (selectedValue: any, selectedOption: any, optionSnapshot: SelectSearchProps) => void - Optional prop for the select handle change
 * @typeParam onClick: ({ ...args }: IGenericRecord) => void - Optional prop define a function when input is clicked
 * @typeParam required: boolean - Optional prop it's used if input is required field
 * @typeParam borderRequired?: boolean - Optional prop that indicates if a input has a border
 * @typeParam requiredText: string - Optional prop it's used for changing text when field is being validated
 * @typeParam options: IOptionSelect[] - Optional prop options' array only for select input
 * @typeParam disabled: boolean - Optional prop it's used if input is a field only for showing and not changing its value
 * @typeParam placeholder: string - Optional prop filler text that describe input's functionality
 * @typeParam placeholderColor: string - Optional prop for change color of placeholder
 * @typeParam instructions: string - Optional prop description only for file input
 * @typeParam classesWrapper: string - Optional prop classNames for input wrapper
 * @typeParam classesWrapperInput: string - Optional prop classNames for inputs wrapper
 * @typeParam classesLabel: string - Optional prop classNames for label text
 * @typeParam classesInput: string - Optional prop classNames for different inputs
 * @typeParam optionSelected: (option: IOptionSelect, name?:string) => void - Optional prop defines a selected option into select input
 * @typeParam isFile: boolean - Optional prop defines if input is type file
 * @typeParam fileExtensionAccept: string - Optional prop defines file extension accepts
 * @typeParam isTable: boolean - Optional prop defines if input is for table
 * @typeParam selected: any - Optional prop with a date selected
 * @typeParam maxDate: Date - Optional prop with a max date of the input
 * @typeParam minDate: Date - Optional prop with a min date of the input
 * @typeParam onChangeDate: (date: Date, event: any) => void - Optional prop action to change date datePicker for selectsRange Date
 * @typeParam selectTextClass: string - Optional prop for customize the text of the select
 * @typeParam id: string - Prop link label with input in ColorInput
 * @typeParam initialColor: string - Optional prop add initial color
 * @typeParam clearOption: boolean - Optional prop only for select input that allows clear option selected
 * @typeParam optionSelect: SelectSearchOption[] - Optional prop with a option select search list
 * @typeParam file: IFile; - Optional prop with the uploaded file
 * @typeParam setFile: Dispatch<SetStateAction<IFile>> - Optional prop that change the uploaded file
 * @typeParam multiple: boolean - Optional prop that defines when input file has multiple files
 * @typeParam centerTextSelect: boolean - Optional prop that allows center text in a select
 * @typeParam onClickIcon: () => void - Optional prop for passed the onClick function to the input icon
 * @typeParam iconClassName: string - Optional prop for customize the input icon
 * @typeParam classListSelect: boolean - Optional prop for class dropdown list in select inputs on table;
 * @typeParam headerSearch: boolean - Optional prop for icon cancel in the input
 * @typeParam widthFileText: string - Optional prop for customize the width input file's name
 * @typeParam handleChangeColor: (color: string) => void - Optional prop with a function that change the input color
 * @typeParam doubleValue: boolean - Optional prop that indicate if the select has double text
 * @typeParam secondValue: string - Optional prop that if select has double text this define second text
 * @typeParam fileInvalid: boolean - Optional prop to validate extension
 * @typeParam fileInvalidSize?: boolean - Optional prop to invalidate size file
 * @typeParam isValidateSize?: boolean - Optional prop to validate size file
 * @typeParam sizeMaxMB?: number - Optional prop to size file
 * @typeParam integerNumbers: boolean - Optional prop that indicates if the input just receive integer numbers
 * @typeParam onlyNumbers: boolean - Optional prop that indicates if the input just receive only integer numbers
 * @typeParam addFileText?: string - Optional add new file in multiple files
 * @typeParam alphanumeric: boolean - Optional prop that indicates if the input just receive alphanumerics
 * @typeParam classNameFiles: string - Optional prop that indicates if file input has class name
 * @typeParam requiredFile?: boolean - Optional add new file in multiple files
 * @typeParam isTableSearch?: boolean - Optional edit className input selectSearch
 * @typeParam image?: IGenericRecord - Optional prop with a input image
 * @typeParam setImage?: Dispatch<SetStateAction<IGenericRecord>> - Optional prop with a function for change the input image
 * @typeParam icons?: boolean - Optional prop that indicates if the input includes icons
 * @typeParam selectIconType : IconsNames - Optional prop change the select icon
 * @typeParam sizeImage?: number - Optional prop with a size image limit
 * @typeParam noDecimals?: boolean - Optional prop to disable decimals
 * @typeParam maxLength?: number - Optional select limit the input
 * @typeParam classIcon?: string - Optional prop for icon class
 * @typeParam extensions?: string - Optional prop with a accepted extensions
 * @typeParam classIconSearch: string - Optional prop classNames for icon select search
 * @typeParam classSearch: string - Optional prop classNames for component
 * @typeParam showTrashIcon?: boolean - Optional prop that indicates if show the trash icon
 * @typeParam imageInstruction?: any - Optional prop with a custom image instruction
 * @typeParam showPlaceHolderDate: boolean - Optional prop that show placeholder date
 * @typeParam withoutDate: boolean - Optional prop that indicates if the input has initial date
 * @typeParam letters: boolean - Optional prop that indicates if the input just receive letters
 * @typeParam lettersWithAccent: boolean - Optional prop that indicates if the input just receive letters with accent
 * @typeParam onClickImage: () => void - Optional prop with a function for the handleClickImage
 * @typeParam emptyMessage: string - Optional prop message is displayed when there are no results in the select search
 * @typeParam classRequired: string - Optional prop style label required text
 * @typeParam decimalComma: boolean - Optional prop change to comma in decimal
 * @typeParam limitMinDate: boolean - Optional prop to limit the min date
 * @typeParam customHandleChangeImage: (e: ChangeEvent) => void - Optional prop with the custom handle change image
 * @typeParam classNameMain: string - Optional prop classNames for div main
 * @typeParam classNameIcon: string - Optional prop classNames for icon input password
 * @typeParam autoComplete?: 'on'|'off' - Optional prop to auto complete in inputs or forms
 * @typeParam idContentTable?: string - Optional prop ID content table
 * @typeParam isNewSelect?: boolean - Optional custom select
 * @typeParam newSelectFields?: IFieldsIconsNewSelect - Optional props custom select
 * @typeParam onClickSelect: () => void - Optional prop with a function for the handleClickSelect
 * @typeParam messagesCustom?: string - Optional prop for message in input select
 * @typeParam limitCharacters: boolean - Optional boolean indicating whether to limit characters
 * @typeParam placeholderClass: string - Optional string style placeholder
 * @typeParam onMouseLeave?: () => void - Optional prop when mouse leave
 * @typeParam getFile?: (e: FocusEvent<HTMLInputElement>)  - Optional prop to obtain file
 * @typeParam contectSelect?: string - Optional classes for each select of the select contect
 * @typeParam onBlur?: (e: FocusEvent<HTMLInputElement>) => void - Optional prop when input loses focus
 * @typeParam isRequiredWithImage?: boolean - Optional prop to show the evaluation when required with an already saved image
 * @typeParam reference?: React.LegacyRef<HTMLInputElement> - Optional prop component reference
 * @typeParam cleanImage: () => void - Optional function to clean image
 * @typeParam showImageName: boolean - Optional prop to show the image name
 * @typeParam isNew: boolean - Optional prop to show the new icon
 * @typeParam selectsRange - boolean- Optional prop that indicates if the input is range date
 * @typeParam startDate - Date - Optional prop selected start date
 * @typeParam endDate - Date - Optional prop selected end date
 * @typeParam onChangeDateRange - (dates: [Date, Date]) => void - Optional prop to change date range
 * @typeParam withModalDelete - boolean - Optional prop with modal delete
 * @typeParam isPlanMembership - boolean - Optional set plan value
 * @typeParam handleKeyChange: (e: KeyboardEvent<HTMLInputElement>) => void - Optional function to handle key change
 * @typeParam secondIcon?: IconsNames - Optional prop second icon name
 * @typeParam dateFormat?: string - Optional prop date format
 * @typeParam wrapperInputClasses?: string - Optional prop wrapper class
 * @typeParam onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void - Optional prop for manage past into input
 * @typeParam isTransparent?: boolean - Optional prop for change to transparent the bg of input
 * @typeParam classScrollSelect?: string - Optional prop for change styles of scroll bar select
 * @typeParam tooltip: { title: string; description: string | JSX.Element } - Optional tooltip data
 * @typeParam updateRequiredField:(value: boolean) => void;- Optional prop to validate valid format file
 * @typeParam cancelValidations:boolean - Optional prop to cancel validations
 * @typeParam alphanumericNoWhitespace?: boolean - Optional prop for characters and numbers without spaces
 * @typeParam iconName?: boolean - Optional prop if it is the name of the icon
 * @typeParam valueIconName?: string - Optional prop value name icon
 * @typeParam tooltipGreen: boolean - Optional: Flag boolean for type tooltip
 * @typeParam classTittleTooltip: string - Optional: tooltip classes
 * @typeParam isPrint?: boolean - Optional state to know if you print screen
 * @typeParam wrapperSelect?: string - Optional prop wrapper select class
 * @typeParam onClickValue?: (options: IOptionSelect[]) => void - Optional prop with a function to click
 * @typeParam wrapperClass?: string - Optional prop wrapper class
 * @typeParam withFocus?: boolean - Optional prop auto focus in input
 * @typeParam renderOption?: (domProps:DomProps, option:SelectedOption, snapshot:OptionSnapshot, className:string) => ReactNode - Optional prop to manage custom options
 */

export interface IPropsInput {
    min?: number;
    labelText?: string | JSX.Element;
    value?: string;
    valueSelect?: any;
    name?: string;
    type?: InputType;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onChangeText?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onChangeSelect?: (selectedValue: any, selectedOption: any, optionSnapshot: SelectSearchProps) => void;
    onClick?: ({ ...args }: IGenericRecord) => void;
    required?: boolean;
    borderRequired?: boolean;
    requiredText?: string;
    options?: IOptionSelect[];
    disabled?: boolean;
    placeholder?: string;
    placeholderColor?: string;
    instructions?: string;
    classesWrapper?: string;
    classesWrapperInput?: string;
    classesLabel?: string;
    classesInput?: string;
    optionSelected?: (option: IOptionSelect, name?: string) => void;
    isFile?: boolean;
    fileExtensionAccept?: string;
    isTable?: boolean;
    selected?: any;
    maxDate?: Date;
    minDate?: Date;
    onChangeDate?: (date: Date, event: any) => void;
    selectTextClass?: string;
    id: string;
    initialColor?: string;
    clearOption?: boolean;
    optionSelect?: SelectSearchOption[];
    file?: IFile;
    setFile?: Dispatch<SetStateAction<IFile>>;
    multiple?: boolean;
    centerTextSelect?: boolean;
    onClickIcon?: () => void;
    iconClassName?: string;
    classListSelect?: boolean;
    headerSearch?: boolean;
    widthFileText?: string;
    handleChangeColor?: (color: string) => void;
    doubleValue?: boolean;
    secondValue?: string;
    fileInvalid?: boolean;
    fileInvalidSize?: boolean;
    isValidateSize?: boolean;
    sizeMaxMB?: number;
    integerNumbers?: boolean;
    onlyNumbers?: boolean;
    addFileText?: string;
    alphanumeric?: boolean;
    classNameFiles?: string;
    requiredFile?: boolean;
    isTableSearch?: boolean;
    image?: IGenericRecord;
    setImage?: Dispatch<SetStateAction<IGenericRecord>>;
    icons?: boolean;
    selectIconType?: IconsNames;
    sizeImage?: number;
    noDecimals?: boolean;
    maxLength?: number;
    classIcon?: string;
    extensions?: string;
    classIconSearch?: string;
    classSearch?: string;
    showTrashIcon?: boolean;
    imageInstruction?: any;
    showPlaceHolderDate?: boolean;
    withoutDate?: boolean;
    letters?: boolean;
    lettersWithAccent?: boolean;
    onClickImage?: () => void;
    emptyMessage?: string;
    classRequired?: string;
    decimalComma?: boolean;
    limitMinDate?: boolean;
    showValue?: boolean;
    customHandleChangeImage?: (e: ChangeEvent) => void;
    clearSearch?: () => void;
    classNameMain?: string;
    classNameIcon?: string;
    autoComplete?: 'on' | 'off' | string;
    idContentTable?: string;
    isNewSelect?: boolean;
    newSelectFields?: IFieldsIconsNewSelect;
    onClickSelect?: () => void;
    messagesCustom?: string;
    limitCharacters?: boolean;
    contectSelect?: string;
    placeholderClass?: string;
    onMouseLeave?: () => void;
    getFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    isRequiredWithImage?: boolean;
    reference?: React.LegacyRef<HTMLInputElement>;
    cleanImage?: () => void;
    showImageName?: boolean;
    tooltipInfo?: boolean;
    titleTooltip?: string;
    descTooltip?: string | JSX.Element;
    isNew?: boolean;
    selectsRange?: boolean;
    startDate?: Date;
    endDate?: Date;
    onChangeDateRange?: (date: Date | [Date, Date] | null, event: SyntheticEvent<any, Event> | undefined) => void;
    withModalDelete?: boolean;
    isPlanMembership?: boolean;
    handleKeyChange?: (e: KeyboardEvent<HTMLInputElement>) => void;
    secondIcon?: IconsNames;
    dateFormat?: string;
    wrapperInputClasses?: string;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    isTransparent?: boolean;
    classScrollSelect?: string;
    tooltip?: { title: string; description: string | JSX.Element };
    updateRequiredField?: (value: boolean) => void;
    cancelValidations?: boolean;
    alphanumericNoWhitespace?: boolean;
    iconName?: boolean;
    valueIconName?: string;
    tooltipGreen?: boolean;
    classTittleTooltip?: string;
    isPrint?: boolean;
    wrapperSelect?: string;
    onClickValue?: (options: IOptionSelect) => void;
    wrapperClass?: string;
    withFocus?: boolean;
    renderOption?:(domProps:DomProps, option:SelectedOption, snapshot:OptionSnapshot, className:string) => ReactNode;
}

/**
 * This interface describes the TimePicker props
 *
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam className: string - Optional prop with a className for customize the component
 * @typeParam time: ITime - TimePicker time
 * @typeParam setTime: SetTime - Function that change the current time
 * @typeParam clickTimePicker: IClickTimePicker - TimePicker booleans keys
 * @typeParam setClickTimePicker: SetClickTimePicker - Function that change when time picker is clicked
 * @typeParam setTimePicker: React.Dispatch<React.SetStateAction<boolean>> - Optional Function that change disabled
 * @typeParam showSeconds?: boolean - Optional prop for show seconds
 * @typeParam eventClass?: string - Optional prop for close or open input
 */
export interface ITimePickerProps {
    id?: string;
    className?: string;
    time: ITime;
    setTime: SetTime;
    clickTimePicker: IClickTimePicker;
    setClickTimePicker: SetClickTimePicker;
    setTimePicker?: React.Dispatch<React.SetStateAction<boolean>>;
    showSeconds?: boolean;
    eventClass?: string;
}

/**
 * This interface describes a structure for each option into a input select
 *
 * @typeParam type: string - Optional prop that defines type when select is used for filtering data
 * @typeParam parentKey: string - Optional prop if option needs it identify its parent
 * @typeParam key: string - Option's identifying
 * @typeParam value: string - Option's value
 * @typeParam doubleText: boolean - Optional prop to InputSelect double text
 * @typeParam valueText: string - Optional prop to InputSelect double text
 * @typeParam classDoubleText: string - Optional prop  for double text inputSelect classes
 * @typeParam classTypeFont: string - Optional prop  for double text inputSelect classes
 * @typeParam classTexts: string - Optional prop for defining class in both text when select has double text
 * @typeParam id: string - Optional prop with a element id
 * @typeParam code: string - Optional prop with a element code
 * @typeParam isButton: boolean - Optional prop with a element option is button
 * @typeParam unitMeasure: string - Optional prop with a unit measure
 * @typeParam date_expired: number[] - Optional prop with a date expired product
 * @typeParam max_length: number - Optional prop with a input length
 * @typeParam min_length: number - Optional prop with a minimum input length
 * @typeParam name: string - Optional prop that describes the name
 * @typeParam containerOption?: string - Optional classes for each option of the select component
 * @typeParam multiSelectCheck?: boolean - Optional check value for each option of the select component
 */
export interface IOptionSelect {
    type?: string;
    parentKey?: string;
    key: string;
    value: string;
    doubleText?: boolean;
    valueText?: string;
    classDoubleText?: string;
    classTypeFont?: string;
    classTexts?: string;
    id?: string;
    code?: string;
    isButton?: boolean;
    unitMeasure?: string;
    date_expired?: number[] | string;
    batch_detail_id?: string;
    max_length?: number;
    min_length?: number;
    name?: string;
    containerOption?: string;
    multiSelectCheck?: IMultiSelectCheck;
}

/**
 * this constant defines the check status of the select option
 */
export interface IMultiSelectCheck {
    value: boolean;
}

/**
 * This interface describes the properties of the object file
 *
 * @typeParam [key: string]: any - FileList Object
 */
export interface IFile {
    [key: string]: any;
}

/**
 * This interface describes the AdaptableTextArea props
 *
 * @typeParam value?: string - Optional Text area value
 * @typeParam placeholder: string - Optional prop with a text area placeholder
 * @typeParam labelText?: string - Optional prop with a text area label
 * @typeParam onChange?: (e: TextAreaEvent) => void - Optional prop with a function for the text area handle change
 * @typeParam name: string - Optional prop with the text area name
 * @typeParam icons: boolean - Optional prop that indicate if the text area includes icon
 * @typeParam classesLabel: string - Optional prop with a label classes fot customize the component
 * @typeParam classesInput: string - Optional prop with a input classes fot customize the component
 * @typeParam classesWrapper: string - Optional prop with a wrapper classes fot customize the component
 * @typeParam successAction: () => void - Optional prop with a success action
 * @typeParam cancelAction: () => void - Optional prop with a cancel action
 * @typeParam maxLength?: number - Optional prop with a select limit the text area
 * @typeParam required?: number - Optional prop that indicates if a field is required
 * @typeParam borderRequired?: boolean - Optional prop that indicates if a input has a border
 * @typeParam requiredText?: number - Optional prop with a custom required text
 * @typeParam disabled: boolean - Optional prop it's used if input is a field only for showing and not changing its value
 * @typeParam isTable: boolean - Optional prop to hide borders
 * @typeParam lettersWithAccent: boolean - Optional prop to allow only letters
 * @typeParam id: string - Prop for identification
 * @typeParam limitCharacters: boolean - Optional boolean indicating whether to limit characters
 * @typeParam rows: number - Optional text area rows
 * @typeParam tooltip?: ITooltipInfo - Optional prop tooltip information
 */
export interface ITextAreaProps {
    value?: string;
    placeholder?: string;
    labelText?: string;
    onChange?: (e: any) => void;
    name?: string;
    icons?: boolean;
    classesLabel?: string;
    classesInput?: string;
    classesWrapper?: string;
    successAction?: () => void;
    cancelAction?: () => void;
    maxLength?: number;
    required?: boolean;
    borderRequired?: boolean;
    requiredText?: string;
    disabled?: boolean;
    isTable?: boolean;
    lettersWithAccent?: boolean;
    id: string;
    limitCharacters?: boolean;
    rows?: number;
    tooltip?: ITooltipInfo;
}

/**
 * This interface is for tooltips props
 *
 * @typeParam title: string;
 * @typeParam description: string | JSX.Element;
 */
export interface ITooltipInfo {
    title: string;
    description: string | JSX.Element;
}

/**
 * This interface describes the TextAreaIcon props
 *
 * @typeParam successAction: () => void - Success action
 * @typeParam cancelAction: () => void - Cancel action
 */
export interface ITextAreaIconsProps {
    successAction: () => void;
    cancelAction: () => void;
}

/**
 * Not value constant for validation
 */
export const NOT_VALUE = 'notValue';

/**
 * Max length for the text area and text input
 */
export const MAX_LENGTH_TEXT_AREA = 500;

/**
 * Default image name
 */
export const DEFAULT_IMAGE_NAME = 'Imagen';

/**
 * Max length for the text input and text input
 */
export const MAX_LENGTH_TEXT_INPUT = 240;

/**
 * Text area rows
 */
export const TEXT_AREA_ROWS = 1;

/**
 * Default required text
 */
export const DEFAULT_REQUIRED_TEXT = '*Campo obligatorio';

/**
 * Size image limit constant
 */
export const SIZE_IMAGE_LIMIT = 1;

/**
 * It is the placeholder for selects that are document type  in creating electronic invoice
 */
export const PLACEHOLDER_DOCUMENT_TYPE = 'CC/CE/NIT/PA';

/**
 * Accepted files
 */
export const ACCEPTED_FILES = '.jpg, .jpeg, .png, .PNG';

/**
 * Image error enum
 */
export enum IMAGE_ERROR {
    EXTENSION = '*Formato de archivo no válido (archivos permitidos .jpg , .png, .jpeg)',
    SIZE = '*El tamaño máximo por imagen es de 1MB',
}

/**
 * Size file max
 */
export const SIZE_MAX_MB = 1000000;

/**
 * This interface describes props for custom select
 *
 * @typeParam editClick: (id: string | undefined) => void - Action icon edit
 * @typeParam trashClick: (id: string | undefined) => void - Action icon trash
 * @typeParam footerClick: () => void - Action in footer in custom select
 * @typeParam nameFooter: string - Name footer in custom select
 */
export interface IFieldsIconsNewSelect {
    editClick: (id: string | undefined) => void;
    trashClick: (id: string | undefined) => void;
    footerClick: () => void;
    nameFooter: string;
    isEdit: boolean;
}

/**
 * This interface describes props for input money
 *
 * @typeParam id: string - Prop with the element ID
 * @typeParam value: string | number - Initial value to render
 * @typeParam decimals: number - Optional prop with the number of decimal places
 * @typeParam thousandSeparator: string - Optional prop with the symbol used as a thousand separator
 * @typeParam decimalSeparator: string - Optional prop with the symbol used as a decimal separator
 * @typeParam classesInput?: string - Optional prop CSS classes for the input element
 * @typeParam labelText?: string - Optional label text for the MoneyInput
 * @typeParam required: boolean - Optional specifies if the input is required
 * @typeParam displayType: any - Optional prop specifying the display type
 * @typeParam classesWrapper: string - CSS classes for the wrapper element
 * @typeParam onChange?: (value: any) => void - Optional callback function called when the value changes
 * @typeParam name: string - Optional prop specifying the input name
 * @typeParam disabled: boolean - Specifies if the input is disabled
 * @typeParam inputClass: string - Optional CSS classes for the input element
 * @typeParam containerClass: string - Optional CSS classes for the container element
 * @typeParam subContainerClass: string - Optional CSS classes for the sub-container element
 * @typeParam placeholder: string - Optional placeholder text for the input
 * @typeParam allowNegative: boolean - Optional prop allowing negative values
 * @typeParam allowLeadingZeros: boolean - Optional prop allowing leading zeros
 * @typeParam maxLength: number - Optional prop specifying the maximum input length
 * @typeParam symbols: boolean - Optional prop specifying if symbols are used
 * @typeParam isCopTxt: boolean - Optional prop specifying if "COP" text is shown
 * @typeParam onBlur?: (value: any) => void - Optional callback function called when the input loses focus
 * @typeParam withIcon?: boolean - Optional prop when the element has icon
 * @typeParam handleChange?: (value: ChangeEvent) => void - Optional handle change
 * @typeParam fixedDecimalScale?: boolean - Optional prop to show zeros of decimals
 * @typeParam prefix?: string - Optional prop to add a prefix to the input value
 * @typeParam requiredText?: string - Optional prop to change the required text
 * @typeParam classRequired?: string - Optional prop to change the class of the required text
 */
export interface IMoneyInputProps {
    id: string;
    value: string | number;
    decimals?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    classesInput?: string;
    labelText?: string;
    required?: boolean;
    displayType?: any;
    classesWrapper: string;
    onChange?: (value: any) => void;
    name?: string;
    disabled?: boolean;
    inputClass?: string;
    containerClass?: string;
    subContainerClass?: string;
    placeholder?: string;
    allowNegative?: boolean;
    allowLeadingZeros?: boolean;
    maxLength?: number;
    symbols?: boolean;
    isCopTxt?: boolean;
    onBlur?: (value: any) => void;
    withIcon?: boolean;
    handleChange?: (value: ChangeEvent) => void;
    fixedDecimalScale?: boolean;
    prefix?: string;
    requiredText?: string;
    classRequired?: string;
}

/**
 * Max length for the input
 */
export const MAX_LENGTH_INPUT = 50;

/**
 * This interface is classes to wrapper select
 *
 * @typeParam classesWrapper: string - Custom class style to wrapper
 * @typeParam classesWrapperInput: string - Custom class style Input
 */
interface IClassesWrapper {
    classesWrapper: string;
    classesWrapperInput: string;
}

/**
 * This interface is param
 *
 * @typeParam showOptions: boolean - If show options
 * @typeParam isTable: boolean - If table input
 * @typeParam value: string - Value input
 */
interface IPropsToSecondParam {
    showOptions: boolean;
    isTable: boolean;
    value: string;
}

/**
 * This function is class custom to selects
 *
 * @param props: React.PropsWithChildren<IPropsInput> - Props input
 * @param param1: IPropsToSecondParam - Seconds options to validate
 * @returns IClassesWrapper
 */
export const selectClassesWrapper = (
    props: React.PropsWithChildren<IPropsInput>,
    { showOptions, isTable, ...options }: IPropsToSecondParam
): IClassesWrapper => {
    const defaultClasses = 'relative';
    const getZIndex = showOptions && isTable ? 'z-20' : '';
    const toggleOptions = showOptions ? 'input--options' : '';
    const selectedValue = options.value ? 'input--value' : '';
    const styleTable = isTable ? 'border-none' : '';
    const classesWrapper = `${props.classesWrapper} ${getZIndex}`;
    const classesWrapperInput = `${props.classesWrapperInput} ${defaultClasses} ${toggleOptions} ${selectedValue} ${styleTable}`;
    return {
        classesWrapper,
        classesWrapperInput,
    };
};

/**
 * Object for default optionsSelect when is loading true
 */
export const DEFAULT_OPTION = [{ name: 'Cargando...', value: 'Cargando...' }];
