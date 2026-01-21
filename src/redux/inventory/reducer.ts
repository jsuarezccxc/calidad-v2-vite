import { IGenericPaginationData, paginationDataFormatDynamic } from '@constants/PaginationBack';
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
import { ActionKeys, InventoryActions } from './types';

const {
    SET_CATEGORIES,
    SET_VARIANTS,
    SET_WAREHOUSE_CONTROL_REPORT,
    SET_UNIT_MEASUREMENTS,
    SET_TAXES,
    SET_BUILD_PRODUCT,
    SET_KARDEX_MOVEMENT,
    SET_FAILED_ERROR,
    SET_UNIQUE_PRODUCTS,
    SET_SHIPPING_COST,
    DELETE_SHIPPING_COST,
    SAVE_SHIPPING_COST,
    SET_UNIT_MEASUREMENTS_DIAN,
    SET_RETENTION_CONCEPT,
    SET_IS_PRODUCT,
    SET_PROVISION_SERVICES,
    SET_QUANTITIES_PRODUCT_WAREHOUSE,
    SET_UNIQUE_PRODUCT_INVENTORY
} = ActionKeys;

interface IInventoryState {
    is_product: boolean;
    categories: ICategory[];
    variants: IVariant[];
    warehouse_report: IWarehouseControlReport[];
    unit_measurements: IUnitMeasurement[];
    unit_measurements_dian: IGenericRecord[];
    retention_concept: IGenericRecord[];
    kardexMovement: IGenericPaginationData<IKardexMovement>;
    taxes: ITaxes[];
    build_product: IBuildProduct | null;
    error: string;
    unique_products: IGenericRecord[];
    shipping_cost: ICompanyShipping | null;
    delete_shipping_cost: number | string;
    save_shipping_cost: number | string;
    provisionService: ICitiesProvisionServices[];
    quantitiesProductWarehouse: IQuantitiesProductWarehouse[];
    uniqueProductInventory:IGenericRecord
}

const initialState = {
    is_product: false,
    categories: [],
    variants: [],
    warehouse_report: [],
    unit_measurements: [],
    unit_measurements_dian: [],
    retention_concept: [],
    kardexMovement: paginationDataFormatDynamic<IKardexMovement>(),
    taxes: [],
    build_product: null,
    error: '', 
    unique_products: [],
    shipping_cost: null,
    delete_shipping_cost: '',
    save_shipping_cost: '',
    provisionService: [],
    quantitiesProductWarehouse: [],
    uniqueProductInventory:{},
};

export const reducer = (state: IInventoryState = initialState, action: InventoryActions): IInventoryState => {
    switch (action.type) {
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.categories,
            };
        case SET_VARIANTS:
            return {
                ...state,
                variants: action.variants,
            };
        case SET_WAREHOUSE_CONTROL_REPORT:
            return {
                ...state,
                warehouse_report: action.warehouse_report,
            };
        case SET_UNIT_MEASUREMENTS:
            return {
                ...state,
                unit_measurements: action.unit_measurements,
            };
        case SET_TAXES:
            return {
                ...state,
                taxes: action.taxes,
            };
        case SET_BUILD_PRODUCT:
            return {
                ...state,
                build_product: action.build_product,
            };
        case SET_FAILED_ERROR:
            return {
                ...state,
                error: action.error,
            };
        case SET_KARDEX_MOVEMENT:
            return {
                ...state,
                kardexMovement: action.kardexMovement,
            };
        case SET_UNIQUE_PRODUCTS:
            return {
                ...state,
                unique_products: action.unique_products,
            };
        case SET_SHIPPING_COST:
            return {
                ...state,
                shipping_cost: action.shipping_cost,
            };
        case DELETE_SHIPPING_COST:
            return {
                ...state,
                delete_shipping_cost: action.delete_shipping_cost,
            };
        case SAVE_SHIPPING_COST:
            return {
                ...state,
                save_shipping_cost: action.save_shipping_cost,
            };
        case SET_UNIT_MEASUREMENTS_DIAN:
            return {
                ...state,
                unit_measurements_dian: action.unit_measurements_dian,
            };
        case SET_RETENTION_CONCEPT:
            return {
                ...state,
                retention_concept: action.retention_concept,
            };
        case SET_IS_PRODUCT:
            return {
                ...state,
                is_product: action.is_product,
            };
        case SET_PROVISION_SERVICES:
            return {
                ...state,
                provisionService: action.provisionService,
            };
        case SET_QUANTITIES_PRODUCT_WAREHOUSE:
            return {
                ...state,
                quantitiesProductWarehouse: action.quantitiesProductWarehouse,
            };
        case SET_UNIQUE_PRODUCT_INVENTORY:
            return {
                ...state,
                uniqueProductInventory: action.payload,
            };
        default:
            return state;
    }
};
