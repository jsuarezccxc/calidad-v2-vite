import { ActionKeys, PaymentActions, PaymentMethods } from './type';
import { IBanks, IStatus, ITransactionPse } from "@models/Payment";

/**
 * this interface its to set up the variable initialState
 *
 * @param SELECT_PAYMENT_METHOD it is a payment method selected, for example CASH is to pay through bank deposit
 * @param MAKE_PAYMENT it is a object that contain information to pay through PAYU gateway
 * @param GET_STATUS it is a object that contain information about pay
 * @param GET_PSE_BANKS it is a object array that contain information about pse banks
 * @param FAILED it is string to know information about failed endpoints
 */
interface IPaymentState {
    paymentMethod: PaymentMethods,
    transaction: ITransactionPse,
    status: IStatus,
    banks: IBanks[],
    error: string,
}

/**
 * It is a variable that contain the initial information
 *
 * @param SELECT_PAYMENT_METHOD it is a payment method selected, for example CASH is to pay through bank deposit
 * @param MAKE_PAYMENT it is a object that contain information to pay through PAYU gateway
 * @param GET_STATUS it is a object that contain information about pay
 * @param GET_PSE_BANKS it is a object array that contain information about pse banks
 * @param FAILED it is string to know information about failed endpoints
 */
const initialState: IPaymentState = {
    banks: [
            {
                id:"0",
                description:'Seleccione un banco',
                pseCode:"0"
            }
        ],
    error: '',
    status: {
        error: "",
        code: "",
        result: {
            payload: {
                state: "",
                authorizationCode: "",
                errorCode: "",
                extraParameters: {
                },
                operationDate:1,
                paymentNetworkResponseCode: "",
                paymentNetworkResponseErrorMessage: "",
                pendingReason: "",
                responseCode: "",
                responseMessage: "",
                transactionDate: "",
                transactionTime: "",
                trazabilityCode: "",
            }
        }
    },
    transaction: {
        error: "",
        code: "",
        transactionResponse: {
            state: "",
            authorizationCode: "",
            errorCode: "",
            extraParameters: {
                BANK_URL: "",
                TRANSACTION_CYCLE: "",
                URL_PAYMENT_RECEIPT_HTML: ""
            },
            operationDate:1,
            paymentNetworkResponseCode: "",
            paymentNetworkResponseErrorMessage: "",
            pendingReason: "",
            responseCode: "",
            responseMessage: "",
            transactionDate: "",
            transactionTime: "",
            trazabilityCode: "",
            transactionId: "",
            additionalInfo: {
                transactionType: "",
                cardType: {},
                paymentNetwork: "",
                responseNetworkMessage: "",
                rejectionType: "",
                travelAgencyAuthorizationCode: "",
            },
            orderId: 0,
            referenceQuestionnaire: "",
        }
    },
    paymentMethod: 'NONE'
}

/**
 * this method is poblate redux
 * @param state this is state initial
 * @param action this action that dispatch the windows
 * @returns 
 */
export const reducer = (state: IPaymentState = initialState,
    action: PaymentActions): IPaymentState => {
    switch (action.type) {
        case ActionKeys.FAILED:
            return {
                ...state,
                error: action.error
            };
        case ActionKeys.MAKE_PAYMENT:
            return {
                ...state,
                transaction: action.transaction
            };
        case ActionKeys.GET_STATUS:
            return {
                ...state,
                status: action.status
            };
        case ActionKeys.SELECT_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.paymentMethod
            }
        case ActionKeys.GET_PSE_BANKS:
            return {
                ...state,
                banks: action.banks
            }
        default: return state;
    }
}