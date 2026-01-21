import { Dispatch, SetStateAction } from 'react';
import { Section } from '@components/bread-crumb';
import { ChangeEvent, IFile } from '@components/input';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { IRadioButtonProps } from '@components/radiobutton';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';

export * from './WebsiteLayout';
export * from './FirstStep';
export * from './SecondStep';
export * from './ThirdStep';
export * from './ExistVisibility';
export * from './LogoStep';

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
        route: getRoute(Routes.WEBSITE_VISIBILITY),
    },
    {
        name: 'Haga visible su sitio web en internet',
        route: getRoute(Routes.WEBSITE_VISIBILITY),
    },
];

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
 * This interface defines the step props
 *
 * @typeParam websiteLocationValues: IGenericRecord - Values website location
 * @typeParam websiteLocationErrors: IGenericRecord - Errors website location
 * @typeParam onInputChangeWebsiteLocation: (e: ChangeEvent) => void - OnChange website location
 * @typeParam handleRemoveKeyword: (keyword: string) => void - Remove keywords
 * @typeParam sendDataWebsiteLocation: () => void - Send data
 * @typeParam logoButton: String - Logo button to display on the website
 * @typeParam setLogoButton: Dispatch<SetStateAction<string>> - Set state action to set logo button
 * @typeParam logo: IFile - Logo to display on the website
 * @typeParam setLogo: Dispatch<SetStateAction<IFile>> - Set state action to set logo to file
 * @typeParam errorEmptyLogo: boolean - When the logo is empty
 * @typeParam modalSuccess: boolean - Set state action to open modal success
 * @typeParam setModalSuccess: Dispatch<SetStateAction<boolean>> - Set state action to set modal success
 */
export interface IStepProps {
    websiteLocationValues: IGenericRecord;
    websiteLocationErrors: IGenericRecord;
    onInputChangeWebsiteLocation: (e: ChangeEvent) => void;
    handleRemoveKeyword: (keyword: string) => void;
    sendDataWebsiteLocation: () => void;
    logoButton: string;
    setLogoButton: Dispatch<SetStateAction<string>>;
    logo: IFile;
    setLogo: Dispatch<SetStateAction<IFile>>;
    errorEmptyLogo: boolean;
    setErrorEmptyLogo: Dispatch<SetStateAction<boolean>>;
    modalSuccess: boolean;
    setModalSuccess: Dispatch<SetStateAction<boolean>>;
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
 * Images examples width and height
 */
export const WIDTH_EXAMPLE_IMAGE = 414;
export const HEIGHT_EXAMPLE_IMAGE = 178;

/**
 * Scroll number
 */
export const SCROLL_NUMBER = 50;

/**
 * Inputs max lenght
 */
export const WEBSITE_NAME = 20;
export const DESCRIPTION = 30;

/**
 * Function that return the RadioButton props physical store
 *
 * @param { selected, setSelected }: IGenericRecord - Variables used to store the checked option
 * @returns IRadioButtonProps
 */
export const radioButtonPropsLogo = ({ selected, setSelected }: IGenericRecord): IRadioButtonProps => {
    return {
        moduleId: ModuleApp.WEBSITE,
        entities: [
            {
                name: 'SI',
                label: 'Si',
            },
            {
                name: 'NO',
                label: 'No',
            },
        ],
        selected,
        setSelected,
        classesLabel: 'text-blue',
    };
};

/**
 * Values radio logo
 */
export const RADIO_LOGO_VALUES = {
    YES: 'SI',
    NO: 'NO',
};
