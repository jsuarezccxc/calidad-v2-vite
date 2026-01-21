import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { Routes } from '@constants/Paths';
import { currentDateInUnix } from '@utils/Date';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './WebsiteInventory';

/**
 * This interface is website inventory
 *
 * @typeParam isDualModule: boolean - Flag to show or hide this inventory movements
 */
export interface IWebsiteInventory {
    isDualModule: boolean;
}

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const getRoutes = (isDualModule: boolean): Section[] => {
    const parentModule = isDualModule ? Routes.WEBSITE_DASHBOARD : Routes.ACCOUNTING_FINANCE;

    return [
        {
            name: getRouteName(parentModule),
            route: getRoute(parentModule),
        },
        {
            name: getRouteName(Routes.INVENTORY_MOVEMENTS),
            route: '#',
        },
    ];
};

/**
 * Placeholder data for representing an empty table
 */
export const INITIAL_DATA = {
    id: null,
    name: '',
    reference: '',
    unit_measurement: '',
    unit_measurement_id: '',
    is_perishable: null,
    batches: [],
};

/**
 * Enum options for boolean select
 */
const enum OptionBoolean {
    SI = 'Si',
    No = 'No',
}

/**
 * @param value boolean
 * Function that returns the string "Si" | "No"
 * @returns string
 */
export const boolToString = (value: boolean): string => {
    return value ? OptionBoolean.SI : OptionBoolean.No;
};

/**
 * @param value string "Si" | "No"
 * Function that returns the boolean
 * @returns string
 */
export const StringToBool = (value: string): boolean => {
    return value === OptionBoolean.SI;
};

/**
 * Options for is_perishable select
 */
export const IS_PERISHABLE_OPTIONS: IOptionSelect[] = [
    { key: 'SI', value: 'Si' },
    { key: 'NO', value: 'No' },
];

/**
 * Represent Placeholder for an empty warehouse
 */
export const EMPTY_WAREHOUSE = {
    name: '',
    date: currentDateInUnix(),
    inventory_transaction_detail_id: null,
    inventory_transaction_id: null,
    purchase_detail_id: null,
    quantity: null,
    is_editable: true,
    isNew: true,
    is_output: false
};

/**
 * Represent Placeholder for an empty batch
 */
export const EMPTY_BATCH = {
    number: null,
    date_expired: null,
    inventory_transaction_detail_id: null,
    inventory_transaction_id: null,
    purchase_detail_id: null,
    quantity: null,
    is_editable: true,
    warehouses: [],
    isNew: true,
    is_output: false,
};

/**
 * Represent N/A batch for no perishable product
 */
export const NA_BATCH = {
    number: 'NA',
    date_expired: 'NA',
    warehouses: [],
};

/**
 * Represent max of characters to batch field
 */
export const MAX_FIELD_BATCH_LENGTH = 80;

/**
 * Represent max of characters to quantity field
 */
export const MAX_FIELD_QUANTITY_LENGTH = 12;
