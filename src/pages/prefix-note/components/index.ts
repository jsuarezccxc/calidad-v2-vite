import { IHeaderTable } from '@components/table';
import { ChangeEvent, IOptionSelect } from '@components/input';
import { IPrefixNote } from '..';

export * from './TablePrefix';

/**
 * This type is change event input select
 */
// eslint-disable-next-line
type onChangeSelect = (option: IOptionSelect, others: any) => void;

/**
 * This type is change event input
 */
// eslint-disable-next-line
type onChange = (e: ChangeEvent, other: any) => void;

/**
 * This interface is props component table
 * 
 * @typeParam typeNote: 'DEBIT_NOTE' | 'ADJUSTMENT_NOTE' - Type note
 * @typeParam onChangeSelect: onChangeSelect - Change input select
 * @typeParam onChangeCheckBox: onChange - Change input check box
 * @typeParam handleDelete: () => void - Event delete items
 * @typeParam onChangeInput: onChange - Change input text
 * @typeParam addPrefix: () => void - Event add item
 * @typeParam data: IPrefixNote[] - Data table
 * @typeParam errors: string[] - Errors table
 */
export interface ITablePrefixProps {
    typeNote: 'DEBIT_NOTE' | 'ADJUSTMENT_NOTE';
    onChangeSelect: onChangeSelect;
    onChangeCheckBox: onChange;
    handleDelete: () => void;
    onChangeInput: onChange;
    addPrefix: () => void;
    data: IPrefixNote[];
    errors: string[];
}

/**
 * This interface param table
 * 
 * @typeParam onChangeSelect: onChangeSelect - 
 * @typeParam onChangeCheckBox: onChange - 
 * @typeParam onChangeInput: onChange - 
 * @typeParam isDisabled?: boolean - 
 */
export interface IParamsTable {
    onChangeSelect: onChangeSelect;
    onChangeCheckBox: onChange;
    onChangeInput: onChange;
    isDisabled?: boolean;
}

/**
 * This const is for headers table
 */
export const HEADERS_TABLE: IHeaderTable[] = [
    {
        title: '',
        wrapperClassName: 'w-7.5',
    },
    {
        title: 'Tipo de documento',
        wrapperClassName: 'w-49',
    },
    {
        title: 'Prefijo',
        wrapperClassName: ' w-25.5',
    },
];
