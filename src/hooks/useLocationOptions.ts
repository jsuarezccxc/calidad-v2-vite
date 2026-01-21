import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';

/**
 * This formats the options by adding the value
 *
 * @param options: IGenericRecord[] - Options
 * @returns SelectSearchOption[]
 */
const formatOptions = (options: IGenericRecord[] = []): SelectSearchOption[] => {
    return options?.map(item => ({ ...item, value: item.id })) as SelectSearchOption[];
};

/**
 * This describes the properties returned by this hook
 *
 * @typeParam cities: SelectSearchOption[] - List of cities
 * @typeParam departments: SelectSearchOption[] - List of departments
 * @typeParam countries: SelectSearchOption[] - List of countries
 */
export interface IUseLocationOptions {
    cities: SelectSearchOption[];
    departments: SelectSearchOption[];
    countries: SelectSearchOption[];
}

const useLocationOptions = (departmentId: string): IUseLocationOptions => {
    const {
        utils: { departments, groupedCities, countries },
    } = useSelector((state: RootState) => state.utils);

    const getCityOptions = (): SelectSearchOption[] => {
        if (!departmentId) return [];
        const departmentCode = departments?.find((department: IGenericRecord) => department.id === departmentId)?.code;
        return formatOptions(groupedCities?.[departmentCode?.trim()]);
    };

    const cities = useMemo(() => getCityOptions(), [groupedCities, departmentId]);

    return {
        cities,
        departments,
        countries,
    };
};

export default useLocationOptions;
