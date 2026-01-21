/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '@redux/rootReducer';
import { getCatalog } from '@redux/product-catalog/actions';
import { getActiveMembership } from '@redux/membership/actions';
import { apiPostInvoice } from '@api/invoice';
import { apiGetUtils, apiPostInventory } from '@api/inventory';
import { urls } from '@api/urls';
import { apiPostNotification } from '@api/notification';
import {
    apiDeleteWebsite,
    apiGetWebsiteAuth,
    apiPutWebsite,
    apiPostWebsite,
    apiGetWebsite,
    apiInitialData,
    apiWebsiteFile,
} from '@api/website';
import { apiDomain } from '@api/domain';
import { FetchRequest, FetchRequestFormData, ServiceType } from '@models/Request';
import { IDates } from '@models/Date';
import { IContactUs, IProofPurchase } from '@models/Website';
import { IGenericRecord } from '@models/GenericRecord';
import { isCorrectResponse } from '@utils/Response';
import { getUserData } from '@utils/User';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { PER_PAGE_RANGE } from '@constants/UtilsConstants';
import { VOUCHER_PURCHASE } from '@constants/ElectronicInvoice';
import { INVOICE_TYPE } from '@constants/InvoiceType';
import { IFile } from '@components/input';
import { IPaginatorBackend } from '@components/paginator-backend/index';
import {
    ActionKeys,
    ISetHasBlog,
    ISetRows,
    WebsiteActions,
    ISetWebsite,
    ISetWebsiteData,
    ISetAccountAccreditation,
    ISetError,
    ISetTemplate,
    ISetTabs,
    ISetFieldsContactUs,
    ISetContactUs,
    ISetProofPurchase,
    IGetBanner,
    IGetReports,
    ISetAnalyticsData,
} from './types';

export const setError = (error: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    error,
});

export const setWebsiteData = (website: IGenericRecord[]): ISetWebsite => ({
    type: ActionKeys.SET_WEBSITE,
    website,
});

export const setHasBlog = (hasBlog: boolean): ISetHasBlog => ({
    type: ActionKeys.SET_HAS_BLOG,
    hasBlog,
});

export const setRows = (rows: IGenericRecord[]): ISetRows => ({
    type: ActionKeys.SET_ROWS,
    rows,
});

export const setWebsite = (data: IGenericRecord): ISetWebsiteData => ({
    type: ActionKeys.SET_WEBSITE_DATA,
    data,
});

export const setListAccreditation = (list_accreditation: IGenericRecord[]): ISetAccountAccreditation => ({
    type: ActionKeys.SET_ACCOUNT_ACCREDITATION,
    list_accreditation,
});

export const setTemplate = (response: number): ISetTemplate => ({
    type: ActionKeys.SET_TEMPLATE,
    response,
});

export const setTabs = (tabs: IGenericRecord[]): ISetTabs => ({
    type: ActionKeys.SET_TABS,
    payload: tabs,
});

export const setFieldsContactUs = (data: IGenericRecord[]): ISetFieldsContactUs => ({
    type: ActionKeys.SET_FIELDS_CONTACT_US,
    data,
});

export const setContactUs = (data: IContactUs): ISetContactUs => ({
    type: ActionKeys.SET_CONTACT_US,
    data,
});

export const setProofPurchaseList = (data: IPaginatorBackend<IProofPurchase>): ISetProofPurchase => ({
    type: ActionKeys.SET_PROOF_PURCHASE,
    data,
});

export const getBannerWebsite = (banner: IGenericRecord): IGetBanner => ({
    type: ActionKeys.GET_BANNER,
    banner,
});

export const getReportsWebsite = (reports: IGenericRecord): IGetReports => ({
    type: ActionKeys.GET_REPORTS,
    reports,
});

export const setAnalyticsData = (data: IGenericRecord[]): ISetAnalyticsData => ({
    type: ActionKeys.SET_ANALYTICS_DATA,
    payload: data,
});

export const uploadInitialData = (data: IFile): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const formData = new FormData();
            const urlUploadInitialData = urls.website.uploadInitialData;
            const request = new FetchRequest(urlUploadInitialData, formData);
            data.forEach((eachFile: IGenericRecord) => formData.append(eachFile.name, eachFile.value));
            await apiInitialData(request);
            dispatch(getWebsiteData());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postWebsite = (): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const { company_id, company_name } = getUserData();
            const urlInitConfig = urls.website.initConfig;
            const request = new FetchRequest(urlInitConfig, { company_id, company_name });
            const response: any = await apiPostWebsite(request);
            if (SUCCESS_RESPONSE.includes(response.statusCode)) {
                dispatch(setWebsiteData(response));
                return response.statusCode;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postHasBlog = (hasBlog: boolean): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const urlBlog = urls.website.blog;
            const request = new FetchRequest(urlBlog, { has_blog: hasBlog });
            const { statusCode }: any = await apiPostWebsite(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setHasBlog(hasBlog));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getRows = (): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlRowTypes = urls.website.rowTypes;
            const request = new FetchRequest(urlRowTypes);
            const { data }: any = await apiGetWebsite(request);
            dispatch(setRows(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postBanner = (includesBanner: boolean): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlBanner = urls.website.banner;
            const request = new FetchRequest(urlBanner, { value_prop: includesBanner });
            const { data }: any = await apiPostWebsite(request);
            dispatch(getBannerWebsite(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getBanner = (): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlBanner = urls.website.banner;
            const request = new FetchRequest(urlBanner);
            const { data }: any = await apiGetWebsite(request);
            dispatch(getBannerWebsite(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getWebsiteData = (): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const { company_id, company_name } = getUserData();
            const urlInitConfig = urls.website.initConfig;
            const request = new FetchRequest(urlInitConfig, {
                company_name,
                company_id,
            });
            const data: any = await apiGetWebsite(request);
            await dispatch(setWebsite(data));
            await dispatch(getActiveMembership());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postUpdateDiscount = (listRef: IGenericRecord): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.website.discount, listRef);
            const { statusCode }: any = await apiPostInventory(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setTemplate(statusCode));
                dispatch(getCatalog());
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getListAccreditation = (start_date: number): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.invoice.timeState, {
                start_date,
            });
            const { statusCode, data }: any = await apiPostInvoice(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setListAccreditation(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postCreateTimeState = (
    invoice_id: string,
    case_option: string
): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>, getState): Promise<void> => {
        try {
            const { list_accreditation } = getState().website;
            const request = new FetchRequest(urls.invoice.createTime, {
                id: invoice_id,
                case: case_option,
            });

            const { statusCode, data }: any = await apiPostInvoice(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                const updateInvoice = data.invoice;
                const newTimeState = data.time_state;
                const newData = list_accreditation.map(item => {
                    if (item.id === updateInvoice.id && typeof data?.time_state !== 'string') {
                        item.time_state = newTimeState;
                        return { ...item };
                    }
                    return item;
                });
                dispatch(setListAccreditation(newData));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const sendEmailAccountAccreditation = (
    request_data: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.notification.voucher, request_data);
            const { statusCode }: any = await apiPostNotification(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postSubdomain = (
    domain_name: string,
    verify: boolean,
    deleteSubdomain?: boolean
): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                verify ? urls.domain.verify : deleteSubdomain ? urls.domain.delete : urls.domain.create,
                { domain_name }
            );

            const { statusCode, message }: any = await apiDomain(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                return message;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postTemplateImage = (image: File): ThunkAction<Promise<IGenericRecord>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<IGenericRecord> => {
        try {
            const urlPostImage = urls.website.postImage;
            const dataRequest = new FetchRequestFormData(image, ServiceType.WEBSITE_NODE);
            const request = new FetchRequest(urlPostImage, dataRequest.formData);
            const { data, errors }: any = await apiWebsiteFile(request);

            return {
                url: data?.url,
                error: errors?.file[0] || '',
            };
        } catch (error) {
            dispatch(setError(String(error)));
            return { url: '', error: String(error) };
        }
    };
};

export const postTabs = (tabs: IGenericRecord[]): ThunkAction<Promise<boolean>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<boolean> => {
        try {
            const urlUpdateTabName = urls.website.updateTabName;
            const request = new FetchRequest(urlUpdateTabName, tabs);
            const { data }: any = await apiPostWebsite(request);
            await dispatch(getWebsiteData());
            return !!data;
        } catch (error) {
            return false;
        }
    };
};

export const createSection = (pageId: string): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlPostSection = urls.website.postSection;
            const request = new FetchRequest(urlPostSection, { page_id: pageId });
            await apiPostWebsite(request);
            await dispatch(getWebsiteData());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteSection = (sectionId: string): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlDeleteSection = urls.website.deleteSection(sectionId);
            const request = new FetchRequest(urlDeleteSection);
            await apiDeleteWebsite(request);
            await dispatch(getWebsiteData());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getFieldsContactUs = (): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.utils.getFormFields);

            const { statusCode, data }: any = await apiGetUtils(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(setFieldsContactUs(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postUpdateContactUs = (
    data: IGenericRecord,
    websiteId = ''
): ThunkAction<Promise<boolean>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<boolean> => {
        try {
            const urlPostContactUs = urls.website.postContactUs;
            const urlPutcontactUs = urls.website.putContactUs(websiteId);
            const request = new FetchRequest(urlPostContactUs, data);
            const putRequest = new FetchRequest(urlPutcontactUs, data);

            const { statusCode }: any = websiteId ? await apiPutWebsite(putRequest) : await apiPostWebsite(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(getWebsiteData());
                dispatch(setTemplate(statusCode));
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const getContactUs = (websiteId: string): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const urlGetContactUs = urls.website.getContactUs(websiteId);
            const request = new FetchRequest(urlGetContactUs);
            const { statusCode, data }: any = await apiGetWebsiteAuth(request);
            if (isCorrectResponse(statusCode)) {
                dispatch(setContactUs(data.form));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getVirtualStoreVouchersList = (
    dates: IDates,
    isList = false,
    search = '',
    invoiceType = [INVOICE_TYPE?.INVOICE, VOUCHER_PURCHASE]
): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(
                isList
                    ? `${urls.invoice.getListVoucherPurchase}?=per_page=${PER_PAGE_RANGE}`
                    : search
                    ? `${urls.invoice.getListVoucherPurchase}?=search=${search}`
                    : urls.invoice.getListVoucherPurchase,
                { ...dates, invoice_type: invoiceType }
            );
            const { statusCode, data }: any = await apiPostInvoice(request);
            if (SUCCESS_RESPONSE.includes(statusCode)) {
                dispatch(setProofPurchaseList(data));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postPage = (pages: IGenericRecord[]): ThunkAction<Promise<IGenericRecord[]>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<IGenericRecord[]> => {
        try {
            const { company_id } = getUserData();
            const urlPostPage = urls.website.postPage;
            const request = new FetchRequest(urlPostPage, {
                company_id,
                pages,
            });
            const { data }: any = await apiPostWebsite(request);
            return data?.pages ?? [];
        } catch (error) {
            dispatch(setError(String(error)));
            return [];
        }
    };
};

export const deletePage = (pageId: string): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlDeletePage = urls.website.deletePage(pageId);
            const request = new FetchRequest(urlDeletePage);
            const { data }: any = await apiDeleteWebsite(request);
            if (data) await dispatch(getWebsiteData());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postWhatsApp = (data: IGenericRecord): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const urlPostWhatsapp = urls.website.postWhatsApp;
            const request = new FetchRequest(urlPostWhatsapp, data);
            const { data: response }: any = await apiPostWebsite(request);
            if (response) await dispatch(postWebsite());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updateActiveUnitValues = (
    request_data: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const urlUpdateShowValues = urls.website.updateShowValues;
            const request = new FetchRequest(urlUpdateShowValues, request_data);
            const { statusCode }: any = await apiPutWebsite(request);
            return statusCode;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAnalyticsData = (
    dates: IGenericRecord | IGenericRecord[],
    domain: string
): ThunkAction<Promise<void>, RootState, unknown, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteActions>): Promise<void> => {
        try {
            const urlGetAnalyticsReport = urls.website.getAnalyticsReport(domain);
            const request = new FetchRequest(urlGetAnalyticsReport, dates);
            const { data, statusCode }: any = await apiPostWebsite(request);
            if (isCorrectResponse(statusCode)) return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAnalyticalReports = (data: IGenericRecord): ThunkAction<Promise<void>, RootState, null, WebsiteActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteActions>): Promise<void> => {
        try {
            const request = new FetchRequest(urls.website.reports, data);
            const { data: response }: any = await apiPostInvoice(request);
            if (response) await dispatch(getReportsWebsite(response));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
