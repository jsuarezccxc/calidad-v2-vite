export * from './Banner';

/**
 * This interface is banner props
 * 
 * @typeParam className?: string - Optional custom style class
 * @typeParam text: JSX.Element | string - Text banner
 * @typeParam classNameTagP?: string - Optional custom style class tag p
 */
export interface IBannerProps {
    className?: string;
    text: JSX.Element | string;
    classNameTagP?: string;
}
