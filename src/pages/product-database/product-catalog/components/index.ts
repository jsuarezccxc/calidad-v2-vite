import { IGenericRecord } from '@models/GenericRecord';

export * from './detail'
export * from './table-catalog'
export * from './deletion-error-modal'

/**
 * This function validate id product have images 
 * 
 * @param product: IGenericRecord - Product to validate if have images
 * @returns : boolean
 */
export const validateImages = (product: IGenericRecord): boolean => !!Object.keys(product?.unique_product_images).length;
