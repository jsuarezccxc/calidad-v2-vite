import { IGenericRecord } from '@models/GenericRecord';

export * from './MassiveUpload';

/**
 * Function that detects errors and returns its location
 *
 * @param errors: IGenericRecord[] - Information errors in xls
 * @returns string
 */
export const locationErrors = (errors: IGenericRecord[]): string => {
    let textErrors = '';
    for (const error of errors) {
        textErrors += `${error.column}${error.row}: ${error.error}, `;
    }
    textErrors = textErrors.slice(0, -1);
    return textErrors;
};
