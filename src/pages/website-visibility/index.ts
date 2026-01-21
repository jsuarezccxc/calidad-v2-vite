
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { IconsNames } from '@components/icon';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { IFile } from '@components/input';
import { getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { buttonsFooterProps } from '@utils/Button';
import { ZERO as ZERO_VALUE } from '@constants/Numbers';

export { default } from './WebsiteVisibility';

/**
 * This interface describes visibility step props
 *
 * @typeParam title: string - Title step
 * @typeParam desc: string - Description step
 * @typeParam iconName: string - Icon name
 * @typeParam active: boolean - Active step
 */
export interface IVisibilityStep {
    title: string;
    desc: string;
    iconName: IconsNames;
    active: boolean;
}

/**
 * List of step
 */
export const visibilitySteps = (commonProperties: IGenericRecord, file?: IFile): IVisibilityStep[] => {
    const { title, description, keywords } = commonProperties;
    const existLogo = !!file?.[ZERO_VALUE]?.files?.length;

    return [
        {
            title: 'Paso 1: Agregue el nombre de su negocio o marca',
            desc: 'Identifique su negocio en internet.',
            iconName: 'visibilityStepOne',
            active: !!title,
        },
        {
            title: 'Paso 2: Agregue la descripción del sitio web',
            desc: 'Resuma el contenido del sitio web para sus clientes.',
            iconName: 'visibilityStepTwo',
            active: !!description,
        },
        {
            title: 'Paso 3: Agregue las palabras claves',
            desc: 'Describa en palabras su negocio para encontrarlo en internet.',
            iconName: 'visibilityStepThree',
            active: !!keywords,
        },
        {
            title: 'Paso 4: Agregue el logo de su negocio',
            desc: 'Si su negocio tiene logo suba el archivo.',
            iconName: 'visibilityStepFour',
            active: !!existLogo,
        },
    ];
};

/**
 * This interface describes that properties the modal type state
 *
 * @typeParam open: boolean - Flag open modal
 * @typeParam text: React.ReactElement | string - Text or element to render modal
 * @typeParam modalHeight: string - Modal height to type
 */
export interface IModalType {
    open: boolean;
    text: React.ReactElement | string;
    modalHeight: string;
}

/**
 * Function that returns the button props
 *
 * @param history: History - Hook for change page
 * @param saveChanges: () => void - Function for save changes
 * @param backAction: () => void - Function for the back action
 * @returns IPageButtonsFooterProps
 */
export const buttonProps = (history: History, saveChanges: () => void, backAction: () => void): IPageButtonsFooterProps => ({
    ...buttonsFooterProps(ModuleApp.WEBSITE, history, saveChanges, {
        name: getRouteName(Routes.WEBSITE_EDITOR),
        moduleName: getRouteName(Routes.WEBSITE_MENU),
    }),
    threeButtons: false,
    onClickButtonLeft: backAction,
});

/**
 * This interface defines step  properties
 *
 * @typeParam title: string - Title step
 * @typeParam content: string - Content step
 * @typeParam description: string - Description step
 * @typeParam step: string - Step
 * @typeParam instruction: string - Instruction step
 * @typeParam component: JSX.Element - Component step
 * @typeParam classWrapperStep: string - Classes wrapper step
 */
export interface IStep {
    title: string;
    content: string;
    description: string;
    step: string;
    instruction: string;
    component: JSX.Element;
    classWrapperStep: string;
}

/**
 * Max current step
 */
export const MAX_STEP = 5;
export const STEP_FOUR = '4.1';
export const FIVE = 5;

/**
 * Footer option to select
 */
export enum FooterOption {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
}

/**
 * This const is position default
 */
export const defaultPosition = -1;
