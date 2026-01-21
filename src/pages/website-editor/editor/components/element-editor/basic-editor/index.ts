/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSObject } from '@emotion/react';
import { IGenericRecord } from '@models/GenericRecord';
import { StyleKey } from '@models/WebsiteNode';
import { IDraggableElement } from '../../drag-and-drop';
import { OPTIONS } from '..';

export * from './BasicEditor';
export * from './ButtonTools';
export * from './CustomOptions';
export * from './Icon';
export * from './IconTools';
export * from './MultimediaTools';
export * from './Opacity';
export * from './ShapeTools';
export * from './TextTools';

/**
 * This describes the props of the common tools
 *
 * @typeParam deleteElement: () => void - Function to delete an element
 * @typeParam justDelete: boolean - Optional Just delete element
 */
export interface ICommonToolsProps {
    deleteElement: () => void;
    justDelete?: boolean;
}

/**
 * This describes the props of the tools
 *
 * @typeParam handleStyleChange: (data: IGenericRecord) => void - Function to handle style change
 * @typeParam style: IGenericRecord - Text style
 */
export interface IToolsProps {
    handleStyleChange: (data: IGenericRecord) => void;
    style?: IGenericRecord;
}

/**
 * This describes the props of the icon
 *
 * @typeParam id: string - Id for recognize Icon
 * @typeParam name: string - Icon name
 * @typeParam onClick: () => void - Optional property to handle the click
 * @typeParam className: string - Optional className styles
 */
export interface IIconProps {
    id: string;
    name: string;
    onClick?: () => void;
    className?: string;
}

/**
 * This is used to get the properties of each icon based on its name
 */
export const ICON_PROPS: { [key: string]: { icon: string; tooltip: string } } = {
    size: {
        icon: 'text-size-blue',
        tooltip: 'Convertir a mayúsculas/minúsculas',
    },
    align: {
        icon: 'align-text-blue',
        tooltip: 'Alineación',
    },
    list: {
        icon: 'set-list-blue',
        tooltip: 'Viñeta',
    },
    opacity: {
        icon: 'square-opacity-blue',
        tooltip: 'Opacidad',
    },
    putForward: {
        icon: 'send-front-blue',
        tooltip: 'Traer adelante',
    },
    putBack: {
        icon: 'send-behind-blue',
        tooltip: 'Enviar atrás',
    },
    copy: {
        icon: 'copy-edit-blue',
        tooltip: 'Copiar',
    },
    paste: {
        icon: 'paste-blue',
        tooltip: 'Pegar',
    },
    cut: {
        icon: 'cut-blue',
        tooltip: 'Cortar',
    },
    delete: {
        icon: 'trash-blue',
        tooltip: 'Eliminar',
    },
    arrowLeftCurvedBlue: {
        icon: 'arrow-left-curved-blue',
        tooltip: 'Deshacer cambios',
    },
    arrowRightCurvedBlue: {
        icon: 'arrow-right-curved-blue',
        tooltip: 'Re hacer cambios',
    },
};

/**
 * Custom options classes
 */
export const CUSTOM_OPTIONS_CLASSES = {
    ARROW: ['rotate-0', 'rotate-180', '-rotate-90', 'rotate-90'],
    BORDER: ['', 'rounded', 'semi-rounded', 'semi-square', 'square'],
};

/**
 * Border radius values
 */
const BORDER_RADIUS_VALUES = [0, 18, 10, 4, 0];

/**
 * This returns the border style
 *
 * @param element: IDraggableElement - Selected element
 * @param border: string - Selected border type
 * @returns CSSObject
 */
export const getBorderStyle = (element: IDraggableElement, border: string): CSSObject => {
    const index = OPTIONS.BORDER.findIndex(option => option === border);
    return {
        border: `${element.style.borderWidth}px solid ${element.style.borderColor ?? 'black'}`,
        borderRadius: BORDER_RADIUS_VALUES[index],
        ...(!index && { border: 'none' }),
    };
};

/**
 * Rotation values
 */
const ROTATION_VALUES = ['90deg', '-90deg', '0deg', '180deg'];

/**
 * This returns the rotation style
 *
 * @param element: IDraggableElement - Selected element
 * @param border: string - Selected border type
 * @returns CSSObject
 */
export const getRotationStyle = (element: IDraggableElement, value: string): CSSObject => {
    const index = OPTIONS.TURN.findIndex(option => option === value);
    return {
        rotate: ROTATION_VALUES[index],
    };
};

/**
 * This updates the element styles on all screens when copying a new one
 *
 * @param element: IDraggableElement - Selected element
 * @param newStyle: IGenericRecord - New style
 * @returns IGenericRecord
 */
export const updateElementStyles = (element: IDraggableElement, newStyle: IGenericRecord): IGenericRecord => {
    const { DesktopStyle, MobileStyle } = StyleKey;
    return {
        style: { ...element.style, ...newStyle },
        [DesktopStyle]: { ...(element[DesktopStyle] ?? {}), ...newStyle },
        [MobileStyle]: { ...(element[MobileStyle] ?? {}), ...newStyle },
    };
};
