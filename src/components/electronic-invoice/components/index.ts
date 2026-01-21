import { SelectedOption } from 'react-select-search';
import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { IOption } from '@components/select-search';
import { ChangeEvent } from '@components/radiobutton';
import { IChangePercentageDiscount } from '@models/ElectronicInvoice';
export { ModalUpdateCustomer, ModalUpdateDocumentNumber } from './invoice-modals';
export { TableInvoice } from './table-invoice/TableInvoice';
export { HeaderTableInvoice } from './header-table-invoice';
export * from './tooltip-icon';
export * from './tooltip-title';

/**
 * This interface is props for select input
 *
 * @typeParam name: string - Prop name select input
 * @typeParam options: IOption[] - Prop options select input
 * @typeParam multiOptions?: IOptionSelect[][] - Prop multi-options select input
 * @typeParam disabled: boolean - Prop disabled select input
 * @typeParam onChange?: (option: SelectedOption, others?: IGenericRecord | undefined, name?: string | undefined) => void - Prop action change for select search
 * @typeParam onChangeSimple?: (option: IOptionSelect, others?: IGenericRecord | undefined, name?: string | undefined) => void - Prop action change for select input
 */
interface IPropertiesSelect {
    name: string;
    options: IOption[];
    multiOptions?: IOptionSelect[][];
    disabled: boolean;
    onChange?: (option: SelectedOption, others?: IGenericRecord | undefined, name?: string | undefined) => void;
    onChangeSimple?: (option: IOptionSelect, others?: IGenericRecord | undefined, name?: string | undefined) => void;
}

/**
 * This interface is for date, text, number and percentage input
 *
 * @typeParam name: string - Prop name input
 * @typeParam disabled: boolean - Prop disabled input
 * @typeParam onChange?: (e: ChangeEvent | IChangePercentageDiscount, others: IGenericRecord, name?: string | undefined) => void - Prop action change input
 * @typeParam onChangeInput?: (e: IGenericRecord, item: IGenericRecord, keyName: string) => void -  Prop action change input
 */
interface IPropertiesText {
    name: string;
    disabled: boolean;
    onChange?: (e: ChangeEvent | IChangePercentageDiscount, others: IGenericRecord, name?: string | undefined) => void;
    onChangeInput?: (e: IGenericRecord, item: IGenericRecord, keyName: string) => void;
}

/**
 * This interface is for props inputs in table invoice
 *
 * @typeParam number: IPropertiesSelect - Row props input number
 * @typeParam sku: IPropertiesSelect - Row props input SKU
 * @typeParam products: IPropertiesSelect - Row props input products
 * @typeParam warehouse: IPropertiesSelect - Row props input warehouse
 * @typeParam batch: IPropertiesSelect - Row props input batch
 * @typeParam input_date_expiration: IPropertiesSelect - Row props input date expiration
 * @typeParam description: IPropertiesText - Row props input description
 * @typeParam quantity: IPropertiesText - Row props input quantity
 * @typeParam measurement: IPropertiesText - Row props input measurement
 * @typeParam unit_cost: IPropertiesText - Row props input unit cost
 * @typeParam percentage_discount: IPropertiesText - Row props input percentage discount
 * @typeParam discount: IPropertiesText - Row props input discount
 * @typeParam total_buy: IPropertiesText - Row props input total but
 * @typeParam percentage: IPropertiesText - Row props input impoconsumo
 * @typeParam iva: IPropertiesText - Row props input IVA
 * @typeParam check: IGenericRecord - Row props input check delete detail
 * @typeParam warehouse_input: IPropertiesText - Row props input warehouse text
 * @typeParam batch_input: IPropertiesText - Row props input batch text
 * @typeParam date_input: IPropertiesText - Row props input date text
 */
export interface IFieldColumns {
    number: IPropertiesSelect;
    sku: IPropertiesSelect;
    products: IPropertiesSelect;
    warehouse: IPropertiesSelect;
    batch: IPropertiesSelect;
    input_date_expiration: IPropertiesSelect;
    description: IPropertiesText;
    quantity: IPropertiesText;
    measurement: IPropertiesText;
    unit_cost: IPropertiesText;
    percentage_discount: IPropertiesText;
    discount: IPropertiesText;
    total_buy: IPropertiesText;
    percentage: IPropertiesText;
    iva: IPropertiesText;
    check: IGenericRecord;
    warehouse_input: IPropertiesText;
    batch_input: IPropertiesText;
    date_input: IPropertiesText;
}

/**
 * This interface is for props content table
 *
 * @typeParam data: IGenericRecord[] - Data content table
 * @typeParam fields: IFieldColumns - Inputs props inputs for content table
 * @typeParam setSelected: (item: IGenericRecord) => void - Action change state
 * @typeParam selected?: [] - State checkbox
 * @typeParam productOptions: IOption[] - Options SKU and products
 */
export interface IPropsContentTableInvoice {
    data: IGenericRecord[];
    fields: IFieldColumns;
    setSelected: (item: IGenericRecord) => void;
    selected?: [];
    productOptions: IOption[];
}

/**
 * This const is for class content table
 */
export const UNEDITABLE = 'uneditable';
