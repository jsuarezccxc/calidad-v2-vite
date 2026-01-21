import { IconsNames } from '@components/icon';

export * from './Card';

/**
 * This interface is simple card props
 *
 * @typeParam id: string - Id for recognize card
 * @typeParam iconName: IconsNames - Icon name
 * @typeParam principalText: string - Principal text
 * @typeParam secondText: string - Second text
 * @typeParam route: string - Route redirect
 * @typeParam isBlueText?: boolean - If blue text
 */
export interface ISimpleCardProps {
    id: string;
    iconName: IconsNames;
    principalText: string;
    secondText: string;
    route: string;
    isBlueText?: boolean;
}

/**
 * This interface is color card props
 *
 * @typeParam id: string - Id for recognize card
 * @typeParam iconName: IconsNames - Icon name
 * @typeParam number: string - Number value
 * @typeParam text: string - Text label
 * @typeParam className: string - Custom style father
 * @typeParam classNameLine: string - Custom style line
 * @typeParam classNameNumber: string -  Custom style number value
 */
export interface IColorCardProps {
    id: string;
    iconName: IconsNames;
    number: string;
    text: string;
    className: string;
    classNameLine: string;
    classNameNumber: string;
}

/**
 * This interface is content card props
 *
 * @typeParam id: string - Id for recognize card
 * @typeParam title: string - Title content card
 * @typeParam className: string - Content card style
 * @typeParam classNameContent: string - Content children style
 */
export interface IContentCardProps {
    id: string;
    title: string;
    className: string;
    classNameContent: string;
}

/**
 * This interface is little card props
 *
 * @typeParam id: string - Id for recognize card
 * @typeParam title: string - Title little card
 * @typeParam number: string - Number value
 * @typeParam className: string - Little card style
 * @typeParam isUnlimited?: boolean - If show number label
 */
export interface ILittleCardProps {
    id: string;
    title: string;
    number: number;
    className: string;
    isUnlimited?: boolean;
}

/**
 * This const is utils components
 */
export const UTILS_CARD = {
    ELEVEN: 11,
};
