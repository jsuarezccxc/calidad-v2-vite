import { IFormData } from '@pages/quotes-report/components/quote-generate';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { IFiscalResponsibility } from '@models/ElectronicNote';

/**
 * Quote form data extended with products for payload building
 * Extends IFormData with additional runtime properties needed for quote creation
 *
 * @interface IQuoteFormDataWithProducts
 * @typeParam products: IInvoiceDetails[] - Array of products included in quote
 * @typeParam client_id: string | null - Selected client unique identifier
 * @typeParam authorize_personal_data: string - Authorization for personal data ('true' or 'false')
 * @typeParam selected_option_id: string - Selected option identifier
 * @typeParam not_information_customer: boolean - Flag for incomplete client information
 * @typeParam clientInfo: object - Client detailed information object
 * @typeParam address: string | null - Fallback client address
 * @typeParam city_id: string | null - City identifier
 * @typeParam city_name: string | null - City name
 * @typeParam country_id: string | null - Country identifier
 * @typeParam country_name: string | null - Country name
 * @typeParam department_id: string | null - Department/state identifier
 * @typeParam department_name: string | null - Department/state name
 * @typeParam document_number: string | null - Client document number
 * @typeParam document_number_purchasing_manager: string | null - Purchasing manager document
 * @typeParam document_number_sales_manager: string | null - Sales manager document
 * @typeParam document_type_id: string | null - Document type identifier
 * @typeParam document_type_purchasing_manager: string | null - Purchasing manager document type
 * @typeParam document_type_sales_manager: string | null - Sales manager document type
 * @typeParam email: string | null - Client email address
 * @typeParam employee_id: string | null - Employee identifier
 * @typeParam fiscal_responsibilities: Array<IFiscalResponsibility | string> - Fiscal responsibilities
 * @typeParam foreign_exchange_id: string | null - Foreign exchange identifier
 * @typeParam foreign_exchange_name: string | null - Foreign exchange name
 * @typeParam foreign_exchange_rate: number - Exchange rate value
 * @typeParam date: string - Quote date
 * @typeParam date_limit: string - Quote expiration date
 * @typeParam name: string | null - Client name
 * @typeParam note: string | null - Public quote notes
 * @typeParam observations: string | null - Alternative field for public notes
 * @typeParam internal_notes: string | null - Internal staff notes
 * @typeParam lang: string - Document language (es/en)
 * @typeParam number: string | null - Quote number
 * @typeParam purchase_order_number: string | null - Purchase order number
 * @typeParam operation_type_id: string | null - Operation type identifier
 * @typeParam payment_method_id: string | null - Payment method identifier
 * @typeParam payment_type_id: string | null - Payment type identifier
 * @typeParam payment_type_name: string | null - Payment type name
 * @typeParam paymentConfig: object - Payment configuration object
 * @typeParam collection_days: number | null - Collection days count
 * @typeParam days_collection_type: string - Collection days type
 * @typeParam phone: string | null - Client phone number
 * @typeParam postal_code: string | null - Client postal code
 * @typeParam purchasing_manager: string | null - Purchasing manager name
 * @typeParam qualification_id: string | null - Qualification identifier
 * @typeParam sales_manager: string | null - Sales manager name
 * @typeParam send_address: string | null - Shipping address
 * @typeParam sending_charge: number - Shipping charge amount
 * @typeParam state_purchase_order: string | null - Purchase order state
 * @typeParam time_issue: string - Quote issue time
 * @typeParam type_taxpayer_id: string | null - Taxpayer type identifier
 * @typeParam type_taxpayer_name: string | null - Taxpayer type name
 */
export interface IQuoteFormDataWithProducts extends Omit<Partial<IFormData>, 'clientInfo' | 'paymentConfig' | 'documentConfig'> {
    documentConfig?: {
        authorizePersonalData?: boolean;
        language?: string;
    };
    products?: IInvoiceDetails[];
    client_id?: string | null;
    authorize_personal_data?: string;
    selected_option_id?: string;
    not_information_customer?: boolean;
    clientInfo?: {
        address?: string;
        city_id?: string;
        city_name?: string;
        country_id?: string;
        country_name?: string;
        department_id?: string;
        department_name?: string;
        documentNumber?: string;
        documentType?: string;
        documentTypeId?: string;
        email?: string;
        fiscal_responsibilities?: Array<IFiscalResponsibility | string>;
        name?: string;
        phone?: string;
        postal_code?: string;
        taxpayerType?: string;
        taxpayerTypeName?: string;
    };
    address?: string | null;
    city_id?: string | null;
    city_name?: string | null;
    country_id?: string | null;
    country_name?: string | null;
    department_id?: string | null;
    department_name?: string | null;
    document_number?: string | null;
    document_number_purchasing_manager?: string | null;
    document_number_sales_manager?: string | null;
    document_type_id?: string | null;
    document_type_purchasing_manager?: string | null;
    document_type_sales_manager?: string | null;
    email?: string | null;
    employee_id?: string | null;
    fiscal_responsibilities?: Array<IFiscalResponsibility | string>;
    foreign_exchange_id?: string | null;
    foreign_exchange_name?: string | null;
    foreign_exchange_rate?: number;
    date?: string;
    date_limit?: string;
    name?: string | null;
    note?: string | null;
    observations?: string | null;
    internal_notes?: string | null;
    lang?: string;
    number?: string | null;
    purchase_order_number?: string | null;
    operation_type_id?: string | null;
    payment_method_id?: string | null;
    payment_type_id?: string | null;
    payment_type_name?: string | null;
    paymentConfig?: {
        method?: string;
        means?: string;
        meansName?: string;
        foreignExchangeId?: string;
        foreignExchangeName?: string;
    };
    collection_days?: number | null;
    days_collection_type?: string;
    phone?: string | null;
    postal_code?: string | null;
    purchasing_manager?: string | null;
    qualification_id?: string | null;
    sales_manager?: string | null;
    send_address?: string | null;
    sending_charge?: number;
    state_purchase_order?: string | null;
    time_issue?: string;
    type_taxpayer_id?: string | null;
    type_taxpayer_name?: string | null;
}
