/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';
import { CSSObject } from '@emotion/react';
import { Color } from '@constants/Color';
import { Button } from '../basic-elements';
import { Text } from '../basic-elements/text';
import { Image } from '../basic-elements/image';
import { Icon } from '../basic-elements/icon';
import { Shape } from '../basic-elements/shape';
import { Video } from '../basic-elements/video';
import { IGenericRecord } from '@models/GenericRecord';
import { Banner, Blog, Slider, Catalog, Collage, Footer, Form, Header } from '../composite-elements';
import { ElementOption, ElementType, Screen, StyleKey } from '@models/WebsiteNode';
import { DEFAULT_PRICE_RANGE, Filter } from '../element-editor';

export * from './Draggable';
export * from './DraggableTab';
export * from './Droppable';

/**
 * This describes the props of the draggable element
 *
 * @typeParam pageId: string - Id to identify the page of element
 * @typeParam id: string - Element id
 * @typeParam dbId: string - Optional element database id
 * @typeParam delete: boolean - Optional flag for delete element
 * @typeParam option: ElementOption - Used for elements that have multiple options
 * @typeParam style: IGenericRecord - Element style
 * @typeParam type: ElementType - Element type
 * @typeParam value: string - This represents the text value of each element
 * @typeParam setting: IGenericRecord - Optional element setting
 * @typeParam desktopStyle: IGenericRecord - Optional desktop style
 * @typeParam mobileStyle: IGenericRecord - Optional mobile style
 * @typeParam isNew: boolean - Optional flag to know if it's new
 * @typeParam removed: boolean - Optional flag to indicate if it was removed
 * @typeParam is_delete: boolean - Optional the element is delete
 * @typeParam topElement: number - Optional top element footer
 */
export interface IDraggableElement {
    pageId?: string;
    id: string;
    dbId?: string;
    delete?: boolean;
    option: ElementOption;
    style: IGenericRecord;
    type: ElementType;
    value: string;
    setting?: IGenericRecord;
    desktopStyle?: IGenericRecord;
    mobileStyle?: IGenericRecord;
    isNew?: boolean;
    removed?: boolean;
    is_delete?: boolean;
    topElement?: number;
}

/**
 * This describes the draggable props
 *
 * @typeParam element: IDraggableElement - Draggable element
 */
export interface IDraggableProps {
    element: IDraggableElement;
}

/**
 * This describes the droppable props
 *
 * @typeParam children: ReactNode - children to render
 * @typeParam activeScreen: Screen - Optional active screen
 * @typeParam background: string - Optional background
 */
export interface IDroppableProps {
    children: ReactNode;
    activeScreen?: Screen;
    background?: string;
}

/**
 * This describes the draggable tab props
 *
 * @typeParam children: ReactNode - Draggable tab children
 * @typeParam element: IDraggableElement - Draggable element
 */
export interface IDraggableTabProps {
    children: ReactNode;
    element: IDraggableElement;
}

/**
 * This describes the elements props used to drag and drop
 *
 * @typeParam data: IDraggableElement - Element data
 * @typeParam handleTextChange: (e: any) => void - Optional function to handle text change
 * @typeParam styleKey: StyleKey - Optional style key
 * @typeParam isMobile: boolean - Optional boolean that indicates whether it is in mobile size
 * @typeParam isMobile: boolean - Optional property that indicates whether it is in preview mode
 * @typeParam onClickButton: (item: IGenericRecord) => void - Optional function url button
 */
export interface IElementProps {
    data: IDraggableElement;
    handleTextChange?: (e: any) => void;
    styleKey?: StyleKey;
    isMobile?: boolean;
    isPreview?: boolean;
    onClickButton?: (item: IGenericRecord) => void;
}

/**
 * This is used as a key to save and get the data of the dragged elements
 */
export const ELEMENT = 'ELEMENT';

/**
 * This is used as a key to type form
 */
export const FORM = 'FORM';

/**
 * Here is each of the draggable elements, which are shown in the work area
 */
export const DRAGGABLE_ELEMENT: { [key in ElementType]: React.FC<IElementProps> } = {
    [ElementType.Banner]: Banner,
    [ElementType.Blog]: Blog,
    [ElementType.Button]: Button,
    [ElementType.Catalog]: Catalog,
    [ElementType.Carousel]: Slider,
    [ElementType.Collage]: Collage,
    [ElementType.Footer]: Footer,
    [ElementType.Form]: Form,
    [ElementType.Header]: Header,
    [ElementType.Icon]: Icon,
    [ElementType.Image]: Image,
    [ElementType.Shape]: Shape,
    [ElementType.Text]: Text,
    [ElementType.Video]: Video,
};

/**
 * Elements whose dimensions cannot be modified in the work area
 */
export const ELEMENTS_WITH_FIXED_DIMENSIONS = [
    ElementType.Carousel,
    ElementType.Catalog,
    ElementType.Header,
    ElementType.Footer,
    ElementType.Banner,
];

/**
 * Elements whose dimensions cannot be modified in the work area
 */
export const OPTIONS_COLLAGE_WITH_FIXED_DIMENSIONS = [ElementOption.Five, ElementOption.Six, ElementOption.Seven];

/**
 * Default element style, which is assigned when the element is dropped in the work area
 */
export const DEFAULT_ELEMENT_STYLE: { [key: string]: CSSObject } = {
    [ElementType.Carousel]: {
        title: {
            color: Color.Primary,
            fontSize: '22',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            color: Color.Secondary,
            fontSize: '16',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
    },
    [`${ElementType.Carousel}_${ElementOption.One}`]: {
        minWidth: 600,
        height: 700,
        minHeight: 700,
        maxHeight: 700,
    },
    [`${ElementType.Carousel}_${ElementOption.Two}`]: {
        minHeight: 338,
        title: {
            fontSize: '22',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            fontSize: '16',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
        minWidth: 270,
    },
    [`${ElementType.Carousel}_${ElementOption.Three}`]: {
        height: 550,
        minHeight: 550,
    },

    [`${ElementType.Carousel}_${ElementOption.Four}`]: {
        height: 400,
        minHeight: 440,
        buttons: {
            fontFamily: 'aller',
            fontWeight: 'Bold',
            fontSize: '16',
        },
        title: {
            fontSize: '22',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            fontSize: '16',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
        minWidth: 270,
    },
    [ElementType.Catalog]: {
        category: {
            color: Color.Secondary,
            fontSize: '22',
            fontWeight: 'Bold',
            fontFamily: 'roboto',
        },
        product: {
            color: Color.Primary,
            fontSize: '22',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        price: {
            color: Color.Purple,
            fontSize: '18',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
        width: 1280,
        height: 'max-content',
    },
    [ElementType.Form]: {
        title: {
            color: Color.Primary,
            fontSize: '12',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        button: {
            color: Color.White,
            fontSize: 13,
        },
    },
    [`${ElementType.Banner}_${ElementOption.One}`]: {
        productValue: {
            fontFamily: 'aller',
            color: Color.Secondary,
            fontSize: 16,
            fontWeight: 'Bold',
        },
        productName: {
            fontFamily: 'aller',
            fontSize: '22',
            color: Color.Primary,
        },
        title: {
            fontFamily: 'aller',
            color: Color.Secondary,
            fontSize: 32,
            fontWeight: 'Bold',
        },
        card: {
            background: Color.Transparent,
        },
        width: 1150,
    },
    [`${ElementType.Banner}_${ElementOption.Two}`]: {
        description: {
            fontFamily: 'opensans',
            fontSize: '18',
        },
        productValue: {
            fontFamily: 'aller',
            color: Color.White,
            fontSize: 16,
        },
        productName: {
            fontFamily: 'aller',
            fontSize: '22',
            color: Color.White,
        },
        title: {
            fontFamily: 'aller',
            color: Color.Secondary,
            fontSize: '32',
            fontWeight: 'Bold',
        },
        card: {
            background: Color.Secondary,
        },
        width: 1144,
    },
    [`${ElementType.Banner}_${ElementOption.Three}`]: {
        description: {
            fontFamily: 'opensans',
            fontSize: '18',
        },
        productValue: {
            fontFamily: 'aller',
            color: Color.White,
            fontSize: 16,
        },
        productName: {
            fontFamily: 'aller',
            fontSize: '22',
            color: Color.White,
        },
        title: {
            fontFamily: 'aller',
            color: Color.Secondary,
            fontSize: '32',
            fontWeight: 'Bold',
        },
        card: {
            background: Color.Secondary,
        },
        width: 1246,
    },
    [`${ElementType.Banner}_${ElementOption.Four}`]: {
        description: {
            fontFamily: 'opensans',
            fontSize: '18',
        },
        productValue: {
            fontFamily: 'aller',
            color: Color.White,
            fontSize: 16,
        },
        productName: {
            fontFamily: 'aller',
            fontSize: '22',
            color: Color.White,
        },
        title: {
            fontFamily: 'aller',
            color: Color.Secondary,
            fontSize: '32',
            fontWeight: 'Bold',
        },
        card: {
            background: Color.Secondary,
        },
        width: 1271,
    },
    [`${ElementType.Button}_${ElementOption.One}`]: {
        background: Color.Primary,
        borderRadius: 18,
    },
    [`${ElementType.Button}_${ElementOption.Two}`]: {
        background: Color.Primary,
        borderRadius: 8,
    },
    [`${ElementType.Button}_${ElementOption.Three}`]: {
        background: Color.Primary,
        borderRadius: 4,
    },
    [`${ElementType.Button}_${ElementOption.Four}`]: {
        background: Color.Primary,
        borderRadius: 0,
    },
    [`${ElementType.Text}_${ElementOption.One}`]: {
        fontFamily: 'poppins',
        fontWeight: 'Bold',
        color: Color.Primary,
    },
    [`${ElementType.Text}_${ElementOption.Two}`]: {
        fontFamily: 'poppins',
        fontSize: 18,
        fontWeight: 'Bold',
        color: Color.Primary,
    },
    [`${ElementType.Text}_${ElementOption.Three}`]: {
        fontFamily: 'poppins',
        fontWeight: 'Regular',
        color: Color.Primary,
    },
    [`${ElementType.Text}_${ElementOption.Four}`]: {
        fontFamily: 'poppins',
        fontSize: 14,
        color: Color.Primary,
    },
    [`${ElementType.Form}_${ElementOption.One}`]: {
        width: 597,
        miHeight: 348,
    },
    [`${ElementType.Form}_${ElementOption.Two}`]: {
        width: 530,
        miHeight: 285,
    },
    [`${ElementType.Form}_${ElementOption.Three}`]: {
        width: 500,
        height: 99,
    },
    [`${ElementType.Form}_${ElementOption.Four}`]: {
        width: 322,
        minWidth: 322,
        miHeight: 419,
    },
    [`${ElementType.Form}_${ElementOption.Five}`]: {
        width: 1280,
        minWidth: 1280,
        miHeight: 551,
    },
};

export const MOBILE_DEFAULT_STYLE: { [key: string]: CSSObject } = {
    [ElementType.Catalog]: {
        width: 360,
        minWidth: 360,
    },
    [`${ElementType.Banner}_${ElementOption.One}`]: {
        title: {
            fontSize: 16,
            fontWeight: 'Bold',
        },
        productValue: {
            fontSize: 6,
        },
        productName: {
            fontSize: 8,
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        width: 320,
        left: 20,
    },
    [`${ElementType.Banner}_${ElementOption.Two}`]: {
        title: {
            fontSize: 10,
            fontWeight: 'Bold',
        },
        description: {
            fontSize: 10,
        },
        productValue: {
            fontSize: 6,
        },
        productName: {
            fontSize: 7,
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        width: 320,
        left: 20,
        height: 125,
    },
    [`${ElementType.Banner}_${ElementOption.Three}`]: {
        title: {
            fontSize: 12,
            fontWeight: 'Bold',
        },
        description: {
            fontSize: 10,
        },
        productValue: {
            fontSize: 6,
        },
        productName: {
            fontSize: 7,
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        width: 320,
        left: 20,
    },
    [`${ElementType.Banner}_${ElementOption.Four}`]: {
        title: {
            fontSize: 9,
            fontWeight: 'Bold',
        },
        description: {
            fontSize: 10,
        },
        productValue: {
            fontSize: 6,
        },
        productName: {
            fontSize: 7,
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        width: 320,
        left: 20,
    },
    [`${ElementType.Form}_${ElementOption.One}`]: {
        width: 360,
        height: 480,
    },
    [`${ElementType.Form}_${ElementOption.Two}`]: {
        width: 360,
        height: 458,
    },
    [`${ElementType.Form}_${ElementOption.Three}`]: {
        width: 360,
        height: 178,
    },
    [`${ElementType.Form}_${ElementOption.Four}`]: {
        width: 360,
        height: 399,
    },
    [`${ElementType.Form}_${ElementOption.Five}`]: {
        width: 360,
        minWidth: 360,
        maxWidth: 360,
        height: 1240,
    },
    [ElementType.Carousel]: {
        minWidth: 340,
        width: 340,
        height: 360,
        minHeight: 360,
    },
    [`${ElementType.Carousel}_${ElementOption.One}`]: {
        minWidth: 320,
        width: 320,
        height: 320,
        minHeight: 320,
    },
    [`${ElementType.Carousel}_${ElementOption.Two}`]: {
        height: 342,
        minHeight: 342,
        minWidth: 228,
        width: 228,
        title: {
            color: 'White',
            fontSize: '16',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            fontSize: '12',
            color: 'White',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Three}`]: {
        minWidth: 320,
        width: 320,
        height: 320,
        minHeight: 320,
    },
    [`${ElementType.Carousel}_${ElementOption.Four}`]: {
        minHeight: 332,
        height: 332,
        width: 322,
        minWidth: 322,
        title: {
            color: 'White',
            fontSize: '16',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            fontSize: '12',
            color: 'White',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Five}`]: {
        width: 194,
        minWidth: 194,
        minHeight: 258,
        height: 258,
    },
    [`${ElementType.Carousel}_${ElementOption.Six}`]: {
        height: 202,
        minHeight: 202,
        width: 347,
        minWidth: 347,
        title: {
            color: Color.Primary,
            fontSize: '12',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            color: Color.Secondary,
            fontSize: '12',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Seven}`]: {
        width: 180.75,
        minWidth: 108.75,
        height: 270,
        minHeight: 270,
    },
    [`${ElementType.Carousel}_${ElementOption.Eight}`]: {
        width: 337,
        minWidth: 337,
        height: 390,
        minHeight: 390,
    },
    [`${ElementType.Carousel}_${ElementOption.Nine}`]: {
        width: 247,
        minWidth: 247,
        height: 247,
        minHeight: 247,
    },
    [`${ElementType.Carousel}_${ElementOption.Ten}`]: {
        width: 180.75,
        minWidth: 108.75,
        height: 270,
        minHeight: 270,
    },
    [`${ElementType.Carousel}_${ElementOption.Eleven}`]: {
        minHeight: 180,
        height: 180,
        minWidth: 139,
        title: {
            fontSize: '16',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            fontSize: '12',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Twelve}`]: {
        height: 209,
        minHeight: 209,
    },
    [`${ElementType.Carousel}_${ElementOption.Thirteen}`]: {
        width: 320,
        minWidth: 320,
        height: 320,
        minHeight: 320,
        title: {
            color: 'White',
            fontSize: '16',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Fourteen}`]: {
        height: 230,
        minHeight: 230,
        minWidth: 138,
        buttons: {
            fontFamily: 'aller',
            fontWeight: 'Bold',
            fontSize: '11',
        },
        title: {
            fontSize: '16',
            fontWeight: 'Bold',
            fontFamily: 'aller',
        },
        description: {
            fontSize: '12',
            fontWeight: 'Regular',
            fontFamily: 'aller',
        },
    },
};

/**
 * Default element setting, which is assigned when the element is dropped in the work area
 */
export const DEFAULT_ELEMENT_SETTING: { [key: string]: IGenericRecord } = {
    [`${ElementType.Banner}_${ElementOption.One}`]: {
        title: 'Título:',
    },
    [`${ElementType.Banner}_${ElementOption.Two}`]: {
        title: 'Título:',
        description: 'Descripción 2',
    },
    [`${ElementType.Banner}_${ElementOption.Three}`]: {
        title: 'Título:',
        description: 'Descripción 3',
    },
    [`${ElementType.Banner}_${ElementOption.Four}`]: {
        title: 'Título:',
        description: 'Descripción 4',
    },
    [`${ElementType.Form}_${ElementOption.One}`]: {
        buttonText: 'Enviar',
        fields: [
            {
                name: 'Título',
                type: 'Texto corto',
                id: '0ase7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Título',
                type: 'Texto corto',
                id: '6c8e7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Título',
                type: 'Texto corto',
                id: 'h78e7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Título',
                type: 'Texto corto',
                id: 'l88e7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Descripción',
                type: 'Párrafo',
                id: 'bc93ebc1-af70-488b-9fde-86a9b422bb34',
            },
        ],
    },
    [`${ElementType.Form}_${ElementOption.Two}`]: {
        buttonText: 'Enviar',
        fields: [
            {
                name: 'Nombre',
                type: 'Texto corto',
                id: 'oi863e64-a482-458f-a3f2-c550ca62d506',
            },
            {
                name: 'Apellido',
                type: 'Texto corto',
                id: 'aj763e64-a482-458f-a3f2-c550ca62d506',
            },
            {
                name: 'Correo',
                type: 'Correo electrónico',
                id: '9is63e64-a482-458f-a3f2-c550ca62d506',
            },
            {
                name: 'Teléfono',
                type: 'Número',
                id: '67d63e64-a482-458f-a3f2-c550ca62d506',
            },
            {
                name: '...',
                type: 'Párrafo',
                id: '74a571ae-bd41-4bc4-9c8f-193bc541b78e',
            },
        ],
    },
    [`${ElementType.Form}_${ElementOption.Three}`]: {
        buttonText: 'Suscribete',
        fields: [
            {
                name: 'Tu correo',
                type: 'Correo electrónico',
                id: 'aj763e64-a482-458f-a3f2-c550ca62d506',
            },
        ],
    },
    [`${ElementType.Form}_${ElementOption.Four}`]: {
        buttonText: 'Enviar',
        fields: [
            {
                name: 'Título',
                type: 'Texto corto',
                id: '0ase7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Título',
                type: 'Texto corto',
                id: '6c8e7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Título',
                type: 'Texto corto',
                id: 'h78e7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
            {
                name: 'Título',
                type: 'Texto corto',
                id: 'l88e7cf4-fabf-442a-bb6d-bbde2ea826cc',
            },
        ],
    },
    [`${ElementType.Form}_${ElementOption.Five}`]: {
        buttonText: 'Reservar',
        fields: [],
    },
    [ElementType.Catalog]: {
        showUnitValue: true,
        itemsPerPage: '9',
        ordering: 'Agregados del más reciente al más antiguo',
        filters: `${Filter.VALUE},${Filter.DATE},${Filter.PRICE_RANGE}`,
        priceRanges: [DEFAULT_PRICE_RANGE],
        productsBanner: true,
        imageBanner: true,
    },
    [ElementType.Carousel]: {
        center: false,
        showDots: true,
        slides: 4,
        carouselHeight: 537,
        carouselWidth: 1240,
        slideWidth: 304,
        slideHeight: 455,
        images: [],
        padding: 8,
    },
    [`${ElementType.Carousel}_${ElementOption.One}`]: {
        images: [],
        desktop: {
            carouselHeight: 684,
            carouselWidth: 600,
            slideWidth: 600,
            slideHeight: 600,
            slides: 1,
            padding: 0,
        },
        mobile: {
            carouselHeight: 320,
            carouselWidth: 320,
            slideWidth: 320,
            slideHeight: 320,
            padding: 0,
            slides: 1,
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Two}`]: {
        showDots: false,
        images: [],
        desktop: {
            slides: 4,
            carouselHeight: 336,
            carouselWidth: 1150,
            slideWidth: 270,
            slideHeight: 270,
            padding: 22,
        },
        mobile: {
            slides: 2,
            carouselHeight: 180,
            carouselWidth: 286,
            slideWidth: 138,
            slideHeight: 138,
            padding: 9,
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Three}`]: {
        showDots: true,
        images: [],
        desktop: {
            slides: 1,
            carouselHeight: 543,
            carouselWidth: 1284,
            slideWidth: 1284,
            slideHeight: 460,
            padding: 0,
        },
        mobile: {
            slides: 1,
            carouselHeight: 189,
            carouselWidth: 360,
            slideWidth: 360,
            slideHeight: 189,
            padding: 0,
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Four}`]: {
        showDots: false,
        images: [],
        desktop: {
            slides: 4,
            carouselHeight: 425,
            carouselWidth: 1134,
            slideWidth: 270,
            slideHeight: 270,
            padding: 18,
        },
        mobile: {
            slides: 2,
            carouselHeight: 206,
            carouselWidth: 286,
            slideWidth: 138,
            slideHeight: 138,
            padding: 9,
        },
    },
    [`${ElementType.Carousel}_${ElementOption.Five}`]: {
        hasBackground: true,
        desktop: {
            carouselHeight: 297,
            carouselWidth: 1232,
            slideWidth: 240,
            slideHeight: 297,
            padding: 8,
            slides: 5,
        },
        mobile: {
            carouselHeight: 342,
            carouselWidth: 228,
            slideWidth: 228,
            slideHeight: 295,
            padding: 0,
            slides: 1,
        },
    },
};

/**
 * Number 0 for get first element in array
 */
export const ZERO = 0;

/**
 * Number 100 for get dimension in percentage
 */
export const HUNDRED = 100;

/**
 * Name of the area where the elements are dragged
 */
export const DROP_ZONE = 'drop-zone';

/**
 * Name of the area where the elements are dragged work space
 */
export const WORK_SPACE = 'work-space';

/**
 * Required page elements
 */
export const MANDATORY_ELEMENTS = [ElementType.Header, ElementType.Footer];

/**
 * Reset size of Draggable element
 */
export const resetSize = { maxWidth: '', maxHeight: '' };

/**
 * Header component height
 */
export const HEADER_HEIGHT = 1.5625;

/**
 * Default size for components
 */
export const DEFAULT_DIMENSION = 0;

/**
 * Default percentage
 */
export const TOTAL_PERCENTAGE = 100;

/**
 * Default scroll setting value
 */
export const SCROLL_SETTING_VALUE = 180;

/**
 * Default width setting value
 */
export const WIDTH_SETTING_VALUE = 50;

/**
 * Function to get the current dimensions of the element
 *
 * @param element: IDraggableElement - Element to get dimensions
 * @param containerRef: React.RefObject<HTMLDivElement> - Container reference
 * @returns CSSObject
 */
export const getCurrentDimensions = (element: IDraggableElement, containerRef: React.RefObject<HTMLDivElement>): CSSObject => {
    const dimension = containerRef?.current;
    if (containerRef?.current?.id === element?.id) {
        return {
            ...element.style,
            width: MANDATORY_ELEMENTS.includes(element.type) ? element.style.width : dimension?.offsetWidth,
            height: dimension?.offsetHeight,
        };
    }
    return { ...element.style };
};
