/* eslint-disable @typescript-eslint/no-explicit-any */
import { VARIABLE_TYPE } from '@constants/DataTypes';

/**
 * Method to clone deep from array or object
 * @param obj: IGenericRecord - Element to clone
 * @returns IGenericRecord - data cloned
 */
export const cloneDeep = <T>(obj: T): T => {
    if (obj === null || typeof obj !== VARIABLE_TYPE.OBJECT) {
        return obj;
    }

    let clone: any;

    if (Array.isArray(obj)) {
        clone = obj.slice();
        for (let i = 0; i < clone.length; i++) {
            clone[i] = cloneDeep(clone[i]);
        }
        return clone as T;
    }

    if (typeof obj === VARIABLE_TYPE.OBJECT) {
        clone = Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clone[key] = cloneDeep(obj[key]);
            }
        }
        return clone as T;
    }

    return obj;
};
