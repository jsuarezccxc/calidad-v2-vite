export * from './TooltipIcon';

/**
 * This interface describes the tooltip icon props
 *
 * @typeParam setTooltip: () => void - Function to set the tooltip
 * @typeParam tooltip: string - Current tooltip
 * @typeParam invest: boolean - Optional prop indicating whether to invert the component
 * @typeParam classTooltip?: string - Optional prop class style
 * @typeParam titleInfo: string - Optional title information
 */
export interface ITooltipIconProps {
    setTooltip: () => void;
    tooltip: string;
    invest?: boolean;
    classTooltip?: string;
    titleInfo?: string;
}
