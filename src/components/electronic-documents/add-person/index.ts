import { v4 as uuid } from 'uuid';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName } from '@models/Company';
import { DEFAULT_RESPONSIBILITY } from '@utils/Company';
import { DEFAULT_FISCAL_RESPONSIBILITIES } from '@pages/supplier-database';

export { AddPerson } from './AddPerson';

/**
 * This describes the props of the form for adding people
 *
 * @typeParam isClient: boolean - This indicates if a client is being added
 * @typeParam toggleModal: (clientId?: string, isNotShow?: boolean) => void - This is to toggle the modal
 * @typeParam backAddUser: () => void - Function to back electronic documents
 */
export interface IAddPersonProps {
    isClient: boolean;
    toggleModal: (clientId?: string, isNotShow?: boolean) => void;
    backAddUser?: () => void;
}

/**
 * Default person value
 */
export const DEFAULT_PERSON_DATA = { fiscal_responsibilities: [DEFAULT_RESPONSIBILITY] };

/**
 * This returns the required fields according to the chosen country
 *
 * @param isColombia: boolean - This indicates if the chosen country is Colombia
 * @returns string[]
 */
export const getRequiredFields = (isColombia: boolean): string[] => [
    ...REQUIRED_FIELDS,
    ...(isColombia ? [FieldName.DepartmentId, FieldName.CityId] : [FieldName.DepartmentName, FieldName.CityName]),
];

/**
 * This formats the person request
 *
 * @param data: IGenericRecord - Person data
 * @param utils: IGenericRecord - Data with the fields used in the form
 * @returns IGenericRecord
 */
export const formatPersonRequest = ({ document_type, ...data }: IGenericRecord, utils: IGenericRecord): IGenericRecord => {
    return{
    ...data,
    email: data?.email ?? null,
    fiscal_responsibilities: data?.fiscal_responsibilities?.map((item: IGenericRecord) =>
        item.id ? item : DEFAULT_FISCAL_RESPONSIBILITIES
    ) || [],
    is_update: false,
    tax_details_code: utils?.tax_details?.find((item: IGenericRecord) => item.value === data.tax_detail)?.code || 'ZZ',
    tax_details_name: data.tax_detail || 'No aplica',
    type_taxpayer_name: data?.type_taxpayer_name ?? utils?.type_tax_payer?.find(({ value }: IGenericRecord) => value === data?.person_type)?.value,
    type_taxpayer_id: data?.type_taxpayer_id ?? utils?.type_tax_payer?.find(({ value }: IGenericRecord) => value === data?.person_type)?.id,
    document_type: utils?.document_types?.find((item: IGenericRecord) => item.value === document_type || item.id === document_type)?.id,
    name_legal_representative: data?.name_legal_representative ?? null,
    receive_email: true,
    receive_products: false,
    electronic_biller: false,
    receive_printed_invoice: false,
}};

/**
 * This formats the supplier request
 *
 * @param data: IGenericRecord - Supplier data
 * @param utils: IGenericRecord - Data with the fields used in the form
 * @returns IGenericRecord
 */
export const formatSupplierRequest = ({ data, utils, user }: IGenericRecord): IGenericRecord => ({
    ...formatPersonRequest(data, utils),
    cellphone: data.phone,
    buy_responsible: user?.id,
    qualification_id: uuid(),
    company_id: user?.company_id,
    user_type_id: uuid(),
});

/**
 * Required fields used to greet when sending data
 */
export const REQUIRED_FIELDS = [
    FieldName.ClientName,
    FieldName.DocumentType,
    FieldName.DocumentNumber,
];

/**
 * Max length of fields form
 */
export enum InputFieldsLimits {
    ClientName = 240,
    DocumentNumber = 10,
    Direction = 240,
    PostalCode = 6,
    Phone = 10,
    Email = 240,
}
