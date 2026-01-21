import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveModules } from '@redux/company/actions';
import { toggleMenu } from '@redux/menu/actions';
import { RootState } from '@redux/rootReducer';
import { setPlanWebsiteActive } from '@redux/membership/actions';
import { getCommonProperties } from '@redux/website-node/actions';
import { setAuthorizationModal } from '@redux/session/actions';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { CommonProperty } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { PATHS, Routes } from '@constants/Paths';
import { WEBSITE_AND_VIRTUAL_STORE } from '@constants/Memberships';
import { Footer, Header, Tab } from './components';
import {
    IActiveTab,
    ITEMS,
    ITEMS_ADMIN,
    ACTIVE_TAB,
    MODULE,
    PARENT,
    MOBILE_SCREEN,
    PREVIEW,
    ISelectTabParams,
    ROUTE_DEFAULT,
    CRM,
} from '.';
import './OperationsTable.scss';

export const OperationsTable: React.FC = React.memo(() => {
    const { pathname } = useLocation();
    const { queryParam } = useParam('page');
    const {
        menu: { open },
        session: { is_administration_customer = false },
    } = useSelector(({ menu, session }: RootState) => ({ menu, session }));
    const [dispatch, history] = [useDispatch(), useHistory()];
    const { activeMemberships, employees, information } = useSelector(({ company }: RootState) => company);

    const [activeTab, setActiveTab] = useState<IActiveTab>(ACTIVE_TAB);
    const items = useMemo(() => (is_administration_customer ? ITEMS_ADMIN : ITEMS)(lengthGreaterThanZero(employees)), [
        employees,
    ]);
    const [sizeScreen, setSizeScreen] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(sizeScreen < MOBILE_SCREEN);
    const [manualNavigation, setManualNavigation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { validationPermissionsMenu } = usePermissions();

    window.addEventListener('resize', (): void => {
        setSizeScreen(window.innerWidth);
    });

    useEffect(() => {
        setIsMobile(sizeScreen < MOBILE_SCREEN);
    }, [sizeScreen]);

    useEffect(() => {
        if (pathname === getRoute(Routes.WEBSITE_DASHBOARD)) {
            dispatch(getCommonProperties([CommonProperty.Domain]));
        }

        if (isMobile) {
            dispatch(toggleMenu());
        }
        if (!manualNavigation) {
            findItemByKey(items, pathname);
        }
        setManualNavigation(false);
    }, [pathname]);

    useEffect(() => {
        dispatch(getActiveModules());
    }, []);

    useEffect(() => {
        let idSubModule = 0;
        let planModule = '';
        if (activeMemberships.length) {
            const activePlan = activeMemberships
                .flatMap(item => item.modules)
                .filter(module => module.name === WEBSITE_AND_VIRTUAL_STORE)
                .flatMap(subModule => subModule.membership_submodules)
                .filter(plan => {
                    if (plan.sub_module_id > idSubModule) {
                        idSubModule = plan.sub_module_id;
                        planModule = plan.name;
                        return plan;
                    }
                })
                .find(namePlan => namePlan.name === planModule)?.name;
            dispatch(setPlanWebsiteActive(activePlan));
        }
    }, [activeMemberships]);

    const findItemByKey = (tabs: IGenericRecord[], key: string): void => {
        for (const tab of tabs) {
            if (tab.route === key) {
                setActiveTab({ ...ACTIVE_TAB, module: tab.module, route: key });
            } else {
                for (const item of tab.items || []) {
                    if (PATHS[item.routeIndex]?.route === key) {
                        setActiveTab(formatActiveTabByRouteIndex(item, key));
                    } else if (item.items && lengthGreaterThanZero(item.items)) {
                        handleSetSubitemTab(item, key);
                    } else if (lengthGreaterThanZero(item.options)) {
                        handleOptionsTab(item, key);
                    }
                }
            }
        }
    };

    const formatActiveTabByRouteIndex = (item: IGenericRecord, key: string): IActiveTab =>
        item.items && lengthGreaterThanZero(item.items)
            ? { ...ACTIVE_TAB, item: PATHS[item.routeIndex]?.title, module: item.parentModule, route: key }
            : { ...ACTIVE_TAB, module: item.parentModule, route: key };

    const handleSetSubitemTab = (item: IGenericRecord, key: string): void => {
        for (const subItem of item.items || []) {
            if (PATHS[subItem.routeIndex]?.route === key) {
                setActiveTab({
                    ...ACTIVE_TAB,
                    item: PATHS[item.routeIndex]?.title,
                    module: subItem.parentModule,
                    parents: [subItem.parentItem],
                    route: key,
                });
            }
        }
    };

    const handleOptionsTab = (item: IGenericRecord, key: string): void => {
        item.options.forEach(({ route, parentItem, ...option }: IGenericRecord) => {
            if (route === key) {
                setActiveTab({
                    route,
                    item: parentItem,
                    notShowOptions: true,
                    parents: [parentItem],
                    module: option.parentModule,
                });
            }
        });
    };

    const selectTab = ({ key, value, route, showOption, authorized }: ISelectTabParams): void => {
        const { module, parents } = activeTab;
        const isValidate = validationPermissionsMenu(module, module);

        if (value === module) {
            setActiveTab({ ...ACTIVE_TAB, module: '', route });
            return;
        }

        currentActiveTab(key, value, route, parents, isValidate, authorized);
        setManualNavigation(true);
        if (isValidate && route !== ROUTE_DEFAULT) {
            module === PATHS[Routes.WEBSITE_MENU].title ? history.replace(route) : history.push(route);
        }
        if (showOption) return;
    };

    const parentsValue = (parents: string[], value: string, route: string): string[] =>
        parents.includes(value) && route === pathname ? parents.filter(item => item !== value) : [...parents, value];

    const currentActiveTab = (
        key: string,
        value: string,
        route: string,
        parents: string[],
        isValidate: boolean,
        authorized: boolean
    ): void => {
        switch (key) {
            case MODULE:
                setActiveTab({ ...ACTIVE_TAB, module: value, route });
                break;

            case PARENT:
                setActiveTab({
                    ...activeTab,
                    notShowOptions: false,
                    parents: parentsValue(parents, value, route),
                    route,
                });
                if (!information?.name) {
                    dispatch(setAuthorizationModal());
                }
                if (!isValidate && !authorized) setShowModal(true);
                break;
            default:
                if (!information?.name) {
                    dispatch(setAuthorizationModal());
                }
                setActiveTab({ ...activeTab, notShowOptions: false, item: value, route });
                if (!isValidate && !authorized && !lengthEqualToZero(activeMemberships)) setShowModal(true);
                break;
        }
    };

    const isCrmRoute = window.location.pathname.includes(CRM);

    return (
        <aside
            id={generateId({
                module: ModuleApp.OPERATION_TABLE,
                submodule: 'main-container',
                action: ActionElementType.CONTAINER,
                elementType: ElementType.CONT,
            })}
            className={`${isCrmRoute ? 'hidden' : ''} operations-table z-1 ${
                queryParam === PREVIEW ? 'operations-table__website-preview' : ''
            } operations-table--${
                (!isMobile && (pathname !== getRoute(Routes.WEBSITE_EDITOR) || lengthGreaterThanZero(queryParam))) || open
                    ? 'show'
                    : 'hide'
            }`}
        >
            <Header />
            <div className="operations-table__upper-section">
                <h2 className="operations-table__title">Tabla de operaciones</h2>
            </div>
            <nav className="operations-table__nav">
                {items.map(tab => (
                    <Tab
                        largeText={tab.isLargeText}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        key={tab.module}
                        tab={tab}
                        selectTab={selectTab}
                        activeTab={activeTab}
                    />
                ))}
            </nav>
            <Footer />
        </aside>
    );
});
