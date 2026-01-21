/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOptionSelect } from '@components/input';
import { ElementOption } from '@models/WebsiteNode';

export * from './BannerEditor';
export * from './DiscountModal';
export * from './ProductItem';
export * from './ProductField';

/**
 * This interface describes th props of the discount modal
 *
 * @typeParam deleteProduct: (id: string) => void - Function to delete product
 * @typeParam products: IProduct[] - Modal products
 * @typeParam toggleModal: () => void - Function to toggle modal
 * @typeParam updateProducts: (products: IProduct[]) => void - This is used to update products
 */
export interface IDiscountModalProps {
    deleteProduct: (id: string) => void;
    products: IProduct[];
    toggleModal: () => void;
    updateProducts: (products: IProduct[]) => void;
}

/**
 * This interface describes the product properties
 *
 * @typeParam checked: boolean - This indicates whether the product is checked
 * @typeParam discount: string - Product discount
 * @typeParam id: string - Product id
 * @typeParam name: string - Product name
 * @typeParam src: string - Product src
 * @typeParam edited: boolean - This indicates if it is an edited product
 * @typeParam number: number - Product number
 */
export interface IProduct {
    checked: boolean;
    discount: string;
    id: string;
    name: string;
    src: string;
    edited: boolean;
    number: number;
}

/**
 * This interface describes the props of the product field
 *
 * @typeParam chooseToEdit: (product: IProduct) => void - This is used to select product for edit
 * @typeParam deleteProduct: (id: string) => void - Function to delete a product
 * @typeParam index: number - Field index used to display the trash icon and indicate the product number
 * @typeParam product: IProduct - Product data
 */
export interface IProductFieldProps {
    chooseToEdit: (product: IProduct) => void;
    deleteProduct: (id: string) => void;
    index: number;
    product: IProduct;
}

/**
 * This interface describes the props of the product item
 *
 * @typeParam handleImageChange: (e: any, id: string) => void - This is used to handle image change
 * @typeParam handleProductChange: (e: any, id: string) => void - This is used to handle product change
 * @typeParam product: IProduct - Product data
 * @typeParam options: IOptionSelect[] - Catalog options
 * @typeParam selectProduct: (option: IOptionSelect, id: string) => void - This is used to select a product
 * @typeParam index: number - Item index
 * @typeParam validate: boolean - Used to validate the fields
 * @typeParam sizeError: boolean - This indicates if there is an image sizs error
 * @typeParam showCheckbox: boolean - This indicates if show checkbox
 */
export interface IProductItemProps {
    handleImageChange: (e: any, id: string) => void;
    handleProductChange: (e: any, id: string) => void;
    product: IProduct;
    options: IOptionSelect[];
    selectProduct: (option: IOptionSelect, id: string) => void;
    index: number;
    validate: boolean;
    sizeError: boolean;
    showCheckbox: boolean;
}

/**
 * Used to set the initial state of the modal products
 */
export const DEFAULT_PRODUCT = {
    id: '',
    name: '',
    checked: false,
    discount: '',
    src: '',
    edited: false,
    number: 1,
};

/**
 * Fields number by banner option
 */
export const FIELDS_BY_OPTION: { [key: string]: number } = {
    [ElementOption.One]: 4,
    [ElementOption.Two]: 1,
    [ElementOption.Three]: 3,
    [ElementOption.Four]: 2,
};
