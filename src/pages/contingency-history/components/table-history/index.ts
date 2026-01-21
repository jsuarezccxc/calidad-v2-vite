import { IHeaderTable } from '@components/table';
import { IContingencyHistoryState } from '@models/ContingencyHistory';

export * from './TableHistory';

/**
 * This interface is table history props
 *
 * @typeParam data: IContingencyHistoryState[] - Data table
 * @typeParam handleItemDate: (id: string, date: Date) => void - handle date
 * @typeParam handleItemTime: (id: string, time: string) => void - Handle Time
 * @typeParam handleItemEdit: (id: string, value: boolean) => void - Handle edit change
 * @typeParam isLoadingTable?: Boolean - Optional prop indicating when loading data for render skeleton
 */
export interface ITableHistoryProps {
    data: IContingencyHistoryState[];
    handleItemDate: (id: string, date: Date) => void;
    handleItemTime: (id: string, time: string) => void;
    handleItemEdit: (id: string, value: boolean) => void;
    isLoadingTable?: boolean;
}

/**
 * This interface is props contingency total
 *
 * @typeParam count: number - Count register
 */
export interface IContingencyTotal {
    count: number;
}

/**
 * This const is header table
 */
export const HEADER_TABLE: IHeaderTable[] = [
    {
        title: 'N°',
        wrapperClassName: 'table-contingency-history__header__number',
        className: 'bbbb',
    },
    {
        title: '*Fecha inicio contingencia',
        wrapperClassName: 'table-contingency-history__header__date',
        className: 'bbbb',
    },
    {
        title: '*Hora inicio contingencia',
        wrapperClassName: 'table-contingency-history__header__hour',
        className: 'bbbb',
    },
    {
        title: '*Fecha final contingencia',
        wrapperClassName: 'table-contingency-history__header__date',
        className: 'bbbb',
    },
    {
        title: '*Hora final contingencia',
        wrapperClassName: 'table-contingency-history__header__hour',
        className: 'bbbb',
    },
    {
        title: '*Descripción contingencia',
        wrapperClassName: 'table-contingency-history__header__description',
        className: 'bbbb',
    },
    {
        title: '*Estado',
        wrapperClassName: 'table-contingency-history__header__state',
        className: 'bbbb',
    },
    {
        title: '',
        wrapperClassName: 'table-contingency-history__header__icon',
        className: 'bbbb',
    },
];
