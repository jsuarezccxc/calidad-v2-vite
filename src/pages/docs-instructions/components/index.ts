import { IconsNames } from '@components/icon';
import { IHeaderColumn } from '@pages/number-range/components';
import { pluralizeFirstWord } from '@utils/Text';
import { TypeDoc } from '../context';
import { IStepDetail } from '..';

export { Header } from './Header';
export { Footer } from './Footer';
export { ContentWrapper } from './ContentWrapper';
export { StepsCard } from './StepsCard';
export { StepSlider } from './StepSlider';
export { StepWrapper } from './StepWrapper';
export { NumberRangeStep } from './NumberRangeStep';
export { RadioCard } from './RadioCard';

/**
 * This interface describes the properties of a radio card component
 *
 * @typeParam title: string - The title of the radio card
 * @typeParam icon: IconsNames - The name of the icon displayed on the radio card
 * @typeParam isSelected: boolean - Indicates whether the radio card is selected
 * @typeParam typeDoc: TypeDoc - The type of document associated with the radio card
 * @typeParam validate: boolean - Optional - this for validate selected
 * @typeParam onClick: () => void - handle click for radio card
 */
export interface IRadioCard {
    title: string;
    icon: IconsNames;
    isSelected: boolean;
    typeDoc: TypeDoc;
    validate?: boolean;
    onClick: () => void;
}

/**
 * Animation class names
 */
export enum Animation {
    FADE_IN = 'fade-in',
    FADE_OUT = 'fade-out',
}

/**
 * Header table object information
 */
export const HEADER_COLUMN = (document: string, isInvoice: boolean): IHeaderColumn[] => [
    ...(isInvoice ? [{ label: 'Tipo de documento electrónico', className: 'w-181' }] : []),
    {
        label: `Número de resolución ${document}`,
        description:
            'es el número que se encuentra en la parte superior derecha, del formato 1876 Autorización numeración de facturación (casilla 4 formato 1876).',
        className: `w-${document === 'Factura de contingencia' ? '191' : '181 number-resolution'} break-word`,
        titleTooltip: 'Número de resolución',
    },
    {
        label: 'Prefijo',
        description: `es un identificador de ${
            document === 'Factura de venta' ? 'facturas electrónicas de venta' : document.toLowerCase()
        } de cuatro caracteres alfanuméricos.`,
        className: 'w-82 whitespace-nowrap',
    },
    {
        label: 'Vigencia desde',
        description: 'es la fecha desde la cual empieza a regir su resolución',
        className: 'w-136 whitespace-nowrap',
    },
    {
        label: 'Vigencia hasta',
        description: 'es la fecha de vencimiento de su resolución',
        className: 'w-136 whitespace-nowrap',
    },
    {
        label: 'Rango desde',
        description: 'es el consecutivo con el que inicia la numeración de sus facturas',
        className: 'w-120 whitespace-nowrap',
    },
    {
        label: 'Rango hasta',
        description: 'es el consecutivo con el que finaliza la numeración de sus facturas',
        className: 'w-120 whitespace-nowrap',
        placement: 'bottom',
    },
    {
        label: 'Numeración actual',
        description: `es la cantidad de ${
            document === 'Factura de venta' ? 'Facturas electrónicas' : pluralizeFirstWord(document.toLocaleLowerCase())
        } ${
            document === 'Documento soporte' ? 'transmitidos' : 'transmitidas'
        } dentro del rango de numeración. Por ejemplo, si el "rango desde" es 1, el "rango hasta" es 100, y ya ha emitido 50 facturas, la numeración actual será 50.`,
        className: 'w-124 current-number',
        placement: 'bottom',
    },
];

/**
 * This interface describes the wrapper for a step component
 *
 * @typeParam children: React.ReactNode - The child components to be wrapped within the step
 * @typeParam title: string - The title of the step
 * @typeParam description: string - A brief description of the step
 */
export interface IStepWrapper {
    children: React.ReactNode;
    title: string;
    description: string;
}

/**
 * This interface describes the properties of a step slider component
 *
 * @typeParam steps: IStepDetail[] - An array of step details, where each step is described by the IStepDetail interface
 * @typeParam stepNumber: number - The current step number in the slider
 */
export interface IStepSlider {
    steps: IStepDetail[];
    stepNumber: number;
}

/**
 * This interface describes the properties of a sales invoice step
 *
 * @typeParam title: string - The title of the sales invoice step
 * @typeParam description: string - A brief description of the sales invoice step
 * @typeParam typeDoc: TypeDoc - (Optional) The type of document associated with this step
 */
export interface ISalesInvoiceStep {
    title: string;
    description: string;
    typeDoc?: TypeDoc;
}

/**
 * This interface describes the properties of a button that redirects to a specific route
 *
 * @typeParam text: string - The text displayed on the button
 * @typeParam className: string - (Optional) Additional CSS classes to style the button
 */
export interface IButtonRedirect {
    text: string;
    className?: string;
}

/**
 * Empty step object
 */
export const EMPTY_STEP = { description: '', content: (): React.ReactNode => '' };

/**
 *  Descriptive text to variations
 */
export enum TEXT_DESCRIBED {
    DE = 'documento electrónico',
    INVOICE = 'factura',
    DS = 'documento soporte',
}
