import { v4 as uuid } from 'uuid';
import { SelectSearchOption } from 'react-select-search';
import { IGenericRecord } from '@models/GenericRecord';
import { FieldName, IParamBuildGlobalOption } from '@models/Company';
import { IOptionSelect } from '@components/input';
import { IOption } from '@components/select-search';
import { WITHHOLDINGS } from '@constants/ElectronicInvoice';
import { getDateTablePicker } from './Date';

export const buildOptions = (
    list: IGenericRecord[] = [],
    codeId = false,
    withCodeValue = false,
    warehouseId = false
): IOptionSelect[] => {
    return list.map(element => ({
        key: uuid(),
        value: withCodeValue ? `${element.code} - ${element.name}` : element.name,
        id: codeId ? element?.code : warehouseId ? element?.warehouses_id : element?.id || element?.unique_product_id,
        code: element?.code || '',
        unitMeasure: element?.unit_measurement_name || '',
        type: element?.type || '',
    }));
};

export const buildOptionsPrefixesLanding = (list: IGenericRecord[]): IOptionSelect[] => {
    const listOptions: IOptionSelect[] = [];
    if (list?.length) {
        list.map(element => {
            listOptions.push({
                key: element.country,
                value: element.countryCode,
                id: element.id,
            });
        });
    }

    return listOptions;
};

export const buildClientOptions = (options: IGenericRecord[]): IOptionSelect[] => {
    const listOptions: IOptionSelect[] = [];

    options?.forEach(option => {
        listOptions.push({
            key: option.id,
            value: option.name,
        });
    });

    return listOptions;
};

export const buildSupplierOptions = (options: IGenericRecord[]): IOptionSelect[] => {
    const listOptions: IOptionSelect[] = [];

    options?.forEach(option => {
        listOptions.push({
            key: option.id,
            value: option.name,
        });
    });

    return listOptions;
};

/**
 * This function is build options sku products
 *
 * @param list: IGenericRecord[] - Products
 * @returns IOptionSelect[]
 */
export const buildOptionsSku = (list: IGenericRecord[]): IOptionSelect[] => {
    if (!list?.length) return [];
    return list.map(element => ({
        key: uuid(),
        value: element.sku_internal || element.service_code,
        id: element?.id,
    }));
};

export const buildOptionsBatches = (list: IGenericRecord[], warehouseId: string): IOptionSelect[] => {
    const hash: IGenericRecord = {};
    const listOptions: IOptionSelect[] = [];
    const findWarehouse = list?.find((item: IGenericRecord) => item.warehouses_id === warehouseId);
    findWarehouse?.batch.forEach((element: IGenericRecord) => {
        listOptions.push({
            key: uuid(),
            value: element.number,
            id: element.batch_id,
        });
    });
    return listOptions.filter((item: IGenericRecord) => (hash[item.id] ? false : (hash[item.id] = true)));
};

export const buildOptionsDate = (list: IGenericRecord[], batchId: string): IOptionSelect[] => {
    const listOptions: IOptionSelect[] = [];
    list?.forEach((item: IGenericRecord) => {
        item.batch.forEach((batch: IGenericRecord) => {
            if (batch.batch_id === batchId) {
                listOptions.push({
                    key: uuid(),
                    value: getDateTablePicker(batch.date_expired),
                    id: batch?.batch_id,
                });
            }
        });
    });
    return listOptions;
};

export const buildOptionsPrefixes = (list: IGenericRecord[]): IOptionSelect[] => {
    const listOptions: IOptionSelect[] = [];
    if (list?.length) {
        list.map(element => {
            listOptions.push({
                key: uuid(),
                value: element.prefix,
                id: element.id,
                code: element.resolution_number,
            });
        });
    }

    return listOptions;
};

export const buildOptionsSearch = (
    list: IGenericRecord[] = [],
    code?: boolean,
    client = false,
    isDescription = false,
    value = false
): SelectSearchOption[] => {
    const listOptions: SelectSearchOption[] = [];

    if (list.length) {
        list.forEach(element => {
            listOptions.push({
                value: (code && element.product_id) || (client && element.id) || element.id,
                name: isDescription ? element.description : element.name || (value && element.value),
            });
        });
    }

    return listOptions;
};

export const buildOptionsCodeSearch = (list: IGenericRecord[] = [], code?: boolean, id?: boolean): SelectSearchOption[] => {
    const listOptions: SelectSearchOption[] = [];

    if (list.length) {
        list.forEach(element => {
            listOptions.push({
                ...(id && { id: element.id }),
                value: code ? element.code : element.id,
                name: code ? `${element.code} - ${element.name}` : element.name,
            });
        });
    }

    return listOptions;
};

export const buildOptionsCustomSearch = (
    list: IGenericRecord[] = [],
    codeValue?: boolean,
    codeName?: boolean,
    ciiuId?: boolean
): SelectSearchOption[] => {
    const listOptions: SelectSearchOption[] = [];

    if (list.length) {
        list.forEach(element => {
            listOptions.push({
                value: codeValue ? element.code : ciiuId ? element?.ciiu_id || '' : element.id,
                name: codeName && !element?.name?.includes(element.code) ? `${element.code} - ${element.name}` : element.name,
            });
        });
    }

    return listOptions;
};

export const buildOptionsWithCode = (options: IGenericRecord[] = []): IOptionSelect[] => {
    return options.map(({ id, code, name }) => ({ key: id, value: `${code} - ${name}`, id }));
};

/**
 * Create options select input
 *
 * @param options: IParamBuildGlobalOption - Param options to create options
 * @returns IOptionSelect[]
 */
export const buildGlobalOptionsSelect = ({
    util = [],
    keyId = 'id',
    keyValue = 'name',
}: IParamBuildGlobalOption): IOptionSelect[] =>
    util.map(item => {
        return {
            key: uuid(),
            id: item[keyId],
            value: item[keyValue],
        };
    });

/**
 * Default value of each fiscal responsibility
 */
export const DEFAULT_RESPONSIBILITY = { id: '', name: '', withholdings: WITHHOLDINGS };

/**
 * This is used to reset location fields every time a value changes.
 */
export const EMPTY_LOCATION_FIELDS: IGenericRecord = {
    [FieldName.CountryId]: {
        [FieldName.DepartmentId]: '',
        [FieldName.DepartmentName]: '',
        [FieldName.CityId]: '',
        [FieldName.CityName]: '',
    },
    [FieldName.DepartmentId]: {
        [FieldName.DepartmentName]: '',
        [FieldName.CityId]: '',
        [FieldName.CityName]: '',
    },
    [FieldName.PersonType]: {
        [FieldName.Responsibilities]: [DEFAULT_RESPONSIBILITY],
    },
};

/**
 * This is used to save the value of the location with the created keys
 */
export const LOCATION_KEYS: IGenericRecord = {
    [FieldName.DepartmentId]: 'department_name',
    [FieldName.CityId]: 'city_name',
    [FieldName.CountryId]: 'country_name',
};

/**
 * This function builds options for the search component from a list of IOptionSelect objects.
 *
 * @param options: IOptionSelect[] - The list of options to convert.
 * @returns IOption[]
 */
export const buildOptionsToOptionsSearch = (options: IOptionSelect[]): IOption[] => {
    return options.map(option => ({
        name: option.value,
        value: option.id ?? '',
        id: option.id ?? '',
    }));
};
