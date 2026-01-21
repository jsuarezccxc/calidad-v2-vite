import { IGenericRecord } from '@models/GenericRecord';
import { IContactUs, IProofPurchase } from '@models/Website';
import { IPaginatorBackend } from '@components/paginator-backend/index';

export enum ActionKeys {
    SET_WEBSITE = 'SET_WEBSITE',
    SET_WEBSITE_DATA = 'SET_WEBSITE_DATA',
    SET_ERROR = 'SET_ERROR',
    SET_HAS_BLOG = 'SET_HAS_BLOG',
    SET_ROWS = 'SET_ROWS',
    SET_ACCOUNT_ACCREDITATION = 'SET_ACCOUNT_ACCREDITATION',
    SET_TEMPLATE = 'SET_TEMPLATE',
    SET_TABS = 'SET_TABS',
    SET_FIELDS_CONTACT_US = 'SET_FIELDS_CONTACT_US',
    SET_CONTACT_US = 'SET_CONTACT_US',
    SET_PROOF_PURCHASE = 'SET_PROOF_PURCHASE',
    GET_BANNER = 'GET_BANNER',
    GET_REPORTS = 'GET_REPORTS',
    GET_ANALYTICS_DATA = 'GET_ANALYTICS_DATA',
    SET_ANALYTICS_DATA = 'SET_ANALYTICS_DATA',
}

export interface ISetWebsiteData {
    type: ActionKeys.SET_WEBSITE_DATA;
    data: IGenericRecord;
}
export interface ISetWebsite {
    type: ActionKeys.SET_WEBSITE;
    website: IGenericRecord[];
}

export interface ISetHasBlog {
    type: ActionKeys.SET_HAS_BLOG;
    hasBlog: boolean;
}
export interface ISetRows {
    type: ActionKeys.SET_ROWS;
    rows: IGenericRecord[];
}
export interface ISetAccountAccreditation {
    type: ActionKeys.SET_ACCOUNT_ACCREDITATION;
    list_accreditation: IGenericRecord[];
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    error: string;
}

export interface ISetTemplate {
    type: ActionKeys.SET_TEMPLATE;
    response: number;
}

export interface ISetTabs {
    type: ActionKeys.SET_TABS;
    payload: IGenericRecord[];
}

export interface ISetFieldsContactUs {
    type: ActionKeys.SET_FIELDS_CONTACT_US;
    data: IGenericRecord[];
}

export interface ISetContactUs {
    type: ActionKeys.SET_CONTACT_US;
    data: IContactUs;
}

export interface ISetProofPurchase {
    type: ActionKeys.SET_PROOF_PURCHASE;
    data: IPaginatorBackend<IProofPurchase>;
}

export interface IGetBanner {
    type: ActionKeys.GET_BANNER;
    banner: IGenericRecord;
}

export interface IGetReports {
    type: ActionKeys.GET_REPORTS;
    reports: IGenericRecord;
}

export interface ISetAnalyticsData {
    type: ActionKeys.SET_ANALYTICS_DATA;
    payload: IGenericRecord[];
}

export type WebsiteActions =
    | ISetHasBlog
    | ISetRows
    | ISetWebsite
    | ISetWebsiteData
    | ISetAccountAccreditation
    | ISetError
    | ISetTemplate
    | ISetTabs
    | ISetFieldsContactUs
    | ISetContactUs
    | IGetBanner
    | ISetProofPurchase
    | IGetReports
    | ISetAnalyticsData;
