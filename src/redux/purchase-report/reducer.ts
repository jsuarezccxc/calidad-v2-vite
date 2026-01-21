import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, PurchaseReportActions } from '@redux/purchase-report/types';

/*
 * This interface describes initial state
 *
 * @typeParam report: IGenericRecord[] - Redux data
 */
export interface IPurchaseReportState {
    listProducts: IGenericRecord[];
}

const initialState: IPurchaseReportState = {
    listProducts: [],
};

export const reducer = (state = initialState, action: PurchaseReportActions): IPurchaseReportState => {
    switch (action.type) {
        case ActionKeys.GET_LIST_PRODUCTS:
            return {
                ...state,
                listProducts: action.payload.data,
            };

        default:
            return state;
    }
};
