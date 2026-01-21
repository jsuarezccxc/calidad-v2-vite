import { v4 as uuid } from 'uuid';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * Function that returns the modal text
 *
 * @param documents: IGenericRecord[] - Object with electronic documents
 * @returns string
 */
export const buildTextInvoices = (documents: IGenericRecord[]): string => {
    const documentArray: string[] = [];

    documents?.forEach((document: IGenericRecord) => {
        documentArray.push(`${document?.invoice_name}`);
    });

    return documentArray.join(', ');
};

/**
 * Function that returns the new warehouses
 *
 * @param data: IGenericRecord[] - Table data
 *
 * @returns IGenericRecord[]
 */
export const getNewWarehouses = (data: IGenericRecord[]): IGenericRecord[] => {
    const requiredKeys = [
        'name',
        'code',
        'address',
        'warehouse_conf_id',
        'city_id',
        'country_id',
        'city_name',
        'country_name',
        'department_id',
        'department_name',
    ];
    return data.map((item: IGenericRecord) => {
        const newItem: IGenericRecord = { id: uuid(), city_id: 1, department_id: 1, is_main: true, is_warehouse_web: true };
        requiredKeys.forEach(key => (newItem[key] = item[key] ?? ''));
        return newItem;
    });
};
