export { default } from './CoincidencesTextSearch';

/**
 * This interface describes the properties of the coincidences text
 *
 * @typeParam text: string - Result text
 * @typeParam search: string - Word for search results
 * @typeParam primaryColor: string - Optional main text color
 * @typeParam secondaryColor: string - Optional change color by match
 * @typeParam isSelect: boolean - Optional is search select
 * @typeParam className: string - Optional class component
 * @typeParam prevText: string - Optional text before the paragraph
 * @typeParam classPrevText: string - Optional class text before the paragraph
 * @typeParam classNameText: string - Optional class text
 * @typeParam classSubText: string - Optional class text coincidence
 * @typeParam isLink: string - Optional if the text is a link
 * @typeParam resolution: string - Optional text resolution
 */
export interface ICoincidencesTextProps {
    text: string;
    search: string;
    primaryColor?: string;
    secondaryColor?: string;
    isSelect?: boolean;
    className?: string;
    prevText?: string;
    classPrevText?: string;
    classNameText?: string;
    classSubText?: string;
    isLink?: string;
    resolution?: string;
}

/**
 * constant for component
 */
export const CANCEL_URL = '//';
export const CANCEL_QUESTION_MARK = '¿';
export const ASTERISK_CHARTER = '*';
export const LINE_BREAK = 'Ç';
export const BULLET_POINT = '•';
