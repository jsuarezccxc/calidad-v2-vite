import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { ChangeEvent, IOptionSelect } from '@components/input';
import { IDraggableElement } from '../../../drag-and-drop';
import { ActiveButton } from '..';

export * from './Buttons';
export * from './Checkbox';
export * from './Filter';
export * from './ProductCard';
export * from './Pagination';
export * from './SidebarFilters';
export * from './Icons';
export * from './Inputs';
export * from './Title';

/**
 * This interface describes the checkbox props
 *
 * @typeParam name: string - Checkbox name
 * @typeParam option: IFilterOption - Checkbox option
 * @typeParam withoutCheck: boolean - Optional without check
 * @typeParam isActive: boolean - Optional show subcategories
 * @typeParam handleChange: (e: ChangeEvent, id: string) => void - Optional Function to handle changing checkbox
 * @typeParam checked: boolean - Checked status
 */
export interface ICheckboxProps {
    name: string;
    option: IFilterOption;
    withoutCheck?: boolean;
    isActive?: boolean;
    handleChange?: (e: ChangeEvent, id: string) => void;
    checked?: boolean;
}

/**
 * This interface describes the filter props
 *
 * @typeParam isActive: boolean - This is optional and indicates whether the filter is active
 * @typeParam setting: IFilterSetting - Filter setting
 * @typeParam valueFilter: IGenericRecord - Optional Price Min and Max Value
 * @typeParam handlePrice: (e: ChangeEvent) => void - Function to handle prices
 * @typeParam handleChange: (e: ChangeEvent) => void - Function to handle changing checkbox
 * @typeParam checked: boolean - Checked status
 * @typeParam selectCategory: (id: string) => void - Optional Selected category
 * @typeParam onClick: () => void - Optional event to handle the click.
 */
export interface IFilterProps {
    isActive?: boolean;
    setting: IFilterSetting;
    valueFilter?: IGenericRecord;
    handlePrice?: (e: ChangeEvent) => void;
    handleChange?: (e: ChangeEvent, id?: string) => void;
    checked?: boolean;
    selectCategory?: (id: string) => void;
    onClick?: () => void;
}

/**
 * This interface describes the filter props
 *
 * @typeParam filterByValue: boolean - This is optional and indicates whether the filter is active
 * @typeParam isMobile: boolean - Optional is mobile option
 * @typeParam activeButton: string | null - Optional active button
 * @typeParam setActiveButton: Dispatch<SetStateAction<ActiveButton | null>> - Function to handle active button
 * @typeParam filters: string - Optional filters catalog
 * @typeParam data: IDraggableElement - Optional data catalog
 * @typeParam valueFilter: IGenericRecord- Optional value filters
 * @typeParam handlePrice:  (e: ChangeEvent) => void - Optional function price
 * @typeParam priceSetting: IFilterSetting - Optional price setting
 * @typeParam dataCategories: IGenericRecord[] - Optional list categories
 * @typeParam handleChange:  (e: ChangeEvent,  id?: string) => void - Optional function filter price
 * @typeParam selectCategory: (id: string) => void - Optional Selected category
 * @typeParam resultCatalog: number - Optional result catalog
 * @typeParam handlePriceProduct: (e: ChangeEvent) => void - Optional function product price
 * @typeParam handleSelectOrder: (option: IOptionSelect, type: string) => void - Optional function select order catalog
 * @typeParam orderProducts: IGenericRecord - Optional order products
 */
export interface ISidebarFilter {
    filterByValue: boolean;
    isMobile?: boolean;
    activeButton?: string | null;
    setActiveButton?: Dispatch<SetStateAction<ActiveButton | null>>;
    filters?: string;
    data: IDraggableElement;
    valueFilter?: IGenericRecord;
    handlePrice?: (e: ChangeEvent) => void;
    priceSetting?: IFilterSetting;
    dataCategories?: IGenericRecord[];
    handleChange?: (e: ChangeEvent, id?: string) => void;
    selectCategory?: (id: string) => void;
    resultCatalog?: number;
    handlePriceProduct?: (e: ChangeEvent) => void;
    handleSelectOrder?: (option: IOptionSelect) => void;
    orderProducts?: IGenericRecord;
}

/**
 * This interface describes the filter props
 *
 * @typeParam name: string - Filter name
 * @typeParam title: string - Filter title
 * @typeParam options: IFilterOption[] - Filter options
 * @typeParam amount: number - Optional amount category
 * @typeParam id: string - Optional id category
 */
export interface IFilterSetting {
    name?: string;
    title: string;
    options: IFilterOption[];
    amount?: number;
    id?: string;
}

/**
 * This interface describes the filter option
 *
 * @typeParam amount: number - Filter amount
 * @typeParam name: string - Filter name
 * @typeParam minRange: string - Filter minimum range
 * @typeParam maxRange: string - Filter maximum range
 * @typeParam subcategories: IFilterOption[] - sub categories option
 * @typeParam id: string - Optional id filter
 */
export interface IFilterOption {
    amount: number;
    name: string;
    minRange?: number;
    maxRange?: number;
    subcategories?: IFilterOption[];
    id?: string;
}

/**
 * This interface describes the pagination props
 *
 * @typeParam activePage: number - Active page
 * @typeParam isInferior: boolean - This is optional and indicates if it is inferior
 * @typeParam itemsPerPage: number - Items per page
 * @typeParam data: IGenericRecord - Catalog data
 * @typeParam updatePaginatedData: (data: IGenericRecord[]) => void - This is used to update the paginated data
 * @typeParam updateActivePage: (page: number) => void - This is used to update the active page
 * @typeParam isOrder: boolean - Active order
 */
export interface IPaginationProps {
    activePage: number;
    isInferior?: boolean;
    itemsPerPage: number;
    data: IGenericRecord[];
    updatePaginatedData: (data: IGenericRecord[]) => void;
    updateActivePage: (page: number) => void;
    isOrder?: boolean;
}

/**
 * This interface describes the title props
 *
 * @typeParam activateArrow: boolean - This is optional and indicates whether the arrow should be activated
 * @typeParam includeArrow: boolean - This is optional and indicates if it is a lower pager
 * @typeParam title: string - Title
 * @typeParam amount: number - Optional number of categories
 * @typeParam titleClassName: string - Optional prop to customize the title
 * @typeParam wrapperClassName: string - Optional prop to customize the wrapper
 * @typeParam selectCategory: (id: string) => void - Optional function select category
 * @typeParam id: string - Optional id of categories
 * @typeParam onClick: () => void - Optional event to handle the click.
 */
export interface ITitleProps {
    activateArrow?: boolean;
    includeArrow?: boolean;
    title: string;
    amount?: number;
    titleClassName?: string;
    wrapperClassName?: string;
    selectCategory?: (id: string) => void;
    id?: string;
    onClick?: () => void;
}

/**
 * This interface describes the inputs component
 *
 * @typeParam filters: string - Catalog filters
 * @typeParam isMobile: boolean - Optional if is screen mobile
 * @typeParam containerClass: string - Optional container class
 * @typeParam option: string - Optional option catalog
 * @typeParam handlePriceProduct: (e: ChangeEvent) => void - Optional function product price
 * @typeParam handleSelectOrder: (option: IOptionSelect, type: string) => void - Optional function select order catalog
 * @typeParam orderProducts: IGenericRecord - Optional order products
 * @typeParam isInputSearch: boolean - Optional is input search
 * @typeParam containerClass: string - Optional container class select inputs
 */
export interface IInputs {
    filters: string;
    isMobile?: boolean;
    containerClass?: string;
    option?: string;
    handlePriceProduct?: (e: ChangeEvent) => void;
    handleSelectOrder?: (option: IOptionSelect) => void;
    orderProducts?: IGenericRecord;
    isInputSearch?: boolean;
    classSelectInputs?: string;
}

/**
 * This returns the pagination text
 *
 * @param data: IGenericRecord - Pagination data used to set the text of the current range and the active page
 * @returns { result: string; pages: string }
 */
export const getPaginationText = ({
    activePage,
    data,
    finalPage,
    initialPage,
    isInferior,
    pagesNumber,
}: IGenericRecord): { result: string; pages: string } => {
    return {
        result: `${initialPage + 1}-${finalPage > data.length ? data.length : finalPage} de ${data.length} Resultados`,
        pages: `${isInferior ? '' : ` ${activePage} de ${pagesNumber}`}:`,
    };
};

/**
 * Price setting used in the sidebar
 */
export const PRICE_SETTING: IFilterSetting = {
    title: 'Precio',
    options: [],
};

/**
 * Filter settings used in the sidebar, excluding price
 */
export const FILTER_SETTINGS = {
    gender: {
        title: 'Género',
        options: [],
    },
    brand: {
        title: 'Marca',
        options: [
            {
                name: 'Adidas',
                amount: 20,
            },
            {
                name: 'Puma',
                amount: 12,
            },
            {
                name: 'Nike',
                amount: 18,
            },
        ],
    },
    material: {
        title: 'Material',
        options: [
            { name: 'Cuero', amount: 12 },
            { name: 'Pana', amount: 20 },
            { name: 'Gamuza', amount: 12 },
        ],
    },
    sizes: {
        title: 'Tallas',
        options: [],
    },
    color: {
        title: 'Color',
        options: [
            {
                name: 'Negro',
                amount: 20,
            },
            {
                name: 'Blanco',
                amount: 40,
            },
            {
                name: 'Gris',
                amount: 10,
            },
            {
                name: 'Azul',
                amount: 20,
            },
            {
                name: 'Rojo',
                amount: 30,
            },
            {
                name: 'Amarillo',
                amount: 5,
            },
            {
                name: 'Sub-categoria',
                amount: 5,
                subcategories: [
                    {
                        name: 'Azul',
                        amount: 30,
                    },
                    {
                        name: 'Rojo',
                        amount: 20,
                    },
                    {
                        name: 'Sub-categoria',
                        amount: 30,
                    },
                ],
            },
        ],
    },
};

/**
 * This is used to activate the color filter
 */
export const COLOR = 'color';

/**
 * This is used to open subcategory
 */
export const SUBCATEGORY = 'Sub-categoria';

/**
 * Const is used for validate price name
 */
export const PRICE = 'price';

/**
 * Options sort by date
 */
export const OPTION_DATE: IOptionSelect[] = [
    {
        key: '0',
        value: 'Agregados del más reciente al más antiguo',
        name: 'newDate',
        type: 'date',
    },
    {
        key: '1',
        value: 'Agregados del más antiguo al más reciente',
        name: 'oldDate',
        type: 'date',
    },
];

/**
 * Options sort by price
 */
export const OPTION_PRICE: IOptionSelect[] = [
    {
        key: '0',
        value: 'Menor a mayor valor',
        name: 'less',
        type: 'value',
    },
    {
        key: '1',
        value: 'Mayor a menor valor',
        name: 'more',
        type: 'value',
    },
];

/**
 * This key select order product default
 */
export const DEFAULT_ORDER_PRODUCTS: { [key: string]: string } = {
    'Agregados del más reciente al más antiguo': 'newDate',
    'Agregados del más antiguo al más reciente': 'oldDate',
    '': 'oldDate',
};

/**
 * This constant max length input value
 */
export const MAX_LENGTH_VALUE = 27;
