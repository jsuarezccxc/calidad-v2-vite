import { IGenericRecord } from '@models/GenericRecord';

export const lengthEqualToZero = (item: IGenericRecord | string): boolean => item?.length === 0;
export const lengthGreaterThanZero = (item: IGenericRecord | string): boolean => item?.length > 0;
export const lengthGreaterThanOne = (item: IGenericRecord): boolean => item?.length > 1;
export const lengthEqualOneOrGreaterThanOne = (item: IGenericRecord): boolean => item?.length >= 1;
export const lengthLastItem = (item: IGenericRecord): number => item?.length - 1;
export const lengthLastItemTwo = (item: IGenericRecord): number => item?.length - 2;
export const lengthEqualEight = (item: IGenericRecord): boolean => item?.length === 8;
export const lengthEqualFive = (item: IGenericRecord): boolean => item?.length === 5;
export const lengthEqualOne = (item: IGenericRecord): boolean => item?.length === 1;
