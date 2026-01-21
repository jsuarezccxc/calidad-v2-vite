import { IConsultClientResponse } from '@models/ImportClient';
import { PRODUCT_NAME } from './ProductName';

/**
 * This const is sub module electronic documents
 */
export const MODULE_TITLES = {
    INVOICE: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
    NOTE: 'Cómo generar y transmitir Notas débito y crédito y Nota de ajuste',
    CONTINGENCY: `Contingencia ${PRODUCT_NAME}`,
    PURCHASE_NOTE: 'Cómo registrar notas débito y crédito para factura de compra',
};

/**
 * This enum defines the types of modals used in the import process
 */
export enum ModalImport {
    Warning = 'ALREADY_EXISTS',
    Error = 'NOT_FOUND_IN_DIAN',
    Contingency = 'CONTINGENCY',
    ConsultClient = 'CONSULT_CLIENT',
    ImportClient = 'CREATED_SUCCESSFULLY',
}

/**
 * This const defines the default response for a client consultation
 */
export const DEFAULT_IMPORT_CLIENT_RESPONSE: IConsultClientResponse = {
    name: '',
    document_number: 0,
    document_type: '',
    client_id: '',
    person_id: '',
    email: '',
    state_person: '',
};

/**
 * This enum defines the possible states of an invoice
 */
export enum InvoiceState {
    Voided = 'VOIDED',
}

/**
 * Support documents title
 */
export const SUPPORT_DOCUMENTS_TITLE = 'Documentos electrónicos';
