import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { clearSession, setAuthorizationModal } from '@redux/session/actions';
import { changePrincipalLiActive } from '@redux/menu/actions';
import arrow from '@assets/images/sidebar/down-arrow.svg';
import arrowWhite from '@assets/images/sidebar/arrow-white.svg';
import arrowBlue from '@assets/images/sidebar/arrow-blue.svg';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { Modal } from '@components/modal';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { getSidebarIcon } from '@utils/ImageLoader';
import { lengthGreaterThanZero } from '@utils/Length';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { ALWAYS_ACCESS_MODULES_NAME, ALWAYS_ACCESS_WITH_MODULE_NAME } from '@utils/Paths';
import { PATHS, Routes } from '@constants/Paths';
import { MODULE, ZERO, idModalTabElement } from '..';
import { Item, Options } from '.';
import './Tab.scss';

export const Tab: React.FC<IGenericRecord> = ({
    tab = { module: '', items: [], options: [] },
    selectTab,
    activeTab,
    largeText = false,
    tab: { soon },
    showModal,
    setShowModal,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {
        company: { information, activeMemberships },
    } = useSelector(({ company }: RootState) => ({ company }));
    const { module, items, icon, route, options } = tab;
    const [showOptions, setShowOptions] = useState(false);
    const { validationPermissionsMenu } = usePermissions();
    const isActiveModule = activeTab.module === module;

    useEffect(() => {
        dispatch(changePrincipalLiActive(module));
    }, [isActiveModule]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return (): void => {
            setShowOptions(false);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!activeTab?.module) {
            setShowOptions(false);
        }
    }, [activeTab]);

    const isTechnicalSheet = module === PATHS[Routes.DATABASE_MENU].title;
    const isPurchasingProcessSheet = module === PATHS[Routes.PURCHASING_PROCESS].title;

    const handleClickOutside = (event: IGenericRecord): void => {
        const modalTabElement = document.getElementById(idModalTabElement);
        if (event.target === modalTabElement) {
            setShowOptions(false);
        }
    };

    const handleClickModule = (): void => {
        if (!soon) {
            if (
                (lengthGreaterThanZero(activeMemberships) &&
                    !ALWAYS_ACCESS_WITH_MODULE_NAME.includes(module) &&
                    !validationPermissionsMenu(module, module)) ||
                (!ALWAYS_ACCESS_MODULES_NAME.includes(module) &&
                    !validationPermissionsMenu(module, module) &&
                    lengthGreaterThanZero(activeMemberships))
            ) {
                if (!information?.name) {
                    dispatch(setAuthorizationModal());
                    return;
                }
                setShowModal(true);
                selectTab({ key: MODULE, value: module, route, authorized: false });
                setShowOptions(false);
                return;
            }

            selectTab({ key: MODULE, value: module, route, authorized: true });
            setShowModal(false);

            if (lengthGreaterThanZero(options)) {
                setShowOptions(true);
            }
        }
    };

    const classesTabDynamic = (): string => {
        const technicalSheetClasses = isTechnicalSheet ? 'sidebar-tab__technicalSheet bg-green text-white' : '';
        const purchasingSheetClasses = isPurchasingProcessSheet
            ? 'sidebar-tab__purchasingProcessSheet bg-gray-grayBlue text-blue'
            : '';
        const defaultClasses = !isTechnicalSheet && !isPurchasingProcessSheet ? 'sidebar-tab__module' : '';
        const activeTechnicalSheetClasses = isActiveModule && isTechnicalSheet ? 'bg-green-extraLight text-green' : '';

        return `${technicalSheetClasses} ${purchasingSheetClasses} ${defaultClasses} ${activeTechnicalSheetClasses}`.trim();
    };

    const handleClassesModule = (): string => {
        const sidebarActiveClasses =
            largeText && isActiveModule && !isTechnicalSheet && !isPurchasingProcessSheet
                ? 'sidebar-tab__plan--large--active'
                : '';
        const sidebarLargeClasses = largeText && !isActiveModule ? 'sidebar-tab__plan--large' : 'sidebar-tab__plan';
        const technicalClasses = !isTechnicalSheet && !isPurchasingProcessSheet ? 'px-4.5' : '';
        const otherClasses =
            isActiveModule && !largeText && !isTechnicalSheet && !isPurchasingProcessSheet ? 'sidebar-tab__plan--active' : '';

        return `${sidebarActiveClasses} ${sidebarLargeClasses} ${technicalClasses} ${otherClasses}`;
    };

    const handleClassesName = (): string => {
        const baseClass = isTechnicalSheet || isPurchasingProcessSheet ? 'sidebar-tab__technicalName' : 'sidebar-tab__name';
        return soon ? `${baseClass} ${baseClass}--soon` : baseClass;
    };

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.OPERATION_TABLE,
                    submodule: 'tab',
                    action: ActionElementType.CONTAINER,
                    elementType: ElementType.MDL,
                })}
                modalClassName="access-module_modal"
                handleClose={(): void => setShowModal(false)}
                open={showModal}
            >
                <div className="add-politics__modal">
                    <Icon
                        id={generateId({
                            module: ModuleApp.OPERATION_TABLE,
                            submodule: 'tab-access-module',
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        name="alertMulticolor"
                        className="mb-2 w-22.2 h-22.2"
                    />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-85">Información</p>
                    <p className="text-base text-center text-gray-dark">
                        Para acceder a este módulo adquiera un plan. Usted será redirigido a la landing de diggi pymes para
                        adquirir un nuevo plan de compra.
                    </p>
                    <div className="flex justify-center w-full gap-7 mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.OPERATION_TABLE,
                                submodule: 'tab-access-module',
                                action: ActionElementType.BACK,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => setShowModal(false)}
                            text="Atrás"
                            classes="shadow-templateDesign"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.OPERATION_TABLE,
                                submodule: 'tab-access-module',
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => {
                                setShowModal(false);
                                dispatch(clearSession());
                                history.push('/');
                            }}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <div className="sidebar-tab">
                <button
                    id={generateId({
                        module: ModuleApp.OPERATION_TABLE,
                        submodule: `tab-${icon}`,
                        action: ActionElementType.ACTION,
                        elementType: ElementType.BTN,
                    })}
                    className={handleClassesModule()}
                    onClick={(): void => {
                        if (isTechnicalSheet) handleClickModule();
                    }}
                >
                    <div className={classesTabDynamic()}>
                        <div className="flex gap-4.5 items-center">
                            {!isTechnicalSheet && !isPurchasingProcessSheet && (
                                <img
                                    alt="Module"
                                    className="cursor-pointer icon-width--tab"
                                    src={getSidebarIcon(icon)}
                                />
                            )}
                            <p onClick={handleClickModule} className={handleClassesName()}>
                                {module}
                            </p>
                        </div>
                        {soon ? (
                            <div className="soon">Proximamente</div>
                        ) : (
                            items &&
                            items.length > ZERO && (
                                <img
                                    role="presentation"
                                    className={`sidebar-tab__arrow ${isActiveModule ? 'sidebar-tab__arrow--active' : ''}`}
                                    src={
                                        isTechnicalSheet && !isActiveModule
                                            ? arrowWhite
                                            : isPurchasingProcessSheet && !isActiveModule
                                            ? arrowBlue
                                            : arrow
                                    }
                                    alt="Arrow"
                                    onClick={handleClickModule}
                                />
                            )
                        )}
                    </div>
                </button>
                {lengthGreaterThanZero(options) && showOptions && validationPermissionsMenu(module, module) && (
                    <Options module={module} options={options} />
                )}
                {isActiveModule && items && items.length > ZERO && (
                    <ul className="sidebar-tab__items sidebar-tab__bar sidebar-tab__items--active">
                        {items.map((item: IGenericRecord, index: number) => (
                            <Item
                                key={item?.name || item?.routeIndex}
                                item={item}
                                className="px-2 mr-4 text-left"
                                index={index}
                                selectTab={selectTab}
                                activeTab={activeTab}
                                showOptions={validationPermissionsMenu(module, module)}
                            />
                        ))}
                    </ul>
                )}
                {isTechnicalSheet && <div className="max-w-full mx-2 border-t xs:hidden w-60 border-gray"></div>}
            </div>
        </>
    );
};
