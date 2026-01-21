import { ItemsPay } from '@constants/PaymentMethods';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, PaymentsActions } from './types';

interface IPayments {
    banks: IGenericRecord[];
    cardInfo: IGenericRecord;
    itemToPay: ItemsPay;
    data: IGenericRecord;
    response: IGenericRecord;
    showResponseModal: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    urlBank: any;
    statusTransaction: string;
    statusValidateModules: number;
    error?: string;
    geolocation: IGenericRecord;
    statusPaymentInfo?: IGenericRecord;
}

const initialState = {
    banks: [],
    cardInfo: {},
    itemToPay: ItemsPay.MEMBERSHIPS,
    data: {},
    response: {},
    showResponseModal: false,
    urlBank: '',
    statusTransaction: '',
    statusValidateModules: 0,
    error: '',
    geolocation: {},
    statusPaymentInfo: {},
};

export const reducer = (state: IPayments = initialState, action: PaymentsActions): IPayments => {
    switch (action.type) {
        case ActionKeys.SET_BANKS_PSE:
            return {
                ...state,
                banks: action.banks,
            };
        case ActionKeys.SET_GEOLOCATION:
            return {
                ...state,
                geolocation: action.geolocation,
            };
        case ActionKeys.GET_CARD_PAYU:
            return {
                ...state,
                cardInfo: action.cardInfo,
            };
        case ActionKeys.ITEM_TO_PAY:
            return {
                ...state,
                itemToPay: action.itemToPay,
            };
        case ActionKeys.PAY_MEMBERSHIPS_OR_USERS:
            return {
                ...state,
                data: action.data,
            };
        case ActionKeys.PAY_RESPONSE:
            return {
                ...state,
                response: action.response,
            };
        case ActionKeys.SHOW_RESPONSE_MODAL:
            return {
                ...state,
                showResponseModal: !state.showResponseModal,
            };
        case ActionKeys.SET_URL_BANK:
            return {
                ...state,
                urlBank: action.urlBank,
            };
        case ActionKeys.SET_STATUS_CANCEL_TRANSACTION:
            return {
                ...state,
                statusTransaction: action.statusTransaction,
            };
        case ActionKeys.SET_STATUS_VALIDATE_MODULES:
            return {
                ...state,
                statusValidateModules: action.statusValidateModules,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_STATUS_PAYMENT_INFO:
            return {
                ...state,
                statusPaymentInfo: action.statusPaymentInfo,
            };

        default:
            return state;
    }
};
