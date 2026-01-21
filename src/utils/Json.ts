import { get } from 'lodash';
import { IGenericRecord } from '@models/GenericRecord';
import { IFieldsAssign, IKeysAssign } from '@models/SupportDocument';
import { lengthGreaterThanZero } from './Length';

/**
 * Create new object to object
 * @param json: IGenericRecord - Param Object
 * @returns IGenericRecord
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createNewJson = (json: IGenericRecord): any => JSON.parse(JSON.stringify(json));

/**
 * Assign data in object
 *
 * @param { tree, base = [] }:IFieldsAssign - Param object by keys
 * @param  obj:IGenericRecord: IGenericRecord - Param data object
 * @returns IGenericRecord
 */
export const assignValue = ({ tree, base = [] }: IFieldsAssign, obj: IGenericRecord): IGenericRecord => {
    let result: IGenericRecord = {};
    Object.keys(tree).forEach((key: string) => {
        const object = obj[key] ?? {};
        tree[key].forEach(({ keyOrigin, skip, keyValue, children }: IKeysAssign) => {
            if (!skip) {
                result[keyValue || keyOrigin] = Object.keys(object).includes(keyOrigin) ? obj[key][keyOrigin] : null;
                return;
            } else if (children && lengthGreaterThanZero(Object.keys(children))) {
                result = {
                    ...result,
                    ...assignValue(children, object),
                };
            }
        });
    });
    base.forEach(({ keyOrigin, keyValue }: IKeysAssign) => {
        result[keyValue || keyOrigin] = obj[keyOrigin];
    });
    return result;
};

/**
 * This function is used to assign data to an object based on a template
 *
 * @param template: Record<string, string> - The template object that defines the mapping
 * @param data: IGenericRecord - The data object from which values will be extracted
 * @returns IGenericRecord
 */
export const AssignDataToObject = (template: Record<string, string>, data: IGenericRecord): IGenericRecord => {
    const result: IGenericRecord = {};
    for (const [targetKey, sourcePath] of Object.entries(template)) {
        if (sourcePath.includes('no source')) {
            result[targetKey] = null;
            continue;
        }
        result[targetKey] = get(data, sourcePath);
    }
    return result;
};
