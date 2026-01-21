import { NumberFormatValues } from 'react-number-format';
import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IHeaderTable } from '@components/table';
import { IOption } from '@components/select-search';
export { TableTaxRetention } from './TableTaxRetention';

/**
 * These titles of table tax
 */
export const headerTableTaxes = (showTaxes: boolean): IHeaderTable[] => [
    {
        title: showTaxes ? 'Impuesto' : 'Retención',
        wrapperClassName: 'header__w-152',
        className: 'w-full items-center',
    },
    {
        title: 'Base',
        wrapperClassName: 'header__w-152',
        className: 'w-full items-center',
    },
    {
        title: 'Tarifa',
        wrapperClassName: 'header__w-152',
        className: 'w-full items-center',
    },
    {
        title: 'Valor',
        wrapperClassName: 'header__w-152',
        className: 'w-full items-center',
    },
];

/**
 * This interface for props of table taxes and retention
 *
 * @typeParam id
 * @typeParam dataValuesTableTaxes?: ITableTaxesAndRetention[] - Prop value for inputs table products
 * @typeParam dataValuesTableRetention: ITableTaxesAndRetention[] - Prop data of table retention
 * @typeParam errorsTableRetention: IErrorsTableRetention - Prop errors of table retention
 * @typeParam onChangeTableRetention: (e: NumberFormatValues, nameField: string, item: ITableTaxesAndRetention, id?: string) => void - Prop function changes inputs of table retention
 * @typeParam options: { reteIVA: IOption[] } - Prop for options select input
 * @typeParam isDisabledWithholdings: boolean - Prop disabled tables
 * @typeParam decimalsToPercentage: number - Optional number of decimals to use in percentage calculation
 * @typeParam isElectronicInvoice: boolean - Optional prop to show input total iva
 * @typeParam showTaxes: boolean - Optional prop to show taxes
 * @typeParam isSupportOrAdjustment: boolean - Optional prop to show retentions
 * @typeParam symbol: string - Prop to show symbol currency
 */
export interface ITablesTaxesRetentionProps {
    id?: string;
    dataValuesTableTaxes?: ITableTaxesAndRetention[];
    dataValuesTableRetention: ITableTaxesAndRetention[];
    errorsTableRetention: IErrorsTableRetention;
    onChangeTableRetention: (e: NumberFormatValues, nameField: string, item: ITableTaxesAndRetention, id?: string) => void;
    options: {
        reteIVA: IOption[];
    };
    isDisabledWithholdings?: boolean;
    decimalsToPercentage?: number;
    isElectronicInvoice?: boolean;
    showTaxes?: boolean;
    isSupportOrAdjustment?: boolean;
    symbol: string;
}

/**
 * This interface for errors of table retention
 * @typeParam reteFuente: boolean - Error show reteFuente
 * @typeParam messageFuente: string - Error message reteFuente
 * @typeParam reteIca: boolean - Error show reteIca
 * @typeParam messageIca: string - Error message reteIca
 * @typeParam reteIva: boolean - Error show reteIva
 * @typeParam messageIva: string - Error message reteIva
 */
export interface IErrorsTableRetention {
    reteFuente: boolean;
    messageFuente: string;
    reteIca: boolean;
    messageIca: string;
    reteIva: boolean;
    messageIva: string;
}

/**
 * This enum is for name inputs
 */
export enum TableNameInputs {
    PERCENTAGE = 'percentage',
}

/**
 * This const is utils for component
 */
export const UTILS = {
    DEFAULT_VALUE: [
        { name: '0,00%', value: '0' },
        { name: '15%', value: '15' },
        { name: '100%', value: '100' },
    ],
    DEFAULT_PERCENTAGE: '0',
};
