import { urls } from '@api/urls';

export const SEARCH = 'SKU/Producto';
export const PRODUCT = 'Producto';
export const PRODUCT_KEY = 'product';
export const PRODUCTS_KEY = 'products';
/**
 * This constant defines the unit of measurement for the IBUA tax
 */
export const MILLILITER = 'ml';

/**
 * This constant represent id of milliliter unit of measurement
 */
export const MILLILITER_ID = '8d5d13fa-9483-4686-b59d-ac9bfd250d74';

/**
 * This constant represent id of milliliter unit of measurement
 */
export const LITER_ID = '40390ef4-e9ea-4828-ac00-ceac4cac5ba9';

/**
 * Option that validates  the upload of products is massive upload
 */

export const MASSIVE_UPLOAD = 'MASSIVE_UPLOAD';

/**
 * Required data field
 */
export const UNIQUE_PRODUCTS = 'unique_products';

/**
 * This constant represent unique product fist position in array
 */
export const UNIQUE_PRODUCT = 0;

/**
 * This emun defines the variants
 */
export enum Variants {
    Category = 'CATEGORY',
    Variant = 'VARIANT',
    VariantDetail = 'VARIAN_DETAIL',
}
/**
 * Used to get the url to delete categories, variants and variant details
 */
export const urlsToDeleteVariants: { [key in Variants]: (id: string) => string } = {
    [Variants.Category]: urls.product.deleteCategory,
    [Variants.Variant]: urls.product.deleteVariant,
    [Variants.VariantDetail]: urls.product.deleteVariantDetail,
};

/**
 * Constant that defines the sku unique product
 */
export const SKU_UNIQUE_PRODUCT = 'SKU-UNIQUE-PRODUCT';
