import React, { SetStateAction } from 'react';
import { Routes } from '@constants/Paths';
import { COLOMBIA_ID } from '@constants/Location';
import { getRouteName, getRoute } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { ModuleApp } from '@utils/GenerateId';
import { Section } from '@components/bread-crumb';
import { IInformationProps } from '@components/information';
import { IPageButtonsFooterProps } from '@components/page-buttons-footer';
import { IGenericRecord } from '@models/GenericRecord';
import { PRODUCT_SHIPPING, PRODUCT_SHIPING_COST_INFORMATION } from '@information-texts/ProductShippingCost';

export * from './components';
export { default } from './ProductShippingCostInformation';

/**
 * Product shipping tables
 */
export enum TABLES {
    NATIONAL = 'NATIONAL',
    FOREIGN = 'FOREIGN',
    PRODUCTS = 'PRODUCTS',
}

/**
 * Product shipping modals
 */
export enum MODALS {
    DELETE = 'delete',
    SUCCESS = 'success',
}

/**
 *
 * Sections for the routes in the Product Shipping Cost Information page
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_MENU),
    },
    {
        name: 'Cómo promocionar y optimizar el sitio web',
        route: getRoute(Routes.WEBSITE_VISIBILITY),
    },
    {
        name: getRouteName(Routes.PRODUCT_SHIPPING_COST),
        route: getRoute(Routes.PRODUCT_SHIPPING_COST),
    },
];

/**
 * Function that returns the checked fields number
 *
 * @param data: IGenericRecord[] - Table data
 * @returns number
 */
export const getCheckedFields = (data: IGenericRecord[]): number => {
    let total = 0;
    data.forEach(item => {
        if (item.cities?.length) {
            total += item.checked
                ? 1
                : 0 + item.cities.reduce((total: number, subItem: IGenericRecord) => (total += subItem.checked ? 1 : 0), 0);
        } else {
            total += item.checked ? 1 : 0;
        }
    });
    return total;
};

/**
 * Function that returns the ids to delete
 *
 * @param data: IGenericRecord[] - Table data
 * @param currentTable: string - Current table
 * @returns IGenericRecord
 */
export const getIdsToDelete = (data: IGenericRecord[], currentTable: string): IGenericRecord => {
    const ids: IGenericRecord = { department: [], city: [], country: [] };
    const { location, id } = deleteKeys[currentTable];
    data?.forEach(item => {
        if (!item?.added && item.checked) ids[location].push(item[id]);
        item.cities?.forEach(({ checked = false, added = false, id }: IGenericRecord) => {
            if (!added && checked) ids.city.push(id);
        });
    });
    return ids;
};

/**
 * Function that returns a boolean indicating if there are ids to delete
 *
 * @param ids: IGenericRecord - Ids to delete
 * @returns boolean
 */
export const hasIdsToDelete = (ids: IGenericRecord): boolean => Object.values(ids).some(item => item.length);

/**
 * Function that deletes the places in local but no in the data base
 *
 * @param data: IGenericRecord[] - Table data
 * @param setData: React.Dispatch<SetStateAction<IGenericRecord[]>> - Function to set the new table data
 * @returns void
 */
export const deletePlacesInLocal = (data: IGenericRecord[], setData: React.Dispatch<SetStateAction<IGenericRecord[]>>): void => {
    setData(
        data
            .filter(item => !item.checked)
            .map(item => ({
                ...item,
                cities: item.cities?.filter((city: IGenericRecord) => !city.checked),
            }))
    );
};

/**
 * Function that returns a shipping request
 *
 * @param { productTable, nationalTable, foreignTable, freeShipping }: IGenericRecord - Request data
 * @returns IGenericRecord
 */
export const getShippingRequest = ({
    productTable,
    nationalTable,
    foreignTable,
    freeShipping = 0,
    products,
}: IGenericRecord): IGenericRecord => {
    const productsFilter = productTable?.flatMap((item: IGenericRecord) => {
        if (item.name) {
            const { product_id, additional_shipping_cost, unique_product_id } = item;
            return [
                {
                    additional_shipping_cost,
                    id:
                        unique_product_id ??
                        products?.find((product: IGenericRecord) => product?.id === product_id)?.unique_product_id,
                },
            ];
        }
        return [];
    });
    return {
        free_shipping: freeShipping,
        unique_products: productsFilter,
        shipping: [getNationalRequest(nationalTable), ...getForeignRequest(foreignTable)],
    };
};

/**
 * Function that returns the request of the national table
 *
 * @param data: IGenericRecord[] - National table data
 * @returns IGenericRecord
 */
const getNationalRequest = (data: IGenericRecord[]): IGenericRecord => {
    const destinations = getValidData(data)?.map(({ department_id, cities, department_name }) => ({
        department_id,
        department_name,
        cities: getCitiesRequest(cities),
    }));
    return {
        country_id: COLOMBIA_ID,
        country_name: 'Colombia',
        destinations,
    };
};

/**
 * Function that returns the request of the foreign table
 *
 * @param data: IGenericRecord[] - Foreign table data
 * @returns IGenericRecord[]
 */
const getForeignRequest = (data: IGenericRecord[]): IGenericRecord[] => {
    return getValidData(data, false)?.map(({ country_id, country_name, cities }) => ({
        country_id,
        country_name,
        destinations: [
            {
                department_id: null,
                department_name: null,
                cities: getCitiesRequest(cities),
            },
        ],
    }));
};

/**
 * Function that returns the request cities
 *
 * @param cities: IGenericRecord[] - List of cities
 * @returns IGenericRecord[]
 */
const getCitiesRequest = (cities: IGenericRecord[]): IGenericRecord[] => {
    return cities?.map(({ estimated_time, city_id, shipping_cost, city_name }: IGenericRecord) => ({
        estimated_time,
        city_id,
        shipping_cost,
        city_name,
    }));
};

/**
 * Function that returns the correct data
 *
 * @param data: IGenericRecord[] - Table data
 * @param isNationalData: boolean - Boolean that indicates if the tables in national
 * @returns IGenericRecord[]
 */
const getValidData = (data: IGenericRecord[], isNationalData = true): IGenericRecord[] => {
    return data?.filter(item => (isNationalData ? item.department_id : item.country_id));
};

/**
 * Function that indicates if the data hast checked places
 *
 * @param data: IGenericRecord[] - Table data
 * @returns boolean
 */
export const hasCheckedPlaces = (data: IGenericRecord[]): boolean => {
    return data?.some(item => item.checked || item.cities.some((city: IGenericRecord) => city.checked));
};

/**
 * Function that returns the products error
 *
 * @param data: IGenericRecord[] - Table data
 * @returns string
 */
export const getProductsError = (data: IGenericRecord[]): string => {
    const errors: IGenericRecord = { empty: [], zero: [] };
    data?.forEach(({ name, additional_shipping_cost }) => {
        if (name) {
            if (!additional_shipping_cost) errors.empty.push(name);
            else {
                if (!Number(additional_shipping_cost)) {
                    errors.zero.push(name);
                    errors.empty.push(name);
                }
            }
        }
    });
    const { empty, zero } = errors;
    if (!empty.length) return '';
    if (zero.length) {
        return empty.length
            ? '*Los campos resaltados son obligatorios y deben tener un valor mayor a 0'
            : '*El campo resaltado es obligatorio y debe tener un valor mayor a 0.';
    }
    return empty.length ? '*Los campos resaltados son obligatorios.' : '*El campo resaltado es obligatorio.';
};

/**
 * Function that returns the locations error
 *
 * @param data: IGenericRecord[] - Table data
 * @param isNationalTable: boolean - Indicates if the table is national
 * @returns string
 */
export const getLocationsError = (data: IGenericRecord[], isNationalTable = true): string => {
    const errors: string[] = [];
    const requiredKeys = ['city_name', 'estimated_time', 'shipping_cost'];

    data.forEach(({ cities, country_id, department_id }) => {
        if (isNationalTable ? !department_id : !country_id) errors.push('department_id');
        if (isNationalTable ? department_id : country_id) {
            if (!cities.length) errors.push(...requiredKeys);
            cities.forEach((item: IGenericRecord) => requiredKeys.forEach(key => !String(item[key]) && errors.push(key)));
        }
    });

    if (errors.length) {
        return errors.length > 1 ? '*Los campos resaltados son obligatorios' : '*El campo resaltado es obligatorio.';
    }

    return '';
};

/**
 * Function that returns the button props
 *
 * @param history: History - Hook used to navigate
 * @param saveChanges: () => void - Function to save changes
 * @returns IPageButtonsFooterProps
 */
export const getButtonProps = (history: History, saveChanges: () => void, setShowModal: () => void): IPageButtonsFooterProps => ({
    threeButtons: true,
    titleButtonCenter: 'Guardar',
    ...buttonsFooterProps(ModuleApp.WEBSITE, history, getRoute(Routes.INFORMATION_PROVISION_OF_SERVICES), {
        name: getRouteName(Routes.INFORMATION_PROVISION_OF_SERVICES),
        moduleName: getRouteName(Routes.HOME),
    }),
    onClickButtonCenter: saveChanges,
    onClickButtonRight: setShowModal,
});

/**
 * Default information props shared in all Information components
 */
export const informationProps: IInformationProps = {
    color: 'blue',
    classNameTitle: 'lg:text-base',
    isList: true,
    classNameContainer: 'mt-7 mb-4.5',
    title: '',
};

/**
 * National information
 */
export const nationalInformation: IInformationProps = {
    ...informationProps,
    customText: PRODUCT_SHIPPING.NATIONAL_INFORMATION,
    title: 'Agregar costo de envío dentro de Colombia',
    classNameContainer: 'mt-4.5 mb-7',
};

/**
 * Foreign information
 */
export const foreignInformation: IInformationProps = {
    ...informationProps,
    title: 'Agregar costo de envío fuera de Colombia',
    customText: PRODUCT_SHIPPING.FOREIGN_INFORMATION,
    classNameContainer: 'mb-7 mt-7',
};

/**
 * Products information
 */
export const productsInformation: IInformationProps = {
    ...informationProps,
    isList: false,
    title: 'Productos con costo de envío adicional',
    description: `Si cuenta con productos que tienen un costo de envío adicional al establecido en la ciudad,
      agréguelos en la siguiente tabla. De lo contrario, no es necesario agregar la información de esta tabla.`,
    classNameContainer: 'mb-9.5 mt-7',
};

/**
 * Shipment information
 */
export const shipmentInformation: IInformationProps = {
    ...informationProps,
    isList: false,
    title: 'Envío gratuito por valor de compra',
    description: `Si desea establecer un monto mínimo a partir del cual sean gratuitos los envíos, agréguelo en la siguiente casilla.`,
};

/**
 * End  information
 */
export const endInformation: IInformationProps = {
    ...informationProps,
    isList: false,
    title: '',
    description: 'Una vez haya llenado las secciones de la pantalla, haga click en Guardar.',
};

/**
 * Initial state used to handle the modals
 */
export const modalInitialState = {
    delete: false,
    success: false,
};

/**
 * Table keys used to delete fields in the shipping table
 */
const deleteKeys: IGenericRecord = {
    [TABLES.NATIONAL]: {
        location: 'department',
        id: 'department_id',
    },
    [TABLES.FOREIGN]: {
        location: 'country',
        id: 'id',
    },
};

/**
 * View props
 */
export const props = {
    information: {
        main: PRODUCT_SHIPING_COST_INFORMATION,
        national: nationalInformation,
        foreign: foreignInformation,
        products: productsInformation,
        shipment: shipmentInformation,
        end: endInformation,
    },
};

/**
 * View utils
 */
export const utils = {
    deletePlacesInLocal,
    getCheckedFields,
    getIdsToDelete,
    hasIdsToDelete,
    getShippingRequest,
    hasCheckedPlaces,
    getProductsError,
    getLocationsError,
    getButtonProps,
};

/**
 * This constant is used to access the first city array
 */
export const FIRST_DESTINATION = 0;

/**
 * This constant is used to warn one elements will delete
 */
export const TEXT_ONE_ELEMENT = '¿Está seguro que desea eliminar el elemento seleccionado?';

/**
 * This constant is used to warn the elements will delete
 */
export const TEXT_ELEMENTS = '¿Está seguro que desea eliminar los elementos seleccionados?';
