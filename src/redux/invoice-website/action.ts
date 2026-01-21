/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { apiPostInvoice } from '@api/invoice';
import { RootState } from '@redux/rootReducer';
import { FetchRequest } from '@models/Request';
import { IFinalInventoryDay } from '@models/InvoiceWebsite';
import { ACTION_TYPE, SELECT_KEY_URL } from '@utils/InvoiceWebsite';
import { IPaginatorBackend, IPaginatorBackendObj } from '@components/paginator-backend';
import {
    ActionKeys,
    ISalesData,
    ISetError,
    ISetFinalInventoryDay,
    ISetFinalInventoryMonth,
    ISetSalesWebsite,
    ISetShoppingWebsite,
    InvoiceSummaryActions,
} from './types';


export const setFailedError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setSalesWebsite = (data: IPaginatorBackendObj<ISalesData>): ISetSalesWebsite => ({
    type: ActionKeys.SET_SALES_WEBSITE,
    data,
});

export const setShoppingWebsite = (data: IPaginatorBackendObj<ISalesData> ): ISetShoppingWebsite => ({
    type: ActionKeys.SET_SHOPPING_WEBSITE,
    data,
});

export const setFinalInventoryDay = (data: IPaginatorBackend<IFinalInventoryDay>): ISetFinalInventoryDay => ({
    type: ActionKeys.FINAL_INVENTORY_DAY,
    data,
});

export const setFinalInventoryMonth = (data: IFinalInventoryDay): ISetFinalInventoryMonth => ({
    type: ActionKeys.FINAL_INVENTORY_MONTH,
    data,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const getInvoiceWebsite = (
    sendData: any,
    type: string
): ThunkAction<Promise<void>, RootState, null, InvoiceSummaryActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, InvoiceSummaryActions>): Promise<void> => {
        try {
            const request = new FetchRequest(SELECT_KEY_URL[type], sendData);
            const { data }: any = await apiPostInvoice(request);

            if (type === ACTION_TYPE.SALES) {
                dispatch(setSalesWebsite(data || {}));
                return;
            }
            if (type === ACTION_TYPE.SHOPPING) {
                dispatch(setShoppingWebsite(data || {}));
                return;
            }
            if (type === ACTION_TYPE.FINAL_INVENTORY_DAY) {
                dispatch(setFinalInventoryDay(data || []));
                return;
            }
            if (type === ACTION_TYPE.FINAL_INVENTORY_MONTH) {
                dispatch(setFinalInventoryMonth(data || []));
                return;
            }
        } catch (error) {
            dispatch(setFailedError(String(error)));
        }
    };
};
