import { IconsNames } from '@components/icon';

export * from './Card';

/**
 * This interface define props to component
 * 
 * @typeParam onClick: () => void - Handle click card
 * @typeParam img: string - Route image
 * @typeParam label: string - Label card
 */
export interface ICardImgProps {
    onClick: () => void;
    img: string;
    label: string;
}

/**
 * This interface define props to component
 * 
 * @typeParam iconStep: IconsNames - Icon name
 * @typeParam title: string - Title card
 * @typeParam isCheck: boolean - If complete instruction
 * @typeParam isNotBlocked: boolean - If not blocked step
 * @typeParam onClick: () => void - Handle click
 */
export interface ICardSectionProps {
    iconStep: IconsNames;
    title: string;
    isCheck: boolean;
    isNotBlocked: boolean;
    onClick: () => void;
}
