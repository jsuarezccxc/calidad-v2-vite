import { IGenericRecord } from '@models/GenericRecord';

/**
 * Returns the string value of a specific key from the provided object
 *
 * @param object: The object containing key-value pairs
 * @param key: The key whose value should be retrieved
 * @returns string
 */
export const getEnum = (object: IGenericRecord, key: string): string => object?.[key];
