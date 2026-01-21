import React, { SetStateAction } from 'react';
import { SelectSearchOption } from 'react-select-search';
import { IGenericRecord } from '@models/GenericRecord';

export * from './ShippingTable';

/**
 * This interface describes the props of the shipping table
 *
 * @typeParam data: IGenericRecord[] - Table data
 * @typeParam setData: React.Dispatch<SetStateAction<IGenericRecord[]>> - Function to set the table data
 * @typeParam products: IGenericRecord[] - Product list
 * @typeParam checkedFields: IGenericRecord[] - Checked fields
 * @typeParam onClickTrash: (table: string) => void - Function to delete fields
 * @typeParam validate: boolean - Indicates if validate the table data
 * @typeParam isNationalTable: boolean - Optional props that indicates if table is national
 * @typeParam setIsSave: (boolean)=>void - Function to indicates if the table is saved
 */
export interface IShippingTableProps {
    data: IGenericRecord[];
    setData: React.Dispatch<SetStateAction<IGenericRecord[]>>;
    checkedFields: number;
    onClickTrash: () => void;
    validate: boolean;
    isNationalTable?: boolean;
    setIsSave: (save:boolean)=> void;
}

/**
 * Function that returns the select options
 *
 * @param data: IGenericRecord[] - Initial options
 * @returns SelectSearchOption[]
 */
export const getOptions = (data: IGenericRecord[] = []): SelectSearchOption[] => {
    return data?.map(item => ({ ...item, value: item.id })) as SelectSearchOption[];
};

/**
 * Function that returns the target object for the handle change
 *
 * @param value: number - Input value
 * @param name: string - Input name
 * @returns IGenericRecord
 */
export const getTarget = (value: number, name: string): IGenericRecord => ({ target: { value, name } });

/**
 * Function that returns the target object of the each plac
 *
 * @param { id: value, name: additionalValue }: IGenericRecord - Default target
 * @param name: string - Input name
 * @returns IGenericRecord
 */
export const getTargetPlace = ({ id: value, name: additionalValue }: IGenericRecord, name: string): IGenericRecord => ({
    target: { name, value, additionalValue, additionalName: 'city_name' },
});

/**
 * Function that returns the selected cities
 *
 * @param data: IGenericRecord[] - Table data
 * @returns string[]
 */
export const getSelectedCities = (data: IGenericRecord[]): string[] => {
    const cities: string[] = [];
    data?.forEach(item => item.cities.forEach(({ city_id }: IGenericRecord) => city_id && cities.push(city_id)));
    return cities;
};

/**
 * Default city used to add rows in the table
 */
export const city = {
    city_name: '',
    estimated_time: '',
    shipping_cost: '',
    city_id: '',
    added: true,
    checked: false,
};

/**
 * Default place used to add rows in the table
 */
export const defaultPlace = {
    cities: [],
    added: true,
    checked: false,
};

/**
 * Max lenght to city name
 */
export const MAX_LENGHT_CITY = 100;

/**
 * Max lenght to NUMBER INPUT COST
 */
export const MAX_LENGTH_NUMBER_INPUT_COST = 17;
