/* eslint-disable @typescript-eslint/no-explicit-any */
export * from './NotFindElements';

/**
 * This interface defines params for not find elements component
 * @typeParam classesWrapper: string - Optional prop that defines classes for wrapper element
 * @typeParam classesIcon: string - Optional prop that defines classes for icon element
 * @typeParam classesText: string - Optional prop that defines classes for text element
 * @typeParam withoutData: boolean - Optional prop that defines if it's used when doesn't exist data
 * @typeParam href: string - Optional prop that defines href for link
 * @typeParam module: string - Optional props that defines module's name needs for adding new elements
 * @typeParam customText: any  - Optional prop that defines a custom text
 * @typeParam onClick: () => void - Optional function to send link in onClick
 */
export interface INotFindElements {
    classesWrapper?: string;
    classesIcon?: string;
    classesText?: string;
    withoutData?: boolean;
    href?: string;
    module?: string;
    customText?: any;
    onClick?: () => void;
}
