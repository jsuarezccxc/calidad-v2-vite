import React, { Dispatch } from 'react';
import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { ModuleApp } from '@utils/GenerateId';

export * from './RadioButton';

export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type RadioButtonSize = 'sm' | 'xl' | 'md' | 'md-row';
type RadioButtonSizeLabel = 'xs' | 'sm' | 'xl' | 'md';

/**
 * This interface describes that properties the radio button component receives
 *
 * @typeParam moduleId: string - Id for identify from module father
 * @typeParam entities: IEntity[] - Checkbox names
 * @typeParam selected: string - Selected option
 * @typeParam setSelected: Dispatch<string> - Optional prop to change the option
 * @typeParam size: RadioButtonSize - Optional Radio button size
 * @typeParam sizeLabel: RadioButtonSizeLabel - Optional Radio button size label
 * @typeParam classesContainer: string - Optional classNames for styling radio button container
 * @typeParam classesRadioButton: string - Optional that defines classNames for styling each radio button
 * @typeParam classesLabel: string - Optional classNames for styling label
 * @typeParam disabled: boolean - Optional prop when rol is read and analyze;
 * @typeParam handleRow: () => void - Optional prop generate code in build warehouse;
 * @typeParam handleChangeOption: (option: IEntity) => void - Optional prop with a function to change the current option
 * @typeParam name: string - Optional prop with the input name
 * @typeParam linkerId?:string; - Optional prop linker input with label
 * @typeParam bgInputDark?:boolean; - Optional prop to change the bgColor in the input
 * @typeParam radioColDirection?:boolean; - Optional prop to set vertical distribution of all radio buttons
 * @typeParam includeTooltip?:boolean; - Optional prop that show
 * @typeParam bgCircle?:string; - Optional prop that bg color circle
 */
export interface IRadioButtonProps {
    moduleId: ModuleApp;
    entities: IEntity[];
    selected: string;
    setSelected?: Dispatch<string>;
    size?: RadioButtonSize;
    sizeLabel?: RadioButtonSizeLabel;
    classesContainer?: string;
    classesRadioButton?: string;
    classesRadioInput?: string;
    classesLabel?: string;
    disabled?: boolean;
    handleRow?: () => void;
    handleChangeOption?: (option: IEntity, name: string) => void;
    name?: string;
    linkerId?: string;
    bgInputDark?: boolean;
    radioColDirection?: boolean;
    includeTooltip?: boolean;
    bgCircle?: string;
}

/**
 * This interface describes that properties the table radio button component receives
 *
 * @typeParam size: RadioButtonSize - Optional Radio button size
 * @typeParam onChange: ()  => void - Change value
 * @typeParam classesContainer: string - Optional classNames for styling radio button container
 * @typeParam disabled?: boolean - Optional prop when rol is read and analyze;
 * @typeParam classesRadioButton: string - Optional that defines classNames for styling each radio button
 * @typeParam name: string - Optional name input
 * @typeParam option: IGenericRecord - Option select
 * @typeParam selectedTable: IGenericRecord - Current table select
 */
export interface ITableRadioButton {
    size?: RadioButtonSize;
    onChange: () => void;
    classesContainer?: string;
    classesRadioButton?: string;
    disabled?: boolean;
    name?: string;
    option: IGenericRecord;
    selectedTable: IGenericRecord;
}

/**
 * This interfaces describe an entity props
 *
 * @typeParam name: string - entity's name
 * @typeParam label: string - entity's label
 * @typeParam selectItems: IOptionSelect[] - Optional get the list of options for each selection within the option button
 * @typeParam labelClass: string - Optional prop to customize the label
 * @typeParam labelElement: JSX.Element | String - Optional prop with design html or custom text
 * @typeParam tooltip: boolean - Optional prop for indicate tooltip
 * @typeParam descTooltip: string | JSX.Element - Optional prop for description tooltip
 * @typeParam titleTooltip: boolean - Optional prop for title tooltip
 * @typeParam description: string - Optional prop for description tooltip
 * @typeParam title: string - Optional prop for title tooltip
 */
export interface IEntity {
    name: string;
    label: string;
    selectItems?: IOptionSelect[];
    labelClass?: string;
    labelElement?: JSX.Element | string;
    tooltip?: boolean;
    descTooltip?: string | JSX.Element;
    titleTooltip?: string;
    description?: string;
    title?: string;
}

/**
 * List with the radio button labels used to translate the text
 */
export const RADIO_BUTTON_LABELS = [{ name: 'yes', value: 'si' }];
