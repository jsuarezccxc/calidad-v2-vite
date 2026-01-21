import { IGenericPaginationData } from '@constants/PaginationBack';
import { IGenericRecord } from '@models/GenericRecord';
import {
    ICategory,
    IUnitMeasurement,
    IVariant,
    IWarehouseControlReport,
    ITaxes,
    IBuildProduct,
    IKardexMovement,
    ICompanyShipping,
    ICitiesProvisionServices,
    IQuantitiesProductWarehouse,
} from '@models/Inventory';

export enum ActionKeys {
    SET_CATEGORIES = 'SET_CATEGORIES',
    SET_VARIANTS = 'SET_VARIANTS',
    SET_WAREHOUSE_CONTROL_REPORT = 'SET_WAREHOUSE_CONTROL_REPORT',
    SET_UNIT_MEASUREMENTS = 'SET_UNIT_MEASUREMENTS',
    SET_UNIT_MEASUREMENTS_DIAN = 'SET_UNIT_MEASUREMENTS_DIAN',
    SET_RETENTION_CONCEPT = 'SET_RETENTION_CONCEPT',
    SET_TAXES = 'SET_TAXES',
    SET_BUILD_PRODUCT = 'SET_BUILD_PRODUCT',
    SET_KARDEX_MOVEMENT = 'SET_KARDEX_MOVEMENT',
    SET_FAILED_ERROR = 'SET_FAILED_ERROR',
    SET_UNIQUE_PRODUCTS = 'SET_UNIQUE_PRODUCTS',
    SET_SHIPPING_COST = 'SET_SHIPPING_COST',
    SET_GET_SHIPPING_COST = 'SET_GET_SHIPPING_COST',
    DELETE_SHIPPING_COST = 'DELETE_SHIPPING_COST',
    UPDATE_SHIPPING_COST = 'UPDATE_SHIPPING_COST',
    SAVE_SHIPPING_COST = 'SAVE_SHIPPING_COST',
    SET_IS_PRODUCT = 'SET_IS_PRODUCT',
    SET_PROVISION_SERVICES = 'SET_PROVISION_SERVICES',
    SET_QUANTITIES_PRODUCT_WAREHOUSE = 'SET_QUANTITIES_PRODUCT_WAREHOUSE',
    SET_UNIQUE_PRODUCT_INVENTORY = 'SET_UNIQUE_PRODUCT_INVENTORY',
}

export interface ISetCategories {
    type: ActionKeys.SET_CATEGORIES;
    categories: ICategory[];
}

export interface ISetVariants {
    type: ActionKeys.SET_VARIANTS;
    variants: IVariant[];
}

export interface ISetWarehouseControlReport {
    type: ActionKeys.SET_WAREHOUSE_CONTROL_REPORT;
    warehouse_report: IWarehouseControlReport[];
}

export interface ISetUnitMeasurements {
    type: ActionKeys.SET_UNIT_MEASUREMENTS;
    unit_measurements: IUnitMeasurement[];
}

export interface ISetUnitMeasurementsDian {
    type: ActionKeys.SET_UNIT_MEASUREMENTS_DIAN;
    unit_measurements_dian: IGenericRecord[];
}

export interface ISetRetentionConcept {
    type: ActionKeys.SET_RETENTION_CONCEPT;
    retention_concept: IGenericRecord[];
}

export interface ISetTaxes {
    type: ActionKeys.SET_TAXES;
    taxes: ITaxes[];
}

export interface ISetBuildProduct {
    type: ActionKeys.SET_BUILD_PRODUCT;
    build_product: IBuildProduct;
}

export interface ISetIsProduct {
    type: ActionKeys.SET_IS_PRODUCT;
    is_product: boolean;
}

export interface ISetFailedError {
    type: ActionKeys.SET_FAILED_ERROR;
    error: string;
}

export interface ISetKardexPoduct {
    type: ActionKeys.SET_KARDEX_MOVEMENT;
    kardexMovement: IGenericPaginationData<IKardexMovement>;
}

export interface ISetUniqueProducts {
    type: ActionKeys.SET_UNIQUE_PRODUCTS;
    unique_products: IGenericRecord[];
}

export interface ISetShippingCost {
    type: ActionKeys.SET_SHIPPING_COST;
    shipping_cost: ICompanyShipping;
}

export interface IDeleteShippingCost {
    type: ActionKeys.DELETE_SHIPPING_COST;
    delete_shipping_cost: number | string;
}

export interface ISaveShippingCost {
    type: ActionKeys.SAVE_SHIPPING_COST;
    save_shipping_cost: number | string;
}

export interface ISetProvisionServices {
    type: ActionKeys.SET_PROVISION_SERVICES;
    provisionService: ICitiesProvisionServices[];
}

export interface ISetUniqueProductInventory {
    type: ActionKeys.SET_UNIQUE_PRODUCT_INVENTORY;
    payload: IGenericRecord;
}

export interface ISetQuantitiesProductWarehouse {
    type: ActionKeys.SET_QUANTITIES_PRODUCT_WAREHOUSE;
    quantitiesProductWarehouse: IQuantitiesProductWarehouse[];
}

export type InventoryActions =
    | ISetCategories
    | ISetVariants
    | ISetWarehouseControlReport
    | ISetUnitMeasurements
    | ISetTaxes
    | ISetBuildProduct
    | ISetKardexPoduct
    | ISetFailedError
    | ISetUniqueProducts
    | ISetShippingCost
    | IDeleteShippingCost
    | ISaveShippingCost
    | ISetUnitMeasurementsDian
    | ISetRetentionConcept
    | ISetIsProduct
    | ISetProvisionServices
    | ISetQuantitiesProductWarehouse
    | ISetUniqueProductInventory;
