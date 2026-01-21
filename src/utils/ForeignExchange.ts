import { SelectSearchOption } from 'react-select-search';

/**
 * This interface is for foreign exchange
 *
 * @typeParam code: string - Code foreign exchange
 * @typeParam created_at | null: string - Optional created date
 * @typeParam description: string - Optional description currency
 * @typeParam id: string - Optional currency id
 * @typeParam name: string - Name currency
 * @typeParam update: string | null - Optional update date
 */
export interface IForeignExchange {
    code: string;
    created_at?: string | null;
    description?: string;
    id?: string;
    name: string;
    update?: string | null;
}

/**
 * Function that retrieves the name of a currency based on its ID from a list of currency options.
 *
 * @param currencyId: string - ID of the currency to retrieve
 * @param currencyOptions: SelectSearchOption[] - Array of currency options containing ID and name
 * @returns string
 */
export const getCurrency = (currencyId: string, currencyOptions: SelectSearchOption[]): string =>
    currencyOptions.find(item => item.value === currencyId)?.name || '';

/**
 * Function that filters to obtain the currencies selected by the company from a larger set of currencies
 *
 * @param companiesCurrencies: IForeignExchange[] - Secondary company currencies
 * @param foreignExchange: IForeignExchange[] - Total currency list
 * @param foreignExchangeId: string - Company primary currency id
 * @returns IForeignExchange[]
 */
export const getForeignExchange = (
    companiesCurrencies: IForeignExchange[],
    foreignExchange: IForeignExchange[],
    foreignExchangeId: string
): IForeignExchange[] => {
    const companiesForeignExchange: IForeignExchange[] = companiesCurrencies?.filter(item => item);
    const initialForeignExchange = foreignExchange?.find((item: IForeignExchange) => item.id === foreignExchangeId);
    if (companiesForeignExchange && initialForeignExchange) {
        return [initialForeignExchange, ...companiesForeignExchange];
    }
    return [];
};
