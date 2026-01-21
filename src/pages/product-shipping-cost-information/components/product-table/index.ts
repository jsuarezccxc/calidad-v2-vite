import React, { SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
export * from './ProductTableHeader';

/**
 * Product table fields used to validate
 */
export enum FIELDS {
    NAME = 'name',
    SHIPPING_COST = 'additional_shipping_cost',
}

/**
 * This interface describes the props of the product table
 *
 * @typeParam data: IGenericRecord[] - Table data
 * @typeParam setData: React.Dispatch<SetStateAction<IGenericRecord[]>> - Function to set the table data
 * @typeParam products: IGenericRecord[] - Product list
 * @typeParam checkedProducts: IGenericRecord[] - Checked fields
 * @typeParam onClickTrash: (table: string) => void - Function to delete fields
 * @typeParam validate: boolean - Indicates if validate the table data
 * @typeParam setIsSave: (boolean)=>void - Function to indicates if the table is saved
 */
export interface IProductTableProps {
    data: IGenericRecord[];
    setData: React.Dispatch<SetStateAction<IGenericRecord[]>>;
    products: IGenericRecord[];
    checkedProducts: IGenericRecord[];
    onClickTrash: (table: string) => void;
    validate: boolean;
    setIsSave: (save: boolean) => void;
}

/**
 * Default product used to add rows in the table
 */
export const defaultProduct = {
    id: '',
    name: '',
    product_id: '',
    additional_shipping_cost: '',
    added: true,
};
