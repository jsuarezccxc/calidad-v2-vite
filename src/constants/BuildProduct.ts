export const VARIABLE = 'Variantes';
export const SKU_INTERNAL = 'sku_internal';
export const PERIODICITY = 'periodicity';
export const UNITARY_COST = 'unit_cost';
export const UNITARY_VALUE = 'unit_value';
export const ID = 'id';
export const TEMPORAL_ID = 'temporal_id';
export const TAX_CONSUMPTION = 'tax_consumption_id';
export const NAME = 'name';
export const CONSUMPTION = 'CONSUMPTION';
export const IVA = 'IVA';
export const INC = 'INC';
export const ICUI = 'ICUI';
export const IBUA = 'IBUA';
export const REFERENCES_ERROR = '*Debe armar al menos una referencia';

export enum Variants {
    Category = 'CATEGORY',
    Variant = 'VARIANT',
    VariantDetail = 'VARIAN_DETAIL',
}

export enum Item {
    Service = 'SERVICE',
    Perishable = 'PERISHABLE',
    Product = 'PRODUCT',
    ProductService = 'PRODUCT_SERVICE',
    NoPerishable = 'NO_PERISHABLE',
}

export enum TypeTransaction {
    Buy = 'BUY',
    Sale = 'SALE',
    BuySale = 'BUY_SALE',
}
