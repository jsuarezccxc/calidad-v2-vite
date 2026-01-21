import { v4 as uuid } from 'uuid';
import { ICompany } from "@models/Company";

export enum PERSON_TYPE_FIELD {
    ID = 'person_type',
    NAME = 'person_type_name',
}

export enum TAXPAYER_FIELD {
    ID = 'taxpayer',
    NAME = 'taxpayer_name',
}

export enum DOCUMENT_TYPE_FIELD {
    ID = 'document_type',
    NAME = 'document_type_name',
}

export enum CIIU_FIELD {
    ID = 'ciiu',
    NAME = 'ciiu_name',
}

export const COMPANY_NAME = 'CCxC';

export const POSTAL_CODE_LENGTH = 6;

export const INITIAL_COMPANY: ICompany = {
    id: '',
    name: '',
    person_type: '',
    person_type_name: '',
    document_type: '',
    document_type_name: '',
    document_number: '',
    company_representative_name: '',
    ciius: [
        {
            code: '',
            name: '',
            number_resolution: '',
            ciiu_id: 0,
        },
    ],
    phone: '',
    country_id: '',
    country_name: '',
    department_id: '',
    department_name: '',
    city_id: '',
    city_name: '',
    postal_code: '',
    address: '',
    domain: '',
    make_web_page_type: '',
    brand_established_service: false,
    accept_company_privacy: false,
    company_privacy_acceptation_date: 0,
    created_at: false,
    updated_at: false,
    memberships: [],
    fiscal_responsibilities: [
        {
            id_fiscal: uuid(),
            id: '',
            name: '',
            code: '',
            number_resolution: '',
            vat_withholding: false,
            withholding_at_source: false,
            withholding_ica: false,
            date: new Date().toDateString(),
            isRequiredResponsibilities: false,
            withholdings: [],
        },
    ],
    whatsapp: '',
    foreign_exchange: '',
    foreign_exchange_id: '',
    foreign_exchange_code: '',
    tax_detail: '',
    tax_detail_code: '',
    logo_extension: '',
    has_a_physical_store: false,
    company_devices: [],
    step_instructions: {},
};
