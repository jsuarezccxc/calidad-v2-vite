import { createContext } from 'react';
import { v4 as uuid } from 'uuid';
import { IVariantValues } from '@pages/assemble-product';
import { IGenericRecord } from '@models/GenericRecord';
import { IOptionSelect } from '@components/input';
import { ITaxOption } from '..';

export type SectionKeys = 'images' | 'inventory' | 'taxes';

/**
 * This interface defines the structure of each option of the tax values object.
 * @typeParam tax_id: string - Tax identification
 * @typeParam tax_value: string - Value of tax for the case where it has no variants
 * @typeParam tax_calculated_value: string - Value of calculated tax for the case where it has no variants
 * @typeParam variants: IVariantValues[] - Array of unique product identifiers and their values
 */
export interface ITaxValues {
    tax_id: string;
    tax_value: string;
    tax_calculated_value: number;
    unit_measure_milliliters?: number;
    tax_rate?: number;
    variants: IVariantValues[];
}

export const newVariant = {
    variant_details: [],
    name: '',
};

/**
 * Function that builds references based on variants
 *
 * @param variants: IGenericRecord[] - Variant list
 * @returns IGenericRecord[]
 */
export const getReferences = (variants: IGenericRecord[]): IGenericRecord[] => {
    return variants
        .reduce(
            (total, item) =>
                total.flatMap((subItem: IGenericRecord) =>
                    item.map((item: IGenericRecord) => subItem.concat({ ...item, reference: item.name }))
                ),
            [[]]
        )
        .map((items: IGenericRecord) => {
            const [references, details]: [references: string[], details: IGenericRecord[]] = [[], []];
            items.forEach(({ reference, id }: IGenericRecord) => {
                references.push(reference);
                details.push(id);
            });
            return {
                reference: references.join(' / '),
                details,
            };
        });
};

/**
 * This emun defines the available taxes
 */
export enum eTaxes {
    IVA = 'IVA',
    IBUA = 'IBUA',
    ICUI = 'ICUI',
    INC = 'INC',
}

/**
 * This is array of all taxes
 */
export const TAXES = Object.values(eTaxes);

/**
 * This constant is used to manage the values entered for each tax.
 */
export const taxValues: { [key: string]: ITaxValues } = {
    [eTaxes.IVA]: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
    [eTaxes.IBUA]: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
    [eTaxes.ICUI]: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
    [eTaxes.INC]: {
        tax_id: '',
        tax_value: '',
        tax_calculated_value: 0,
        unit_measure_milliliters: 0,
        variants: [],
    },
};

/**
 * This constant represent initial data to render taxes
 */
export const initialRenderTaxes = {
    IVA: false,
    ICUI: false,
    IBUA: false,
    INC: false,
};

/**
 * This constant represent first position in array of unique products
 */
export const UNIQUE_PRODUCT_INDEX = 0;

/**
 * This constant represent first position in array of warehouses
 */
export const UNIQUE_WAREHOUSE_INDEX = 0;

/**
 * This constant indicates that all sections are closed
 */
export const initialStateSections = {
    images: false,
    inventory: false,
    taxes: false,
};

/**
 * This constant defines the initial values for the tax selector
 */
export const taxesOptions: ITaxOption[] = [
    {
        id: '1',
        key: eTaxes.IVA,
        value: eTaxes.IVA,
        multiSelectCheck: {
            value: false,
        },
    },
    {
        id: '2',
        value: 'ICUI comestibles ultra procesados',
        key: eTaxes.ICUI,
        multiSelectCheck: {
            value: false,
        },
    },
    {
        id: '3',
        value: 'IBUA bebidas azucaradas',
        key: eTaxes.IBUA,
        multiSelectCheck: {
            value: false,
        },
    },
    {
        id: '4',
        value: 'INC impuesto al consumo',
        key: eTaxes.INC,
        multiSelectCheck: {
            value: false,
        },
    },
];

export const initialData = {
    company_id: '',
    is_product: true,
    name: '',
    date: '',
    tax_iva_id: null,
    is_include_tax: false,
    ledger_account_id: null,
    unit_measurement_id: null,
    description: '',
    variants: [],
    sale_channel: '',
    unique_products: [
        {
            id: uuid(),
            is_name: false,
            name: '',
            reference: '',
            sku_internal: '',
            unit_value: '',
            is_mandate: false,
            wholesale_quantity: 0,
            wholesale_value: 0,
            images: [],
            unique_product_details: [],
            taxes: [],
            unit_measure_milliliters: 0,
        },
    ],
    categories: [],
};

/**
 * This constant represent a empty tax to delete information
 */
export const EMPTY_TAX = {
    tax_calculated_value: 0,
    tax_id: '',
    tax_value: '',
    unit_measure_milliliters: 0,
    variants: [],
};

/**
 * Local storage constant to store the id of the selected variant
 */
export const EDIT_VARIANT_SELECTED = 'edit_variant_selected';

/**
 * This constant represent the creation of an image in the DB
 */
export const CREATE_IMAGE = 1;

/**
 * This constant represent the deletion of an image in the DB
 */
export const DELETE_IMAGE = 2;

/**
 * This constant represent no edit of an image in the DB
 */
export const NO_EDIT_IMAGE = 3;

/**
 * This constant represent the text of reference milliliter unit of measure
 */
export const MILLILITER_TEXT = 'Mililitro';

/**
 * This constant represent the text of reference liter unit of measure
 */
export const LITER_TEXT = 'Litro';

export const newInventoryEdit = [
    {
        id: '',
        number: '',
        batch_detail_id: null,
        purchase_detail_id: null,
        inventory_transaction_detail_id: null,
        is_perishable: false,
        quantity: 0,
        warehouses: [
            {
                id: '',
                idReference: '',
                inventory_transaction_id: null,
                inventory_transaction_detail_id: null,
                purchase_detail_id: null,
                name: '',
                date: '',
                quantity: '',
                is_editable: true,
            },
        ],
    },
];

/**
 * This describes the website inventory context
 *
 * @typeParam data: IGenericRecord - Product data
 * @typeParam setData: React.Dispatch<React.SetStateAction<IGenericRecord>> - Function to set product data
 * @typeParam variantList: IGenericRecord[] - List of variants
 * @typeParam setVariantList: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Function to set variant list
 * @typeParam toggleIsUniqueProduct: (value: boolean) => void - Function to toggle unique product
 * @typeParam isUniqueProduct: boolean - Unique product flag
 * @typeParam toggleSection: (section: SectionKeys, value?: boolean) => void - Function to toggle section
 * @typeParam sections: IGenericRecord - Sections
 * @typeParam variants: IGenericRecord - Variants of the product
 * @typeParam images: IGenericRecord[] - Images of the products or variants
 * @typeParam selectedImages: IGenericRecord - Selected images of the products or variants
 * @typeParam setImages: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Function to set images
 * @typeParam setSelectedImages: React.Dispatch<React.SetStateAction<IGenericRecord>> - Function to set selected images
 * @typeParam setVariants: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Function to set variants
 * @typeParam localValues: { [key: string]: ITaxValues } - Local values
 * @typeParam setLocalValues: React.Dispatch<React.SetStateAction<{ [key: string]: ITaxValues }>> - Function to set local values
 * @typeParam setTaxesRender: React.Dispatch<React.SetStateAction<IGenericRecord>> - Function to set taxes render
 * @typeParam taxesRender: IGenericRecord - Taxes render
 * @typeParam setTaxesSelectedValues: React.Dispatch<React.SetStateAction<string>> - Function to set taxes selected values
 * @typeParam taxesSelectedValues: string - Taxes selected values
 * @typeParam setSelectedTaxes: React.Dispatch<React.SetStateAction<ITaxOption[]>> - Function to set selected taxes
 * @typeParam selectedTaxes: ITaxOption[] - Selected taxes
 * @typeParam ivaRateArray: IOptionSelect[] - IVA rate array
 * @typeParam setIvaRateArray: React.Dispatch<React.SetStateAction<IOptionSelect[]>> - Function to set IVA rate array
 * @typeParam incRateArray: IGenericRecord - INC rate array
 * @typeParam setIncRateArray: React.Dispatch<React.SetStateAction<IOptionSelect[]>> - Function to set INC rate array
 * @typeParam deleteTax: (item: string) => void - Function to delete tax
 * @typeParam setValidate: React.Dispatch<React.SetStateAction<boolean>> - Function to set validate
 * @typeParam validate: boolean - Validate flag
 * @typeParam closeSections: () => void - Function to close sections
 * @typeParam edit: boolean - Edit flag
 * @typeParam productEdit: IGenericRecord - Product edit
 * @typeParam resetData: () => void - Function to reset data
 * @typeParam setIbuaRateSelected: React.Dispatch<React.SetStateAction<string>> - Function to set IBUA rate selected
 * @typeParam ibuaRateSelected: string - IBUA rate selected
 * @typeParam setNetContent: React.Dispatch<React.SetStateAction<string>> - Function to set net content
 * @typeParam netContent: string - Net content
 * @typeParam setUnitMeasure: React.Dispatch<React.SetStateAction<string>> - Function to set unit measure
 * @typeParam unitMeasure: string - Unit measure
 * @typeParam setVariantsNetContent: React.Dispatch<React.SetStateAction<IVariantValues[]>> - Function to set variants net content
 * @typeParam variantsNetContent: IVariantValues[] - Variants net content
 * @typeParam handleContentMilliliters: (value: string) => void - Function to handle content milliliters
 * @typeParam handleContentMillilitersVariants: (value: string, id: string) => void - Function to handle content milliliters variants
 * @typeParam deleteImage: (value: string) => void - Function to delete image
 * @typeParam setDataTable: React.Dispatch<React.SetStateAction<IGenericRecord[]>> - Function to set data table
 * @typeParam dataTable: IGenericRecord[] - Data table
 * @typeParam markedForDeletion: string[] - Marked for deletion
 * @typeParam buildInventoryEdit: () => void - Function to build inventory edit
 * @typeParam handleUnitMeasureVariant: (value: string, id: string) => void - Function to handle unit measure variant
 */

export interface IProductDatabaseContext {
    data: IGenericRecord;
    setData: React.Dispatch<React.SetStateAction<IGenericRecord>>;
    variantList: IGenericRecord[];
    setVariantList: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    toggleIsUniqueProduct: (value: boolean) => void;
    isUniqueProduct: boolean;
    toggleSection: (section: SectionKeys, value?: boolean) => void;
    sections: IGenericRecord;
    variants: IGenericRecord;
    images: IGenericRecord[];
    selectedImages: IGenericRecord;
    setImages: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    setSelectedImages: React.Dispatch<React.SetStateAction<IGenericRecord>>;
    setVariants: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    localValues: {
        [key: string]: ITaxValues;
    };
    setLocalValues: React.Dispatch<
        React.SetStateAction<{
            [key: string]: ITaxValues;
        }>
    >;
    setTaxesRender: React.Dispatch<React.SetStateAction<IGenericRecord>>;
    taxesRender: IGenericRecord;
    setTaxesSelectedValues: React.Dispatch<React.SetStateAction<string>>;
    taxesSelectedValues: string;
    setSelectedTaxes: React.Dispatch<React.SetStateAction<ITaxOption[]>>;
    selectedTaxes: ITaxOption[];
    ivaRateArray: IOptionSelect[];
    setIvaRateArray: React.Dispatch<React.SetStateAction<IOptionSelect[]>>;
    incRateArray: IGenericRecord;
    setIncRateArray: React.Dispatch<React.SetStateAction<IOptionSelect[]>>;
    deleteTax: (item: string) => void;
    setValidate: React.Dispatch<React.SetStateAction<boolean>>;
    validate: boolean;
    closeSections: () => void;
    edit: boolean;
    productEdit: IGenericRecord;
    resetData: () => void;
    setIbuaRateSelected: React.Dispatch<React.SetStateAction<string>>;
    ibuaRateSelected: string;
    setNetContent: React.Dispatch<React.SetStateAction<string>>;
    netContent: string;
    setUnitMeasure: React.Dispatch<React.SetStateAction<string>>;
    unitMeasure: string;
    setVariantsNetContent: React.Dispatch<React.SetStateAction<IVariantValues[]>>;
    variantsNetContent: IVariantValues[];
    handleContentMilliliters: (value: string) => void;
    handleContentMillilitersVariants: (value: string, id: string) => void;
    deleteImage: (value: string) => void;
    setDataTable: React.Dispatch<React.SetStateAction<IGenericRecord[]>>;
    dataTable: IGenericRecord[];
    markedForDeletion: string[];
    buildInventoryEdit: () => void;
    handleUnitMeasureVariant: (value: string, id: string) => void;
}

/**
 * Website Inventory context
 */
export const ProductDatabaseContext = createContext<IProductDatabaseContext>({
    // productServices: [],
    data: {},
    setData: () => {},
    variantList: [],
    setVariantList: () => {},
    toggleIsUniqueProduct: () => {},
    isUniqueProduct: false,
    toggleSection: () => {},
    sections: {},
    variants: {},
    images: [],
    selectedImages: {},
    setImages: () => {},
    setSelectedImages: () => {},
    setVariants: () => {},
    localValues: {},
    setLocalValues: () => {},
    setTaxesRender: () => {},
    taxesRender: {},
    setTaxesSelectedValues: () => {},
    taxesSelectedValues: '',
    setSelectedTaxes: () => {},
    selectedTaxes: [],
    ivaRateArray: [],
    setIvaRateArray: () => {},
    incRateArray: {},
    setIncRateArray: () => {},
    deleteTax: (): void => {},
    setValidate: (): void => {},
    validate: false,
    closeSections: (): void => {},
    edit: false,
    productEdit: {},
    resetData: (): void => {},
    setIbuaRateSelected: () => {},
    ibuaRateSelected: '',
    setNetContent: () => {},
    netContent: '',
    setUnitMeasure: () => {},
    unitMeasure: '',
    setVariantsNetContent: () => {},
    variantsNetContent: [],
    handleContentMilliliters: () => {},
    handleContentMillilitersVariants: () => {},
    deleteImage: () => {},
    setDataTable: () => {},
    dataTable: [],
    markedForDeletion: [],
    buildInventoryEdit: () => {},
    handleUnitMeasureVariant: () => {},
});
