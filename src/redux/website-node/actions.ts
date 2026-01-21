/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { urls } from '@api/urls';
import { apiGetWebsite, apiPostWebsite, apiPutWebsite, apiDeleteWebsite, apiWebsiteFile } from '@api/website';
import { IPageWebsite, IWebsite, IVideoTutorial, ISocialNetwork, CommonProperty } from '@models/WebsiteNode';
import { FolderType, FetchRequest, FetchRequestFormData, ServiceType } from '@models/Request';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { isCorrectResponse } from '@utils/Response';
import { getUserData } from '@utils/User';
import { addPageToWebsite } from '@utils/WebsiteNode';
import { lengthEqualToZero } from '@utils/Length';
import {
    ActionKeys,
    ISetError,
    ISetSelectedWebsite,
    ISetActivePage,
    ISetWebsites,
    ISetVideoTutorials,
    WebsiteNodeActions,
    ISetSocialNetworks,
    ISetCommonProperties,
    ISetLogo,
    ISetFilterCategories,
} from './types';
import { apiDeletePrefix, apiGetPrefix } from '@api/prefix';

export const setWebsites = (payload: IWebsite[]): ISetWebsites => ({
    type: ActionKeys.SET_WEBSITES,
    payload,
});

export const setSelectedWebsite = (payload: IWebsite): ISetSelectedWebsite => ({
    type: ActionKeys.SET_SELECTED_WEBSITE,
    payload,
});

export const setActivePage = (payload: IPageWebsite | null): ISetActivePage => ({
    type: ActionKeys.SET_ACTIVE_PAGE,
    payload,
});

export const setError = (payload: string): ISetError => ({
    type: ActionKeys.SET_ERROR,
    payload,
});

export const setVideoTutorials = (videoTutorials: IVideoTutorial[]): ISetVideoTutorials => ({
    type: ActionKeys.SET_VIDEO_TUTORIALS,
    payload: videoTutorials,
});

export const setSocialNetworks = (socialNetworks: ISocialNetwork[]): ISetSocialNetworks => ({
    type: ActionKeys.SET_SOCIAL_NETWORKS,
    payload: socialNetworks,
});

export const setCommonProperties = (properties: IGenericRecord): ISetCommonProperties => ({
    type: ActionKeys.SET_COMMON_PROPERTIES,
    payload: properties,
});

export const setLogo = (logo: IGenericRecord): ISetLogo => ({
    type: ActionKeys.SET_LOGO,
    payload: logo,
});

export const setFilterCategories = (categories: { filterCategories: string[]; selectedPage: string }): ISetFilterCategories => ({
    type: ActionKeys.SET_FILTER_CATEGORIES,
    payload: categories,
});

export const getVideoTutorials = (): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlGetVideoTutorials = urls.websiteNode.getVideoTutorials;
            const request = new FetchRequest(urlGetVideoTutorials);
            const { data: response }: any = await apiGetWebsite(request);
            dispatch(setVideoTutorials(response));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getWebsites = (): ThunkAction<Promise<IGenericRecord[]>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<IGenericRecord[]> => {
        try {
            const urlGetWebsites = urls.websiteNode.getWebsites;
            const request = new FetchRequest(urlGetWebsites, {});
            const { data }: any = await apiGetWebsite(request);
            if (data) dispatch(setWebsites(data));
            if (lengthEqualToZero(data)) await dispatch(postNewWebsite());
            return data ?? [];
        } catch (error) {
            dispatch(setError(String(error)));
            return [];
        }
    };
};

export const getWebsite = (websiteId: string): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlGetWebsites = urls.websiteNode.getWebsiteById(websiteId);
            const request = new FetchRequest(urlGetWebsites, {});
            const { data }: any = await apiGetWebsite(request);
            if (data) {
                await dispatch(setSelectedWebsite(data?.website));
                return data;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getPageWebsite = (websiteId: string): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlGetWebSiteById = urls.websiteNode.getWebsiteById(websiteId);
            const request = new FetchRequest(urlGetWebSiteById, {});
            const { data }: any = await apiGetWebsite(request);
            if (data) {
                return data?.website?.pages;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const createOrUpdateElement = (
    dataElement: IGenericRecord,
    newPage?: boolean
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlCreateOrUpdateElement = urls.websiteNode.createOrUpdateElement;
            const request = new FetchRequest(urlCreateOrUpdateElement, dataElement);
            const { data }: any = await apiPostWebsite(request);
            if (data?.website) {
                dispatch(setSelectedWebsite(data.website));
                if (newPage) dispatch(setActivePage(data.website?.pages.at(-1)));
                return data;
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteElementById = (elementId = ''): ThunkAction<Promise<boolean>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>, getState): Promise<boolean> => {
        try {
            const urlDeleteWebsiteNode = urls.websiteNode.specificElement(elementId);
            const request = new FetchRequest(urlDeleteWebsiteNode);
            const { statusCode }: any = await apiDeleteWebsite(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(getWebsite(getState().websiteNode.selectedWebsite.id));
                return true;
            }
            return false;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const deletePage = (
    pageId: string,
    websiteId: string
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlDeletePage = urls.websiteNode.deletePage(pageId);
            const request = new FetchRequest(urlDeletePage);
            const { statusCode }: any = await apiDeleteWebsite(request);
            if (isCorrectResponse(statusCode)) {
                await dispatch(getWebsite(websiteId));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const updatePages = (pages: IGenericRecord[]): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    const pagesData = {
        pages,
    };
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlUpdatePages = urls.websiteNode.updatePages;
            const request = new FetchRequest(urlUpdatePages, pagesData);
            const data: any = await apiPutWebsite(request);
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const uploadImage = (image: File): ThunkAction<Promise<string>, RootState, unknown, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, WebsiteNodeActions>): Promise<string> => {
        try {
            const urlPostImage = urls.website.postImage;
            const dataRequest = new FetchRequestFormData(image, ServiceType.WEBSITE_NODE, FolderType.CAROUSEL);
            const request = new FetchRequest(urlPostImage, dataRequest.formData);

            const { data }: any = await apiWebsiteFile(request);
            return data?.url ?? '';
        } catch (error) {
            dispatch(setError(String(error)));
            return '';
        }
    };
};

export const postNewWebsite = (): ThunkAction<Promise<string>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<string> => {
        try {
            const urlPostNewWebsite = urls.websiteNode.postNewWebsite;
            const request = new FetchRequest(urlPostNewWebsite, {});
            const data: any = await apiPostWebsite(request);
            if (data) {
                await Promise.all([
                    dispatch(getWebsites()),
                    dispatch(createOrUpdateElement(addPageToWebsite(data?.data?.newWebsite))),
                ]);
                return data?.data?.newWebsite.id;
            }
            return '';
        } catch (error) {
            dispatch(setError(String(error)));
            return '';
        }
    };
};

export const putUpdateWebsiteById = (
    websiteId: string,
    dataWebsite: IGenericRecord
): ThunkAction<Promise<string>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<string> => {
        try {
            const urlPutWebsiteById = urls.websiteNode.getWebsiteById(websiteId);
            const request = new FetchRequest(urlPutWebsiteById, dataWebsite);
            const data: any = await apiPutWebsite(request);
            if (isCorrectResponse(data?.statusCode)) await dispatch(getWebsite(websiteId));
            return '';
        } catch (error) {
            dispatch(setError(String(error)));
            return '';
        }
    };
};

export const putPublishWebsite = (
    websiteId: string
): ThunkAction<Promise<IGenericRecord[]>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<IGenericRecord[]> => {
        try {
            const urlPublishWebsite = urls.websiteNode.publishWebsite;
            const request = new FetchRequest(urlPublishWebsite, { website_id: websiteId });
            const data: any = await apiPutWebsite(request);
            if (data) {
                await Promise.all([dispatch(getWebsites()), dispatch(getWebsite(websiteId))]);
                return data.data;
            }
            return [];
        } catch (error) {
            dispatch(setError(String(error)));
            return [];
        }
    };
};

export const deleteWebsite = (websiteId: string): ThunkAction<Promise<boolean>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<boolean> => {
        try {
            const urlDeleteWebsite = urls.websiteNode.getWebsiteById(websiteId);
            const request = new FetchRequest(urlDeleteWebsite, {});
            const { statusCode }: any = await apiDeleteWebsite(request);
            await dispatch(getWebsites());
            return isCorrectResponse(statusCode);
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const deleteSocialNetworkById = (
    socialNetwork: ISocialNetwork
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlDeleteSocialNetwork = urls.websiteNode.deleteSocialNetworkById(socialNetwork?.id || '');
            const request = new FetchRequest(urlDeleteSocialNetwork);
            await apiDeleteWebsite(request);
            dispatch(getAllSocialNetworks());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getAllSocialNetworks = (): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const urlGetSocialNetworks = urls.websiteNode.getSocialNetworks;
            const request = new FetchRequest(urlGetSocialNetworks);
            const { data: response }: any = await apiGetWebsite(request);
            if (response) dispatch(setSocialNetworks(response));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const getCommonProperties = (
    properties: CommonProperty[]
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const response: any = await Promise.all(
                properties.map(property => {
                    const urlCommonProperty = urls.websiteNode.commonProperty(property);
                    const request = new FetchRequest(urlCommonProperty);
                    return apiGetWebsite(request);
                })
            ).then(res => res);

            const commonProperties: IGenericRecord = {};

            properties.forEach((property, idx) => {
                commonProperties[property] = response[idx]?.data?.value;
            });
            dispatch(setCommonProperties(commonProperties));
        } catch (error) {
            dispatch(setCommonProperties({}));
            dispatch(setError(String(error)));
        }
    };
};

export const postCommonProperties = (
    data: { property: CommonProperty; value: IGenericRecord }[]
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            await Promise.all(
                data.map(({ property, value }) => {
                    const urlPostCommonProperty = urls.websiteNode.commonProperty(property);
                    const request = new FetchRequest(urlPostCommonProperty, { value_prop: value });
                    return apiPostWebsite(request);
                })
            );

            await dispatch(getCommonProperties(data.map(({ property }) => property)));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const postSocialNetworks = (
    socialNetworks: ISocialNetwork[]
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();

            const dataSocialNetworks = socialNetworks.map(socialNetwork => ({
                ...socialNetwork,
                company_id,
            }));
            const urlPostSocialNetwork = urls.websiteNode.postSocialNetworks;
            const request = new FetchRequest(urlPostSocialNetwork, { social_networks: dataSocialNetworks });
            await apiPostWebsite(request);
            await dispatch(getAllSocialNetworks());
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteCommonProperty = (
    property: CommonProperty
): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>, getState): Promise<void> => {
        try {
            const urlDeleteCommonProperty = urls.websiteNode.commonProperty(property);
            const websiteRequest = new FetchRequest(urlDeleteCommonProperty, {});
            const { statusCode }: any = await apiDeleteWebsite(websiteRequest);
            if (isCorrectResponse(statusCode)) {
                const { commonProperties } = getState().websiteNode;
                dispatch(setCommonProperties({ ...commonProperties, [property]: '' }));
            }
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const upsertCommonProperty = (
    property: CommonProperty,
    value: string
): ThunkAction<Promise<any>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<any> => {
        try {
            const urlUpsertCommonProperty = urls.websiteNode.commonProperty(property);
            const websiteRequest = new FetchRequest(urlUpsertCommonProperty, {
                value_prop: value,
            });
            const { data }: any = await apiPostWebsite(websiteRequest);
            return data;
        } catch (error) {
            dispatch(setError(String(error)));
            return false;
        }
    };
};

export const getFileCompanyAction = (): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.prefix.getLogo(company_id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await apiGetPrefix(request);
            dispatch(setLogo(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};

export const deleteFileLogo = (): ThunkAction<Promise<void>, RootState, null, WebsiteNodeActions> => {
    return async (dispatch: ThunkDispatch<RootState, null, WebsiteNodeActions>): Promise<void> => {
        try {
            const { company_id } = getUserData();
            const request = new FetchRequest(urls.prefix.deleteLogo(company_id));
            const { data }: any = await apiDeletePrefix(request);
            dispatch(setLogo(data));
        } catch (error) {
            dispatch(setError(String(error)));
        }
    };
};
