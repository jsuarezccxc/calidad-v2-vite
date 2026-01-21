import { Numeric } from '@utils/Number';

export * from './CatalogEditor';
export * from './FilterOption';
export * from './CatalogModalThree';

/**
 * Constant max number products
 */
export const MAX__PRODUCTS = 3;

/**
 * Represents the properties required to calculate dimensions.
 *
 * @typeParam min: string - minimun value of price range
 * @typeParam max: string - maximun value of price range
 */
export interface IPriceRange {
    min: string;
    max: string;
}

/**
 * Represents the properties required to calculate dimensions.
 *
 * @typeParam min: number - minimun value of price range
 * @typeParam max: number - maximun value of price range
 */
export type IPriceRangeNumeric = Numeric<IPriceRange>;

/**
 * default value for price range
 */
export const DEFAULT_PRICE_RAGE = { min: '', max: '' };

/**
 * String new for conditional
 */
export const NEW = 'new';
