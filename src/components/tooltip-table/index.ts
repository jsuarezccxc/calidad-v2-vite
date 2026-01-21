export * from './TooltipTable';

/**
 * This interface is for props for title component
 *
 * @typeParam text: string | JSX.Element - Text
 * @typeParam disabledDefinitionSection?: boolean - Disabled section in tooltip
 * @typeParam className?: string - Customer class style
 */
export interface ITooltipTitleProps {
    text: string | JSX.Element;
    disabledDefinitionSection?: boolean;
    className?: string;
}

/**
 * This interface is props in tooltip component
 *
 * @typeParam setTooltip?: () => void - Dispatch state
 * @typeParam placement?: PopperPlacementType - Optional prop for the placement of Popper
 */
export interface ITooltipTableProps extends ITooltipTitleProps {
    setTooltip?: () => void;
    placement?:
        | 'bottom-end'
        | 'bottom-start'
        | 'bottom'
        | 'left-end'
        | 'left-start'
        | 'left'
        | 'right-end'
        | 'right-start'
        | 'right'
        | 'top-end'
        | 'top-start'
        | 'top';
}
