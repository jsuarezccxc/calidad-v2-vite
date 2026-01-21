/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react';

//--- Components ---//
import { IOptionSelect } from '@components/input';

//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
import { IProductValues } from '@models/InvoiceProduct';
import { ICompany } from '@models/Company';

//--- Utils ---//
import { lengthGreaterThanZero } from '@utils/Length';

/**
 * This interface describes which properties are required for Form
 *
 * @typeParam isNote: boolean - Required prop for type of Form
 * @typeParam isEdit: boolean - Required prop for type of Create or edit Note
 * @typeParam typeNote: string - Optional prop for type of Note "Credit" or "Debit"
 * @typeParam suppliers: IGenericRecord[] - Optional prop array of suppliers data
 * @typeParam documents: IGenericRecord[] - Optional prop array of documents data
 * @typeParam invoiceValue: IProductValues - Required prop invoice information
 * @typeParam modalSupplier: boolean - Required prop show modal Supplier
 * @typeParam requiredFields: IPropsRequired - Required Object with Required fields
 * @typeParam taxpayerSelected: string - Required taxpayerSelected
 * @typeParam getDynamicRequest: IGenericRecord - Required Contents information for some selects with metadata
 * @typeParam validateFiscalRepeated: boolean - Required flag for validation
 * @typeParam requiredTextFiscalRepeated: string[] - Required array string for requiredTextFiscalRepeated
 * @typeParam fiscalResponsibilitiesOptions: IGenericRecord[] - Required array with fiscalResponsibilitiesOptions
 * @typeParam validateFiscalResponsibilities: boolean - Required flag for validation
 * @typeParam setInvoiceValue: (e: IProductValues) => void - Required Set state function for InvoiceValue
 * @typeParam setRequiredFields: (e: IPropsRequired) => void - Required Set state function for RequiredFields
 * @typeParam handleModalSupplier: (e: boolean) => void - Required Set state show modal Supplier
 * @typeParam setTaxpayerSelected: (e: string) => void - Required Set state taxpayerSelected
 * @typeParam setValidateSupplier: (e: ISupplierValues) => void - Required Set state validateSupplier
 * @typeParam validateRepeatFiscal: () => boolean - Required function for validateRepeatFiscal
 * @typeParam fieldsDisabled: string[] - Required array of Fields Disabled
 * @typeParam optionsPrefix: IGenericRecord[] - Required array of prefix options
 * @typeParam information: ICompany | null - Required Company information
 * @typeParam validateForm: () => boolean - Function for validate fields
 * @typeParam errorsFromBack?: IGenericRecord - Optional errors from backend
 * @typeParam setErrorsFromBack?: Dispatch<SetStateAction<IGenericRecord>> - Optional set errors from backend
 * */
export interface IFormInvoicePurchaseProps {
    isNote: boolean;
    isEdit: boolean;
    typeNote?: string;
    suppliers?: IGenericRecord[];
    documents?: IGenericRecord[];
    invoiceValue: IProductValues;
    modalSupplier: boolean;
    requiredFields: IPropsRequired;
    taxpayerSelected: string;
    getDynamicRequest: IGenericRecord | undefined;
    validateFiscalRepeated: boolean;
    requiredTextFiscalRepeated: string[];
    fiscalResponsibilitiesOptions: IGenericRecord[];
    validateFiscalResponsibilities: boolean;
    setInvoiceValue: (e: IProductValues) => void;
    setRequiredFields: (e: IPropsRequired) => void;
    handleModalSupplier: (e: boolean) => void;
    setTaxpayerSelected: (e: string) => void;
    setValidateSupplier: (e: ISupplierValues) => void;
    validateRepeatFiscal: () => boolean;
    fieldsDisabled: string[];
    optionsPrefix: IGenericRecord[];
    information: ICompany | null;
    validateForm: () => boolean;
    errorsFromBack?: IGenericRecord;
    setErrorsFromBack?: Dispatch<SetStateAction<IGenericRecord>>;
}

/**
 * This interface describes which properties are required for product
 *
 * @typeParam prefix_note: boolean - Required prop for prefix_note product
 * @typeParam prefix: boolean - Required prop for prefix product
 * @typeParam prefix_id: boolean - Required prop for prefix_id product
 * @typeParam number: boolean - Optional prop for number product
 * @typeParam supplier_invoice_number: boolean - Optional prop for supplier invoice number
 * @typeParam foreign_exchange_id: boolean - Required prop for foreign exchange id product
 * @typeParam foreign_exchange_rate: boolean - Required prop for foreign exchange rate product
 * @typeParam date_limit: boolean - Required prop for date limit product
 * @typeParam name: boolean - Required prop for name product
 * @typeParam document_name: boolean => void - Required prop for document name product
 * @typeParam document_number: boolean - Required prop for document number product
 * @typeParam email: boolean - Required prop for email product
 * @typeParam address: boolean - Required prop for address product
 * @typeParam country_id: boolean - Required prop for country id product
 * @typeParam country_name: boolean - Required prop for country name product
 * @typeParam department_id: boolean - Required prop for department id product
 * @typeParam department_name: boolean - Required prop for department name product
 * @typeParam city_id: boolean - Required prop for city id product
 * @typeParam city_name: boolean - Required prop for city name product
 * @typeParam postal_code: boolean - Required prop for postal code product
 * @typeParam phone: boolean - Required prop for phone product
 * @typeParam days_payment: boolean - Required prop for days payment product
 * @typeParam payment_type_id: boolean - Required prop for payment type id product
 * @typeParam payment_method_id: boolean - Required prop for payment method id product
 * @typeParam type_taxpayer_name: boolean - Required prop for type taxpayer name product
 * @typeParam fiscal_responsibilities: boolean - Required prop for fiscal responsabilities product
 * @typeParam taxes_details: boolean - Required prop for taxes details product
 * @typeParam number_purchase_order: boolean - Required prop for number purchase order product
 */
export interface IPropsRequired {
    prefix_note: boolean;
    prefix: boolean;
    prefix_id?: boolean;
    number?: boolean;
    supplier_invoice_number?: boolean;
    foreign_exchange_id: boolean;
    foreign_exchange_rate: boolean;
    date_limit?: boolean;
    name: boolean;
    document_name: boolean;
    document_number: boolean;
    email: boolean;
    address: boolean;
    country_id: boolean;
    country_name: boolean;
    department_id: boolean;
    department_name: boolean;
    city_id: boolean;
    city_name: boolean;
    postal_code: boolean;
    phone: boolean;
    days_payment: boolean;
    payment_type_id: boolean;
    payment_method_id: boolean;
    type_taxpayer_name: boolean;
    fiscal_responsibilities: boolean;
    taxes_details: boolean;
    number_purchase_order: boolean;
}

/**
 * Const for inputs
 */
export const INPUT_NAME = {
    NAME_SUPPLIER: 'name',
    EMAIL_PROVIDER: 'email',
    TYPE_TAXPAYER: 'type_taxpayer_name',
    PAYMENT_TYPE_ID: 'payment_type_id',
    FOREIGN_EXCHANGE_ID: 'foreign_exchange_id',
    UNIT_COST: 'unit_cost',
    DEPARTMENT_ID: 'department_id',
    COUNTRY_ID: 'country_id',
    CITY_ID: 'city_id',
    COUNTED: 'Contado',
    EXCHANGE_ID: '0e2346cd-2d32-3383-a762-203a9c013b02',
    QUANTITY: 'quantity',
    PREFIX: 'prefix',
    DOCUMENT_NAME: 'document_name',
};

/**
 * Data for prefix
 */
export const optionsPrefix = [{ key: '1', name: 'FC', id: 'f37cf560-7e9c-43e4-86bc-d7d5085f76e6' }];

/**
 * This interface describes the properties for supplier
 *
 * @typeParam id: string - Id supplier
 * @typeParam name: string - Name supplier
 * @typeParam email: string - Email supplier
 * @typeParam document_name: string - Document name supplier
 * @typeParam document_type: string - Document type supplier
 * @typeParam document_number: string - Document number supplier
 * @typeParam address: string - Address supplier
 * @typeParam country_id: string | number - Country id supplier
 * @typeParam country_name: string - Country name supplier
 * @typeParam department_id: string | number => void - Department id supplier
 * @typeParam department_name: string - Department name supplier
 * @typeParam city_id: number - City id supplier
 * @typeParam city_name: string - City name supplier
 * @typeParam postal_code: string - Postal code supplier
 * @typeParam phone: string - Phone supplier
 * @typeParam type_taxpayer_id: number - Type taxpayer id supplier
 * @typeParam type_taxpayer_name: string - Type taxpayer name supplier
 * @typeParam fiscal_responsibilities: IGenericRecord[] - Fiscal responsabilities supplier
 * @typeParam tax_details_code: number - Tax details code supplier
 * @typeParam tax_details_name: string - Tax details name supplier
 */
export interface ISupplierValues {
    id: string;
    name: string;
    email: string;
    document_name: string;
    document_type: string;
    document_number: string;
    address: string;
    person_id: string;
    country_id: number | string;
    country_name: string;
    department_id: number | string;
    department_name: string;
    city_id: number;
    city_name: string;
    postal_code: string;
    phone: string;
    type_taxpayer_id: number;
    type_taxpayer_name: string;
    fiscal_responsibilities: IGenericRecord[];
    tax_details_code: number;
    tax_details_name: string;
}

/**
 * Function that return an array with tax
 *
 * @param array: IOptionSelect[] - array
 * @returns IOptionSelect[]
 */
export const formatTaxDetails = (array: IOptionSelect[]): IOptionSelect[] => {
    return lengthGreaterThanZero(array)
        ? array.map(tax => ({
              ...tax,
              value: `${tax?.code} - ${tax?.value}`,
          }))
        : [];
};

/**
 * Function that return document type
 *
 * @param documentTypes: IGenericRecord[] - document types
 * @param id: string | number - id
 * @returns string value
 */
export const getDocumentTypeName = (documentTypes: IGenericRecord[], id: string | number): string =>
    documentTypes?.find((documentType: IGenericRecord) => documentType.id == id || documentType?.warehouses_id == id)?.name || '';

/**
 * Function that return the suppliers with fiscal responsiblilities
 *
 * @param suppliers: IGenericRecord[] - suppliers
 * @returns string value
 */
export const buildOptionsSuppliers = (suppliers: IGenericRecord[]): IOptionSelect[] => {
    if (lengthGreaterThanZero(suppliers)) {
        return suppliers.flatMap(supplier =>
            lengthGreaterThanZero(supplier?.person?.fiscal_responsibilities)
                ? {
                      value: supplier.name,
                      key: supplier.person_id,
                      id: supplier.document_number,
                      parentKey: supplier?.person?.type_taxpayer_name,
                  }
                : []
        );
    }
    return [];
};

/**
 * Const for max length inputs
 */
export const MAXIMUM_LENGTH = {
    POSTAL_CODE: 6,
    FOREIGN_RATE: 10,
    CUFE: 96,
    CUDE: 96,
    NUMBER_PURCHASE: 96,
    SALES_MANAGER: 96,
    DOCUMENT_MANAGER: 10,
    DOCUMENT_NUMBER: 10,
    EMAIL: 60,
    ADDRESS: 96,
    PHONE: 10,
    PURCHASING_MANAGER: 96,
    DOCUMENT_NUMBER_MANAGER: 10,
    DAYS_PAYMENT: 3,
    NOTE: 96,
};

/**
 * This interface is time props
 * 
 * @typeParam eventClass?: string - Optional prop class to active event
 * @typeParam label?: string - Optional prop label input
 * @typeParam disabled?: boolean - Optional prop if disabled input
 * @typeParam timeValue: IProductValues | any - Value form
 * @typeParam setTimeValue: (e: IProductValues) => void - Set action state
 * @typeParam timePicker: boolean - Show timepicker
 * @typeParam setTimePicker: React.Dispatch<SetStateAction<boolean>> - Set action state time
 * @typeParam className?: string - Optional prop custom style class
 * @typeParam tooltipInfo?: boolean - Optional prop show tooltip
 * @typeParam titleTooltip?: string - Optional prop title tooltip
 * @typeParam descTooltip?: string | JSX.Element - Optional prop description tooltip
 */
export interface IInputSelectTimeProps {
    eventClass?: string;
    label?: string;
    disabled?: boolean;
    timeValue: IProductValues | any;
    setTimeValue: (e: IProductValues) => void;
    timePicker: boolean;
    setTimePicker: React.Dispatch<SetStateAction<boolean>>;
    className?: string;
    tooltipInfo?: boolean;
    titleTooltip?: string;
    descTooltip?: string | JSX.Element;
}

/**
 * Name fields Form invoice Pruchase
 */
export const fieldsNamePurchaseCufe = 'cufe';
