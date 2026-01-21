export { default } from './Footer';

/**
 * Properties that footer component receives
 *
 * @typeParam className: string - Classes to apply to element
 * @typeParam isFooterSidebar: boolean - Optional sidebar footer
 */
export interface IFooterProps {
    className: string;
    isFooterSidebar?: boolean;
}

