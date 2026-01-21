/* eslint-disable no-case-declarations */
import { IGenericRecord } from '@models/GenericRecord';
import { IContactUs, IProofPurchase } from '@models/Website';
import { IPaginatorBackend } from '@components/paginator-backend/index';
import { paginationDataFormatDynamic } from '@constants/PaginationBack';
import { ActionKeys, WebsiteActions } from './types';
export interface IWebsiteState {
    website: IGenericRecord;
    hasBlog: boolean;
    list_accreditation: IGenericRecord[];
    error: string;
    rows: IGenericRecord[];
    ids: IGenericRecord;
    homeSections: IGenericRecord[];
    aboutUsSections: IGenericRecord[];
    contactUsSections: IGenericRecord[];
    pages: IGenericRecord[];
    statusTemplate: number;
    bucket: string;
    title: string;
    colors: { primary: string; secondary: string };
    tabs: IGenericRecord[];
    fieldsContactUs: IGenericRecord[];
    dataContactUsFields: IContactUs;
    virtualStoreVouchersList: IPaginatorBackend<IProofPurchase>;
    styles: IGenericRecord;
    banner: IGenericRecord;
    reports: IGenericRecord;
    analyticsData: IGenericRecord[];
}

const initialState: IWebsiteState = {
    website: [],
    hasBlog: true,
    rows: [],
    ids: {},
    homeSections: [],
    aboutUsSections: [],
    contactUsSections: [],
    pages: [],
    list_accreditation: [],
    error: '',
    statusTemplate: 0,
    bucket: '',
    title: '',
    colors: { primary: '', secondary: '' },
    tabs: [],
    fieldsContactUs: [],
    dataContactUsFields: {
        title: '',
        description: '',
        fields: [],
    },
    virtualStoreVouchersList: paginationDataFormatDynamic<IProofPurchase>(),
    styles: { font: '', button: '', primaryColor: '', secondaryColor: '' },
    banner: { id: '', name: '', value: false, is_active: false, company_id: '', created_at: '', updated_at: '' },
    reports: {},
    analyticsData: [],
};

export const reducer = (state: IWebsiteState = initialState, action: WebsiteActions): IWebsiteState => {
    switch (action.type) {
        case ActionKeys.SET_HAS_BLOG:
            return {
                ...state,
                hasBlog: action.hasBlog,
            };
        case ActionKeys.SET_ROWS:
            return {
                ...state,
                rows: action.rows,
            };
        case ActionKeys.SET_WEBSITE_DATA:
            return {
                ...state,
            };
        case ActionKeys.SET_ACCOUNT_ACCREDITATION:
            return {
                ...state,
                list_accreditation: action.list_accreditation,
            };
        case ActionKeys.SET_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case ActionKeys.SET_WEBSITE:
            return {
                ...state,
                website: action.website,
            };
        case ActionKeys.SET_TEMPLATE:
            return {
                ...state,
                statusTemplate: action.response,
            };
        case ActionKeys.SET_TABS:
            return {
                ...state,
                tabs: action.payload,
            };
        case ActionKeys.SET_FIELDS_CONTACT_US:
            return {
                ...state,
                fieldsContactUs: action.data,
            };
        case ActionKeys.SET_CONTACT_US:
            return {
                ...state,
                dataContactUsFields: action.data,
            };
        case ActionKeys.SET_PROOF_PURCHASE:
            return {
                ...state,
                virtualStoreVouchersList: action.data,
            };
        case ActionKeys.GET_BANNER:
            return {
                ...state,
                banner: action.banner,
            };
        case ActionKeys.GET_REPORTS:
            return {
                ...state,
                reports: action.reports,
            };
        case ActionKeys.SET_ANALYTICS_DATA:
            return {
                ...state,
                analyticsData: action.payload,
            };
        default:
            return state;
    }
};
