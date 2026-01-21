import { TypeEventDian } from '@constants/DianEvents';
import { IGenericRecord } from '@models/GenericRecord';

export { Download } from './Download';
export { Actions } from './Actions';
export { Document } from './Document';
export { Invoice } from './Invoice';

export const getEnum = (e: IGenericRecord, k: string): string => {
    return e[k];
};

/**
 * Return key for next event
 * 
 * @param event:string - Type event
 * @returns string
 */
export const handleTypeModal = (event: string): string => {
    switch (event) {
        case TypeEventDian.NO_EVENTS:
            return TypeEventDian.ACCUSE_RECEIVE_FE;
        case TypeEventDian.ACCUSE_RECEIVE_FE:
            return TypeEventDian.ACCUSE_RECEIVE_BS;
        case TypeEventDian.ACCUSE_RECEIVE_BS:
            return TypeEventDian.ACCEPTANCE_CLAIM;
        default:
            return TypeEventDian.ACCUSE_RECEIVE_FE;
    }
};

/**
 * This interface is for props component
 *
 * @typeParam isPurchaseSupplier: boolean - Is purchase supplier document
 * @typeParam electronicDocument: IGenericRecord - Electronic document
 * @typeParam isQuote: boolean - Is quote document (optional)
 */
export interface IDownloadProps {
    isPurchaseSupplier: boolean;
    electronicDocument: IGenericRecord;
    isQuote?: boolean;
}

/**
 * This enum key state modal
 */
export enum ModalKey {
    ReceiptDocument = 'receiptDocument',
    Status = 'status'
}

/**
 * This const is default state event
 */
export const DEFAULT_EVENT = {
    nextCase: TypeEventDian.ACCEPTANCE_CLAIM,
    case: '',
    invoice_id: '',
    document_uuid: '',
    claim_code: '',
    claim_name: '',
    observations: '',
}

/**
 * This const is entities to radio button
 */
export const ENTITIES_RADIO = [
    { label: 'Aceptación', name: TypeEventDian.ACCEPTATION_EXPRESS },
    { label: 'Reclamo', name: TypeEventDian.CLAIM_FE },
];
