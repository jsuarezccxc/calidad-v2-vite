import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
export * from './IndividualModules';

/**
 * Text colors
 */
export enum TextColor {
    BLUE = 'blue',
    PURPLE = 'purple',
}

/**
 * This interface describes what properties the Module component receives
 * @typeParam title: string - Text title from information component
 * @typeParam descriptionModule: IDescriptionModule[] - Description text from information component
 * @typeParam isTitleIcon: boolean - Optional If icon information
 * @typeParam onClickIcon: onClickIcon:  (item: string, description:string) => void - Optional click handler for the icon
 * @typeParam descriptionModal: string - Optional description modal
 */
export interface IModule {
    title: string;
    descriptionModule: IDescriptionModule[];
    isTitleIcon?: boolean;
    onClickIcon?: (item: string, description: string) => void;
    descriptionModal?: string;
}

/**
 * This interface describes what properties the description module
 * @typeParam description: string - description from information
 * @typeParam descriptionIcon: boolean - Optional  If icon information
 * @typeParam separator: boolean - Optional If  has horizontal line
 * @typeParam textPositionCenter: boolean - Optional If postion text center
 * @typeParam textColor: TextColor - Optional text color
 */
export interface IDescriptionModule {
    description: string;
    descriptionIcon?: boolean;
    separator?: boolean;
    textPositionCenter?: boolean;
    textColor?: TextColor;
}

/**
 * This interface describes what properties the Module component
 * @typeParam titleModule: string - Text title from module
 * @typeParam dataModule: IModule[] - data component module
 * @typeParam onClickIcon: onClickIcon: (item:string, description: string) => void - Optional click handler for the icon
 * @typeParam sizeScreen: number - Require size screem
 */
export interface IIndividualModule {
    titleModule: string;
    dataModule: IModule[];
    onClickIcon?: (item: string, description: string) => void;
    sizeScreen: number;
}

/**
 * This is constants
 */
export const constantModule = {
    sizeScreen: 768,
    titleModalWeb: WEBSITE_DESIGN_AND_ADMINISTRATION,
};
