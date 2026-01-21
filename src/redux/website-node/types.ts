import { IGenericRecord } from '@models/GenericRecord';
import { IPageWebsite, IWebsite, IVideoTutorial, ISocialNetwork } from '@models/WebsiteNode';

export enum ActionKeys {
    SET_WEBSITES = 'SET_WEBSITES',
    SET_ERROR = 'SET_ERROR',
    SET_SELECTED_WEBSITE = 'SET_SELECTED_WEBSITE',
    SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE',
    SET_LIST_WEBSITE = 'SET_LIST_WEBSITE',
    SET_VIDEO_TUTORIALS = 'SET_VIDEO_TUTORIALS',
    SET_SOCIAL_NETWORKS = 'SET_SOCIAL_NETWORKS',
    SET_COMMON_PROPERTIES = 'SET_COMMON_PROPERTIES',
    SET_LOGO = 'SET_LOGO',
    SET_FILTER_CATEGORIES = 'SET_FILTER_CATEGORIES',
}

export interface ISetWebsites {
    type: ActionKeys.SET_WEBSITES;
    payload: IWebsite[];
}

export interface ISetSelectedWebsite {
    type: ActionKeys.SET_SELECTED_WEBSITE;
    payload: IWebsite;
}

export interface ISetActivePage {
    type: ActionKeys.SET_ACTIVE_PAGE;
    payload: IPageWebsite | null;
}

export interface ISetError {
    type: ActionKeys.SET_ERROR;
    payload: string;
}

export interface ISetVideoTutorials {
    type: ActionKeys.SET_VIDEO_TUTORIALS;
    payload: IVideoTutorial[];
}

export interface ISetSocialNetworks {
    type: ActionKeys.SET_SOCIAL_NETWORKS;
    payload: ISocialNetwork[];
}

export interface ISetCommonProperties {
    type: ActionKeys.SET_COMMON_PROPERTIES;
    payload: IGenericRecord;
}

export interface ISetLogo {
    type: ActionKeys.SET_LOGO;
    payload: IGenericRecord;
}

export interface ISetFilterCategories {
    type: ActionKeys.SET_FILTER_CATEGORIES;
    payload:  { filterCategories: string[]; selectedPage: string };
}

export type WebsiteNodeActions =
    | ISetWebsites
    | ISetError
    | ISetSelectedWebsite
    | ISetActivePage
    | ISetVideoTutorials
    | ISetSocialNetworks
    | ISetCommonProperties
    | ISetLogo
    |ISetFilterCategories;
