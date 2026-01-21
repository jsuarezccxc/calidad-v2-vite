import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';

export * from './AddWarehouses';

/**
 * Field to validate
 */
export enum WarehouseFields {
    CityName = 'city_name',
    DepartmentName = 'department_name',
    CountryName = 'country_name',
    Address = 'address',
    Name = 'name',
}

/**
 * Required Fields before saving
 */
export const requiredFields: WarehouseFields[] = [
    WarehouseFields.CityName,
    WarehouseFields.DepartmentName,
    WarehouseFields.CountryName,
    WarehouseFields.Address,
    WarehouseFields.Name,
];

/**
 * This function return routes for bread crumb
 *
 * @param edit: boolean - Indicates if the route includes edition
 * @returns Section[]
 */
export const routesAddWarehouses = (edit: boolean): Section[] => [
    {
        name: 'Ficha técnica',
        route: getRoute(Routes.DATABASE_MENU),
    },
    {
        name: 'Ficha técnica de bodegas',
        route: getRoute(Routes.WAREHOUSES),
    },
    {
        name: `${edit ? 'Editar bodega' : 'Agregar bodega '}`,
        route: '#',
    },
];
/**
 * Initial state when adding a warehouse
 */

export const initialState = {
    address: '',
    city_id: '',
    city_name: '',
    country_id: '',
    country_name: '',
    id: '',
    department_name: '',
    department_id: '',
    is_main: '',
    is_warehouse_web: '',
    name: '',
    warehouse_conf_id_: '',
};

/**
 * Function that returns if the parameter has empty fields
 *
 * @param warehouse: IGenericRecord - Object to validate if has empty fields
 * @param fieldsToValidate: string[] - Fields to validate
 * @returns string[]
 */
export const hasEmptyFields = (warehouse: IGenericRecord, fieldsToValidate: string[]): string[] => {
    const emptyField: string[] = [];

    fieldsToValidate.forEach(field => {
        if (!warehouse[field]) {
            emptyField.push(field);
        }
    });

    return emptyField;
};
