import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { SelectSearchOption } from 'react-select-search';
export * from './table-information-provision-services/TableProvisionServices';

/**
 * This interface describes the properties the component TableProvisionServices
 *
 * @typeParam setIdDeleteDepartment: Dispatch<SetStateAction<IGenericRecord[]>> - Optional set item checkbox department
 * @typeParam idDeleteCity: IGenericRecord[] - Optional state item checkbox city
 * @typeParam idDeleteDepartment: Dispatch<SetStateAction<IGenericRecord[] - Optional Optional set item checkbox department
 * @typeParam setIdDeleteCity: Dispatch<SetStateAction<IGenericRecord[]>> - Optional set item checkbox city
 * @typeParam handleChangeSelectCity: (e:ChangeEvent | ChangeEvent<HTMLInputElement>, idCity:string, idDepartment:string) => void - Require handle city
 * @typeParam handleChangeSelectDepartment: (e:ChangeEvent | ChangeEvent<HTMLInputElement>, idItem:string) => void - Require handle  department
 * @typeParam dataLocation: ILocation[]  - Require handle data table
 * @typeParam addCity: (value: string, itemDepartment:string) => void - Require add city
 * @typeParam department: SelectSearchOption[] - Require data department option
 * @typeParam onClickSelect: (id: string, name: string) - Optional add class Search select
 * @typeParam validationCities: boolean - Require validate table
 * @typeParam citiesRequest: IGenericRecord[] - get all cities
 * @typeParam validateCitiesZero: string[] - validate department
 */
export interface ITableProvisionServices {
    setIdDeleteDepartment?: Dispatch<SetStateAction<IGenericRecord[]>>;
    idDeleteCity?: IGenericRecord[];
    idDeleteDepartment?: IGenericRecord[];
    setIdDeleteCity?: Dispatch<SetStateAction<IGenericRecord[]>>;
    handleChangeSelectCity: (e: IGenericRecord | ChangeEvent<HTMLInputElement>, idCity: string, idDepartment: string) => void;
    handleChangeSelectDepartment: (e: IGenericRecord | ChangeEvent<HTMLInputElement>, idItem: string) => void;
    dataLocation: ILocation[];
    addCity: (value: string, itemDepartment: string) => void;
    onClickSelect?: (id: string, name: string) => void;
    validationCities: boolean;
    citiesRequest: IGenericRecord[];
    validateCitiesZero: string[];
}

/**
 * This interface describes the properties data Location
 *
 * @typeParam id: string - require the id item
 * @typeParam department_name: string - require for name department
 * @typeParam department_id: string - require for dide department
 * @typeParam department_code: string - require code department
 * @typeParam cities: ICities[] - require data cities
 * @typeParam options: SelectSearchOption[] - required options departments
 */
export interface ILocation {
    id: string;
    department_name: string;
    department_id: string;
    department_code: string;
    cities: ICities[];
    options: SelectSearchOption[];
}

/**
 * This interface describes the properties cities
 *
 * @typeParam id: string - Required for id item
 * @typeParam city_id: string - Required id city
 * @typeParam name: string - Required for name city
 * @typeParam code: string - Required  for code city
 * @typeParam options: SelectSearchOption[] - Required options cities
 */
export interface ICities {
    id: string;
    city_id: number;
    name: string;
    code: string;
    options: SelectSearchOption[];
    link: boolean;
}
