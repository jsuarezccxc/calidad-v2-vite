import React, { useContext, useEffect, useMemo } from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { TabType } from '@models/WebsiteNode';
import { ADD_PREVIEW_TEMPLATES, COMPOSITE_ELEMENTS, TAB_PROPS } from '@pages/website-editor';
import usePopper from '@hooks/usePopper';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ElementsContext, SidebarContext } from '../../context';
import { Card, Element, TemplateOptions } from '.';

export const Tab: React.FC<{ type: TabType }> = ({ type }) => {
    const { activeTab, activateTab, selectItem, selectedItem, toggleActiveTab } = useContext(SidebarContext);
    const { selectedElement } = useContext(ElementsContext);
    const { description, elements, name } = useMemo(() => TAB_PROPS[type], [type]);
    const { anchorEl, mouseProps } = usePopper();

    useEffect(() => {
        updateItem();
    }, [selectedElement]);

    const isActive = activeTab.includes(type);

    const openTemplates = type === TabType.PresetTemplates;

    const updateItem = (): void => {
        const canBeUpdated = !!(selectedElement?.type && elements.length);
        if (canBeUpdated) {
            const openCompositeElements = COMPOSITE_ELEMENTS.some(item => item.type === selectedElement?.type);
            activateTab(openCompositeElements ? TabType.CompositeElements : TabType.BasicElements);
            const element = elements.find(element => element.type === selectedElement?.type);
            if (element) selectItem(element);
        }
    };

    const activeElement = elements.some(item => item.type === selectedItem?.type);

    return (
        <>
            <button
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-tab-${name}`,
                    action: ActionElementType.ACTION,
                    elementType: ElementType.BTN,
                })}
                className={`sidebar__tab ${type === TabType.BasicElements || isActive ? 'border-b' : ''}`}
            >
                <div className="flex items-center">
                    <span {...mouseProps}>
                        <Icon name="infoGreen" className="w-5.5 h-5.5 pr-2.5 cursor-pointer" />
                    </span>
                    <span
                        onClick={(): void => {
                            toggleActiveTab(type);
                        }}
                        className="w-32 text-left"
                    >
                        {name}
                    </span>
                </div>

                <Icon
                    onClick={(): void => {
                        toggleActiveTab(type);
                    }}
                    name="arrowDownGreen"
                    className={`w-5.5 h-5.5 transition-all transform cursor-pointer ${isActive ? 'rotate-180' : ''}`}
                />
            </button>
            <Tooltip
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-tab-${name}`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TOOL,
                })}
                iconName="infoBlue"
                anchorEl={anchorEl}
                title={`${name}:`}
                wrapperClassName={`${name === ADD_PREVIEW_TEMPLATES ? 'material-tooltip__info-templates' : ''} rounded-lg`}
                description={description}
            />

            <div className={`sidebar__elements bg-green-scrollbar ${isActive ? 'sidebar__elements--active' : ''}`}>
                {isActive && (
                    <>
                        {openTemplates ? (
                            <TemplateOptions />
                        ) : selectedItem && activeElement ? (
                            <Element />
                        ) : (
                            <div className="sidebar__cards">
                                {elements.map(element => (
                                    <Card element={element} key={element.icon} selectElement={selectItem} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
