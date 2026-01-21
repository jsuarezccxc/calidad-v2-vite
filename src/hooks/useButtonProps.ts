import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { LANGUAGE_KEY } from '@constants/Translate';
import { Routes } from '@constants/Paths';
import { getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';

/**
 * This interface describes the button props
 *
 * @typeParam moduleId: ModuleApp - Id for recognize module container
 * @typeParam permissions: { name: Routes; moduleName: number } -  Defines name and module page for validating access into app according to permissions
 * @typeParam rightText: string - Optional prop with the text of the right button
 * @typeParam rightPath: string - Optional prop with the right path
 * @typeParam leftPath: string - Optional prop with the left path
 * @typeParam onClickButtonRight: () => void - Optional prop with the button right action
 * @typeParam threeButtons: boolean - Optional prop that indicates if there are three buttons
 * @typeParam onClickButtonCenter: () => void - Optional prop with the button center action
 *
 */
export interface IButtonProps {
    moduleId: ModuleApp;
    permissions: { name: Routes; moduleName: Routes };
    rightText?: string;
    rightPath?: string;
    leftPath?: string;
    onClickButtonRight?: () => void;
    threeButtons?: boolean;
    onClickButtonCenter?: () => void;
}

/**
 * Custom hook that returns a function to get the button props
 *
 * @returns { getButtonProps: (buttonProps: IButtonProps) => IPageButtonsFooterProps }
 */
const useButtonProps = (): { getButtonProps: (buttonProps: IButtonProps) => IPageButtonsFooterProps } => {
    const history = useHistory();
    const [translate] = useTranslation(LANGUAGE_KEY);

    const getButtonProps = ({
        moduleId,
        rightText = '',
        leftPath = '',
        rightPath = '',
        onClickButtonRight = (): void => {},
        permissions,
        threeButtons = false,
        onClickButtonCenter = (): void => {},
    }: IButtonProps): IPageButtonsFooterProps => ({
        moduleId,
        onClickButtonLeft: (): void => (leftPath ? history.push(leftPath) : history.goBack()),
        onClickButtonRight: (): void => (rightPath ? history.push(rightPath) : onClickButtonRight()),
        titleButtonLeft: translate('button.back'),
        titleButtonRight: rightText || translate('button.next'),
        validationPermission: {
            name: getRouteName(permissions.name),
            moduleName: getRouteName(permissions.moduleName),
        },
        threeButtons,
        ...(threeButtons && { titleButtonCenter: translate('button.save'), onClickButtonCenter }),
    });

    return {
        getButtonProps,
    };
};

export default useButtonProps;
