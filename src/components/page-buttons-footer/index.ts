import { Background, ITooltip, LinesNumber } from '@components/button';
import { IPermissionButton } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';

export * from './PageButtonsFooter';

/**
 * This interface describe the properties from page buttons footer
 *
 * @typeParam moduleId: ModuleApp - Module name in kebab-case (e.g., "electronic-document").
 * @typeParam titleButtonLeft: string - Optional title button gray left
 * @typeParam titleButtonRight: string - Optional title button blue right
 * @typeParam titleButtonCenter: string - Optional title button center
 * @typeParam onClickButtonLeft: () => void - Optional define a function when left button is clicked
 * @typeParam onClickButtonRight: () => void - Optional define a function when right button is clicked
 * @typeParam onClickButtonCenter: () => void - Optional define a function when center button is clicked
 * @typeParam threeButtons: boolean - Optional if page has three buttons
 * @typeParam className: string - Optional prop for customize the component
 * @typeParam classButton: string - Optional prop for customize the component
 * @typeParam bgColorCenterButton: Background - Optional prop for customize center button background color
 * @typeParam bgColorLeftButton: Background - Optional prop for customize left button background color
 * @typeParam linesNumberBtnCenter: LinesNumber - Optional prop for customize number lines in button center
 * @typeParam disabledLeft: boolean - Optional prop to customize the state of the left button
 * @typeParam disabledCenter: boolean - Optional prop to customize the state of the center button
 * @typeParam disabledRight: boolean - Optional prop to customize the state of the right button
 * @typeParam validationPermission: IPermissionButton - Optional prop that defines name and module page for validating access into app according to permissions
 * @typeParam classNameBtnLeft: string - Optional prop for customize the button left
 */
export interface IPageButtonsFooterProps {
    moduleId: ModuleApp;
    titleButtonLeft?: string;
    titleButtonRight?: string;
    titleButtonCenter?: string;
    onClickButtonLeft?: () => void;
    onClickButtonRight?: () => void;
    onClickButtonCenter?: () => void;
    threeButtons?: boolean;
    className?: string;
    classButton?: string;
    bgColorCenterButton?: Background;
    bgColorLeftButton?: Background;
    linesNumberBtnCenter?: LinesNumber;
    disabledLeft?: boolean;
    disabledCenter?: boolean;
    disabledRight?: boolean;
    validationPermission?: IPermissionButton;
    tooltip?: ITooltip;
    classNameBtnCenter?: string;
    classNameBtnLeft?: string;
}

/**
 * Const with undefined value
 */
export const UNDEFINED = 'undefined';
