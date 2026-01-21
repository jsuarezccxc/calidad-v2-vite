import { Section } from '@components/bread-crumb';
import { IOption } from '@components/select-search';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';

export * from './AddInventory';

/**
 * This constant indicate that no elements will be removed from the array
 */
export const NO_ELEMENTS_TO_REMOVE = 0;

/**
 * This constant indicate one row in table
 */
export const ONE_POSITION = 1;

/**
 * This constant represent absence of elements
 */
export const MIN_QUANTITY = 0;

/**
 * This constant represent first batch in product
 */
export const UNIQUE_BATCH_INDEX = 0;

/**
 * This constant represent that warehouses do no have quantities
 */
export const NO_QUANTITIES = 0;

/**
 * Routes bread crumb pages
 * @returns Section[]
 */
export const routes = (ShowCatalog: () => void, ShowProduct: () => void): Section[] => {
    return [
        {
            name: 'Ficha técnica',
            route: getRoute(Routes.DATABASE_MENU),
        },
        {
            name: 'Ficha técnica de productos/servicios',
            route: '#',
            onClick: ShowCatalog,
        },
        {
            name: 'Agregar producto/servicio',
            route: '#',
            onClick: ShowProduct,
        },
        {
            name: ' Agregar inventario',
            route: '#',
        },
    ];
};

/**
 * Options for is_perishable select
 */
export const IS_PERISHABLE_OPTIONS: IOption[] = [
    { name: 'SI', value: 'perishable', id: 'option-perishable-1' },
    { name: 'NO', value: 'non-perishable', id: 'option-perishable-2' },
];

/**
 * Initial State product perishable
 */
export const initialStatePerishable = (variant: IGenericRecord): IGenericRecord[] => [
    {
        variantId: variant.id,
        variant: variant.reference,
        variantName: variant.name,
        is_perishable: true,
        warehouseId: variant.batches?.[0]?.warehouses?.[0]?.idReference,
        batchesId: variant.batches?.[0]?.id,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        render: true,
        rowBatches: 2,
        totalRows: 3,
        renderBatch: true,
        addWarehouse: false,
        addBatch: false,
        dateBatch: '',
    },
    {
        variantId: variant.id,
        variant: variant.reference,
        variantName: variant.name,
        is_perishable: true,
        warehouseId: variant.batches?.[0]?.warehouses?.[0]?.idReference,
        batchesId: variant.batches?.[0]?.id,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        rowBatches: 2,
        addWarehouse: true,
        addBatch: false,
        dateBatch: '',
    },
    {
        variantId: variant.id,
        variant: variant.reference,
        variantName: variant.name,
        is_perishable: true,
        warehouseId: variant.batches?.[0]?.warehouses?.[0]?.idReference,
        batchesId: '',
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        rowBatches: 2,
        rowSpan: 3,
        addBatch: true,
        addWarehouse: false,
        dateBatch: '',
    },
];

/**
 * Initial State product non perishable
 */
export const initialStateNonPerishable = (variant: IGenericRecord): IGenericRecord[] => [
    {
        variantId: variant.id,
        variant: variant.reference,
        variantName: variant.name,
        is_perishable: false,
        warehouseId: variant.batches?.[0]?.warehouses?.[0]?.idReference,
        batchesId: variant.batches?.[0]?.id,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        render: true,
        totalRows: 2,
    },
    {
        variantId: variant.id,
        variant: variant.reference,
        variantName: variant.name,
        is_perishable: false,
        warehouseId: variant.batches?.[0]?.warehouses?.[0]?.idReference,
        batchesId: variant.batches?.[0]?.id,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        rowSpan: 3,
        addWarehouse: true,
    },
];

export const rowWarehouse = (variant: IGenericRecord, warehouseId: string): IGenericRecord => ({
    variantId: variant.variantId,
    variant: variant.variant,
    variantName: variant.variantName,
    is_perishable: variant.is_perishable,
    warehouseId: warehouseId,
    batchesId: variant.batchesId,
    lot: variant.lot ?? '',
    date_expired: variant.date_expired ?? '',
    dateBatch: variant.dateBatch,
    quantity: '',
    warehouse: '',
    render: '',
    totalRows: '',
    addBatch: false,
    addWarehouse: false,
});

/**
 * This function add two rows to table inventory
 * @param variant: IGenericRecord  - Information of product inventory
 * @param batchId: string - Id to identify batch in data
 * @param warehouseId: string - Id to identify warehouse in data
 * @returns
 */
export const rowsBatch = (variant: IGenericRecord, batchId: string, warehouseId: string): IGenericRecord[] => [
    {
        variantId: variant.variantId,
        variant: variant.variant,
        variantName: variant.variantName,
        is_perishable: true,
        warehouseId: warehouseId,
        batchesId: batchId,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        render: true,
        totalRows: 2,
    },
    {
        variantId: variant.variantId,
        vvariant: variant.variant,
        variantName: variant.variantName,
        is_perishable: true,
        warehouseId: warehouseId,
        batchesId: batchId,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        rowSpan: 3,
        addWarehouse: true,
    },
];

/**
 * This function adds data to a new batch in the table
 *
 * @param variant: IGenericRecord - Variant to base information
 * @param batchId: string - Represent batch id
 * @param warehouseId:string - Represent warehouse id
 * @returns IGenericRecord[]
 */
export const rowBatch = (variant: IGenericRecord, batchId: string, warehouseId: string): IGenericRecord[] => [
    {
        variantId: variant.variantId,
        variant: variant.variant,
        variantName: variant.variantName,
        is_perishable: variant.is_perishable,
        warehouseId,
        batchesId: batchId,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        render: '',
        totalRows: '',
        rowBatches: 2,
        renderBatch: true,
    },
    {
        variantId: variant.variantId,
        variant: variant.variant,
        variantName: variant.variantName,
        is_perishable: variant.is_perishable,
        warehouseId: variant.warehouseId,
        batchesId: batchId,
        lot: '',
        date_expired: '',
        quantity: '',
        warehouse: '',
        render: '',
        totalRows: '',
        rowBatches: 2,
        addWarehouse: true,
    },
];

/**
 * This function return new structure for inventory product
 * @param genericId : string - New id for batch
 * @returns IGenericRecord[]
 */
export const initialDataBatch = (batchesId: string, warehouseId: string): IGenericRecord[] => [
    {
        id: batchesId,
        number: '',
        batch_detail_id: null,
        purchase_detail_id: null,
        inventory_transaction_detail_id: null,
        is_perishable: false,
        quantity: 0,
        warehouses: [
            {
                id: '',
                idReference: warehouseId,
                inventory_transaction_id: null,
                inventory_transaction_detail_id: null,
                purchase_detail_id: null,
                name: '',
                date: '',
                quantity: 0,
                is_editable: true,
                rowWarehouse: 1,
            },
        ],
    },
];
