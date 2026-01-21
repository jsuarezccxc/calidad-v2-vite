import { PopperPlacementType } from '@mui/material';

export { TabContent } from './TabContent';
export { Tabs } from './Tabs';
export { HeaderColumn } from './HeaderColumn';
export { Header } from './Header';
export { Footer } from './Footer';
export { Modals } from './Modals';

/**
 * This interface describes the properties of a tab object.
 *
 * @typeParam label: string - The label displayed on the tab.
 * @typeParam content: React.ReactNode - The content rendered when the tab is active.
 */
export interface ITab {
    label: string;
    content: React.ReactNode;
}

/**
 * This interface describes the properties of a tabs container object.
 *
 * @typeParam tabs: ITab[] - An array of tab objects, each representing a single tab.
 */
export interface ITabs {
    tabs: ITab[];
}

/**
 * This interface describes the properties of a header column object.
 *
 * @typeParam label: string - The label displayed in the column header.
 * @typeParam description: string - Optional brief description of the column.
 * @typeParam className?: string - Optional CSS class name for custom styling.
 * @typeParam placement?: PopperPlacementType - Optional position tooltip placement.
 * @typeParam titleTooltip: string - Optinoal title displayed in tooltip.
 *
 */
export interface IHeaderColumn {
    label: string;
    description?: string;
    className?: string;
    placement?: PopperPlacementType;
    titleTooltip?: string;
}

/**
 * Types of tabs to navigate
 */
export enum TypeTab {
    FE = 'Factura electrónica de venta',
    SD = 'Documento soporte',
    FC = 'Facturación de contingencia',
}

/**
 * Header table modal prefix
 */
export const HEADER_MODAL_COLUMNS: IHeaderColumn[] = [
    {
        label: '*Tipo de facturación',
        className: 'table-modal-prefix__type-invoice',
    },
    {
        label: 'Prefijo',
        className: 'table-modal-prefix__prefix',
    },
    {
        label: 'Número de resolución',
        className: 'table-modal-prefix__number-resolution',
    },
];

/**
 * Header table object information
 */
export const HEADER_COLUMN = (isInvoice: boolean): IHeaderColumn[] => [
    ...(isInvoice ? [{ label: 'Tipo de documento electrónico', className: 'w-181' }] : []),
    {
        label: 'Número de resolución',
        description:
            'es el número que se encuentra en la parte superior derecha, del formato 1876 Autorización numeración de facturación (casilla 4 formato 1876).',
        className: 'w-181 whitespace-nowrap',
    },
    {
        label: 'Prefijo',
        description: 'es un identificador de facturas electrónicas de venta de cuatro caracteres alfanuméricos.',
        className: 'w-82 whitespace-nowrap',
    },
    {
        label: 'Vigencia desde',
        description: 'es la fecha desde la cual empieza a regir su resolución.',
        className: 'w-136 whitespace-nowrap',
    },
    {
        label: 'Vigencia hasta',
        description: 'es la fecha de vencimiento de su resolución.',
        className: 'w-136 whitespace-nowrap',
    },
    {
        label: 'Rango desde',
        description: 'es el consecutivo con el que inicia la numeración de sus facturas.',
        className: 'w-120 whitespace-nowrap',
    },
    {
        label: 'Rango hasta',
        description: 'es el consecutivo con el que finaliza la numeración de sus facturas.',
        className: 'w-120 whitespace-nowrap',
        placement: 'bottom',
    },
    {
        label: 'Numeración actual',
        description:
            'es la cantidad de documentos soporte transmitidas dentro del rango de numeración. Por ejemplo, si el "rango desde" es 1, el "rango hasta" es 100, y ya ha emitido 50 facturas, la numeración actual será 50.',
        className: 'w-124 current-number',
        placement: 'bottom',
    },
];
