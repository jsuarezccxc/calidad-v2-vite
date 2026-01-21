import { ActionKeys, PaymentGatewayActions } from '@redux/payment-gateway/types';
import { IDataPaymentGateway } from '@models/PaymentGateway';

const { ERROR, STORE_COMPANY_PAYMENT_GATEWAY, SET_STATUS_CODE, CHANGE_IS_INSTRUCTIONS } = ActionKeys;

interface IPaymentGatewayState {
    error: string;
    dataCompanyPaymentGateway: IDataPaymentGateway[];
    statusCode: number;
    isInstructions: boolean;
}

const initialState: IPaymentGatewayState = {
    error: '',
    dataCompanyPaymentGateway: [],
    statusCode: 0,
    isInstructions: false,
};

export const reducer = (state = initialState, action: PaymentGatewayActions): IPaymentGatewayState => {
    switch (action.type) {
        case ERROR:
            return {
                ...state,
                error: action.error,
            };
        case STORE_COMPANY_PAYMENT_GATEWAY:
            return {
                ...state,
                dataCompanyPaymentGateway: action.payload,
            };
        case SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.statusCode,
            };

        case CHANGE_IS_INSTRUCTIONS:
            return {
                ...state,
                isInstructions: action.payload,
            };
        default:
            return state;
    }
};
