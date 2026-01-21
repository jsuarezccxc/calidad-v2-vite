import { paginationDataFormat } from '@constants/PaginationBack';
import { DEFAULT_DATA } from '@components/sales-and-purchase-accounting-report';
import { IFinalInventoryDay } from '@models/InvoiceWebsite';
import { IInvoiceWebsiteState, ActionKeys, InvoiceSummaryActions } from './types';

const initialState = {
    error: '',
    success: false,
    message: '',
    sales: { ...paginationDataFormat, data: DEFAULT_DATA },
    shopping: { ...paginationDataFormat, data: DEFAULT_DATA },
    finalInventoryDay: { ...paginationDataFormat, data: [] as IFinalInventoryDay[] },
    finalInventoryMonth: { date: '', operation: '', unit_measurements_name: '', quantities: [], quantity_total: 0 },
};

export const reducer = (state: IInvoiceWebsiteState = initialState, action: InvoiceSummaryActions): IInvoiceWebsiteState => {
    switch (action.type) {
        case ActionKeys.SET_ERROR:
            return {
                ...state,
            };
        case ActionKeys.SET_MESSAGE:
            return {
                ...state,
            };
        case ActionKeys.SET_SUCCESS:
            return {
                ...state,
            };
        case ActionKeys.SET_SALES_WEBSITE:
            return {
                ...state,
                sales: action.data,
            };
        case ActionKeys.SET_SHOPPING_WEBSITE:
            return {
                ...state,
                shopping: action.data,
            };
        case ActionKeys.FINAL_INVENTORY_DAY:
            return {
                ...state,
                finalInventoryDay: action.data,
            };
        case ActionKeys.FINAL_INVENTORY_MONTH:
            return {
                ...state,
                finalInventoryMonth: action.data,
            };
        default:
            return state;
    }
};
