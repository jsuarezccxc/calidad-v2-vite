/**
 * This interface describes the structure of a currency symbol
 * 
 * @typeParam locate: string - The locale for the currency symbol
 * @typeParam display: 'symbol' | 'name' - The display type for the currency symbol
 */
export interface ISymbolCurrency {
    locale: string;
    display: 'symbol' | 'name';
}
