import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { Button, Background } from '@components/button';
import usePermissions from '@hooks/usePermissions';
import { TitleButtons } from '@constants/Buttons';
import { IPageButtonsFooterProps } from '.';
import './PageButtonsFooter.scss';

/**
 * Page Button Footer is a component to show two or three buttons align right
 * @param props
 * @returns Element with buttons footer
 */
export const PageButtonsFooter: React.FC<IPageButtonsFooterProps> = props => {
    const { loader } = useSelector((state: RootState) => state.loader);

    const { validationPermissionsMenu, dispatchAuthorizationModal } = usePermissions();

    const {
        className = '',
        classButton = '',
        titleButtonLeft = '',
        titleButtonRight = '',
        titleButtonCenter = TitleButtons.SAVE,
        onClickButtonLeft,
        onClickButtonRight,
        onClickButtonCenter,
        threeButtons = false,
        bgColorCenterButton = 'blue',
        bgColorLeftButton = 'white',
        linesNumberBtnCenter = 1,
        disabledLeft = false,
        disabledCenter = false,
        disabledRight = false,
        validationPermission,
        tooltip,
        classNameBtnCenter = '',
        classNameBtnLeft = '',
        moduleId = '',
    } = props;

    /**
     * When page has three buttons and right button is different to gray light color
     * @returns Background
     */
    const bgColorRightButton = (): Background => {
        if (threeButtons) {
            if (bgColorCenterButton !== 'blue') {
                return 'blue';
            }
            return 'white';
        }
        return 'blue';
    };

    return (
        <div
            id={generateId({
                module: ModuleApp.BUTTONS,
                submodule: `${moduleId}-page-buttons-container`,
                action: ActionElementType.CONTAINER,
                elementType: ElementType.CRD,
            })}
            className={`right-0 text-right bottom-8 xs:mb-7 mt-7 xs:flex xs:justify-center ${className}`}
        >
            <Button
                id={generateId({
                    module: ModuleApp.BUTTONS,
                    submodule: `${moduleId}-left-button`,
                    action: ActionElementType.CUSTOM_ACTION,
                    elementType: ElementType.BTN,
                })}
                background={bgColorLeftButton}
                text={titleButtonLeft}
                onClick={onClickButtonLeft}
                disabled={disabledLeft}
                classes={classButton ? classButton : `xs:w-22.3 shadow-templateDesign ${classNameBtnLeft}`}
            />
            {threeButtons && (
                <Button
                    id={generateId({
                        module: ModuleApp.BUTTONS,
                        submodule: `${moduleId}-center-button`,
                        action: ActionElementType.CUSTOM_ACTION,
                        elementType: ElementType.BTN,
                    })}
                    background={bgColorCenterButton}
                    text={titleButtonCenter}
                    linesNumber={linesNumberBtnCenter}
                    onClick={onClickButtonCenter}
                    classes={`ml-5.5 xs:w-22.3 shadow-templateDesign ${classNameBtnCenter}`}
                    disabled={disabledCenter || loader}
                    tooltip={tooltip}
                />
            )}
            {titleButtonRight && (
                <Button
                    id={generateId({
                        module: ModuleApp.BUTTONS,
                        submodule: `${moduleId}-right-button`,
                        action: ActionElementType.CUSTOM_ACTION,
                        elementType: ElementType.BTN,
                    })}
                    background={bgColorRightButton()}
                    text={titleButtonRight}
                    onClick={
                        validationPermissionsMenu(validationPermission?.name || '', validationPermission?.moduleName || '')
                            ? onClickButtonRight
                            : dispatchAuthorizationModal
                    }
                    classes={`ml-4.5 ${classButton} xs:w-22.3 shadow-templateDesign`}
                    disabled={disabledRight || loader}
                />
            )}
        </div>
    );
};
