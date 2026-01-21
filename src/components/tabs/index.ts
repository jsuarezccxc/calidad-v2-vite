import { Dispatch, SetStateAction } from 'react';
export * from './tabs';

/**
 * This interface describes the properties of a tab object.
 *
 * @typeParam label: string - The label displayed on the tab.
 * @typeParam content: React.ReactNode - The content rendered when the tab is active.
 */
export interface ITab {
    label: string;
    content: React.ReactNode;
}

/**
 * This interface describes the properties of a tabs container object.
 *
 * @typeParam id - A unique identifier for the tabs container.
 * @typeParam indexTab - The index of the currently active tab.
 * @typeParam setIndexTab - A function to update the currently active tab index.
 * @typeParam tabs - An array containing all tab objects that belong to the container.
 */
export interface ITabs {
    id: string;
    indexTab: number;
    setIndexTab: Dispatch<SetStateAction<number>>;
    tabs: ITab[];
}
