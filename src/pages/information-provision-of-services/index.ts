import { getRouteName, getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { Section } from '@components/bread-crumb';
import { ICitiesProvisionServices } from '@models/Inventory';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthEqualToZero } from '@utils/Length';
import { SelectSearchOption } from 'react-select-search';
export { default } from './InformationProvisionOfServices';

/**
 * This interface describes the properties option cities
 *
 * @typeParam id: string - Required id option cities
 * @typeParam name: string - Required name option cities
 * @typeParam code: string - Required code option cities
 */
export interface IOptionCities {
    id: string;
    name: string;
    code: string;
}

/**
 * This interface describes the properties data cities initial
 *
 * @typeParam cities: IDataCities[] - Required data cities initial
 */
export interface IDataCitiesInitial {
    cities: IDataCities[];
}

/**
 * This interface describes the properties data cities
 *
 * @typeParam id: string - Required id data cities
 * @typeParam city_id: string - Required id city data cities
 * @typeParam name: string - Required name city data cities
 * @typeParam options: SelectSearchOption[] - Required options cities
 */
export interface IDataCities {
    id: string;
    city_id: number;
    name: string;
    code: string;
    options: SelectSearchOption[];
    link: boolean;
}

/**
 * This interface describes the properties data cities
 *
 * @typeParam id: string - Required id data cities
 * @typeParam city_id: string - Required id city data cities
 * @typeParam name: string - Required name city data cities
 */
export interface ILocation {
    location: IDepartment[];
}

/**
 * This interface describes the properties data cities
 *
 * @typeParam options: SelectSearchOption[] - Required options departments
 * @typeParam id: string - Required id data cities
 * @typeParam city_id: string - Required id city data cities
 * @typeParam name: string - Required name city data cities
 */
export interface IDepartment {
    options: SelectSearchOption[];
    department_code: string;
    department_id: string;
    department_name: string;
    id: string;
    cities: IDataCities[];
}

/**
 * Function that return the breadcrumb routes
 *
 * @returns Section[]
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.WEBSITE_MENU),
            route: getRoute(Routes.WEBSITE_MENU),
        },
        {
            name: 'Cómo promocionar y optimizar el sitio web',
            route: getRoute(Routes.WEBSITE_VISIBILITY),
        },
        {
            name: 'Ubicación de la prestación de servicios',
            route: getRoute(Routes.INFORMATION_PROVISION_OF_SERVICES),
        },
    ];
};

/**
 * headers of the table
 */
export const headersTableCities = [
    {
        wrapperClassName: 'w-7.5',
        className: 'w-0',
    },
    {
        title: 'Ciudad',
        className: 'w-70 xs:w-65.5 h-5.75 xs:min-h-6.75',
        wrapperClassName: 'w-70 xs:w-76 xs:h-4',
    },
];

/**
 * headers of the table
 */
export const headersTableServices = [
    {
        wrapperClassName: 'w-7.5',
        className: 'w-0',
    },
    {
        title: '*Departamento',
        className: 'w-70 xs:w-65.5 h-5.75 xs:min-h-6.75',
        wrapperClassName: 'w-70 xs:w-76 xs:h-4',
    },
    {
        title: '*Ciudad',
        className: 'w-70 xs:w-65.5 h-5.75 xs:min-h-6.75',
        wrapperClassName: 'w-70 xs:w-76 xs:h-4',
    },
];

/**
 * Init data from TableShipping initial
 */
export const DATA_CITIES_INITIAL_SERVICES: ILocation = {
    location: [],
};

export const constants = {
    ID_COLOMBIA: '46',
    CITY: 'city',
    DEPARTMENT: 'department',
    NUMBRE_MAX_DIV_SIX: 6,
};

/**
 * This function return data table
 * @param provisionService: ICitiesProvisionServices[] - data for table
 * @returns IDepartment[]
 */
export const formatDataTable = (provisionService: ICitiesProvisionServices[], dynamic: IGenericRecord): IDepartment[] => {
    const dataTable: IDepartment[] = [];
    provisionService.forEach((itemService: ICitiesProvisionServices) => {
        if (dataTable.find(item => item.department_id === itemService.department_id)) {
            dataTable.forEach(itemTable => {
                if (itemTable.department_id === itemService.department_id)
                    itemTable.cities.push({
                        options: [],
                        city_id: itemService.city_id,
                        code: itemService.code,
                        id: itemService.id,
                        name: itemService.name,
                        link: false,
                    });
                itemTable.cities = orderInputsCities(itemTable.cities);
            });
        }
        if (!dataTable.find(item => item.department_id === itemService.department_id)) {
            dataTable.push({
                options: [],
                department_id: itemService.department_id,
                department_code: itemService.department_code,
                department_name: itemService.department_name,
                id: itemService.department_id,
                cities: [
                    {
                        city_id: itemService.city_id,
                        code: itemService.code,
                        id: itemService.id,
                        name: itemService.name,
                        options: [],
                        link: false,
                    },
                    {
                        city_id: 0,
                        code: '',
                        id: '',
                        name: '+ Agregar ciudad',
                        options: [],
                        link: true,
                    },
                ],
            });
        }
    });
    return optionsToAssign(dataTable?.slice(), dynamic);
};

/**
 * This function validate cities
 * @param cities: IGenericRecord[] - array cities
 * @param idCities: string[] - array cities selected
 * @param idDepartment: string - department id
 * @returns boolean
 */
export const validateCities = (cities: IGenericRecord[], idCities: string[], idDepartment: string): boolean => {
    let optionCities: IGenericRecord[] = [];
    optionCities = cities?.filter((item: IGenericRecord) => !idCities.includes(item.id) && item.department_id === idDepartment);
    return lengthEqualToZero(optionCities);
};

/**
 * This functions return array string keys
 * @param array: IGenericRecord[] - array json
 * @returns string[]
 */
const arrayJsonToArrayString = (array: IGenericRecord[]): string[] =>
    array.map((item: IGenericRecord) => String(item.city_id || item.department_id));

/**
 * This functions return options select search
 * @param data: :IGenericRecord[] - Array json
 * @returns :SelectSearchOption[]
 */
const buildOptionsSearch = (data: IGenericRecord[]): SelectSearchOption[] =>
    data.map(option => ({ name: option.name, value: option.id, ...option }));

/**
 * This functions assign options
 * @param data: IDepartment[] - data table
 * @param cities: Object - data departments and cities
 * @returns IDepartment[]
 */
export const optionsToAssign = (data: IDepartment[] = [], { cities = [], departments = [] }: IGenericRecord): IDepartment[] => {
    data.forEach((item: IDepartment) => {
        item.options = optionsToAssignDepartmentsOrCities(departments, data, item.department_id);
        item.cities.forEach(city => {
            city.options = optionsToAssignDepartmentsOrCities(cities, item.cities, String(city.city_id), item.department_id);
        });
    });
    return data;
};

/**
 * This function create options
 * @param dataForOptions: IGenericRecord[] - data create options
 * @param data: :IDepartment[] | IDataCities[] - data table
 * @param idExcluded: string - key id
 * @param idDepartment?: string - Optional param
 * @returns SelectSearchOption[]
 */
const optionsToAssignDepartmentsOrCities = (
    dataForOptions: IGenericRecord[],
    data: IDepartment[] | IDataCities[],
    idExcluded: string,
    idDepartment = ''
): SelectSearchOption[] => {
    const options = buildOptionsSearch(dataForOptions).sort((item, itemSecon) => item.name.localeCompare(itemSecon.name));
    if (idDepartment)
        return options.filter(
            (item: IGenericRecord) =>
                (item.department_id === idDepartment && !arrayJsonToArrayString(data).includes(String(item.value))) ||
                String(item.value) === idExcluded
        );
    return options.filter(
        (item: IGenericRecord) => !arrayJsonToArrayString(data).includes(String(item.value)) || idExcluded === String(item.value)
    );
};

export const orderInputsCities = (cities: IDataCities[]): IDataCities[] =>
    cities.sort((item, itemSecond) => {
        return item.link === itemSecond.link ? 0 : !item.link ? -1 : 1;
    });
