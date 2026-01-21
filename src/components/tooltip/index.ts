import { IconsNames } from '@components/icon';
import { PopperPlacementType } from '@mui/material';

export * from './Tooltip';

/**
 * This describes the popper props
 *
 * @typeParam id: string - Optional - Unique identifier for the tooltip
 * @typeParam anchorEl: HTMLElement | null - Anchor element
 * @typeParam wrapperClassName: string - Optional class used to customize the component Popper
 * @typeParam classTitle: string - Optional class used to title
 * @typeParam placement: PopperPlacementType - Optional prop for the placement of Popper
 * @typeParam iconName: IconsNames - Optional prop that is using for icons name
 * @typeParam description: string | JSX.Element - Optional Popper description
 * @typeParam title: string - Optional popper title
 * @typeParam isCustom: boolean - Optional prop to render custom element
 * @typeParam element: JSX.Element - Optional custom element
 * @typeParam textStyles: string - Optional custom text styles
 *
 */
export interface ITooltipProps {
    id?: string;
    anchorEl: HTMLElement | null;
    wrapperClassName?: string;
    classTitle?: string;
    placement?: PopperPlacementType;
    iconName?: IconsNames;
    description?: string | JSX.Element;
    title?: string;
    isCustom?: boolean;
    element?: JSX.Element;
    textStyles?: string;
}

/**
 * This interface define structure props to component
 * 
 * @typeParam iconName: IconsNames - Icon name
 * @typeParam tooltipProps: Omit<ITooltipProps, 'anchorEl'> - Tooltip props
 */
export interface ITooltipButtonProps {
    iconName: IconsNames;
    tooltipProps: Omit<ITooltipProps, 'anchorEl'>;
}
