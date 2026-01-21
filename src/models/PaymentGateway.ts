/**
 * This interface defines structure for payment gateway data
 *
 * @typeParam payment_gateway_id: number - Payment gateway id
 * @typeParam credential: ICredentials - Credential's type
 * @typeParam date: string - Current date with unix format
 */
export interface IPaymentGateway {
    payment_gateway_id: number;
    credentials: ICredentials;
    date: string;
}

/**
 * This interface defines credentials' object
 *
 * @typeParam api_login: string - Api login's key
 * @typeParam public_key: string - Public's key
 * @typeParam account_id: string - Account's key
 * @typeParam api_key: string - Api's key
 * @typeParam merchant_id: string - Merchant's key
 */
export interface ICredentials {
    api_login: string;
    public_key: string;
    account_id: string;
    api_key: string;
    merchant_id: string;
}

/**
 * This interface define structure object data
 *
 * @typeParam pub_key: string - Public key
 * @typeParam priv_key: string - Private key
 * @typeParam event: string - Event
 * @typeParam integrity: string - Integrity
 */
export interface IWompiForm {
    pub_key: string;
    priv_key: string;
    event: string;
    integrity: string;
}

/**
 * This interface defines structure for payment gateway data
 * 
 * @typeParam id: string - Unique identifier for the payment gateway
 * @typeParam payment_gateway_id: number - Payment gateway id
 * @typeParam credentials: ICredentials - Credential's type
 * @typeParam date: string - Current date with unix format
 * @typeParam company_information_id: string - Company information id
 * @typeParam deleted_at: any - Deleted at timestamp
 * @typeParam created_at: string - Created at timestamp
 * @typeParam updated_at: string - Updated at timestamp
 * @typeParam payment_gateway: ISubPaymentGateway - Sub payment gateway object
 */
export interface IDataPaymentGateway {
    id: string;
    payment_gateway_id: number;
    credentials: ICredentials | IWompiForm;
    date: string;
    company_information_id: string;
    deleted_at: string;
    created_at: string;
    updated_at: string;
    payment_gateway: ISubPaymentGateway;
}

/**
 * This interface defines structure for credentials data
 * 
 * @typeParam api_key: string - Api key
 * @typeParam api_login: string - Api login
 * @typeParam account_id: string - Account id
 * @typeParam public_key: string - Public key
 * @typeParam merchant_id: string - Merchant id
 */
export interface ICredentials {
    api_key: string;
    api_login: string;
    account_id: string;
    public_key: string;
    merchant_id: string;
}

/**
 * This interface defines structure for sub payment gateway data
 * 
 * @typeParam id: number - Unique identifier for the payment gateway
 * @typeParam name: string - Name of the payment gateway
 */
export interface ISubPaymentGateway {
    id: number;
    name: string;
}
