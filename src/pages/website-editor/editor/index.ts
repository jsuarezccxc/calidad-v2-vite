import { FC } from 'react';
import { ElementType, TabType } from '@models/WebsiteNode';
import { IconList, ImageField, ShapeList, VideoField } from './components/basic-elements';
import { IElement } from './components/sidebar';
import { TAB_INFORMATION } from '@information-texts/WebsiteElements';
import {
    BannerEditor,
    BlogEditor,
    CarouselEditor,
    CatalogEditor,
    CollageEditor,
    FooterEditor,
    FormEditor,
    HeaderEditor,
} from './components/element-editor/composite-editor';
import {
    ButtonTools,
    IToolsProps,
    IconTools,
    MultimediaTools,
    ShapeTools,
    TextTools,
} from './components/element-editor/basic-editor';

export * from './Editor';

/**
 * This describes the tab props
 *
 * @typeParam description: string | JSX.Element - Tab description
 * @typeParam elements: IElement[] - Tab elements
 * @typeParam name: string - Tab name
 */
interface ITabProps {
    description: string | JSX.Element;
    elements: IElement[];
    name: string;
}

/**
 * This hour data object
 */
export const autoSaveTimes = {
    thousandMilSeconds: 1000,
    sixtySeconds: 60,
    oneMinutesMil: 60000,
    twoMinutesMil: 120000,
    valueDay: 24,
    valueMonth: 30,
    differenceOneDay: 1,
};

/**
 * This key select message options save
 */
export const MESSAGE_SAVE_KEY: { [key: string]: string } = {
    save: 'Cambios guardados',
    minute: 'Guardado hace 1 min',
    error: 'No se han guardado los últimos cambios',
    '': '',
};

/**
 * This constant image type
 */
export const IMAGE_TYPE = 'image/png';

/**
 * This saved messages object
 */
export const propMessage = {
    save: 'save',
    minute: 'minute',
    error: 'error',
};

/**
 * This action buttons
 */
export const actionButtons = ['Guardar', 'Publicar'];

/**
 * This constant max character
 */
export const MAX_CHARACTER = 512;

/**
 * Constant with default value by page
 */
export const DEFAULT_FIRST_PAGE = 0;

/**
 * List of non image elements
 */
export const NON_IMAGE_ELEMENT: { [key: string]: React.FC } = {
    [ElementType.Icon]: IconList,
    [ElementType.Image]: ImageField,
    [ElementType.Video]: VideoField,
    [ElementType.Shape]: ShapeList,
};

/**
 * List of basic elements shown in the sidebar
 */
export const BASIC_ELEMENTS: IElement[] = [
    {
        name: 'Botón',
        icon: 'circleButton',
        type: ElementType.Button,
    },
    {
        name: 'Formas',
        icon: 'shapeBlue',
        type: ElementType.Shape,
    },
    {
        name: 'Imagen',
        icon: 'imageBlue',
        type: ElementType.Image,
    },
    {
        name: 'Texto',
        icon: 'textBlue',
        type: ElementType.Text,
    },
    {
        name: 'Video',
        icon: 'videoBlue',
        type: ElementType.Video,
    },
    {
        name: 'Ícono',
        icon: 'homeBlue',
        type: ElementType.Icon,
    },
];

/**
 * List of composite elements shown in the sidebar
 */
export const COMPOSITE_ELEMENTS: IElement[] = [
    {
        name: 'Banner',
        icon: 'bannerEditor',
        type: ElementType.Banner,
    },
    {
        name: 'Blog',
        icon: 'blogBlue',
        type: ElementType.Blog,
    },
    {
        name: 'Carrusel',
        icon: 'carouselBlue',
        type: ElementType.Carousel,
    },
    {
        name: 'Catálogo',
        icon: 'catalogBlue',
        type: ElementType.Catalog,
    },
    {
        name: 'Collage',
        icon: 'collageBlue',
        type: ElementType.Collage,
    },
    {
        name: 'Encabezado',
        icon: 'headerEditor',
        type: ElementType.Header,
    },
    {
        name: 'Formulario',
        icon: 'formEditor',
        type: ElementType.Form,
    },
    {
        name: 'Pie de página',
        icon: 'footerEditor',
        type: ElementType.Footer,
    },
];

/**
 * Used to validate type of template
 */
export const ADD_PREVIEW_TEMPLATES = 'Agregar plantillas prediseñadas';

/**
 * Used to get the props of each type of tab
 */
export const TAB_PROPS: { [key: string]: ITabProps } = {
    [TabType.BasicElements]: {
        name: 'Agregar elementos básicos',
        elements: BASIC_ELEMENTS,
        description: TAB_INFORMATION.BASIC_ELEMENTS,
    },
    [TabType.CompositeElements]: {
        name: 'Agregar elementos compuestos',
        elements: COMPOSITE_ELEMENTS,
        description: TAB_INFORMATION.COMPOUND_ELEMENTS,
    },
    [TabType.PresetTemplates]: {
        name: 'Agregar plantillas prediseñadas',
        elements: [],
        description: TAB_INFORMATION.PREDESIGNED_TEMPLATES,
    },
};

/**
 * This is used to get the editor of the active composite element
 */
export const COMPOSITE_ELEMENT_EDITOR: { [key: string]: FC } = {
    [ElementType.Banner]: BannerEditor,
    [ElementType.Carousel]: CarouselEditor,
    [ElementType.Header]: HeaderEditor,
    [ElementType.Form]: FormEditor,
    [ElementType.Collage]: CollageEditor,
    [ElementType.Footer]: FooterEditor,
    [ElementType.Blog]: BlogEditor,
    [ElementType.Catalog]: CatalogEditor,
};

/**
 * Tools for each basic element
 */
export const TOOLS_PER_ELEMENT: { [key: string]: FC<IToolsProps> } = {
    [ElementType.Button]: ButtonTools,
    [ElementType.Icon]: IconTools,
    [ElementType.Image]: MultimediaTools,
    [ElementType.Shape]: ShapeTools,
    [ElementType.Text]: TextTools,
    [ElementType.Video]: MultimediaTools,
};
