import { IconsNames } from '@components/icon';
import { ElementOption, ElementType, TabType } from '@models/WebsiteNode';

export * from './Card';
export * from './Element';
export * from './Sidebar';
export { TemplateOptions } from './template-options';

/**
 * This describes the properties of each element of the tabs
 *
 * @typeParam name: string - ElementType name
 * @typeParam icon: IconsNames - ElementType icon
 * @typeParam type: ElementType - ElementType type
 */
export interface IElement {
    name: string;
    icon: IconsNames;
    type: ElementType;
}

/**
 * This describes the element card props
 *
 * @typeParam selectElement: () => void - Function to select an element
 */
export interface IElementCardProps extends IElement {
    selectElement: () => void;
}

/**
 * This describes the card props
 *
 * @typeParam element: IElement - Card element
 * @typeParam selectElement: (element: IElement) => void - Function to select an element
 */
export interface ICardProps {
    element: IElement;
    selectElement: (element: IElement) => void;
}

/**
 * Options for each compound element
 */
export const ELEMENT_OPTIONS: { [key: string]: number } = {
    [ElementType.Banner]: 4,
    [ElementType.Carousel]: 5,
    [ElementType.Collage]: 7,
    [ElementType.Footer]: 6,
    [ElementType.Form]: 5,
    [ElementType.Header]: 4,
    [ElementType.Blog]: 1,
    [ElementType.Text]: 4,
    [ElementType.Button]: 4,
    [ElementType.Catalog]: 3,
};

/**
 * Default values of text elements
 */
export const TEXT_VALUE: { [key: string]: string } = {
    [ElementOption.One]: 'Agregar caja de texto',
    [ElementOption.Two]: 'Añadir titulo',
    [ElementOption.Three]: 'Añadir subtítulo',
    [ElementOption.Four]: 'Añadir texto',
};

/**
 * This is the maximum number of words for the big name to display on the card
 */
export const LARGE_FONT_WORD_LIMIT = 1;

/**
 * Sidebar tabs
 */
export const TABS = [TabType.PresetTemplates, TabType.CompositeElements, TabType.BasicElements];

/**
 * This returns the default value of elements containing text
 *
 * @param option: ElementOption - Element option
 * @param type: ElementType - Element type
 * @returns IDownloadIconsProps
 */
export const getElementText = (option: ElementOption, type: ElementType): string => {
    if (type === ElementType.Button) return 'Botón';
    return type === ElementType.Text ? TEXT_VALUE[option] : '';
};

/**
 * List basic elements
 */
export const LIST_BASIC_ELEMENTS = ['BUTTON', 'SHAPE', 'ICON', 'IMAGE', 'TEXT', 'VIDEO'];
