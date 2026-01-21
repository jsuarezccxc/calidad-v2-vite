import { PopperPlacementType } from '@mui/material';
import { MouseEventHandler } from 'react';

export * from './Popper';

/**
 * This describes the popper props
 *
 * @typeParam anchorEl: HTMLElement | null - Anchor element
 * @typeParam description: string | JSX.Element - Optional Popper description
 * @typeParam descriptionClassName: string - Optional class used to customize the description
 * @typeParam title: string - Optional popper title
 * @typeParam wrapperClassName: string - Optional class used to customize the component Popper
 * @typeParam placement: PopperPlacementType - Optional prop for the placement of Popper
 * @typeParam children: JSX.Element - Optional prop for Popper content
 * @typeParam onClick: MouseEventHandler - Optional click event handler
 */
export interface IPopperProps {
    anchorEl: HTMLElement | null;
    description?: string | JSX.Element;
    descriptionClassName?: string;
    title?: string;
    wrapperClassName?: string;
    placement?: PopperPlacementType;
    children?: JSX.Element;
    onClick?: MouseEventHandler;
}
