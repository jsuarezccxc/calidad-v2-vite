import { FormEvent, ReactNode } from 'react';
import { IconsNames } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';

export * from './Button';

/**
 * Type of the submit event
 */
export type OnSubmitEvent = FormEvent<HTMLFormElement>;

/**
 * Button background
 */
export type Background = 'blue' | 'green' | 'gray-light' | 'gray' | 'white' | 'purple' | 'gray-blocking' | 'green-bgLight';

/**
 * Button type
 */
export enum ButtonType {
    Button = 'button',
    Submit = 'submit',
    Reset = 'reset',
}

/**
 * Link colors
 */
export enum LinkColor {
    GREEN = 'green',
    BLUE = 'blue',
    PURPLE = 'purple',
    WHITE = 'white',
    GRAY = 'gray',
}

/**
 * Button lines number
 */
export type LinesNumber = 1 | 2;

/**
 * This interface is tooltips props
 *
 * @typeParam title: string - Title text
 * @typeParam description: string | JSX.Element - Description text
 */
export interface ITooltip {
    title: string;
    description: string | JSX.Element;
}

/**
 * This interface describes that properties the button component receives 
 
 * @typeParam background: Background - Button background
 * @typeParam classes: string - Optional prop for customize the button
 * @typeParam linesNumber: LinesNumber - Number lines of the button text
 * @typeParam onClick: (e?: any) => void - Optional click handler
 * @typeParam text: string - Button text value
 * @typeParam disabled: boolean - Optional if button is disabled
 * @typeParam type: ButtonType - Optional prop with the button type
 * @typeParam id: string - Prop for defining element's id
 * @typeParam style: IGenericRecord - Optional styles
 * @typeParam ref:  React.LegacyRef<HTMLButtonElement>  - Optional component reference 
 */
export interface IButtonProps {
    background?: Background;
    classes?: string;
    linesNumber?: LinesNumber;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: (e?: any) => void;
    text: string;
    disabled?: boolean;
    type?: ButtonType;
    id: string;
    style?: IGenericRecord;
    reference?: React.LegacyRef<HTMLButtonElement>;
    tooltip?: ITooltip;
}

/**
 * This interface describes that properties the link component receives
 * @typeParam id: string - identifier button
 * @typeParam href: string - Destination link
 * @typeParam linkColor: LinkColor - Optional link color
 * @typeParam text: string - Link text value
 * @typeParam classes: string - Optional prop for customize the link
 * @typeParam target: string - Optional value indicate where to open link
 * @typeParam onClick: () => void - Optional click handler
 * @typeParam download: boolean - Optional link is used for download file
 * @typeParam disabled: boolean - Optional if link is disabled
 * @typeParam hover: boolean - Optional hover link
 */
export interface ILinkProps {
    id: string;
    href: string;
    linkColor?: LinkColor;
    text: string;
    classes?: string;
    target?: string;
    onClick?: () => void;
    download?: boolean;
    disabled?: boolean;
    hover?: boolean;
}

/**
 * This interface describes that properties the double line component receives
 * @typeParam words: string[] - Button word list
 */
export interface IDoubleLineProps {
    words: string[];
}

/**
 * These interfaces are used to icon component
 *
 * @typeParam id: string - Identifier for the component
 * @typeParam className: string - Optional prop for customize the component
 * @typeParam href: string - require link
 * @typeParam nameIcon: IconsNames - Require name icon
 * @typeParam classIcon: string - Optional class icon
 * @typeParam target: string - Optional value indicate where to open link
 */
export interface IOutsideloadIconsProps {
    id: string;
    className?: string;
    href: string;
    nameIcon: IconsNames;
    classIcon?: string;
    target: string;
}

/**
 * These interfaces are used to icon component
 *
 * @typeParam className: string - Optional prop for customize the component
 * @typeParam href: string - require link
 * @typeParam nameIcon: IconsNames - Require name icon
 * @typeParam classIcon: string - Optional class icon
 * @typeParam target: string - Optional value indicate where to open link
 */
export interface IButtonWithIconProps extends ISimpleButtonProps {
    nameIcon: IconsNames;
    classIcon?: string;
}

/**
 * This interface describes the simple button props
 *
 * @typeParam id: element id
 * @typeParam children: ReactNode - Button children
 * @typeParam className: string - Optional class to customize it
 * @typeParam onClick: () => void - Optional function to handle the click event
 * @typeParam onMouseLeave: () => void - Optional function to handle the mouse leave event
 * @typeParam onMouseOver: () => void - Optional function to handle the mouse over event
 * @typeParam style: IGenericRecord - Optional styles
 * @typeParam disabled: boolean - Optional disabled
 */
export interface ISimpleButtonProps {
    id: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    onMouseLeave?: () => void;
    onMouseOver?: () => void;
    style?: IGenericRecord;
    disabled?: boolean;
}

/**
 * This const event mouse over
 */
export enum TypeIcon {
    Blue = 'infoBlue',
    Green = 'infoGreen',
}
