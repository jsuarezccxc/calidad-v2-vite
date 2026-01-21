import { IMouseProps } from '@hooks/usePopper';
import type { IGenericRecord } from '@models/GenericRecord';

export * from './Information';

/**
 * @typeParam Colors - Colors text;
 */
type Colors = 'blue' | 'gray-dark';

/**
 * This interface describes what properties the custom modal component receives
 * @typeParam id: Optional - string - Id for the information component
 * @typeParam title: string - Text title from information component
 * @typeParam description: string | JSX.Element - Description text from information component
 * @typeParam color: Colors - Type of colors to use in text
 * @typeParam customText: JSX.Element - Fragment with custom text
 * @typeParam isList: boolean - Indicate if element passed it's a list
 * @typeParam editIcon: boolean - Show pencil icon
 * @typeParam onClickIcon: onClickIcon - Optional click handler for the icon
 * @typeParam separator: boolean - If title has horizontal line
 * @typeParam classNameIcon: string - Optional parameter that receives styles for icon
 * @typeParam classNameContainer: string - Optional parameter that receives styles for container
 * @typeParam classNameSubContainer: string - Optional parameter that receives styles for sub-container
 * @typeParam classNameTitle: string - Optional parameter that receives styles for title
 * @typeParam classNameSeparator: string - Optional parameter that receives styles for horizontal line
 * @typeParam hoverIcon: () => void - Optional hover handler for the icon
 * @typeParam onClickIcon: onClickIcon - Optional click handler for the icon
 * @typeParam classNameDescription: string - Optional styles
 *
 */
export interface IInformationProps {
    id?: string;
    title: string;
    description?: string | JSX.Element;
    color?: Colors;
    customText?: JSX.Element;
    isList?: boolean;
    editIcon?: boolean;
    onClickIcon?: () => void;
    separator?: boolean;
    classNameIcon?: string;
    classNameContainer?: string;
    classNameSubContainer?: string;
    classNameTitle?: string;
    classNameSeparator?: string;
    hoverIcon?: IHoverIcon;
    classNameDescription?: string;
}

/**
 * This interface describes what properties the hover icon receives
 *
 * @typeParam anchorElTitle: HTMLElement | null - Optional get anchor for element
 * @typeParam mouseProps: IMouseProps - Optional props for event hover
 * @typeParam title: string - Optional title tooltip
 * @typeParam description: string | JSX.ELEMENT - Optional description tooltip
 */
interface IHoverIcon {
    anchorElTitle?: HTMLElement | null;
    mouseProps?: IMouseProps;
    title?: string;
    description?: string | JSX.Element;
}

/**
 * This interface is information electronic document
 *
 * @typeParam id: Optional - string - Id for the information component
 * @typeParam title: string - Title prop
 * @typeParam question: string - Optional Question prop
 * @typeParam lightBulb: string - Optional Text lightBulb prop
 * @typeParam description: string | JSX.Element - Description prop
 * @typeParam quantityInvoices: IGenericRecord - Optional Data with the number of invoices available
 */
export interface IInformationElectronicDocumentsProps {
    id?: string;
    title: string;
    question?: string;
    lightBulb?: string;
    description: string | JSX.Element | IGenericRecord;
    quantityInvoices?: IGenericRecord;
}

/**
 * This interface is information bulb electronic document
 *
 * @typeParam id: Optional - string - Id for the information component
 * @typeParam text: string - Title information bulb prop
 * @typeParam textDescription: string - Description information bulb prop
 * @typeParam wrapperClass?: string - Optional class to Text lightBulb
 * @typeParam tooltipClass?: string - Optional class to tooltip
 * @typeParam descriptionClass?: string - Optional class to description tooltip
 * @typeParam buttonClass?: string - Optional class to button
 */
export interface IInformationBulb {
    id?: string;
    text: string;
    textDescription: string;
    wrapperClass?: string;
    tooltipClass?: string;
    descriptionClass?: string;
    buttonClass?: string
}
