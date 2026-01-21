import { ActionKeys, SalesReportSalesForce } from './types';
import { IGenericRecord } from '@models/GenericRecord';

interface ISalesReportForce {
    data: IGenericRecord;
    electronicDocumentsSalesReport: IGenericRecord;
    error?: string;
    productService: string;
    sales: IGenericRecord;
}

const initialState = {
    data: {},
    electronicDocumentsSalesReport: {},
    error: '',
    productService: '',
    sales: {},
};

export const reducer = (state: ISalesReportForce = initialState, action: SalesReportSalesForce): ISalesReportForce => {
    switch (action.type) {
        case ActionKeys.SET_SALES_REPORT:
            return {
                ...state,
                data: action.data,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_PRODUCT_SERVICE:
            return {
                ...state,
                productService: action.data,
            };
        case ActionKeys.SET_ELECTRONIC_DOCUMENTS_SALES_REPORT:
            return {
                ...state,
                electronicDocumentsSalesReport: action.data,
            };
        case ActionKeys.SET_SALES:
            return {
                ...state,
                sales: {
                    ...state.sales,
                    [action.payload.date]: action.payload.data,
                },
            };
        default:
            return state;
    }
};
