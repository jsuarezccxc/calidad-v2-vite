import { Section } from '@components/bread-crumb';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import { getRoute, getRouteName } from '@utils/Paths';


export { default } from './WebsiteSocial';

/**
 * This interface describes the properties of the props
 *
 * @typeParam title: string - title component FrameVideos
 * @typeParam content: string - content component FrameVideos
 * @typeParam url: string - url component FrameVideos
 */
export interface IDataFrame {
    title: string;
    content: string;
    url: string;
}

/**
 * This interface describes the properties of the props
 *
 * @typeParam show: boolean - action for open modal
 * @typeParam showModal: () => void - function open modal
 * @typeParam dataModal: IDataFrame - data props component ModalVideo
 * @typeParam backModal:  () => void - function close modal
 * @typeParam size:  number - data size screen
 */
export interface IModalVideo {
    show: boolean;
    showModal: () => void;
    dataModal: IDataFrame;
    backModal: () => void;
    size: number;
}

/**
 * This type describe the reference to the input elements
 */
export type RefMap = {
    [key: string]: HTMLInputElement | null;
};

/**
 * This contains the modal types
 */
export enum Modal {
    Success = 'SUCCESS',
    NotSaved = 'NOT_SAVED',
}

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_MENU),
    },
    {
        name: 'Cómo promocionar y optimizar el sitio web',
        route: getRoute(Routes.WEBSITE_SOCIAL),
    },
    {
        name: 'Agregue las redes sociales de su empresa en el sitio web',
        route: getRoute(Routes.WEBSITE_SOCIAL),
    },
];

/**
 * Default social networks
 */
export const INITIAL_SOCIAL = [
    {
        network_type: 'Facebook',
        network_account: '',
        errorMessage: '',
    },
    {
        network_type: 'Instagram',
        network_account: '',
        errorMessage: '',
    },
    {
        network_type: 'X',
        network_account: '',
        errorMessage: '',
    },
];

/**
 * Function that returns the button props
 *
 * @param history: History - Hook for change page
 * @param saveChanges: () => void - Function for save changes
 * @param backAction: () => void - Function for the back action
 * @returns IPageButtonsFooterProps
 */
export const buttonProps = (history: History, nextRoute: () => void, backAction: () => void): IPageButtonsFooterProps => ({
    ...buttonsFooterProps(ModuleApp.WEBSITE, history, nextRoute, {
        name: getRouteName(Routes.WEBSITE_EDITOR),
        moduleName: getRouteName(Routes.WEBSITE_MENU),
    }),
    threeButtons: false,
    onClickButtonLeft: backAction,
});

/**
 * This constant is used to get countries from utils
 */
export const PREFIX_COUNTRIES = ['countries'];
export const INITIAL_VALUE_PREFIX = {
    key: '46',
    value: '+57',
    code: '/static/media/CO.384a7e2c.svg',
};
export const SYMBOL_PREFIX = '+';
export const CODE_COLOMBIA = 'CO';

/**
 * This constant represents the link prefix for sharing links via WhatsApp
 */
export const WHATSAPP_URL_BASE = 'https://wa.me/';

/**
 * Ignore social networks
 */
export const IGNORE_SOCIAL = ['SNAPCHAT', 'MESSENGER'];

/**
 * Options max length phone
 */
export const MaxLengthPhone = {
    Colombia: 10,
    OtherCountries: 12,
};

/**
 * Whatsapp url that precedes the number
 */
export const WHATSAPP_URL = 'https://wa.me/+57';

/**
 * Texts add input social network
 */
export const TEXT_ADD_SOCIAL_NETWORKS = {
    ADD: '+ Agregar red social',
    ADD_OTHER: '+ Agregar otra red social',
};

/**
 * this constants
 */
export const CONSTANTS = {
    sizeResponsive: 750,
    two: 2,
    sizeLg: 1279,
    allVideos: '469dd7a6-713c-3de3-a043-20f4af3117f5',
    allVideosName: 'Todos los videos',
    videoBanks: 'video_banks',
    allModules: 'Todos los módulos',
    videoTutorial: 'Video tutoriales',
};
