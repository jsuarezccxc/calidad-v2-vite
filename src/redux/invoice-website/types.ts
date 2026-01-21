import { IPaginatorBackendObj } from '@components/paginator-backend';
import { IFinalInventoryDay, ITableCustom, IWarehouseQuantities } from '@models/InvoiceWebsite';
import { IPaginatorBackend } from '@components/paginator-backend/index';

export enum ActionKeys {
    SET_ERROR = 'SET_ERROR',
    SET_SUCCESS = 'SET_SUCCESS',
    SET_MESSAGE = 'SET_MESSAGE',
    SET_SALES_WEBSITE = 'SET_SALES_WEBSITE',
    SET_SHOPPING_WEBSITE = 'SET_SHOPPING_WEBSITE',
    FINAL_INVENTORY_DAY = 'FINAL_INVENTORY_DAY',
    FINAL_INVENTORY_MONTH = 'FINAL_INVENTORY_MONTH',
}

export interface ISalesData {
    details: ITableCustom[];
    totals: IWarehouseQuantities;
}
export interface IInvoiceWebsiteState {
    error: string;
    success: boolean;
    message: string;
    sales: IPaginatorBackendObj<ISalesData>;
    shopping: IPaginatorBackendObj<ISalesData>;
    finalInventoryDay: IPaginatorBackend<IFinalInventoryDay>;
    finalInventoryMonth: IFinalInventoryDay;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetSuccess {
    type: ActionKeys.SET_SUCCESS;
    success: string;
}

export interface ISetMessage {
    type: ActionKeys.SET_MESSAGE;
    message: string;
}

export interface ISetSalesWebsite {
    type: ActionKeys.SET_SALES_WEBSITE;
    data: IPaginatorBackendObj<ISalesData>;
}

export interface ISetShoppingWebsite {
    type: ActionKeys.SET_SHOPPING_WEBSITE;
    data: IPaginatorBackendObj<ISalesData>;
}

export interface ISetFinalInventoryDay {
    type: ActionKeys.FINAL_INVENTORY_DAY;
    data: IPaginatorBackend<IFinalInventoryDay>;
}

export interface ISetFinalInventoryMonth {
    type: ActionKeys.FINAL_INVENTORY_MONTH;
    data: IFinalInventoryDay;
}

export type InvoiceSummaryActions =
    | ISetMessage
    | ISetSuccess
    | ISetError
    | ISetSalesWebsite
    | ISetShoppingWebsite
    | ISetFinalInventoryDay
    | ISetFinalInventoryMonth;
