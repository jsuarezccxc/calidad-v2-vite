export { InformativeText } from './InformativeText';

/**
 * This interface describes the props of informative text
 *
 * @typeParam description: string - Tooltip description
 * @typeParam text: string - Text
 * @typeParam textClassName: string - Optional prop to customize the text
 * @typeParam wrapperClassName: string - Optional prop to customize the wrapper
 * @typeParam title: string - Optional prop indicates tooltip title
 */
export interface IInformativeTextProps {
    description: string;
    text: string;
    textClassName?: string;
    wrapperClassName?: string;
    title?: string;
}
