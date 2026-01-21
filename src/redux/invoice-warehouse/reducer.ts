import { IInvoiveState, ActionKeys, InvoiceSummaryActions } from './types';

const initialState = {
    error: '',
    success: false,
    message: '',
    products: [],
    invoice: {},
    productDetail: {
        prefix: '',
        number: 0,
    },
};

export const reducer = (state: IInvoiveState = initialState, action: InvoiceSummaryActions): IInvoiveState => {
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
        case ActionKeys.SET_PRODUCT_DETAIL:
            return {
                ...state,
                productDetail: {
                    prefix: action.product.prefix,
                    number: action.product.number,
                },
            };
        case ActionKeys.GET_ALL_PRODUCTS:
            return {
                ...state,
                products: action.products,
            };
        case ActionKeys.SET_INVOICE_DETAIL:
            return {
                ...state,
                invoice: action.invoice,
            };

        default:
            return state;
    }
};
