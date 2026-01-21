import { useMemo } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { getEmptyFields, getErrorMessages } from '@utils/Table';

/**
 * This describes the properties returned by this hook
 *
 * @typeParam errorMessages: string[] - Error messages
 * @typeParam hasEmptyFields: boolean - This indicates if there are empty fields
 */
interface IUseTable {
    errorMessages: string[];
    hasEmptyFields: boolean;
}

export const useTable = (data: IGenericRecord[], requiredFields: { name: string; value: string }[]): IUseTable => {
    const emptyFields = useMemo(() => getEmptyFields(data, requiredFields), [data]);

    const errorMessages = useMemo(() => getErrorMessages(emptyFields, requiredFields), [emptyFields]);

    return {
        hasEmptyFields: !!Object.keys(emptyFields).length,
        errorMessages,
    };
};

export default useTable;
