import {IGenericRecord} from "@models/GenericRecord";

/**
 * This interface describe that properties the payments structure data send
 *
 * @typeParam shopping_cart : IMembershipDetail - shopping_cart is an object that contains information about the membership purchase
 * @typeParam buyer : IPersonDetail - shopping_cart is an object that contains information about the membership purchase
 * @typeParam shipping_address : IMembershipDetail - shopping_cart is an object that contains information about the membership purchase
 * @typeParam payer : IPersonDetail - shopping_cart is an object that contains information about the membership purchase
 * @typeParam billing_address : IMembershipDetail - shopping_cart is an object that contains information about the membership purchase
 * @typeParam ip : IMembershipDetail - shopping_cart is an object that contains information about the membership purchase
 * @typeParam user_agent : IMembershipDetail - shopping_cart is an object that contains information about the membership purchase
 *
 */
export interface IPayment {
    invoice : IMembershipDetail,
    buyer : IPersonDetail,
    shipping_address : IShippingAddress,
    payer: IPersonDetail,
    billing_address: IShippingAddress,
    ip: string,
    user_agent: string,
    pse?: IPse,
    type?: string
}

/**
 * this interface describe the order details
 * 
 * @typeParam id : this is uuid that reference a membership select
 * @typeParam total_value : this is the total value that user will pay on PayU
 * @typeParam tax_value : this is the tax that user will must pay 
 */
export interface IMembershipDetail {
    id : string,
    total_value : string,
    tax_value: string,
}

/**
 * this interface describe person details
 * 
 * @typeParam full_name: this is the full name
 * @typeParam email_address: this is the email person
 * @typeParam contact_phone: this is the phone number
 * @typeParam dni_number: this is the dni number person
 */
export interface IPersonDetail {
    full_name : string,
    email_address: string,
    contact_phone: string,
    dni_number: string,
}

/**
 * This interface describes the details that are necessary for shipments.
 * 
 * @typeParam street1: this is the main address
 * @typeParam street2: this is the second address
 * @typeParam city: this is the city
 * @typeParam state: this is the department or state
 * @typeParam country: this is the country
 * @typeParam postal_code: this is the postal code
 * @typeParam phone: this is the phone
 */
export interface IShippingAddress {
    street1: string,
    street2?: string,
    city: string,
    state: string,
    country: string,
    postal_code: string,
    phone: string
}

/**
 * This interface describes the details that are necessary for pay through pse.
 * 
 * @typeParam code: It is the code of the bank by which you are going to pay
 * @typeParam user_type: this is known if the user is natural o legal person
 * @typeParam user_document_type: this is the type document number
 * @typeParam user_document: this is the document number
 */
export interface IPse{
    code: string,
    user_type: string,
    user_document_type: string,
    user_document: string
}

/**
 * This interface describes the response the pse payment.
 * 
 * @typeParam code: It is the code the payu response
 * @typeParam error: this posible error
 * @typeParam transactionResponse: the object that contain the links to open
 */
export interface ITransactionPse {
    code: string,
    error: string,
    transactionResponse: ITransactionResponsePse
}

/**
 * This interface describes the object that contain the links to open
 * 
 *  @typeParam orderId: this order id in payu platform
 *  @typeParam transactionId: this transaction id in payu platform
 *  @typeParam state: the state of transaction
 *  @typeParam paymentNetworkResponseCode: code of state
 *  @typeParam paymentNetworkResponseErrorMessage: possible error on state, if this declined
 *  @typeParam trazabilityCode: this code is to know date when change state
 *  @typeParam authorizationCode: this is authorization code
 *  @typeParam pendingReason: this is pending reason
 *  @typeParam responseCode: this response code of payu
 *  @typeParam errorCode: possible code error
 *  @typeParam responseMessage: this is a message
 *  @typeParam transactionDate: this is the date when start transaction
 *  @typeParam transactionTime: this is the date local when start transaction
 *  @typeParam operationDate: this is a date
 *  @typeParam referenceQuestionnaire: this is a reference
 *  @typeParam extraParameters: this is a object that contain links to pse o cash payment
 *  @typeParam additionalInfo: this is a object that contain information
 */
export interface ITransactionResponsePse {
    orderId: number;
    transactionId: string;
    state: string;
    paymentNetworkResponseCode: string;
    paymentNetworkResponseErrorMessage: string;
    trazabilityCode: string;
    authorizationCode: string;
    pendingReason: string;
    responseCode: string;
    errorCode: string;
    responseMessage: string;
    transactionDate: string;
    transactionTime: string;
    operationDate: number;
    referenceQuestionnaire: string;
    extraParameters: IExtraParametersPse;
    additionalInfo: IAdditionalInfoPse;
}

/**
 * This interface describes the object that contain additional information
 * 
 *  @typeParam paymentNetwork: the payment method
 *  @typeParam rejectionType: reason because it was declined
 *  @typeParam responseNetworkMessage: this is a message
 *  @typeParam travelAgencyAuthorizationCode: code of bank authorization
 *  @typeParam cardType: this is a card type if pay credit card
 *  @typeParam transactionType: this is method payment on payu
 */
export interface IAdditionalInfoPse {
    paymentNetwork: string;
    rejectionType: string;
    responseNetworkMessage: string;
    travelAgencyAuthorizationCode: string;
    cardType: IGenericRecord;
    transactionType: string;
}

/**
 * This interface describes the object that contain the links
 * 
 *  @typeParam TRANSACTION_CYCLE: this is step of payment
 *  @typeParam BANK_URL: this is link to open pse gateway
 *  @typeParam URL_PAYMENT_RECEIPT_HTML: this is link to open pdf 
 */
export interface IExtraParametersPse {
    TRANSACTION_CYCLE: string;
    BANK_URL: string ;
    URL_PAYMENT_RECEIPT_HTML: string
}

/**
 * This interface describes the object that contain status information
 * 
 *  @typeParam code: this is a code
 *  @typeParam error: this is a error
 *  @typeParam result: this is a message
 */
export interface IStatus {
    code:   string;
    error:  string;
    result: IResult;
}

/**
 * This interface describes the object that contain the object to pay
 * 
 *  @typeParam payload: this is a object that send
 */
export interface IResult {
    payload: IPayload;
}

/**
 * This interface describes the object that contain the links to open when cash is select
 * 
 *  @typeParam state: this order id in payu platform
 *  @typeParam transactionId: this transaction id in payu platform
 *  @typeParam state: the state of transaction
 *  @typeParam paymentNetworkResponseCode: code of state
 *  @typeParam paymentNetworkResponseErrorMessage: possible error on state, if this declined
 *  @typeParam trazabilityCode: this code is to know date when change state
 *  @typeParam authorizationCode: this is authorization code
 *  @typeParam pendingReason: this is pending reason
 *  @typeParam responseCode: this response code of payu
 *  @typeParam errorCode: possible code error
 *  @typeParam responseMessage: this is a message
 *  @typeParam transactionDate: this is the date when start transaction
 *  @typeParam transactionTime: this is the date local when start transaction
 *  @typeParam operationDate: this is a date
 *  @typeParam referenceQuestionnaire: this is a reference
 *  @typeParam extraParameters: this is a object that contain links to pse o cash payment
 *  @typeParam additionalInfo: this is a object that contain information
 */
export interface IPayload {
    state:                              string;
    paymentNetworkResponseCode:         string;
    paymentNetworkResponseErrorMessage: string;
    trazabilityCode:                    string;
    authorizationCode:                  string;
    pendingReason:                      string;
    responseCode:                       string;
    errorCode:                          string;
    responseMessage:                    string;
    transactionDate:                    string;
    transactionTime:                    string;
    operationDate:                      number;
    extraParameters:                    IGenericRecord;
}

/**
 * this interface describe the banks to pse pays
 * 
 * @typeParam id this is a id the bank
 * @typeParam description this is a bank name
 * @typeParam pseCode this is pse code
 */
export interface IBanks {
    id:          string;
    description: string;
    pseCode:     string;
}

/**
 * Payment type information from utils store
 *
 * @interface IPaymentType
 * @typeParam id: string - Unique payment type identifier
 * @typeParam value: string - Optional payment type display value
 * @typeParam name: string - Optional payment type descriptive name
 */
export interface IPaymentType {
    id: string;
    value?: string;
    name?: string;
}
