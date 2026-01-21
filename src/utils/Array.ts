/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericRecord } from '@models/GenericRecord';
import { IOptionSelect } from '@components/input';

export const sortArray = (array: IGenericRecord[], key = 'order'): any[] => [...array]?.sort((a, b) => a[key] - b[key]);

export const getUniqueValues = (array: any[] = []): any[] => Array.from(new Set(array));

export const getSum = (data: IGenericRecord[] = [], key = VALUE): number => {
    if (!data?.length) return 0;
    return data?.reduce((total: number, item: IGenericRecord) => (total += Number(item[key] || 0)), 0);
};

export const getTotal = (data: IGenericRecord, key = ''): number => {
    return (
        data?.reduce((total: number, item: IGenericRecord) => total + (Number(item.value) || 0) * (Number(item[key]) || 1), 0) ||
        0
    );
};

export const sortArrayAlphabetically = (data: IGenericRecord[]): any[] => {
    return data?.length
        ? data?.sort((pre, next) => pre?.name?.toLowerCase().charCodeAt(0) - next?.name?.toLowerCase().charCodeAt(0))
        : [];
};

/**
 * Finds and returns an option from a list based on a matching `id`.
 *
 * @param options - Array of IOptionSelect items to search through.
 * @param id - The id to search for (string or number).
 * @returns IOptionSelect - Returns the matching option, or a default empty option if not found.
 */
export const findItemOption = (options: IOptionSelect[], id: string | number): IOptionSelect =>
    options.find(option => String(option.id) === String(id)) || { value: '', id: '', key: '' };

export const someArrayObject = (data: IGenericRecord[], key: string): boolean =>
    data?.some((item: IGenericRecord) => item && item[key]);

export const createArray = (length: number): number[] => Array.from({ length }, (_, index) => index + 1);

const VALUE = 'value';

/**
 * This function compares a value in an array
 *
 * @param array: any[] - Optional array param
 * @param value: any - Value param
 * @returns boolean
 */
// eslint-disable-next-line
export const includeArray = (array: any[] = [], value: any): boolean => array.includes(value);
