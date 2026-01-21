//--- Libraries ---//
import { createContext, Dispatch, SetStateAction } from 'react';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, Screen, StyleKey, TabType } from '@models/WebsiteNode';
//--- Components ---//
import { IElement } from '../components/sidebar';
import { IDraggableElement, MANDATORY_ELEMENTS } from '../components/drag-and-drop';

export * from './ElementsProvider';
export * from './ScreensProvider';
export * from './SidebarProvider';

/**
 * Action that tools have to replicate an element
 */
export enum CopyableAction {
    Copy = 'COPY',
    Cut = 'CUT',
}

/**
 * This describes the structure of copyable element
 *
 * @typeParam action: CopyableAction - Copyable action
 * @typeParam id: string - Id of the selected element
 */
export interface ICopyableElement {
    action: CopyableAction;
    id: string;
}

/**
 * This describes the structure of style data
 *
 * @typeParam item: string - Style item
 * @typeParam name: string - Style name
 * @typeParam value: string - Style value
 */
export interface IStyleData {
    item: string;
    name: string;
    value: string;
}

/**
 * This describes the structure of setting data
 *
 * @typeParam multiple: boolean - This indicates if it is multiple choice
 * @typeParam name: string - Setting name
 * @typeParam value: any - Setting value
 */
export interface ISettingData {
    multiple?: boolean;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

/**
 * This describes the elements context
 *
 * @typeParam saveChanges:  () => Promise<void>[] - Function save element
 * @typeParam copyElements: IDraggableElement[][] - Copy elements
 * @typeParam addElement: (element: IDraggableElement) => void - Element id
 * @typeParam copyableElement: ICopyableElement | null - Selected element to copy or cut
 * @typeParam deleteElement: (id: string) => void - Used to delete an element
 * @typeParam deletedElements: IDraggableElement[] - Deleted elements
 * @typeParam elements: IDraggableElement[] - Draggable elements
 * @typeParam handleSettingChange: (data: ISettingData) => void - Function to handle setting change
 * @typeParam handleStyleChange: (data: IStyleData) => void - Function to handle style change
 * @typeParam saveElement: (element: IDraggableElement) => void - This is used to save an element
 * @typeParam selectCopyableElement: (element: ICopyableElement | null) => void - This is used to select a copyable element
 * @typeParam selectElement: (element: IDraggableElement | null) => void - This is used to select an element
 * @typeParam selectedElement: IDraggableElement | null - Element selected for editing
 * @typeParam updateElements: (elements: IDraggableElement[], isCopy?:boolean) => void - Function to update elements
 * @typeParam updateDeletedElements: (id: string, add?:boolean) => void - Function to update deleted elements
 * @typeParam pasteElement: () => void - Function to paste copied element
 * @typeParam handleHeaderStyle: (data: IGenericRecord) => void - Function to handle header style
 * @typeParam logoSize: IGenericRecord - Logo size header
 * @typeParam setLogoSize: Dispatch<SetStateAction<IGenericRecord>> -Function set logo size header
 */
interface IElementsContext {
    saveChanges: () => Promise<void>;
    copyElements: IDraggableElement[][];
    addElement: (element: IDraggableElement) => void;
    copyableElement: ICopyableElement | null;
    deleteElement: (id: string) => void;
    deletedElements: IDraggableElement[];
    elements: IDraggableElement[];
    handleSettingChange: (data: ISettingData) => void;
    handleStyleChange: (data: IStyleData) => void;
    saveElement: (element: IDraggableElement) => void;
    selectCopyableElement: (element: ICopyableElement | null) => void;
    selectElement: (element: IDraggableElement | null) => void;
    selectedElement: IDraggableElement | null;
    updateElements: (elements: IDraggableElement[], isCopy?: boolean) => void;
    updateDeletedElements: (id: string, add?: boolean) => void;
    pasteElement: () => void;
    handleHeaderStyle: (data: IGenericRecord) => void;
    logoSize: IGenericRecord;
    setLogoSize: Dispatch<SetStateAction<IGenericRecord>>;
}

/**
 * This describes the sidebar context
 *
 * @typeParam activeTab: TabType | null - Active tab
 * @typeParam activateTab: (tab: TabType) => void - Function to activate tab
 * @typeParam selectItem: (item: IElement | null) => void - Used to select an item
 * @typeParam selectedItem: IElement | null - Selected item
 * @typeParam toggleActiveTab: ((tab: TabType) => void - Function to toggle active tab
 */
interface ISidebarContext {
    activeTab: TabType[];
    activateTab: (tab: TabType) => void;
    selectItem: (item: IElement | null) => void;
    selectedItem: IElement | null;
    toggleActiveTab: (tab: TabType) => void;
}

/**
 * This describes the screens context
 *
 * @typeParam activeScreen: Screen - Active screen
 * @typeParam isMobile: boolean - This indicates if the screen is mobile
 * @typeParam styleKey: StyleKey - Style key according to active screen
 * @typeParam selectedElement: IDraggableElement | null - Element selected for editing
 */
interface IScreensContext {
    activeScreen: Screen;
    isMobile: boolean;
    styleKey: StyleKey;
    selectScreen: (screen: Screen) => void;
}

/**
 * Screens context
 */
export const ScreensContext = createContext<IScreensContext>({
    activeScreen: Screen.Desktop,
    isMobile: false,
    styleKey: StyleKey.DesktopStyle,
    selectScreen: () => {},
});

/**
 * Elements context
 */
export const ElementsContext = createContext<IElementsContext>({
    saveChanges: async () => {},
    copyElements: [],
    addElement: () => {},
    updateDeletedElements: () => {},
    copyableElement: null,
    deleteElement: () => {},
    deletedElements: [],
    elements: [],
    handleSettingChange: () => {},
    handleStyleChange: () => {},
    saveElement: () => {},
    selectCopyableElement: () => {},
    selectElement: () => {},
    selectedElement: null,
    updateElements: () => {},
    pasteElement: () => {},
    handleHeaderStyle: () => {},
    logoSize: { width: '', height: '' },
    setLogoSize: () => {},
});

/**
 * Default top for footer.
 */
export const DEFAULT_TOP_FOOTER = 980;

/**
 * Sidebar context
 */
export const SidebarContext = createContext<ISidebarContext>({
    activeTab: [],
    activateTab: () => {},
    selectItem: () => {},
    selectedItem: null,
    toggleActiveTab: () => {},
});

/**
 * This describes the type of elements there are
 *
 * @typeParam commonElements: IDraggableElement[] - These are the fixed elements that all pages have
 * @typeParam individualElements: IDraggableElement[] - These are the unique elements of each page
 */
export interface IElements {
    commonElements: IDraggableElement[];
    individualElements: IDraggableElement[];
}

/**
 * This indicates whether the current element is one in common
 *
 * @param type: string - Element type
 * @returns boolean
 */
export const isCommonElement = (type: string): boolean => MANDATORY_ELEMENTS.includes(type as ElementType);

/**
 * This is responsible for separating the elements according to their type
 *
 * @param elements: IDraggableElement[] - Page elements
 * @returns IElements
 */
export const separateElements = (elements: IDraggableElement[]): IElements => {
    const data: IElements = { individualElements: [], commonElements: [] };
    elements.forEach(element => data[isCommonElement(element.type) ? 'commonElements' : 'individualElements'].push(element));
    return data;
};

/**
 * This update elements styles
 *
 * @param elements: IDraggableElement - Page elements
 * @param newStyle: IGenericRecord[] - Styles elements
 * @returns IGenericRecord
 */
export const updateElementStyles = (element: IDraggableElement, newStyle: IGenericRecord): IGenericRecord => {
    const { DesktopStyle, MobileStyle } = StyleKey;
    return {
        style: { ...element.style, ...newStyle },
        [DesktopStyle]: { ...(element[DesktopStyle] ?? {}), ...newStyle },
        [MobileStyle]: { ...(element[MobileStyle] ?? {}), ...newStyle },
    };
};

/**
 * Footer margin to the lowest positioned element
 */
export const MARGIN_FOOTER = 50;

/**
 * Footer margin to the element, when composite element is positioned above the one
 */
export const MARGIN_COMPOSITE_FOOTER = 300;
