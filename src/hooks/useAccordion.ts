import { useState } from 'react';

/**
 * This interface describes the props of use accordion
 *
 * @typeParam getActiveClass: (className: string) => string - This returns the active class
 * @typeParam open: boolean - This indicates whether to open the content
 * @typeParam toggleOpening: () => void - This toggles the display of the content
 */
interface IUseAccordion {
    getActiveClass: (className: string) => string;
    open: boolean;
    toggleOpening: () => void;
}

export const useAccordion = (): IUseAccordion => {
    const [open, setOpen] = useState<boolean>(false);

    const getActiveClass = (className: string): string => (open ? `${className}--active` : '');

    const toggleOpening = (): void => setOpen(!open);

    return {
        getActiveClass,
        open,
        toggleOpening,
    };
};
