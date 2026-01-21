/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { TitleButtons } from '@constants/Buttons';
import { ModuleApp } from './GenerateId';

export type ButtonProps = (
    history: any,
    pathRight: string,
    validationPermission: IPermissionButton,
    pathLeft?: string,
    className?: string
) => IPageButtonsFooterProps;

/**
 * This interface describes that properties for button according to permissions
 *
 * @typeParam name: string - Page name
 * @typeParam moduleName: string - Module name according to page name
 */
export interface IPermissionButton {
    name: string;
    moduleName: string;
}

/**
 * buttonsFooterProps is a function that allows receive and return buttons footer props
 *
 * @param moduleId: ModuleApp - Id for recognize id owner
 * @param history: History - receive a History object for push route
 * @param onClickRight: string | (() => void) - Path or function for right button
 * @param validationPermission: IPermissionButton - Defines name and module page for validating access into app according to permissions
 * @param titleButtonRight: string - Optional prop that defines title for button
 * @param pathLeft: string - Optional prop that defines path for left button
 * @param className: string - Optional prop that defines classes for buttons
 * @param hiddenNext: boolean - Optional hidden button next
 * @returns IPageButtonsFooterProps
 */
export const buttonsFooterProps = (
    moduleId: ModuleApp,
    history: any,
    onClickRight: string | (() => void),
    validationPermission: IPermissionButton,
    titleButtonRight?: string,
    pathLeft?: string,
    className?: string,
    hiddenNext?: boolean
): IPageButtonsFooterProps => {
    return {
        moduleId,
        titleButtonLeft: TitleButtons.BACK,
        titleButtonRight: !hiddenNext && titleButtonRight ? titleButtonRight : TitleButtons.NEXT,
        onClickButtonLeft: (): void => {
            pathLeft ? history.push(pathLeft) : history.goBack();
        },
        onClickButtonRight: (): void => {
            typeof onClickRight === 'string' ? history.push(onClickRight) : onClickRight();
        },
        className,
        validationPermission,
    };
};
