import { IGenericRecord } from '@models/GenericRecord';

/**
 * This interface describes data of warehouse
 *
 * @typeParam name: string - Optional value is name of warehouse
 * @typeParam code: string - Optional value is is code identification of warehouse
 * @typeParam address: string - Optional value address of address
 * @typeParam city_name: IGenericRecord[] - Optional value of city
 * @typeParam department_name: IGenericRecord[] - Optional data of department
 * @typeParam country_name: IGenericRecord[] - Optional data of country
 */
export interface IDataWarehouses {
    name?: string;
    code?: string;
    address?: string;
    city_name?: IGenericRecord[];
    department_name?: IGenericRecord[];
    country_name?: IGenericRecord[];
}

/**
 * This interface describes warehouse with its products
 *
 * @typeParam id: string - Warehouse's id
 * @typeParam name: string - Warehouse's name
 * @typeParam code: string - Warehouse's code
 * @typeParam products: IProductForWarehouse[] - Product of warehouse
 */
export interface IWarehousesWithProducts {
    id: string;
    name: string;
    code: string;
    products: IProductForWarehouse[];
}

/**
 * This interface describes products data
 *
 * @typeParam id: string - Product's id
 * @typeParam name: string - Product's name
 * @typeParam product_id: string - Product's parent id
 * @typeParam sku_internal: string - Product's sku
 * @typeParam unit_measurement_name: string - Product's measurement name
 */
export interface IProductForWarehouse {
    id: string;
    name: string;
    product_id: string;
    sku_internal: string;
    unit_measurement_name: string;
}
