import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { SelectSearchOption } from 'react-select-search';
import { IOptionSelect } from '@components/input';
import { IBodyTable, IHeaderTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';
import { IGenericRecord } from '@models/GenericRecord';
import { ChangeEvent as ChangeEventTable } from '@components/radiobutton';
import { IErrorsTableRetention } from '@components/table-tax-retention';

export * from './ElectronicDocument';

/**
 * This interface for custom errors
 * @typeParam error:boolean - state error
 * @typeParam message:string - message error
 */
export interface ICustomValidation {
    error: boolean;
    message: string;
}

/**
 * This interface describes electronic document props
 *
 * @typeParam isNew: boolean - Optional state to known if this document is new
 * @typeParam className: string - Optional class name container
 * @typeParam ids: IGenericRecord[] - Optional list ids select to check
 * @typeParam setSelectedId: Dispatch<SetStateAction<IGenericRecord[]>> - Optional action to select id
 * @typeParam handleDelete: () => void - Optional action to delete
 * @typeParam data_main_table IGenericRecord[] - Data to main table
 * @typeParam data_taxes IGenericRecord[] - Data to tax table
 * @typeParam fields: IGenericRecord - Props values from fields component
 * @typeParam fields_main_table: IGenericRecord - Props from values product and services table
 * @typeParam fields_tax_table: IGenericRecord - Props from values taxes table
 * @typeParam fields_withholdings: IGenericRecord - Props from values withholdings table
 * @typeParam valueTotals: IGenericRecord[] - List total values
 * @typeParam totalValues: boolean - State to disabled total fields
 * @typeParam handleTotals: (e: ChangeEvent<HTMLInputElement>) => void - Optional action to change value totals
 * @typeParam addProductService: boolean - State to show action
 * @typeParam delete_elements: boolean - State to show trash
 * @typeParam reason_rejection: boolean - State to show reason rejection field
 * @typeParam other_fields: boolean - Optional tate to show other fields
 * @typeParam route: string - Route to redirect module
 * @typeParam textRoute: string - Optional text shown in the route link
 * @typeParam routeOnClick  () => void - Optional action to on click link
 * @typeParam closeTimer: (e: React.MouseEvent<HTMLElement> | IGenericRecord) => void - Optional action to close timer
 * @typeParam validateClickTimePicker: boolean - Optional state to validate time picker
 * @typeParam showPaginator: boolean - Optional show pagination
 * @typeParam fiscal_responsibilities: IGenericRecord[] - Optional list fiscal responsibilities
 * @typeParam handleAddNewResponsibility: () => void - Optional Action to add new fiscal responsibilities
 * @typeParam fileLinkView: boolean - Optional file link view
 * @typeParam editableTotals: boolean - Optional toggle totals table to disable
 * @typeParam debitCreditNotes: boolean - Optional state to show fields
 * @typeParam fieldInputs: IGenericRecord - Optional initial inputs state
 * @typeParam setFieldInputs: Dispatch<SetStateAction<IGenericRecord>> - Optional change initial inputs state
 * @typeParam onChangeProductTable: (e: ChangeEventTable, item: IGenericRecord) => void - Optional onChangeTable;
 * @typeParam oneFiscalResponsibility?: boolean - Optional one fiscal responsibility
 * @typeParam onChangeSelect?: (e: IOptionSelect, item: IGenericRecord, name: string) => void - Optional change select
 * @typeParam onChangeWarehouse?: (e: IOptionSelect, item: IGenericRecord) => void - Optional change warehouse
 * @typeParam onChangeTaxes?: (e: ChangeEventTable, item: IGenericRecord) => void - Optional change taxes
 * @typeParam consecutive?: number - Optional consecutive
 * @typeParam annulation?: boolean -  Optional annulation note
 * @typeParam typeNote?: string - Optional type note
 * @typeParam isMultiOptionsTableMain?: boolean - Optional prop multi-options table
 * @typeParam handleAddProductService?: () => void - Optional function add products
 * @typeParam dataWithHoldings IGenericRecord[] - Optional data to withholdings table
 * @typeParam sendInvoice?: boolean - Optional check send invoice
 * @typeParam tableValidate?: boolean - Optional check table validate
 * @typeParam setTableData?: Dispatch<SetStateAction<IGenericRecord[]>> - Optional change table
 * @typeParam errorsTableValidate?: IGenericRecord[] - Optional array to table validate
 * @typeParam isViewTableTotals?: boolean - Optional prop specifies if it is a view to disable the fields
 * @typeParam errorsTableWithholdings?: IGenericRecord - Optional prop for errors table withholdings
 * @typeParam errorsCustom?: ICustomValidation - Optional prop for errors customs
 * @typeParam oneProductTable?: boolean - Optional check one product table
 * @typeParam disabledReteIva?: boolean - Optional disabled reteiva
 * @typeParam currentError?: IGenericRecord[] - Optional current errors state
 * @typeParam setCurrentError?: Dispatch<SetStateAction<IGenericRecord[]>> - Optional set current table errors
 * @typeParam showInvoiceNumber?: boolean - Check show invoice number
 * @typeParam tableErrors?: IGenericRecord[]; - Table errors strings
 * @typeParam handleChangeBatchAndDate?: (e: IOptionSelect, item: IGenericRecord, isDate: boolean) => void - Optional change batches;
 * @typeParam valuesTotal?: IGenericRecord - Optional value total
 * @typeParam isClientNote?: boolean - Optional value view
 * @typeParam optionsWithHoldings?: boolean - Optional array options for select withholdings table
 * @typeParam isSupportOrAdjustment?: boolean - Optional conditional for render support document or adjustment note information
 * @typeParam isAdjustmentNote?: boolean - Optional conditional for adjustment note information
 * @typeParam isSupportDocument?: boolean - Optional conditional for support document information
 * @typeParam isInvoice?: boolean - Optional conditional for invoice document information
 * @typeParam selectFile?: IGenericRecord - Optional object for document logo
 * @typeParam setSelectFile?: Dispatch<SetStateAction<IGenericRecord>> - Optional set current document logo
 * @typeParam symbol: string - Symbol to show in totals
 **/
export interface IElectronicDocumentProps {
    isNew?: boolean;
    isInfoView?: boolean;
    className?: string;
    ids?: IGenericRecord[];
    inputsKeys?: boolean;
    fieldsInputsKeys?: IGenericRecord;
    setFieldsInputsKeys?: Dispatch<SetStateAction<IGenericRecord>>;
    setSelectedId?: Dispatch<SetStateAction<IGenericRecord[]>>;
    handleDelete?: () => void;
    data_main_table: IGenericRecord[];
    data_taxes: IGenericRecord[];
    fields?: IGenericRecord;
    fields_main_table?: IGenericRecord;
    fields_tax_table?: IGenericRecord;
    fields_withholdings?: IGenericRecord;
    valueTotals: IGenericRecord[];
    totalValues: boolean;
    handleTotals?: (e: ChangeEvent<HTMLInputElement>) => void;
    addProductService: boolean;
    delete_elements: boolean;
    reason_rejection: boolean;
    other_fields?: boolean;
    route: string;
    textRoute?: string;
    routeOnClick?: () => void;
    closeTimer?: (e: React.MouseEvent<HTMLElement> | IGenericRecord) => void;
    validateClickTimePicker?: boolean;
    showPaginator?: boolean;
    fiscal_responsibilities?: IGenericRecord[];
    handleAddNewResponsibility?: () => void;
    fileLinkView?: boolean;
    editableTotals?: boolean;
    debitCreditNotes?: boolean;
    fieldInputs?: IGenericRecord;
    setFieldInputs?: Dispatch<SetStateAction<IGenericRecord>>;
    onChangeProductTable?: (e: ChangeEventTable, item: IGenericRecord) => void;
    oneFiscalResponsibility?: boolean;
    onChangeSelect?: (e: IOptionSelect, item: IGenericRecord, name: string) => void;
    onChangeWarehouse?: (e: IOptionSelect, item: IGenericRecord) => void;
    onChangeTaxes?: (e: ChangeEventTable, item: IGenericRecord, isWithHoldings?: boolean) => void;
    consecutive?: number;
    annulation?: boolean;
    typeNote?: string;
    isMultiOptionsTableMain?: boolean;
    handleAddProductService?: () => void;
    dataWithHoldings?: IGenericRecord[];
    sendInvoice?: boolean;
    tableValidate?: boolean;
    setTableData?: Dispatch<SetStateAction<IGenericRecord[]>>;
    errorsTableValidate?: IGenericRecord[];
    isViewTableTotals?: boolean;
    errorsTableWithholdings?: IGenericRecord;
    errorsCustom?: ICustomValidation[];
    oneProductTable?: boolean;
    disabledReteIva?: boolean;
    currentError?: IGenericRecord[];
    setCurrentError?: Dispatch<SetStateAction<IGenericRecord[]>>;
    showInvoiceNumber?: boolean;
    tableErrors?: IGenericRecord[];
    handleChangeBatchAndDate?: (e: IOptionSelect, item: IGenericRecord, isDate: boolean) => void;
    valuesTotal?: IGenericRecord;
    isClientNote?: boolean;
    optionsWithHoldings?: SelectSearchOption[];
    isSupportOrAdjustment?: boolean;
    isAdjustmentNote?: boolean;
    isSupportDocument?: boolean;
    isInvoice?: boolean;
    selectFile?: IGenericRecord;
    setSelectFile?: Dispatch<SetStateAction<IGenericRecord>>;
    symbol: string;
}

/**
 * This interface describes total invoice tables props
 *
 * @typeParam dataTaxes: IGenericRecord[] - Data to tax table
 * @typeParam dataWithholdings: IGenericRecord[] - optional data to withholdings table
 * @typeParam fiscalResponsibilitiesOptions: IGenericRecord[] - optional data to fiscal Responsibilities Options
 * @typeParam fields_tax_table: IGenericRecord - Fields props from tax table
 * @typeParam fields_withholdings_table: IGenericRecord - Fields optional prop from withholdings table
 * @typeParam dataTotals: { title: string; value: number }[] - List total values
 * @typeParam totalValues: boolean - Disabled total fields
 * @typeParam handleTotals: (e: ChangeEvent<HTMLInputElement>) => void - Action to change value totals
 * @typeParam fieldsInputs: IGenericRecord - Optional data registration
 * @typeParam editableTotals: boolean - Optional toggle totals table to disable
 * @typeParam onChangeProductTable: (e: ChangeEventTable, item: IGenericRecord, index?: number) => void - Optional onChangeTable;
 * @typeParam onChangeTaxes?: (e: ChangeEventTable, item: IGenericRecord, index?: number) => void = Optional change taxes
 * @typeParam setDataTaxes?: (taxes: IGenericRecord[]) => void = Optional set data taxes
 * @typeParam isView: boolean Optional prop specifies if it is a view to disable the fields
 * @typeParam annulation?: boolean -  Optional annulation note
 * @typeParam typeNote?: string = Optional type note
 * @typeParam totalIva?: number = Optional number is the total discount
 * @typeParam errorsTableWithholdings?: IGenericRecord - Optional prop for errors table withholdings
 * @typeParam disabledReteIva?: boolean?: boolean - Optional disabled reteiva
 * @typeParam currentCountry?: string - Optional current country
 * @typeParam currentError?: IGenericRecord[] - Optional current errors state
 * @typeParam setCurrentError?: Dispatch<SetStateAction<IGenericRecord[]>> - Optional set state errors
 * @typeParam totalsValues?: IGenericRecord - Optional prop values total
 * @typeParam hiddenTaxes?: boolean - Optional prop hidden taxes
 * @typeParam hiddenTotals?: string[] - Optional keys hidden in table totals
 * @typeParam hiddenRete?: string[] - Optional keys hidden in table retentions
 * @typeParam hiddenRequiredFields?: boolean - Hidden symbol '*' in table titles
 * @typeParam optionsWithHoldings?: boolean - Optional array options for select withholdings table
 * @typeParam setFieldInputs: Dispatch<SetStateAction<IGenericRecord>> - Optional change initial inputs state
 * @typeParam handleChange: (e: React.ChangeEvent<HTMLInputElement>, setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>, fieldInputs: IGenericRecord, required?: boolean) => void - Change inputs
 * @typeParam fields: IGenericRecord - Optional fields from inputs
 * @typeParam symbol: string - Optional symbol to show in totals
 */
export interface ITotalInvoiceTablesProps {
    dataTaxes: IGenericRecord[];
    dataWithholdings?: IGenericRecord[];
    fiscalResponsibilitiesOptions?: IGenericRecord[];
    fields_tax_table: IGenericRecord;
    fields_withholdings_table?: IGenericRecord;
    dataTotals: IGenericRecord[];
    data_table_totals?: IGenericRecord[];
    totalValues: boolean;
    handleTotals: (e: ChangeEvent<HTMLInputElement>) => void;
    fieldsInputs?: IGenericRecord;
    editableTotals: boolean;
    onChangeProductTable?: (e: ChangeEventTable, item: IGenericRecord, index?: number) => void;
    onChangeTaxes?: (e: ChangeEventTable, item: IGenericRecord, isWithHoldings?: boolean) => void;
    setDataTaxes?: (taxes: IGenericRecord[]) => void;
    isView?: boolean;
    annulation?: boolean;
    typeNote?: string;
    totalIva?: number;
    errorsTableWithholdings?: IGenericRecord;
    disabledReteIva?: boolean;
    currentCountry?: string;
    currentError?: IGenericRecord[];
    setCurrentError?: Dispatch<SetStateAction<IGenericRecord[]>>;
    totalsValues?: IGenericRecord;
    hiddenTaxes?: boolean;
    hiddenTotals?: string[];
    hiddenRete?: string[];
    hiddenRequiredFields?: RegExp | string;
    optionsWithHoldings?: SelectSearchOption[];
    setFieldInputs?: Dispatch<SetStateAction<IGenericRecord>>;
    handleChange?: (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord,
        required?: boolean
    ) => void;
    fields?: IGenericRecord;
    symbol: string;
}

/**
 * This interface describes total value object
 *
 * @typeParam value: number - Value from total
 * @typeParam field: boolean - Field total
 */
export interface ITotalValue {
    value: number;
    field: string;
}

/**
 * This interface describes object to text input
 *
 * @typeParam value: string | number - Value from text input
 * @typeParam disabled: boolean - Disabled from text input
 * @typeParam onChange: (e: React.ChangeEvent<HTMLInputElement>) => void - Action to change value from text input
 */
export interface IObjectText {
    value: string;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, item?: IGenericRecord) => void;
    required?: boolean;
    requiredText?: string;
}

/**
 * This interface describes object to select input
 *
 * @typeParam value: string - Value from select input
 * @typeParam disabled: boolean - Disabled from select input
 * @typeParam options: IOptionSelect[] - Options from select input
 * @typeParam onChange: (option: IOptionSelect) => void - Action to change value from select input
 */
export interface IObjectSelect {
    value: string;
    disabled: boolean;
    options: IOptionSelect[] | IOptionSelect[][];
    onChange: (option: IOptionSelect, others?: IGenericRecord) => void;
    required?: boolean;
    requiredText?: string;
}

/**
 * This interface describes object to select search input
 *
 * @typeParam value: string - Value from select search input
 * @typeParam disabled: boolean - Disabled from select search input
 * @typeParam options: SelectSearchOption[] - Options from select search input
 * @typeParam onChange: () => void - Action to change value from select search input
 */
export interface IObjectSelectSearch {
    value: string;
    disabled: boolean;
    options: SelectSearchOption[];
    onChange: (option: SelectSearchOption, others?: IGenericRecord) => void;
    required?: boolean;
    requiredText?: string;
}

/**
 * This interface describes object to date input
 *
 * @typeParam value: number - Value from date input
 * @typeParam disabled: boolean - Disabled from date input
 * @typeParam onChange: (date: Date, event: React.SyntheticEvent) => void - Action to change value from date input
 */
export interface IObjectDate {
    value: number;
    disabled: boolean;
    onChange: (date: Date, event: React.SyntheticEvent) => void;
    required?: boolean;
    requiredText?: string;
}

/**
 * This interface describe fields from object in data
 *
 * @typeParam [key: string]: IObjectText | IObjectSelect | IObjectSelectSearch | IObjectDate - Values object from data init
 */
export interface IFields {
    [key: string]: IObjectText | IObjectSelect | IObjectSelectSearch | IObjectDate | IGenericRecord;
}

/**
 * Data header from products and services table
 */
export const headersTable: IHeaderTable[] = [
    {
        title: 'No',
        className: 'w-11 lg:h-9.75 xs:h-8.6',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'SKU/Código de servicio',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Producto/Servicio',
        className: 'w-48',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Bodega',
        className: 'w-38',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Lote',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Fecha de vencimiento',
        className: 'w-38 px-4',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Descripción',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Cantidad',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: '*Unidad de medida',
        className: 'w-48',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Valor unitario',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Venta',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Dto.',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Costo de envío',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Valor venta',
        className: 'w-32.5',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'Impoconsumo',
        className: 'w-28',
        wrapperClassName: 'padding-none',
    },
    {
        title: 'IVA',
        className: 'w-28',
        wrapperClassName: 'padding-none',
    },
    {
        className: 'w-max',
    },
];

/**
 * Data body from products and services table
 *
 * @param fields: IGenericRecord - Fields disabled in table
 * @param onChange: (e: ChangeEventTable, item: IGenericRecord) => void - Onchange fields
 * @param keyOptions
 * @returns IBodyTable[] - Data to table
 */
export const fieldsBody = (
    fields: IGenericRecord,
    onChange: (e: ChangeEventTable, item: IGenericRecord) => void,
    keyOptions = 'options'
): IBodyTable[] => {
    return [
        {
            type: ITableFieldType.TEXT,
            field: 'number',
            wrapperClassName: 'without-padding',
            className: 'w-11',
            onChange,
            editableField: !fields.number.disabled,
        },
        {
            type: ITableFieldType.SELECT,
            field: 'sku',
            wrapperClassName: 'without-padding',
            className: 'w-27',
            options: fields.sku.options,
            onChangeSelect: fields.sku.onChange,
            editableField: !fields.sku.disabled,
        },
        {
            type: ITableFieldType.SELECT,
            field: 'element',
            wrapperClassName: 'without-padding',
            className: 'w-32.7',
            options: fields.element.options,
            onChangeSelect: fields.element.onChange,
            editableField: !fields.element.disabled,
        },
        {
            type: ITableFieldType.SELECT,
            field: 'warehouse',
            wrapperClassName: 'without-padding',
            className: 'w-26',
            [keyOptions]: fields.warehouse.options,
            onChangeSelect: fields.warehouse.onChange,
            editableField: !fields.warehouse.disabled,
        },
        {
            type: ITableFieldType.SELECT,
            field: 'lot',
            wrapperClassName: 'without-padding',
            className: 'w-28.2',
            [keyOptions]: fields.lot.options,
            onChangeSelect: fields.lot.onChange,
            editableField: !fields.lot.disabled,
        },
        {
            type: ITableFieldType.DATE,
            field: 'date',
            wrapperClassName: 'without-padding',
            className: 'w-full',
            editableField: !fields.date.disabled,
        },
        {
            type: ITableFieldType.TEXT_AREA,
            field: 'description',
            wrapperClassName: 'without-padding',
            className: 'w-49',
            onChange,
            editableField: !fields.description.disabled,
        },
        {
            type: ITableFieldType.VALUE,
            field: 'quantity',
            wrapperClassName: 'without-padding',
            className: 'w-20',
            onChange: fields.quantity.onChange,
            editableField: !fields.quantity.disabled,
            withIcon: false,
        },
        {
            type: ITableFieldType.TEXT,
            field: 'measurement',
            wrapperClassName: 'without-padding',
            className: 'w-20',
            onChange,
            editableField: !fields.measurement.disabled,
        },
        {
            type: ITableFieldType.VALUE,
            field: 'unit_value',
            wrapperClassName: 'without-padding',
            inputClass: 'w-full',
            containerClass: 'w-28.5',
            onChange,
            editableField: !fields.unit_value.disabled,
        },
        {
            type: ITableFieldType.VALUE,
            field: 'sale',
            wrapperClassName: 'without-padding',
            inputClass: 'w-full',
            containerClass: 'w-28.5',
            onChange,
            editableField: !fields.sale.disabled,
        },
        {
            type: ITableFieldType.VALUE,
            field: 'discount',
            wrapperClassName: 'without-padding',
            inputClass: 'w-full',
            containerClass: 'w-28.5',
            onChange,
            editableField: !fields.discount.disabled,
            allowInitZeros: true,
        },
        {
            type: ITableFieldType.VALUE,
            field: 'send_cost',
            wrapperClassName: 'without-padding',
            inputClass: 'w-full',
            containerClass: 'w-28.5',
            onChange,
            editableField: !fields.send_cost.disabled,
        },
        {
            type: ITableFieldType.VALUE,
            field: 'sale_cost',
            wrapperClassName: 'without-padding',
            inputClass: 'w-full',
            containerClass: 'w-28.5',
            onChange,
            editableField: !fields.sale_cost.disabled,
        },
        {
            type: ITableFieldType.PERCENTAGE,
            field: 'percentage',
            wrapperClassName: 'without-padding',
            inputClass: 'w-full',
            containerClass: 'w-28.5',
            onChange,
            editableField: !fields.percentage.disabled,
        },
        {
            type: ITableFieldType.PERCENTAGE,
            field: 'iva',
            wrapperClassName: 'without-padding',
            name: 'iva',
            inputClass: 'w-full',
            containerClass: 'w-22',
            onChange,
            editableField: !fields.iva.disabled,
        },
        {
            type: ITableFieldType.CHECKBOX,
            field: 'check',
            wrapperClassName: `${!fields.check.disabled ? '' : 'd-none'}`,
            className: `margin-check`,
            editableField: !fields.check.disabled,
        },
    ];
};

/**
 * Data fake products and services table
 */
export const dataFake = [
    {
        id: 1,
        number: '0021',
        sku: 'xxxxx',
        element: 'Producto 1',
        lot: 'Lote 1',
        date: 1636499517,
        warehouse: 'Bodega 1',
        description: 'Descripción',
        quantity: 2,
        measurement: 'Kg',
        unit_value: 100000,
        sale: 100000,
        discount: 100000,
        percentage_discount: 0,
        send_cost: 100000,
        sale_cost: 100000,
        percentage: 12,
        iva: 19,
    },
    {
        id: 2,
        number: '0021',
        sku: 'xxxxx',
        element: 'Producto 1',
        lot: 'Lote 1',
        date: 1636499517,
        warehouse: 'Bodega 1',
        description: 'Descripción',
        quantity: 2,
        measurement: 'Kg',
        unit_value: 100000,
        sale: 100000,
        discount: 100000,
        percentage_discount: 0,
        send_cost: 100000,
        sale_cost: 100000,
        percentage: 12,
        iva: 19,
    },
    {
        id: 3,
        number: '0021',
        sku: 'xxxxx',
        element: 'Producto 1',
        lot: 'Lote 1',
        date: 1636499517,
        warehouse: 'Bodega 1',
        description: 'Descripción',
        quantity: 2,
        measurement: 'Kg',
        unit_value: 100000,
        sale: 100000,
        discount: 100000,
        percentage_discount: 0,
        send_cost: 100000,
        sale_cost: 100000,
        percentage: 12,
        iva: 19,
    },
];

/**
 * Data header from taxes table
 */
export const headerTableTaxes = [
    {
        title: 'Retención',
        className: 'h-5.75 xs:h-auto w-37',
        wrapperClassName: 'padding-0',
    },
    {
        title: 'Base',
        className: 'w-37',
        wrapperClassName: 'padding-0',
    },
    {
        title: 'Tarifa',
        className: 'w-37',
        wrapperClassName: 'padding-0',
    },
    {
        title: 'Valor',
        className: 'w-37',
        wrapperClassName: 'padding-0',
    },
];

/**
 * Data fake from taxes table
 */
export const dataTaxes = [
    {
        id: 1,
        name: '01 IVA',
        value: 1000,
        percentage: 19,
        is_tax: true,
        other_value: 1000,
    },
    {
        id: 2,
        name: '02 IVA',
        value: 1000,
        percentage: 5,
        is_tax: true,
        other_value: 1000,
    },
    {
        id: 3,
        name: '03 IVA',
        value: 1000,
        percentage: 0,
        is_tax: true,
        other_value: 1000,
    },
    {
        id: 4,
        name: '04 IVA',
        value: 1000,
        percentage: 'No grabado',
        is_tax: true,
        other_value: 1000,
    },
    {
        id: 4,
        name: '04 IVA',
        value: 1000,
        percentage: 'Excluido',
        is_tax: true,
        other_value: 1000,
    },
    {
        id: 5,
        name: '06 Retefuente',
        value: 1000,
        percentage: 19,
        is_tax: false,
        other_value: 1000,
    },
    {
        id: 6,
        name: '08 ReteIVA',
        value: 1000,
        percentage: 19,
        is_tax: false,
        other_value: 1000,
    },
];

/**
 * Titles from total table
 */
export const titleTotals = [
    {
        id: 'dp-electronic-invoice-cesi-total-sale',
        title: 'Total venta',
        field: 'total_sale',
        symbol: '+',
    },
    {
        id: 'dp-electronic-invoice-cesi-total-discount',
        title: 'Total descuento',
        field: 'total_discount',
        symbol: '-',
    },
    {
        id: 'dp-electronic-invoice-cesi-shipping-cost',
        title: 'Costo de envío',
        field: 'shipping_cost',
        symbol: '+',
    },
    {
        id: 'dp-electronic-invoice-cesi-total-sale-value',
        title: 'Total valor venta',
        field: 'total_sale_value',
        symbol: '+',
    },
    {
        id: 'dp-electronic-invoice-cesi-total-iva',
        title: 'Total IVA',
        field: 'total_iva',
        symbol: '+',
    },
    {
        id: 'dp-electronic-invoice-cesi-impoconsumo',
        title: 'Impoconsumo',
        field: 'impoconsumo',
        symbol: '+',
    },
    {
        id: 'dp-electronic-invoice-cesi-retefuente',
        title: 'Retefuente',
        field: 'retefuente',
        symbol: '-',
    },
    {
        id: 'dp-electronic-invoice-cesi-reteica',
        title: 'Reteica',
        field: 'reteica',
        symbol: '-',
    },
    {
        id: 'dp-electronic-invoice-cesi-reteiva',
        title: 'Reteiva',
        field: 'reteiva',
        symbol: '-',
    },
    {
        id: 'dp-electronic-invoice-cesi-total',
        title: 'Total',
        field: 'total',
        symbol: '+',
    },
];

/**
 * Initial data fields from fields
 */
export const initFields: IFields = {
    associated_document_prefix: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    associated_document_number: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    date_issue_associated_document: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    hour_issue_associated_document: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    prefix: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
        required: false,
        requiredText: '',
    },
    invoice_number: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    badge: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    date_issue: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    broadcast_time: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    due_date: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    reason_rejection: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    purchase_order_number: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    customer_document_type: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    customer_name: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    address: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    department_state: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    postal_code: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    purchase_manager: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    purchase_number_document_number: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    collection_days: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    way_pay: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    fiscal_responsibility: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    observations: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    sales_manager: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    customer_document_number: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    email: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    country: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    type_tax_payer: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    city: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    phone: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    type_document_purchase_manager: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    payment_type: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    type_taxpayer: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    tax_detail: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    seller_type_document: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: false,
    },
    seller_document_number: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
};

/**
 * Initial data fields from products and services table
 */
export const initFieldsTable: IFields = {
    number: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    sku: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    element: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    warehouse: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    lot: {
        value: '',
        options: [],
        onChange: () => {},
        disabled: true,
    },
    date: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    description: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    quantity: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    measurement: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    unit_value: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    sale: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    discount: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    send_cost: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    sale_cost: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    percentage: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    iva: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
    check: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
};

/**
 * Initial data fields disabled from taxes table
 */
export const initFieldsTaxTable: IFields = {
    tax: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    base: {
        value: 0,
        onChange: () => {},
        disabled: false,
    },
    rate: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    value: {
        value: 0,
        onChange: () => {},
        disabled: false,
    },
};

/**
 * Initial data fields disabled from withholdings table
 */
export const init_fields_Withholdings_table: IFields = {
    tax: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    base: {
        value: 0,
        onChange: () => {},
        disabled: false,
    },
    rate: {
        value: '',
        onChange: () => {},
        disabled: false,
    },
    value: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
};

//This constant stores temporary data that stores the pagination data
export const data = [{ prueba: 1 }, { prueba2: 2 }, { prueba3: 3 }];

//This constant stores the limits of each paginator
export const limitsPaginator = {
    start: 1,
    finish: 4,
};

//Is the page where the paginator is currently
export const currentPagePaginator = 0;

//This constant errors table withholdings
export const initStateErrorsWithholdings: IErrorsTableRetention = {
    reteFuente: false,
    messageFuente: '',
    reteIca: false,
    messageIca: '',
    reteIva: false,
    messageIva: '',
};
