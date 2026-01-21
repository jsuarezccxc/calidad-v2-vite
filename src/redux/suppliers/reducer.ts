import { ISelectedSupplier } from '@models/Supplier';
import { IGenericRecord } from '@models/GenericRecord';
import { paginationDataFormat } from '@constants/PaginationBack';
import { ActionKeys, SupplierActions } from './types';

const {
    SET_SUPPLIERS,
    SET_SUPPLIERS_THIN,
    SET_SUPPLIER_HISTORY,
    SET_SUPPLIER_INVOICE,
    SET_ERROR,
    SET_SELECTED_SUPPLIER,
} = ActionKeys;

interface ISuppliers {
    suppliers: IGenericRecord;
    suppliersThin: IGenericRecord[];
    supplierHistory: IGenericRecord[];
    error: IGenericRecord;
    invoice: IGenericRecord;
    selectedSupplier: ISelectedSupplier;
}

const initialState = {
    suppliers: paginationDataFormat,
    suppliersThin: [],
    supplierHistory: [],
    invoice: {},
    error: { email: '', document_number: '' },
    selectedSupplier: { id: '', name: '', personId: '' },
};

export const reducer = (state: ISuppliers = initialState, action: SupplierActions): ISuppliers => {
    switch (action.type) {
        case SET_SUPPLIERS:
            return {
                ...state,
                suppliers: action.suppliers,
            };
        case SET_SUPPLIERS_THIN:
            return {
                ...state,
                suppliersThin: action.suppliersThin,
            };
        case SET_SUPPLIER_HISTORY:
            return {
                ...state,
                supplierHistory: action.supplierHistory,
            };
        case SET_SUPPLIER_INVOICE:
            return {
                ...state,
                invoice: action.invoice,
            };
        case SET_SELECTED_SUPPLIER:
            return {
                ...state,
                selectedSupplier: action.selectedSupplier,
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
