import React, { Dispatch, SetStateAction, ReactElement } from 'react';
import { SelectedOption, SelectSearchOption } from 'react-select-search';
import { IconsNames } from '@components/icon';
import { ITableFieldType } from '@constants/TableFieldType';
import { IGenericRecord } from '@models/GenericRecord';
import { LinkColor } from '@components/button';
import { IOptionSelect } from '@components/input';
import { ILimits } from '@components/paginator';
import { IPaginatorBackend } from '@components/paginator-backend';
import { GenericRecord } from '@pages/catalog-customer';

export * from './Table';

/**
 * Attributes for button on table component
 *
 * @typeParam text: string - Text to show in button
 * @typeParam onClick: ({ ...args }: IGenericRecord) => void - Prop with the handler event for the button
 * @typeParam route: string - Optional prop with the route to redirect page
 */
interface IButtonTable {
    text: string;
    onClick: ({ ...args }: IGenericRecord) => void;
    route?: string;
}

/**
 * This interface describes that properties the header table receives in object
 *
 * @typeParam title: string - Optional prop with field header name
 * @typeParam editableField: boolean - Optional prop that define if the field is editable
 * @typeParam calculatedField: boolean - Optional prop that define if the field is calculated
 * @typeParam className: string - Optional prop for customize the field (td)
 * @typeParam wrapperClassName: string - Optional prop for customize the wrapper (th)
 * @typeParam hidden: boolean - Optional prop for when header is hidden
 * @typeParam recommendationBlue: boolean - Optional prop for when header is recommendation in blue color
 * @typeParam translationKey: string - Optional prop to translate the title
 * @typeParam showInformation: string - Optional prop to show i information
 */
export interface IHeaderTable {
    title?: string;
    editableField?: boolean;
    calculatedField?: boolean;
    className?: string;
    wrapperClassName?: string;
    hidden?: boolean;
    recommendationBlue?: boolean;
    translationKey?: string;
    showInformation?: boolean;
}

/**
 * This interface describes that properties the body table receives in object
 *
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam button: IButtonTable - Optional prop with the attributes of button to show in table
 * @typeParam options: IOptionSelect[] - Optional list options to show in select field
 * @typeParam multipleOptions: IOptionSelect[][] - Optional list options to show in select field
 * @typeParam optionsSearch?: SelectSearchOption[] - Optional list options to select search input
 * @typeParam type: ITableFieldType - Type of field to show or edit TEXT | DATE | VALUE | CHECKBOX | ICON | NUMBER
 * @typeParam field: string - Name from field in data
 * @typeParam iconName: IconsNames - Optional prop with the icon name to use it in the field
 * @typeParam className: string - Optional prop for customize the fields
 * @typeParam classesMultipleModules: string - Optional prop for customize the fields with multiple texts
 * @typeParam wrapperClassName: string - Optional prop for customize the wrapper
 * @typeParam editableField: boolean - Defines if the element can be editable
 * @typeParam calculatedField: boolean - Optional prop that defines if the field is calculated
 * @typeParam doubleDate: boolean - Optional prop that defines if the element receive double date to show information from Date
 * @typeParam onClick: (e: IGenericRecord) => void - Optional prop that define the action in element Link | Icon
 * @typeParam hideButtons: (e: IGenericRecord) => void - Optional prop that define the action in element Button
 * @typeParam hideIcons: (e: IGenericRecord) => void - Optional prop that define the action in element Link | Icon
 * @typeParam onChange: (e: React.ChangeEvent<HTMLInputElement>, others: IGenericRecord, name?: string | undefined>) => void - Optional prop defines an onChange in inputs table
 * @typeParam onChangeSelect: (option: IOptionSelect, others?: IGenericRecord) => void - Optional action to change values from select
 * @typeParam onChangeSelectSearch: (option: SelectedOption, others?: IGenericRecord, name?: string) => void - Optional action to change values from select search
 * @typeParam onChangeDate: (date: Date, others?: IGenericRecord, name?: string) => void - Optional action to change value from datepicker
 * @typeParam name: LinkColor => void - Optional prop that defines if input table has name
 * @typeParam color: LinkColor => void - Optional prop that define if the link element in body has different link color
 * @typeParam hoverIcon: IconsNames - Optional prop with the name of the hover icon
 * @typeParam href: (item: IGenericRecord) => string - Optional prop for pass a route or param to the link
 * @typeParam containerClass: string - Optional prop for customize the element container
 * @typeParam subContainerClass: string - Optional prop for customize the element subContainerClass
 * @typeParam inputClass: string - Optional prop for customize the inputs
 * @typeParam time?: IGenericRecord - Optional prop for time
 * @typeParam disabled?: boolean - Optional prop when rol is read and analyze;
 * @typeParam classListSelect?: boolean - Optional prop to disabled classListSelect;
 * @typeParam breakWords: boolean - Optional prop when text must be break words in table
 * @typeParam withIcon: boolean - Optional prop when the element has icon
 * @typeParam allowNegative: boolean - Optional prop when the field is a number and allow negative values
 * @typeParam allowLeadingZeros: boolean - Optional prop when the field is a number and allow leading zeros
 * @typeParam maxLength?: number - Optional max length in input
 * @typeParam allowInitZeros?: boolean - Optional delete zeros in initial value
 * @typeParam validation?: boolean - Optional input validation
 * @typeParam alphanumeric: boolean - Optional prop that indicates if the input just receive alphanumerics
 * @typeParam integerNumbers: boolean - Optional prop that indicates if the input just receive numbers
 * @typeParam maxDate: Date - Optional max date of the datepicker
 * @typeParam minDate: Date - Optional min date of the datepicker
 * @typeParam fieldMinDate - Optional name field by min date
 * @typeParam classNameTd: string - Optional prop for customize the td
 * @typeParam emailWrap: boolean - Optional prop  when email overflow
 * @typeParam classIconSearch: string - Optional prop to send classes from icon in select search
 * @typeParam selectIconType : IconsNames - Optional prop change the select icon
 * @typeParam isCopTxt: boolean - Optional prop for showing COP text
 * @typeParam message: boolean - Optional prop when date has a different message than date
 * @typeParam placeholder: string - Optional prop placeholder
 * @typeParam withFinalLink?: boolean - Optional prop to allow a link to the final of the text
 * @typeParam redirectionPathLink?: string - Optional prop to allow a link to the redirection
 * @typeParam textLink?: string - Optional prop to allow a link to the text
 * @typeParam notApply?: boolean - Optional prop is not apply
 * @typeParam alphanumericNoWhitespace?: boolean - Optional prop for characters and numbers without spaces
 * @typeParam fixedDecimalScale?: boolean - Optional prop to show zeros of decimals
 */
export interface IBodyTable {
    id?: string;
    button?: IButtonTable;
    options?: IOptionSelect[];
    multipleOptions?: IOptionSelect[][];
    optionsSearch?: SelectSearchOption[];
    type: ITableFieldType;
    field: string;
    iconName?: IconsNames;
    className?: string;
    classesMultipleModules?: string;
    wrapperClassName?: string;
    editableField: boolean;
    calculatedField?: boolean;
    doubleDate?: boolean;
    onClick?: (e: IGenericRecord) => void;
    hideIcons?: (item?: IGenericRecord) => string;
    hideButtons?: (item?: IGenericRecord) => string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, others: IGenericRecord, name?: string | undefined) => void;
    onChangeSelect?: (option: IOptionSelect, others?: IGenericRecord, name?: string) => void;
    onChangeSelectSearch?: (option: SelectedOption, others?: IGenericRecord, name?: string) => void;
    onChangeDate?: (date: Date, others?: IGenericRecord, name?: string) => void;
    name?: string;
    color?: LinkColor;
    hoverIcon?: IconsNames;
    href?: (item: IGenericRecord) => string;
    containerClass?: string;
    subContainerClass?: string;
    inputClass?: string;
    time?: IGenericRecord;
    disabled?: boolean;
    classListSelect?: boolean;
    breakWords?: boolean;
    withIcon?: boolean;
    allowNegative?: boolean;
    allowLeadingZeros?: boolean;
    maxLength?: number;
    allowInitZeros?: boolean;
    validation?: boolean;
    alphanumeric?: boolean;
    integerNumbers?: boolean;
    maxDate?: Date;
    minDate?: Date;
    fieldMinDate?: string;
    classNameTd?: string;
    emailWrap?: boolean;
    isTable?: boolean;
    classIconSearch?: string;
    selectIconType?: IconsNames;
    isCopTxt?: boolean;
    message?: boolean;
    placeholder?: string;
    withFinalLink?: boolean;
    redirectionPathLink?: string;
    textLink?: string;
    notApply?: boolean;
    alphanumericNoWhitespace?: boolean;
    fixedDecimalScale?: boolean;
}

/**
 * This interface describes that properties the td table receives in object
 * @typeParam id: string - Optional prop for defining element's id
 * @typeParam tableId: string - Optional prop for defining element's id for general table
 * @typeParam editable: boolean - Defines if the element can be editable
 * @typeParam tdClasses: string - Classes name to add new styles in field
 * @typeParam field: IBodyTable - Type of objects in list field from body
 * @typeParam item: IGenericRecord - Type of objects in list field from data table
 * @typeParam onClickIcon: (e: IGenericRecord) => void - Optional prop that defines the action on icon
 * @typeParam validate: boolean- Optional prop that defines if the field need validation
 * @typeParam disabled: boolean - Optional prop when rol is read and analyze
 * @typeParam selected: IGenericRecord[] - Optional prop with the list of the checked elements
 * @typeParam setSelected: Dispatch<SetStateAction<IGenericRecord[]>> - Optional prop used to get the value from checkboxes
 * @typeParam index: number - Optional prop
 * @typeParam customEditable: boolean - Optional prop to set a field unEditable when data have a proverty this_field_is_disabled
 * @typeParam isNew: boolean - Optional prop to change position of inputs and text into table
 */
export interface ITdProps {
    id?: string;
    tableId?: string;
    editable: boolean;
    tdClasses: string;
    field: IBodyTable;
    item: IGenericRecord;
    onClickIcon?: (e: IGenericRecord) => void;
    validate?: boolean;
    disabled?: boolean;
    selected?: IGenericRecord[];
    setSelected?: Dispatch<SetStateAction<IGenericRecord[]>>;
    index: number;
    customEditable?: boolean;
    showValue?: boolean;
    isNew?: boolean;
}

/**
 * This interface describes that properties the table component receives
 *
 * @typeParam id: string - identifier for table component
 * @typeParam editable: boolean - Optional prop that define if the element can be editable
 * @typeParam calculated: boolean - Optional prop that Define if the element is calculated
 * @typeParam headersTable: IHeaderTable - Optional prop with type of objects in list field from header
 * @typeParam fieldsBody: IBodyTable - Optional prop with the type of objects in list field from body
 * @typeParam data: IGenericRecord - Type of objects in list field from data table
 * @typeParam className: string - Optional prop with the classes to add new styles in field
 * @typeParam selected: IGenericRecord[] - Optional prop with the list of the checked elements
 * @typeParam setSelected: Dispatch<SetStateAction<IGenericRecord[]>> - Optional prop used to get the value from checkboxes
 * @typeParam customTable: boolean - Optional prop use to add custom body content in table
 * @typeParam headerHidden?: boolean - Optional prop use to hidden headers table
 * @typeParam isHeaderRowsCustom: boolean - Optional prop use to add custom header content in table
 * @typeParam headerRowsCustom: ReactElement - Optional prop with a HTML to insert on header
 * @typeParam isFooterRowsCustom: boolean - Optional prop use to add custom tfoot content in table
 * @typeParam footerRowsCustom: ReactElement - Optional prop with a HTML to insert on tfoot
 * @typeParam footerRowsConfig: IBodyTable[] - Optional prop with the type of objects in list field from tfoot
 * @typeParam footerRows: IGenericRecord[] - Optional prop with the objects to render on tfoot
 * @typeParam onClickIcon: (e: IGenericRecord) => void - Optional prop that defines the action on icon
 * @typeParam validate: boolean- Optional prop that defines if the field need validation
 * @typeParam wrapperClassName: string - Optional prop that defines wrapper class names
 * @typeParam theadClassName: string - Optional prop that defines thead class names
 * @typeParam tbodyClassName: string - Optional prop that defines tbody class names
 * @typeParam editModule: boolean - Optional prop when module is editable
 * @typeParam disabled: boolean - Optional prop when rol is read and analyze
 * @typeParam withScrollTable: boolean - Optional prop to show scroll from table when you use dropdown components
 * @typeParam currentPage: IGenericRecord - Optional prop to know current page in screen
 * @typeParam setCurrentPage: Dispatch<SetStateAction<IGenericRecord>> - Optional prop to change current page state from screen
 * @typeParam classNamePaginator: string - Optional prop paginator styles
 * @typeParam reloadPaginator: boolean - Optional state to reload the paginator
 * @typeParam idContentTable: string - Optional prop ID content table
 * @typeParam setLimits: Dispatch<SetStateAction<ILimits>> - Optional prop to save pager limits
 * @typeParam paginate: boolean - Optional props indicating whether to paginate the table
 * @typeParam onScroll: () => void - Optional function to handle scroll event
 * @typeParam textAddLink?: string - Optional string to add a link to the link text
 * @typeParam onClickAddLink?: () => void - Optional function to handle click on the link
 * @typeParam isNew?: boolean - Optional prop to validate the new features in table
 * @typeParam styleInline?: string - Optional prop to includes styles
 * @typeParam paginatorBackendData?: IPaginatorBackend - data needed for pagination with backend
 * @typeParam sendFormWithEnter?: Boolean - Optional prop indicating whether to submit the form with enter
 * @typeParam isLoading?: Boolean - Optional prop indicating when loading data for render skeleton
 */
export interface ITableProps {
    id: string;
    editable?: boolean;
    calculated?: boolean;
    headersTable?: IHeaderTable[];
    fieldsBody?: IBodyTable[];
    data: IGenericRecord[];
    className?: string;
    selected?: IGenericRecord[];
    setSelected?: Dispatch<SetStateAction<IGenericRecord[]>>;
    customTable?: boolean;
    headerHidden?: boolean;
    isHeaderRowsCustom?: boolean;
    headerRowsCustom?: ReactElement;
    isFooterRowsCustom?: boolean;
    footerRowsCustom?: ReactElement;
    footerRowsConfig?: IBodyTable[];
    footerRows?: IGenericRecord[];
    onClickIcon?: (e: IGenericRecord) => void;
    validate?: boolean;
    wrapperClassName?: string;
    theadClassName?: string;
    tbodyClassName?: string;
    editModule?: boolean;
    disabled?: boolean;
    withScrollTable?: boolean;
    currentPage?: IGenericRecord;
    setCurrentPage?: Dispatch<SetStateAction<IGenericRecord>>;
    classNamePaginator?: string;
    showValue?: boolean;
    reloadPaginator?: boolean;
    idContentTable?: string;
    setLimits?: Dispatch<SetStateAction<ILimits>>;
    paginate?: boolean;
    onScroll?: () => void;
    textAddLink?: string;
    onClickAddLink?: () => void;
    isNew?: boolean;
    styleInline?: IGenericRecord;
    paginatorBackendData?: IPaginatorBackend<GenericRecord>;
    sendFormWithEnter?: boolean;
    isLoading?: boolean;
}

/**
 * Attributes for a text field component in the table
 *
 * @typeParam tableId: string - Optional prop for defining element's id for general table
 * @typeParam field: IGenericRecord - The record representing the field to display
 * @typeParam index: number - The index of the current item in the data array
 * @typeParam customEditable: boolean - Indicates whether the field is custom editable
 * @typeParam item: IGenericRecord - The complete record of the current row
 * @typeParam editable: boolean - Indicates whether the field is editable
 * @typeParam isMultipleModules: boolean - Optional - Indicate if field contained more than one value
 * @typeParam classesMultipleModules: string - Optional - Styles for field contained more than one value
 */
export interface IFieldTypeTextComponent {
    tableId?: string;
    field: IGenericRecord;
    index: number;
    customEditable: boolean;
    item: IGenericRecord;
    editable: boolean;
    isMultipleModules?: boolean;
    classesMultipleModules?: string;
}

/**
 * This interface describes that properties the item checked receives
 *
 * @typeParam id: string - Id of the selected item
 */
export interface ICheckedId {
    id: string;
}

/**
 * Constant
 */
export const CITY_ID = 'city_id';
export const NOT_APPLY = 'No Aplica';
export const NA = 'N/A';
export const ONE = 1;
