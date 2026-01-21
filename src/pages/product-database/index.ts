export { default } from './ProductDatabase';
import { IOptionSelect } from '@components/input';
import { eTaxes } from './context';

/**
 * This interface define structure of tax select available options
 *
 * @typeParam id: string - Element id
 * @typeParam value: string - Option's value
 * @typeParam key: string - Option's tax identifying
 * @typeParam multiSelectCheck?: boolean - Optional check value for each option of the select component
 */
export interface ITaxOption extends IOptionSelect {
    id: string;
    value: string;
    key: keyof typeof eTaxes | string;
    multiSelectCheck: {
        value: boolean;
    };
    width?: number;
}
