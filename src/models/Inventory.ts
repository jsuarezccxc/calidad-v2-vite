import { IGenericRecord } from './GenericRecord';
import { IUniqueProduct, IUniqueProductDetail } from './UnitValueCalculation';

/**
 * This interface describes that properties the category structure data receives
 *
 * @typeParam id: string - id is an identifier to assign from category
 * @typeParam name: string - name of category
 * @typeParam value: boolean - Optional value to know if it was selected
 * @typeParam edit: boolean - Optional prop to know if field is being edited
 * @typeParam main: boolean - Optional prop to know if field is default
 * @typeParam is_product: boolean - If it's product or service
 * @typeParam company_id: string - id is an identifier to assign category to company id
 * @typeParam product_types: IProductType[] - it's the list of product types from category
 * @typeParam is_default: boolean - Optional prop that indicates if the category is's by default
 * @typeParam checked: boolean - Optional prop that indicates if the category it's checked
 */
export interface ICategory {
    id: string;
    name: string;
    value?: boolean;
    edit?: boolean;
    main?: boolean;
    is_product: boolean;
    company_id: string;
    product_types: IProductType[];
    is_default?: boolean;
    checked?: boolean;
}

/**
 * This interface describes that properties the product type structure data receives
 *
 * @typeParam id: string - id is an identifier to assign from product type
 * @typeParam name: string - name of product type
 * @typeParam value: boolean - Optional value to know if it was selected
 * @typeParam edit: boolean - Optional prop to know if field is being edited
 * @typeParam main: boolean - Optional prop to know if field is default
 * @typeParam category_id: string - id is an identifier to assign product type to category
 * @typeParam is_perishable: boolean - If type product is perishable
 * @typeParam variants: IVariant[] - Optional list of variants from product type
 */
export interface IProductType {
    id: string;
    name: string;
    value?: boolean;
    edit?: boolean;
    main?: boolean;
    category_id: string;
    is_perishable: boolean;
    variants?: IVariant[];
}

/**
 * This interface describes that properties the product type structure data send
 *
 * @typeParam category_id: string - id is an identifier to assign product type to category
 * @typeParam name: string - name of product type
 * @typeParam is_perishable: boolean - Optional perishable type product
 */
export interface IStoreProductType {
    category_id: string;
    name: string;
    is_perishable?: boolean;
}

/**
 * This interface describes that properties the variant structure data receives
 *
 * @typeParam id: string - id is an identifier to assign from variant
 * @typeParam name: string - name of variant
 * @typeParam value: boolean - Optional value to know if it was selected
 * @typeParam edit: boolean - Optional prop to know if field is being edited
 * @typeParam main: boolean - Optional prop to know if field is default
 * @typeParam product_type_id: string - id is an identifier to assign variant to product type
 * @typeParam variant_details: IVariantDetail[] - it's the list of variants details from variants
 */
export interface IVariant {
    id: string;
    name: string;
    value?: boolean;
    edit?: boolean;
    main?: boolean;
    product_type_id: string;
    variant_details: IVariantDetail[];
}

/**
 * This interface describes that properties the variant structure data send
 *
 * @typeParam product_type_id: string - id is an identifier to assign variant to product type
 * @typeParam name: string - name of variant
 */
export interface IStoreVariant {
    product_type_id: string;
    name: string;
}

/**
 * This interface describes that properties the variant detail structure data receives
 *
 * @typeParam id: string - id is an identifier to assign from variant detail
 * @typeParam name: string - name of variant detail
 * @typeParam value: boolean - Optional value to know if it was selected
 * @typeParam edit: boolean - Optional prop to know if field is being edited
 * @typeParam main: boolean - Optional prop to know if field is default
 * @typeParam variant_id: string - id is an identifier to assign variant detail to variant
 * @typeParam is_default: boolean - Prop to know if field is default
 */
export interface IVariantDetail {
    id: string;
    name: string;
    value?: boolean;
    edit?: boolean;
    main?: boolean;
    variant_id: string;
    is_default: boolean;
}

/**
 * This interface describes that properties the variant detail store structure data receives
 *
 * @typeParam variant_id: string - id is an identifier to assign variant detail to variant
 * @typeParam name: string - name of variant detail
 */
export interface IStoreVariantDetail {
    variant_id: string;
    name: string;
}

/**
 * This interface describes that properties warehouse-config control report structure data receives
 *
 * @typeParam id: string - id is an identifier to warehouse-config
 * @typeParam name: string - name of warehouse-config
 * @typeParam products: IProduct[] - it's the list product store in warehouse-config
 */
export interface IWarehouseControlReport {
    id: string;
    name: string;
    products: IProduct[];
}

/**
 * This interface describes that properties the product object structure data receives
 *
 * @typeParam id: string - id is an identifier to product
 * @typeParam sku: string - sku from product
 * @typeParam initial_inventory: string - quantity from inventory
 * @typeParam initial_unit_cost: string - unit cost from inventory
 * @typeParam unit_purchases: string - purchases from units
 * @typeParam unit_purchases_cost: string - cost purchases from units
 * @typeParam unit_sales: string - sales from units
 * @typeParam unit_cost_in_sales: string - cost sales from units
 * @typeParam units_available: string - units avaible to use
 * @typeParam unit_cost_units_available: string - cost units avaible to use
 * @typeParam distribution_percentage: string - percentage distribution products
 */
export interface IProduct {
    id: string;
    sku: string;
    initial_inventory: number;
    initial_unit_cost: number;
    unit_purchases: number;
    unit_purchases_cost: number;
    unit_sales: number;
    unit_cost_in_sales: number;
    units_available: number;
    unit_cost_units_available: number;
    distribution_percentage: number;
}

/**
 * This interface describes type to use in unit measurements
 *
 * @typeParam id: string - Unit's id
 * @typeParam name: string - Unit's name
 * @typeParam description: string - Unit's description
 * @typeParam created_at: string - Optional unit's creation date
 * @typeParam updated_at: string - Optional unit's update date
 * @typeParam is_decimal: boolean - Unit has decimal
 * @typeParam is_integer: boolean - Unit is only integer
 */
export interface IUnitMeasurement {
    id: string;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    is_decimal: boolean;
    is_integer: boolean;
}

/**
 * This interface describes type to use in list options
 *
 * @typeParam id: string - Id from option
 * @typeParam parent_id: string - Optional parent id if element has id
 * @typeParam parent_name: string - Optional parent name if element has id
 * @typeParam product_type_id: string - Optional product type id if elment has element in type
 * @typeParam level: number - Number of level from view
 * @typeParam name: string - Name of option
 * @typeParam selected: boolean - Optional value selection;
 * @typeParam is_product?: boolean - Optional value to know if it is product
 * @typeParam is_perishable?: boolean - Optional value to product perishable
 * @typeParam children: IOption[] - Optional children list options from option
 */
export interface IOption {
    id: string;
    parent_id?: string;
    parent_name?: string;
    product_type_id?: string;
    level: number;
    name: string;
    selected: boolean;
    is_product?: boolean;
    is_perishable?: boolean;
    children?: IOption[];
}

/**
 * This interface describes type to use in list sections
 *
 * @typeParam name: string - title section from section
 * @typeParam options: IOption[] - list options to use in section
 */
export interface ISection {
    name: string;
    options: IOption[];
}

/**
 * This interface describes type to use in list tax
 *
 * @typeParam id: string - Id's tax
 * @typeParam name: string - Name's tax
 * @typeParam description: string - Description's tax
 * @typeParam percentage: number - Percentage's tax
 * @typeParam created_at: string | null - Date created tax
 * @typeParam updated_at: string | null - Date updated tax
 * @typeParam type: string - Optional type of tax
 */
export interface ITaxes {
    id: string;
    name: string;
    description: string;
    percentage: number;
    created_at: string | null;
    updated_at: string | null;
    type?: string;
}

/**
 * This interface define build product's data
 *
 * @typeParam id: string - Build product's id
 * @typeParam company_id: string - Company's id
 * @typeParam name: string - Product's name
 * @typeParam reference: string - Product's id
 * @typeParam category_id: string - Product's category id selected
 * @typeParam product_type_id: string - Product's product type id selected
 * @typeParam variants: IGenericRecord[] - Product's variant details id selected
 * @typeParam unique_products: IUniqueProduct[] - Product's unique list products
 * @typeParam ciiu_id: string - Product's ciiu id
 * @typeParam retention_concept_id: Product's retention concept id
 * @typeParam sku_internal: string - Product's sku internal
 * @typeParam unit_measurement_id: string - Product's unit measurement
 * @typeParam unit_measurement: string - Product's unit measurement name
 * @typeParam weight: string - Product's weight
 * @typeParam unit_value: number - Product's unit value
 * @typeParam unit_cost: number - Product's unit cost
 * @typeParam unique_product_details: IUniqueProductDetail - Product's list unique product details
 * @typeParam purchase_details: IPurchaseDetail[] - Optional Product's purchase list
 * @typeParam is_expired: boolean - Optional product's expiration state
 * @typeParam batches: IBachDetail[] - Optional product's batches details
 * @typeParam periodicity: number - Optional product's quantity
 * @typeParam deleted_at: number - Product's deleted date
 * @typeParam created_at: number - Product's created date
 * @typeParam updated_at: number - Product's updated date
 * @typeParam product_taxes: IGenericRecord - Product's taxes
 */
export interface IBuildProduct {
    id: string;
    company_id: string;
    name: string;
    reference: string;
    category_id: string;
    product_type_id: string;
    variants: IGenericRecord[];
    unique_products: IUniqueProduct[];
    ciiu_id: string;
    retention_concept_id: string;
    sku_internal: string;
    unit_measurement_id: string;
    unit_measurement: string;
    weight: string;
    unit_value: number;
    unit_cost: number;
    unique_product_details: IUniqueProductDetail[];
    purchase_details?: IPurchaseDetail[];
    is_expired?: boolean;
    batches?: IBachDetail[];
    periodicity?: number;
    deleted_at: number;
    created_at: number;
    updated_at: number;
    product_taxes: IGenericRecord;
}

/**
 * This interface define bach detail's data
 *
 * @typeParam warehouse_id: string - Warehouse id from product
 * @typeParam date: string - Date registration product
 * @typeParam quantity: number - Quantity from warehouse
 * @typeParam is_expired: boolean - Is expired producto from warehouse
 * @typeParam is_initial_inventory: boolean - Is initial inventory from warehouse
 */
export interface IPurchaseDetail {
    warehouse_id: string;
    date: string;
    quantity: number;
    is_expired: boolean;
    is_initial_inventory: boolean;
}

/**
 * This interface define bach detail's data
 *
 * @typeParam date_expired: number - bach's date expired
 * @typeParam quantity: number - bach's quantity
 * @typeParam is_expired: boolean - bach's status expired
 */
export interface IBachDetail {
    date_expired: number;
    quantity: number;
    is_expired: boolean;
}

/**
 * This interface describes the properties data shipping
 *
 * @typeParam company_id: string - require the id company
 * @typeParam shipping: IDataShipping[] - require for data shipping
 * @typeParam product: IAdditionalProducts[] - require for data additional product
 * @typeParam free_shipping: string - require data shipping free
 */
export interface IDestines {
    company_id: string;
    shipping: IDataShipping[];
    product: IAdditionalProducts[];
    free_shipping: string;
}

/**
 * This interface describes the properties data table shipping
 *
 * @typeParam country_id: number - require the id country
 * @typeParam country_name: string - require for name the country
 * @typeParam id: string - require for id the table shipping
 * @typeParam destinations: IDepartment[] - require for destinies
 */
export interface IDataShipping {
    country_id: number;
    country_name: string;
    id: string;
    destinations: IDepartment[];
}

/**
 * This interface describes the properties department
 *
 * @typeParam department_id: number | null - Optional id department
 * @typeParam department_name: string | null - Optional for name department
 * @typeParam id: string - Required for id department item
 * @typeParam cities: ICities[] - data cities
 */
export interface IDepartment {
    department_id?: number;
    department_name?: string;
    id: string;
    cities: ICities[];
}

/**
 * This interface describes the properties data shipping
 *
 * @typeParam name: string - require the name product
 * @typeParam id: string - require the id product
 * @typeParam additional_shipping_cost: string - require the shipping cost additional
 */
export interface IAdditionalProducts {
    name: string;
    id: string;
    additional_shipping_cost: string;
}

/**
 * This interface describes the properties cities
 *
 * @typeParam city_id: number - Required id city
 * @typeParam city_name: string - Required for name city
 * @typeParam id: string - Required for id cities
 * @typeParam estimated_time: string - Required for time estimated
 * @typeParam shipping_cost: string - Required for shipping cost
 */
export interface ICities {
    city_id: number;
    city_name: string;
    id: string;
    estimated_time: string;
    shipping_cost: string;
}

/**
 * This interface describes the properties data product
 *
 * @typeParam product: IProductInitial[] - require the data product initial
 */
export interface IProductInitialItems {
    product: IProductInitial[];
}

/**
 * This interface describes the properties data shipping
 *
 * @typeParam id: string - require the id product
 * @typeParam shipping_cost: string - require the value shipping cost
 */
export interface IProductInitial {
    id: string;
    shipping_cost: string;
}

/**
 * This interface describes the properties data shipping company
 *
 * @typeParam shipping: IShipping[] - require for data shipping company
 * @typeParam unique_products: IAdditionalProducts[] - require for data additional product
 * @typeParam free_shipping: string - require data shipping free
 */
export interface ICompanyShipping {
    shipping: IShipping[];
    unique_products: IAdditionalProducts[];
    free_shipping: string;
}

/**
 * This interface describes the properties data table shipping
 *
 * @typeParam country_id: number - require the id country
 * @typeParam country_name: string - require for name the country
 * @typeParam id: string - require for id the table shipping
 * @typeParam destinations: IDepartment[] - require for destinies
 */
export interface IShipping {
    country_id: number;
    country_name: string;
    id: string;
    destinations: IDepartment[];
}

/**
 * This interface describes the properties cities
 *
 * @typeParam city_id: number - Required id city
 * @typeParam city_name: string - Required for name city
 * @typeParam id: string - Required for id cities
 * @typeParam estimated_time: number - Required for time estimated
 * @typeParam shipping_cost: string - Required for shipping cost
 */
export interface IDestinies {
    city_id: number;
    city_name: string;
    id: string;
    estimated_time: number;
    shipping_cost: string;
}

/**
 * This interface define date range
 *
 * @typeParam start_date: number - Date start filter
 * @typeParam finish_date: number - Date finish filter
 */
export interface IDateData {
    start_date: number;
    finish_date: number;
}

/**
 * This interface describes data to get products and services
 *
 * @typeParam products: IGenericRecord[] - Data products filtered by date
 * @typeParam services: IGenericRecord[] - Data services filtered by date
 */
export interface IProductAndService {
    products: IGenericRecord[];
    services: IGenericRecord[];
}

/**
 * This interface describes data to get products and services
 *
 * @typeParam products: IGenericRecord[] - Data products filtered by date
 * @typeParam services: IGenericRecord[] - Data services filtered by date
 */
export interface IProductAndService {
    products: IGenericRecord[];
    services: IGenericRecord[];
}

/**
 * This interface describes data to get kardex daily inventory movement
 *
 * @typeParam product_date: string - Is the date of the product
 * @typeParam product_reference: string - It is the product reference
 * @typeParam product_sku: string -It is the product sku
 * @typeParam batch: string - It is the batch of the product
 * @typeParam date_expired: string - Product expiration date
 * @typeParam type_concept: string - Is the type of concept to which the product belongs
 * @typeParam input: string - IKardexProductsDetails product input data
 * @typeParam output: string - IKardexProductsDetails product output data
 * @typeParam available: string - IKardexProductsDetails product available data
 */
export interface IKardexMovement {
    product_date: string;
    product_reference: string;
    product_sku: string;
    batch: string;
    date_expired: string;
    type_concept: string;
    input: IKardexProductsDetails;
    output: IKardexProductsDetails;
    available: IKardexProductsDetails;
}
/**
 * This interface describes data to get kardex daily inventory movement
 *
 * @typeParam unique_product_id: string - Is the id of the product
 * @typeParam date: string - Is the date of the movement
 * @typeParam number: string - Is the number of invoice
 * @typeParam reference: string - It is the product reference
 * @typeParam sku_internal: string -It is the product sku
 * @typeParam quantity: number - It is the number of products in the movement
 * @typeParam unit_cost: number - Product unit cost
 * @typeParam total_value: number - total cost of the movement
 * @typeParam isProduct: boolean - is product or service (true = product , false = service)
 * @typeParam type_operation: string - SALE  or PURCHASE
 */
export interface IKardexMovementSaleOrPurchase {
    unique_product_id: string;
    date: string;
    number: string;
    reference: string;
    sku_internal: string;
    quantity: number;
    unit_cost: number;
    total_value: number;
    is_product: boolean;
    type_operation: string;
}
/**
 * This interface describes data to get kardex daily inventory movement
 *
 * @typeParam quantity: string - Is the quantity of products
 * @typeParam unit_value_product: string - Is the unit value of each product
 * @typeParam value_total_product: string - Is the total value of each product
 */
export interface IKardexProductsDetails {
    quantity: string;
    unit_value_product: string;
    value_total_product: string;
}

/**
 * This interface describes data to get structure of each warehouse
 *
 * @typeParam id: string - Is the id of warehouse
 * @typeParam name: string - Is the name value of each warehouse
 * @typeParam code: string - Is the code value of each warehouse
 * @typeParam products:  IProducts[] - Is the list products of each warehouse
 */
export interface IWarehouseProducts {
    id: string;
    name: string;
    code: string;
    products: IProducts[];
}

/**
 * This interface describes data to get Products
 *
 * @typeParam id: string - Is the id of product
 * @typeParam name: string - Is the name value of each product
 * @typeParam product_id: string - Is the product_id value of each product
 * @typeParam sku_internal: string - Is the sku_internal value of each product
 */
export interface IProducts {
    id: string;
    name: string;
    product_id: string;
    sku_internal: string;
}

/**
 * This interface describes data to Unique products
 *
 * @typeParam products: IGenericRecord[] -is list the products
 * @typeParam IGenericRecord[]: string - Is list the services
 */
export interface IUniqueProducts {
    products: IGenericRecord[];
    services: IGenericRecord[];
}

/**
 * This interface describes the properties cities
 *
 * @typeParam id: string - Required for id
 * @typeParam city_id: number - Required id city
 * @typeParam name: string - Required for name city
 * @typeParam code: string - Required for code city
 * @typeParam department_code: string - Required for code department
 * @typeParam department_id: string - Required for id department
 * @typeParam department_name: string - Required for name department
 */
export interface ICitiesProvisionServices {
    id: string;
    city_id: number;
    name: string;
    code: string;
    department_code: string;
    department_id: string;
    department_name: string;
}

/**
 * This interface describes the properties quantities product per warehouse
 *
 * @typeParam id: string - Required for id
 * @typeParam reference: number - Required product reference
 * @typeParam sku_internal: string - Required product sku
 * @typeParam product: string - Required for name product
 * @typeParam batch: string - Required for batch product
 * @typeParam date_expired: string - Required for date expired product
 * @typeParam date_purchase: string - Required for date purchase product
 * @typeParam stock: string - Required for stock product
 * @typeParam warehouse: IWarehouseQuantities[] - Required for warehouse
 * @typeParam batches: IGenericRecord - Represent batches product
 * @typeParam quantityRows: number - Represent quantity rows
 */
export interface IQuantitiesProductWarehouse {
    id: string;
    reference: string;
    sku_internal: string;
    product: string;
    batch: string;
    date_expired: string;
    date_purchase: string;
    stock: number;
    warehouse: IWarehouseQuantities[];
    batches: IGenericRecord;
    quantityRows: number;
}

/**
 * This interface describes the properties warehouse
 *
 * @typeParam unique_product_id: string - Required for id unique product
 * @typeParam code: number - Required code warehouse
 * @typeParam address: string - Required for warehouse addres
 * @typeParam batch: string - Required for prduct batch
 * @typeParam quantity: string - Required for product quantities
 * @typeParam warehouses_id: string - Required for id warehouse
 * @typeParam name: string - Required for name warehouse
 */
export interface IWarehouseQuantities {
    unique_product_id: string;
    code: string;
    address: string;
    batch: IBatchWarehouseQuantities[];
    quantity: string;
    warehouses_id: string;
    name: string;
}

/**
 * This interface describes the properties batch product
 *
 * @typeParam batch_id: string - Required for id unique product
 * @typeParam number: number - Required code warehouse
 * @typeParam date_expired: string - Required for date expired product
 * @typeParam quantity: string - Required for product batch quantities
 */
export interface IBatchWarehouseQuantities {
    batch_id: string;
    number: string;
    date_expired: string;
    quantity: string;
}

/**
 * This interface is for unique product taxes
 * 
 * @typeParam id: string - Id tax
 * @typeParam unique_product_id: string - Unique product id
 * @typeParam company_tax_id: string - Company tax id
 * @typeParam tax_value: number - Tax value
 * @typeParam custom_tax_value: number | null - Custom tax value
 * @typeParam tax_name: string - Tax name
 * @typeParam tax_rate: number - Rate
 * @typeParam tax_rate_name: string | null - Tax rate name
 * @typeParam is_customized: boolean - If is custom tax
 */
export interface ITaxesProductsStock {
    id: string;
    unique_product_id: string;
    company_tax_id: string;
    tax_value: number;
    custom_tax_value: number | null;
    tax_name: string;
    tax_rate: number;
    tax_rate_name: string | null;
    is_customized: boolean;
}
