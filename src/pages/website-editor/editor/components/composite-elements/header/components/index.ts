import { IGenericRecord } from '@models/GenericRecord';

export * from './Link';
export * from './SeeMore';
export * from './SocialNetworks';
export * from './ShoppingCart';

/**
 * This interface describes the properties of the header link
 *
 * @typeParam links: IGenericRecord[] - Page links of website
 */
export interface IHeaderLink {
    links: IGenericRecord[];
}

/**
 * This interface describes the properties of component SeeMore
 *
 * @typeParam links: IGenericRecord[] - Page links of website
 * @typeParam color: string - Color of arrow icon
 */
export interface ISeeMore {
    moreLinks: IGenericRecord[];
    color: string;
}

/**
 * limit of links to show
 */
export const LIMIT_LINKS = 4;

/**
 * limit of letters link
 */
export const LETTER_LIMIT = 30;

/**
 * This interface describes the properties of component SeeMore
 *
 * @typeParam fill: string - Prop for fill color into svg component
 * @typeParam color: string - Prop for cart color
 * @typeParam mobile?: string - Optional prop for mobile option
 * @typeParam counter: string - Prop for cart counter
 */
export interface IShoppingCartProps {
    fill: string;
    color: string;
    mobile?: boolean;
    counter: number;
}
