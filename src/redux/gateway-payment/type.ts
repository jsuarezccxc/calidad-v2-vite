import { IBanks, IStatus, ITransactionPse } from "@models/Payment";

/**
 * @param SELECT_PAYMENT_METHOD it is a payment method selected, for example CASH is to pay through bank deposit
 * @param MAKE_PAYMENT it is a object that contain information to pay through PAYU gateway
 * @param GET_STATUS it is a object that contain information about pay
 * @param GET_PSE_BANKS it is a object array that contain information about pse banks
 * @param FAILED it is string to know information about failed endpoints
 */
export enum ActionKeys {
    SELECT_PAYMENT_METHOD = 'SELECT_PAYMENT_METHOD',
    MAKE_PAYMENT = 'MAKE_PAYMENT',
    GET_STATUS = 'GET_STATUS',
    GET_PSE_BANKS = 'GET_PSE_BANKS',
    FAILED = 'FAILED'
}

/**
 *  @param type It's action
 *  @param paymentMethod its a string type with three options
 */
export interface ISelectPaymentMethod {
    type: ActionKeys.SELECT_PAYMENT_METHOD,
    paymentMethod: PaymentMethods
}

/**
 *  @param type It's action
 *  @param IBanks[] its a array that contain bank pse information
 */
export interface IGetPseBanks {
    type: ActionKeys.GET_PSE_BANKS,
    banks: IBanks[]
}

/**
 *  @param type It's action
 *  @param transaction its a object that contain information about pay dates
 */
export interface IMakePayment {
    type: ActionKeys.MAKE_PAYMENT,
    transaction: ITransactionPse
}

/**
 *  @param type It's action
 *  @param IStatus its object that have information about status transaction
 */
export interface IGetStatus {
    type: ActionKeys.GET_STATUS,
    status: IStatus
}

/**
 *  @param type It's action
 *  @param error its a string that contain error message
 */
export interface IFailed {
    type: ActionKeys.FAILED,
    error: string
}

export type PaymentMethods = 'CASH' | 'PSE' | 'NONE';
export type PaymentActions = ISelectPaymentMethod | IMakePayment | IGetStatus | IGetPseBanks | IFailed;