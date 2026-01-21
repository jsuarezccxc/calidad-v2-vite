export const COUNTRY_ID = 'country_id';
export const DEPARTMENT_ID = 'department_id';
export const COUNTRY_NAME = 'country_name';
export const DEPARTMENT_NAME = 'department_name';
export const COLOMBIA_ID = 46;
export const COLOMBIA = 'Colombia';

/**
 * This const is for inputs reset
 */
export const INPUTS_RESET_LOCATION = {
    department_name: '',
    department_id: '',
    city_name: '',
    city_id: '',
};

/**
 * This const is for labels of location inputs
 */
export const { COUNTRY, DEPARTMENT, CITY, ADDRESS } = {
    ADDRESS: 'Dirección',
    COUNTRY: 'País:',
    DEPARTMENT : 'Departamento:',
    CITY: 'Ciudad:'
}

/**
 * This const is for required location keys
 */
export const REQUIRED_LOCATION_KEY = ['country_name', 'city_name'];
export const REQUIRED_LOCATIONS_KEYS = ['department_name', 'address'];
