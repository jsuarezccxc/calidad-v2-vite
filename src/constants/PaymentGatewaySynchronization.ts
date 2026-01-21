/**
 * This constants is to page payment gateway
 */
export enum ParamPaymentGateway {
    MercadoPago = 'MERCADO_PAGO',
    Wompi = 'WOMPI',
}

/**
 * This constants is to page payment gateway
 */
export const SUB_TITLE = 'Cómo armar el sitio web';

/**
 * This constant is url to wompi
 */
export const URL_WOMPI = 'https://wompi.com/es/co/';

/**
 * This enum is modal keys
 */
export enum ModalKeys {
    Save = 'save',
    Error = 'error',
}

/**
 * This constant is to modal state
 */
export const MODAL_STATE_KEYS = {
    [ModalKeys.Save]: false,
    [ModalKeys.Error]: false,
};
