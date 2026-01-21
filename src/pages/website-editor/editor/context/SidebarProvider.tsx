import React, { useState } from 'react';
import { IElement } from '../components/sidebar';
import { TabType } from '@models/WebsiteNode';
import { SidebarContext } from '.';

export const SidebarProvider: React.FC = ({ children }) => {
    const [activeTab, setActiveTab] = useState<TabType[]>([TabType.BasicElements]);
    const [selectedItem, setSelectedItem] = useState<IElement | null>(null);

    const activateTab = (tab: TabType): void => setActiveTab([...activeTab, tab]);

    const toggleActiveTab = (tab: TabType): void => {
        setActiveTab(activeTab.includes(tab) ? activeTab.filter(item => item !== tab) : [...activeTab, tab]);
        setSelectedItem(null);
    };

    const selectItem = (element: IElement | null): void => setSelectedItem(element);

    return (
        <SidebarContext.Provider value={{ activeTab, activateTab, selectItem, selectedItem, toggleActiveTab }}>
            {children}
        </SidebarContext.Provider>
    );
};
