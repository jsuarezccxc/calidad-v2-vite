import { DEFAULT_WEBSITE } from '@constants/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { IPageWebsite, ISocialNetwork, IVideoTutorial, IWebsite } from '@models/WebsiteNode';
import { ActionKeys, WebsiteNodeActions } from './types';
import { getPageElements } from '@utils/WebsiteNode';

export interface IWebsiteState {
    websites: IWebsite[];
    selectedWebsite: IWebsite;
    activePage: IPageWebsite | null;
    videoTutorials: IVideoTutorial[];
    socialNetworks: ISocialNetwork[];
    commonProperties: IGenericRecord;
    logo: IGenericRecord;
    dataCarouselFive: { filterCategories: string[]; selectedPage: string };
}

const initialState: IWebsiteState = {
    websites: [],
    selectedWebsite: DEFAULT_WEBSITE,
    activePage: null,
    videoTutorials: [],
    socialNetworks: [],
    commonProperties: {},
    logo: {},
    dataCarouselFive: { filterCategories: [], selectedPage: '' },
};

export const reducer = (state: IWebsiteState = initialState, action: WebsiteNodeActions): IWebsiteState => {
    switch (action.type) {
        case ActionKeys.SET_WEBSITES:
            return {
                ...state,
                websites: action.payload,
            };
        case ActionKeys.SET_SELECTED_WEBSITE:
            return {
                ...state,
                selectedWebsite: action.payload,
            };
        case ActionKeys.SET_ACTIVE_PAGE:
            return {
                ...state,
                ...(action.payload && {
                    activePage: {
                        ...(action.payload ?? {}),
                        allElements: action.payload.allElements
                            ? action.payload.allElements
                            : getPageElements(action.payload, state.selectedWebsite),
                    },
                }),
            };
        case ActionKeys.SET_VIDEO_TUTORIALS:
            return {
                ...state,
                videoTutorials: action.payload,
            };
        case ActionKeys.SET_SOCIAL_NETWORKS:
            return {
                ...state,
                socialNetworks: action.payload,
            };
        case ActionKeys.SET_COMMON_PROPERTIES:
            return {
                ...state,
                commonProperties: action.payload,
            };
        case ActionKeys.SET_FILTER_CATEGORIES:
            return {
                ...state,
                dataCarouselFive: action.payload,
            };

        case ActionKeys.SET_LOGO:
            return {
                ...state,
                logo: action.payload,
            };
        default:
            return state;
    }
};
