import styled, { CSSObject } from '@emotion/styled';
import { IGenericRecord } from '@models/GenericRecord';
import { createStyle } from '@utils/WebsiteNode';

export * from './Catalog';

/**
 * This interface data filter
 *
 * @typeParam priceMin: number - Minimum price
 * @typeParam priceMax: number - Maximum price
 * @typeParam text: string - Text search
 * @typeParam priceFilter: string[] - List filter price
 * @typeParam categories: string[] - Filter category
 */
export interface IFilterData {
    priceMin: number;
    priceMax: number;
    text: string;
    priceFilter: string[];
    categories: string[];
}

/**
 * Active button in mobile screen
 */
export enum ActiveButton {
    Filter = 'FILTER',
    Sort = 'SORT',
}

/**
 * This creates fake data to show the catalog
 *
 * @param length: number - Products number
 * @returns IGenericRecord[]
 */
export const createData = (length: number): IGenericRecord[] =>
    Array.from({ length }, (_, index) => ({ name: `Producto ${index + 1}`, ...(index === 2 && { src: true }) }));

/**
 * Catalog wrapper made with styled components
 */
export const Wrapper = styled.div<{ style: IGenericRecord }>`
    .text-primary {
        color: #0b2c4c;
    }

    .text-secondary {
        color: #00a99d;
    }

    .filter {
        &__category-title {
            ${({ style: { category } }): CSSObject => createStyle(category)}
        }
    }

    .product-card {
        &__name {
            ${({ style: { product } }): CSSObject => createStyle(product)};
        }

        &__price {
            ${({ style: { price } }): CSSObject => createStyle(price)}
        }
    }
`;

/**
 * Default style
 */
export const ITEMS_PER_PAGE = 9;

/**
 * Default style twelve
 */
export const ITEMS_PER_PAGE_TWELVE = 12;

/**
 * Default top catalog
 */
export const DEFAULT_TOP_CATALOG = 75;

/**
 * Prices
 */
export const NAME_PRICE = ['priceMin', 'priceMax'];

/**
 * Filter default
 */
export const FILTER_DEFAULT = {
    priceMin: 0,
    priceMax: 0,
    text: '',
    priceFilter: [],
    categories: [],
};

/**
 * Order type
 */
export const OrderType = {
    Lees: 'less',
    More: 'more',
    OldDate: 'oldDate',
    NewDate: 'newDate',
    Text: 'text',
    Value: 'value',
    Date: 'date',
};
