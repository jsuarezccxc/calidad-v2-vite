import { IGenericRecord } from '@models/GenericRecord';
import { INestedKey } from '@models/Search';

const filterData = (item: IGenericRecord, keys: string[], search: string): boolean => {
    return keys.some((key: string) => String(item[key])?.toLowerCase()?.includes(search?.toLowerCase()));
};

export const searchData = (
    data: IGenericRecord[],
    word: string,
    keys: string[] = ['sku', 'name', 'reference'],
    nestedKey?: INestedKey
): IGenericRecord[] => {
    if (!word) return data;

    if (nestedKey) {
        const { prop, key } = nestedKey;
        return data.map((item: IGenericRecord) => {
            const newItem = { ...item };
            const value = word.toLowerCase();
            const showItem = keys.some((key: string) => newItem[key].toLowerCase().includes(value));
            const hasChildren = newItem[prop].some((children: IGenericRecord) => children[key].toLowerCase().includes(value));
            newItem.show = showItem;
            if (newItem.show) {
                newItem[prop].map((subItem: IGenericRecord) => (subItem.show = true));
            } else {
                newItem[prop] = newItem[prop].map((subItem: IGenericRecord) => {
                    const newItem = { ...subItem };
                    newItem.show = newItem[key].toLowerCase().includes(value);
                    return newItem;
                });
            }
            if (hasChildren && !newItem.show) {
                newItem.show = hasChildren;
            }
            return newItem;
        });
    }
    return data?.filter((item: IGenericRecord) => filterData(item, keys, word));
};

/**
 * This returns the alphabet array
 * @returns string[]
 */
export const getAlphabet = (): string[] => 'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ'.split('');
