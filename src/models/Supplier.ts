import { IGenericRecord } from './GenericRecord';

/**
 * This interface is supplier
 *
 * @typeParam id: string - Prop to create supplier
 * @typeParam name: string - Prop to create supplier
 * @typeParam buy_responsible: string - Prop to create supplier
 * @typeParam fiscal_responsibilities: IFiscalResponsibility[] - Prop to create supplier
 * @typeParam taxpayer: string - Prop to create supplier
 * @typeParam type_taxpayer_id: string - Prop to create supplier
 * @typeParam type_taxpayer_name: string - Prop to create supplier
 * @typeParam qualification_id: string - Prop to create supplier
 * @typeParam company_id: string - Prop to create supplier
 * @typeParam user_type_id: string - Prop to create supplier
 * @typeParam document_type: string - Prop to create supplier
 * @typeParam document_name:  string - Prop to create supplier
 * @typeParam document_number: string - Prop to create supplier
 * @typeParam postal_code: string - Prop to create supplier
 * @typeParam address: string - Prop to create supplier
 * @typeParam email: string - Prop to create supplier
 * @typeParam phone: string - Prop to create supplier
 * @typeParam cellphone: string - Prop to create supplier
 * @typeParam country_id: string - Prop to create supplier
 * @typeParam country_name: string - Prop to create supplier
 * @typeParam department_id: string - Prop to create supplier
 * @typeParam department_name: string - Prop to create supplier
 * @typeParam city_id: string - Prop to create supplier
 * @typeParam city_name: string - Prop to create supplier
 * @typeParam tax_details_code: string - Prop to create supplier
 * @typeParam tax_details_id: string - Prop to create supplier
 * @typeParam tax_details_name: string - Prop to create supplier
 * @typeParam person_id?: string - Optional prop to create supplier
 */
export interface ISupplier {
    id: string;
    name: string;
    buy_responsible: string;
    fiscal_responsibilities: IFiscalResponsibility[];
    taxpayer: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    qualification_id: string;
    company_id: string;
    user_type_id: string;
    document_type: string;
    document_name: string;
    document_number: string;
    postal_code: string;
    address: string;
    email: string;
    phone: string;
    cellphone: string;
    country_id: string;
    country_name: string;
    department_id: string;
    department_name: string;
    city_id: string;
    city_name: string;
    tax_details_code: string;
    tax_details_id: string;
    tax_details_name: string;
    person_id?: string;
}

/**
 * This interface is fiscal responsibility
 *
 * @typeParam id_fiscal: string - Fiscal ID
 * @typeParam id: string - Fiscal ID back
 * @typeParam name: string - Fiscal name
 * @typeParam withholdings: IGenericRecord[] - withholdings by responsabilities
 * @typeParam date?: Date - Optional date by responsability
 * @typeParam number_resolution?: string - Optional number resolution
 */
export interface IFiscalResponsibility {
    id_fiscal: string;
    id: string;
    name: string;
    withholdings: IGenericRecord[];
    date?: Date;
    number_resolution?: string;
}

/**
 * This interface is selected supplier
 *
 * @typeParam id: string - Supplier Id
 * @typeParam name: string - Supplier name
 * @typeParam personId: string - Person Id
 */
export interface ISelectedSupplier {
    id: string;
    name: string;
    personId: string;
}

/**
 * This interface is supplier exist
 *
 * @typeParam document_type: string - Prop to create supplier
 * @typeParam document_number: string - Prop to create supplier
 * @typeParam email: string - Prop to create supplier
 */
export interface ISupplierExist {
    document_type?: string;
    document_number?: string;
    email?: string;
}

/**
 * This interface is supplier exist response
 *
 * @typeParam is_created: boolean - Prop to create supplier
 * @typeParam supplier: ISupplierResponse - Prop to create supplier
 */
export interface ISupplierExistResponse {
    is_created: boolean;
    supplier?: ISupplierResponse;
}

/**
 * This interface is supplier response
 *
 * @typeParam id: string - Prop to create supplier
 * @typeParam name: string - Prop to create supplier
 * @typeParam buy_responsible: string - Prop to create supplier
 * @typeParam person_id: string - Prop to create supplier
 * @typeParam qualification_id: string - Prop to create supplier
 * @typeParam created_at: string - Prop to create supplier
 * @typeParam updated_at: string - Prop to create supplier
 * @typeParam tax_details_code: string - Prop to create supplier
 * @typeParam tax_details_name: string - Prop to create supplier
 * @typeParam deleted_at: string - Prop to create supplier
 * @typeParam person: IPerson - Prop to create supplier
 */
export interface ISupplierResponse {
    id: string;
    name: string;
    buy_responsible: string;
    person_id: string;
    qualification_id: string;
    created_at: string;
    updated_at: string;
    tax_details_code: string;
    tax_details_name: string;
    deleted_at: string;
    person: IPerson;
}

/**
 * This interface is fiscal responsibilities response
 */
export interface IFiscalResponsibilitiesResponse extends Omit<IFiscalResponsibility, 'id_fiscal'> {}

/**
 * This interface is person
 *
 * @typeParam id: string - Prop to create supplier
 * @typeParam company_id: string - Prop to create supplier
 * @typeParam document_type: string - Prop to create supplier
 * @typeParam country_id: number - Prop to create supplier
 * @typeParam country_name: string - Prop to create supplier
 * @typeParam department_id: number - Prop to create supplier
 * @typeParam department_name: string - Prop to create supplier
 * @typeParam city_id: number - Prop to create supplier
 * @typeParam city_name: string - Prop to create supplier
 * @typeParam postal_code: string - Prop to create supplier
 * @typeParam document_number: string - Prop to create supplier
 * @typeParam address: string - Prop to create supplier
 * @typeParam indications_address: string - Prop to create supplier
 * @typeParam email: string - Prop to create supplier
 * @typeParam phone: string - Prop to create supplier
 * @typeParam cellphone: string - Prop to create supplier
 * @typeParam type_taxpayer_id: string - Prop to create supplier
 * @typeParam type_taxpayer_name: string - Prop to create supplier
 * @typeParam company_name: string - Prop to create supplier
 * @typeParam created_at: string - Prop to create supplier
 * @typeParam updated_at: string - Prop to create supplier
 * @typeParam electronic_biller: boolean - Prop to create supplier
 * @typeParam fiscal_responsibilities: IFiscalResponsibilitiesResponse - Prop to create supplier
 */
export interface IPerson {
    id: string;
    company_id: string;
    document_type: string;
    country_id: number;
    country_name: string;
    department_id: number;
    department_name: string;
    city_id: number;
    city_name: string;
    postal_code: string;
    document_number: string;
    address: string;
    indications_address: string;
    email: string;
    phone: string;
    cellphone: string;
    type_taxpayer_id: string;
    type_taxpayer_name: string;
    company_name: string;
    created_at: string;
    updated_at: string;
    electronic_biller: boolean;
    fiscal_responsibilities: IFiscalResponsibilitiesResponse[];
}
