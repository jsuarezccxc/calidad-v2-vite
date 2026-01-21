/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, useState } from 'react';

/**
 * This describes the mouse props
 *
 * @typeParam onMouseEnter: (e: any) => void - On mouse enter function
 * @typeParam onMouseOver: (e: MouseEvent<HTMLElement>) => void - On mouse over function
 * @typeParam onMouseLeave: () => void - On mouse leave function
 */
export interface IMouseProps {
    onMouseEnter: (e: any) => void;
    onMouseOver: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
}

/**
 * This describes the properties returned by this hook
 *
 * @typeParam activePopper: string - Active popper
 * @typeParam anchorEl: HTMLElement | null - Used to have the popper reference
 * @typeParam mouseProps: IMouseProps - Mouse props used to toggle the popper
 * @typeParam togglePopper: (e: MouseEvent<HTMLElement>) => void - Used to toggle Popper
 */
export interface IUsePopper {
    activePopper: string;
    anchorEl: HTMLElement | null;
    mouseProps: IMouseProps;
    togglePopper: (e: MouseEvent<HTMLElement>) => void;
}

const usePopper = (): IUsePopper => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [activePopper, setActivePopper] = useState<any>(null);

    const activatePopper = ({ target }: any): void => setActivePopper(target?.id);

    const openPopper = (e: MouseEvent<HTMLElement>): void => setAnchorEl(e.currentTarget);

    const closePopper = (): void => setAnchorEl(null);

    const togglePopper = (e: MouseEvent<HTMLElement>): void => setAnchorEl(anchorEl ? null : e.currentTarget);

    return {
        activePopper,
        anchorEl,
        mouseProps: {
            onMouseOver: openPopper,
            onMouseLeave: closePopper,
            onMouseEnter: activatePopper,
        },
        togglePopper,
    };
};

export default usePopper;
