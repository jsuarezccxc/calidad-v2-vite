import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModalRedirectPlans } from '@redux/menu/actions';
import arrow from '@assets/images/sidebar/down-arrow.svg';
import { PATHS } from '@constants/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import {
    ACTIVE_TAB,
    IActiveTab,
    ITEM,
    PARENT,
    TAB_ELECTRONIC_DOCUMENTS,
    TAB_WEBSITE,
    TAB_TECHNICAL_DATA,
    TAB_PURCHASING_PROCESS,
    TAB_GET_PURCHASE_PLAN,
    TAB_CRM,
} from '..';
import { Options } from '.';

export const Item: React.FC<IGenericRecord> = ({ item, className, index, selectTab, activeTab, showOptions }) => {
    const dispatch = useDispatch();

    const { name, items = [], routeIndex } = item;
    const { title, route } = PATHS[routeIndex] ?? { title: name, route: '#' };

    const isActiveTab = activeTab.parents.includes(title);

    const [valueTab, setValueTab] = useState<IActiveTab>(ACTIVE_TAB);
    const [showOptionTab, setShowOptionTab] = useState(true);
    const [tabSubMenu, setTabSubMenu] = useState(false);

    useEffect(() => {
        if (
            (activeTab?.module === TAB_WEBSITE ||
                activeTab?.module === TAB_ELECTRONIC_DOCUMENTS ||
                activeTab?.module === TAB_TECHNICAL_DATA ||
                activeTab?.module === TAB_CRM) &&
            item.options
        ) {
            setTabSubMenu(!!item.options?.length && activeTab?.item === title);
            if (valueTab.item !== activeTab?.item && !activeTab.notShowOptions) {
                setValueTab(activeTab);
                setShowOptionTab(true);
            } else {
                setShowOptionTab(false);
                setValueTab(ACTIVE_TAB);
            }
        } else {
            setTabSubMenu(route === activeTab?.route);
            setShowOptionTab(false);
        }
    }, [activeTab]);

    const getDynamicItemClasses = (): string => {
        if (!tabSubMenu) return '';
        return activeTab?.module === TAB_PURCHASING_PROCESS
            ? 'sidebar-tab__item--activePurchasingProcess mr-2'
            : 'sidebar-tab__item--active mr-2';
    };

    return (
        <>
            <button
                id={generateId({
                    module: ModuleApp.OPERATION_TABLE,
                    submodule: `tab-${title}`,
                    action: ActionElementType.ACTION,
                    elementType: ElementType.BTN,
                })}
                className={`sidebar-tab__item ${className} ${getDynamicItemClasses()}`}
                onClick={(): void => {
                    if (item.name === TAB_GET_PURCHASE_PLAN) {
                        dispatch(setModalRedirectPlans());
                    }
                    selectTab({ key: items.length ? PARENT : ITEM, value: title, route, showOption: showOptionTab });
                }}
            >
                {title}
                {!!items.length && (
                    <img
                        className={`sidebar-tab__arrow xs:ml-auto xs:mr-4 ${isActiveTab ? 'sidebar-tab__arrow--active' : ''}`}
                        src={arrow}
                        alt="Arrow"
                    />
                )}
                {activeTab?.item === title && !!item.options?.length && showOptionTab && showOptions && (
                    <Options module={valueTab.module} options={item.options} />
                )}
            </button>
            {!!items.length && isActiveTab && (
                <ul className="sidebar-tab__items sidebar-tab__items--active">
                    {items.map((item: IGenericRecord, int: number) => (
                        <Item
                            key={`${item.name}${int}`}
                            className="pl-4 pr-2 text-left xs:pl-0 xs:pr-10"
                            item={item}
                            index={index}
                            selectTab={selectTab}
                            activeTab={activeTab}
                        />
                    ))}
                </ul>
            )}
        </>
    );
};
