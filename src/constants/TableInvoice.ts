import { IFieldsAssign } from "@models/SupportDocument";

/**
 * This enum is keys in table invoice component
 */
export enum InvoiceTableKeys {
    SKU = 'sku_internal',
    DESCRIPTION = 'description',
    WAREHOUSE_ID = 'warehouse_id',
    WAREHOUSE = 'warehouse_name',
    BATCH_ID = 'batch_id',
    BATCH = 'batch_number',
    DATE = 'date_expiration',
    QUANTITY = 'quantity',
    UNIT_COST = 'unit_cost',
    UNIT_VALUE = 'unit_value',
    PERCENTAGE_DISCOUNT = 'percentage_discount',
    MANDATE = 'mandate_id',
}

/**
 * This const is for keys handle change
 */
export const KEYS_HANDLE = {
    CHANGE_OPTIONS: [InvoiceTableKeys.SKU, InvoiceTableKeys.WAREHOUSE, InvoiceTableKeys.BATCH, InvoiceTableKeys.DATE, InvoiceTableKeys.MANDATE],
    CHANGES_NUMBERS: [InvoiceTableKeys.QUANTITY, InvoiceTableKeys.UNIT_COST, InvoiceTableKeys.PERCENTAGE_DISCOUNT],
    CHANGES_TEXT: [InvoiceTableKeys.DESCRIPTION],
};

/**
 * This const is keys validate details
 */
export const KEYS_VALIDATE_DETAILS: string[] = [
    InvoiceTableKeys.SKU,
    InvoiceTableKeys.QUANTITY,
    InvoiceTableKeys.UNIT_COST,
    InvoiceTableKeys.WAREHOUSE,
    InvoiceTableKeys.BATCH,
    InvoiceTableKeys.DATE,
];

/**
 * 
 */
export const KEYS_ASSIGN_DETAIL: IFieldsAssign = {
    tree: {
        product: [
            { keyOrigin: 'ciiu_id' },
            { keyOrigin: 'is_product' },
        ],
    },
    base: [
        { keyOrigin: 'id'},
        { keyOrigin: 'id', keyValue: 'unique_products_id'},
        { keyOrigin: 'sku_internal' },
        { keyOrigin: 'reference' },
        { keyOrigin: 'name', keyValue: 'unique_product_name' },
        { keyOrigin: 'unit_measurement_id', keyValue: 'unit_measurements_id' },
        { keyOrigin: 'unit_measurement_name' },
        { keyOrigin: 'unit_measure_milliliters' },
        { keyOrigin: 'is_inventoriable' }
    ]
};
