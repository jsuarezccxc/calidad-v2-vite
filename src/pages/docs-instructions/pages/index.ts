import { IRadioCard } from '../components';
import { DOC, STEP, TypeDoc } from '../context';

export { DocSelector } from './DocSelector';
export { Steps } from './Steps';

/**
 * Options for documents card
 */
export const CARD_OPTION_DEFAULT: IRadioCard[] = [
    {
        title: 'Factura electrónica de venta',
        icon: 'addMoneyInvoice',
        isSelected: false,
        typeDoc: TypeDoc.EI,
        onClick: (): void => {},
    },
    {
        title: 'Documento soporte',
        icon: 'addMoneyInvoice',
        isSelected: false,
        typeDoc: TypeDoc.SD,
        onClick: (): void => {},
    },
];

/**
 * Values for empty steps
 */
export const EMPTY_STEPS = { completedSteps: [] };

/**
 * Steps for documents and menus
 */
export enum stepsUrl {
    MENU = 'menu',
    SEND = 'send-dian',
    REQUEST = 'request-resolution',
    SYNC = 'sync-range',
    GENERATE = 'generate',
}

/**
 * Step Menu route
 */
export const MENU_STEPS = (doc: string): string => `?${DOC}=${doc}&${STEP}=${stepsUrl.MENU}`;
